"""
Enforcement Workflow Management API
Handles: Alert Queue -> Acknowledge -> Assign Officer -> SMS/Call -> Resolve

FIX: Alert queue and timeline are now persisted to a JSON file so that
restarts, pod restarts, and scaling events do not wipe enforcement history.
Alerts are seeded from real high-PCI locations on first boot.
"""
import json
import hashlib
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta

from app.core.config import ALLOW_SIMULATION_PROVIDERS, TWILIO_CALL_FROM, BASE_DIR
from app.services.sms_service import sms_service, SMSServiceError
from app.services.telephony_service import telephony_service, TelephonyServiceError
from app.services.dispatch_service import DispatchService

router = APIRouter()

# ── Persistence paths ────────────────────────────────────────────────────────
_DATA_DIR = Path(BASE_DIR) / "data" / "enforcement"
_QUEUE_FILE = _DATA_DIR / "alert_queue.json"
_TIMELINE_FILE = _DATA_DIR / "timeline_events.json"
_DATA_DIR.mkdir(parents=True, exist_ok=True)


def _load_json(path: Path, default):
    try:
        if path.exists():
            return json.loads(path.read_text())
    except Exception:
        pass
    return default


def _save_json(path: Path, data):
    try:
        path.write_text(json.dumps(data, indent=2, default=str))
    except Exception as e:
        print(f"[enforcement] Warning: could not persist {path}: {e}")


def _load_queue():
    return _load_json(_QUEUE_FILE, [])


def _save_queue(q):
    _save_json(_QUEUE_FILE, q)


def _load_timeline():
    return _load_json(_TIMELINE_FILE, [])


def _save_timeline(t):
    _save_json(_TIMELINE_FILE, t)


# ── Seed helpers ─────────────────────────────────────────────────────────────

def _dhash(seed: str, mod: int) -> int:
    return int(hashlib.md5(seed.encode()).hexdigest(), 16) % mod


def _seed_queue_from_data() -> list:
    """Build initial alert queue from top high-PCI locations in the dataset."""
    try:
        from app.core.data_loader import load_pci
        df = load_pci()
        top = (
            df.groupby("location", observed=True)["pci"]
            .mean()
            .sort_values(ascending=False)
            .head(15)
            .reset_index()
        )
        alerts = []
        for i, (_, row) in enumerate(top.iterrows()):
            loc = str(row["location"])
            pci = float(row["pci"])
            sev = "CRITICAL" if pci >= 0.80 else "HIGH" if pci >= 0.65 else "MEDIUM"
            plate_alpha = ["AB", "CD", "EF", "GH", "JK"][_dhash(loc + "a", 5)]
            plate_num = 1000 + _dhash(loc + "n", 8999)
            dist = 1 + _dhash(loc + "d", 5)
            vehicle_id = f"KA{dist:02d}{plate_alpha}{plate_num}"
            minutes_ago = 5 + _dhash(f"ALT-{i:04d}", 115)
            alerts.append({
                "id": f"ALT-{i:04d}",
                "location": loc,
                "vehicle_id": vehicle_id,
                "severity": sev,
                "pci": round(pci, 3),
                "timestamp": (datetime.now() - timedelta(minutes=minutes_ago)).strftime("%Y-%m-%d %H:%M"),
                "status": "NEW",
                "officer": None,
                "notes": None,
                "phone_number": "+919999999999",   # placeholder — not a real number
                "officer_phone_number": "+919999999999",
                "sms_sent_at": None,
                "call_status": None,
                "created_at": datetime.now().isoformat(),
            })
        return alerts
    except Exception as e:
        print(f"[enforcement] Could not seed from data: {e}")
        return []


# ── Pydantic models ───────────────────────────────────────────────────────────

class AssignOfficerRequest(BaseModel):
    officer: str

class SMSRequest(BaseModel):
    message: str

class ResolveRequest(BaseModel):
    notes: Optional[str] = None

class CallRequest(BaseModel):
    officer_name: Optional[str] = None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/queue")
async def get_alert_queue():
    """Get all alerts in the enforcement queue (persisted across restarts)."""
    queue = _load_queue()
    if not queue:
        queue = _seed_queue_from_data()
        _save_queue(queue)
    return queue


@router.post("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    """Acknowledge an alert (NEW -> ACKNOWLEDGED)."""
    queue = _load_queue()
    for alert in queue:
        if alert["id"] == alert_id:
            alert["status"] = "ACKNOWLEDGED"
            _save_queue(queue)
            timeline = _load_timeline()
            timeline.append({
                "action": "ACKNOWLEDGED",
                "title": "Alert Acknowledged",
                "description": f"Alert {alert_id} at {alert['location']} acknowledged by command center",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            _save_timeline(timeline)
            return {"success": True, "alert": alert}
    raise HTTPException(status_code=404, detail="Alert not found")


@router.post("/{alert_id}/assign")
async def assign_officer(alert_id: str, request: AssignOfficerRequest):
    """Assign officer to alert (ACKNOWLEDGED -> OFFICER_ASSIGNED)."""
    queue = _load_queue()
    for alert in queue:
        if alert["id"] == alert_id:
            alert["status"] = "OFFICER_ASSIGNED"
            alert["officer"] = request.officer
            _save_queue(queue)
            timeline = _load_timeline()
            timeline.append({
                "action": "OFFICER_ASSIGNED",
                "title": "Officer Assigned",
                "description": f"{request.officer} assigned to {alert['location']} - Vehicle {alert['vehicle_id']}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            _save_timeline(timeline)
            return {"success": True, "alert": alert}
    raise HTTPException(status_code=404, detail="Alert not found")

@router.post("/{alert_id}/auto-assign")
async def auto_assign(
    alert_id: str
):

    queue = _load_queue()

    for alert in queue:

        if alert["id"] == alert_id:

            assigned = (
                DispatchService
                .assign_officer(
                    alert["location"])
            )

            if not assigned:
                raise HTTPException(
                    status_code=503,
                    detail=
                    "No officers available"
                )

            alert["officer"] = (
                assigned["name"]
            )

            alert[
                "officer_phone_number"
            ] = assigned["phone"]

            alert["status"] = (
                "OFFICER_ASSIGNED"
            )

            _save_queue(queue)

            return {
                "success": True,
                "officer":
                    assigned["name"],
                "alert": alert,
            }

    raise HTTPException(
        status_code=404,
        detail="Alert not found"
    )

@router.post("/{alert_id}/sms")
async def send_sms(alert_id: str, request: SMSRequest):
    """Send SMS notification to vehicle owner."""
    queue = _load_queue()
    for alert in queue:
        if alert["id"] == alert_id:
            try:
                sms_result = await sms_service._send_sms(alert["phone_number"], request.message)
            except SMSServiceError as exc:
                raise HTTPException(status_code=503, detail=str(exc)) from exc
            alert["sms_sent_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            _save_queue(queue)
            timeline = _load_timeline()
            timeline.append({
                "action": "SMS_SENT",
                "title": "SMS Sent",
                "description": f"Warning SMS sent to owner of {alert['vehicle_id']} at {alert['phone_number']}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            _save_timeline(timeline)
            return {
                "success": True,
                "message": "SMS sent successfully",
                "vehicle_id": alert["vehicle_id"],
                "sms_content": request.message,
                "provider": sms_result.get("provider", "simulation"),
                "phone_number": alert["phone_number"],
            }
    raise HTTPException(status_code=404, detail="Alert not found")


@router.post("/{alert_id}/call")
async def place_call(alert_id: str, request: Optional[CallRequest] = None):
    """Place or log field officer call activity."""
    queue = _load_queue()
    for alert in queue:
        if alert["id"] == alert_id:
            officer_name = (
                request.officer_name if request and request.officer_name
                else alert.get("officer") or "Assigned Officer"
            )
            call_message = (
                f"Officer {officer_name}, respond to illegal parking alert at {alert['location']} "
                f"for vehicle {alert['vehicle_id']}. Please acknowledge arrival with the command center."
            )
            try:
                call_result = await telephony_service.place_voice_call(
                    alert["officer_phone_number"], call_message
                )
            except TelephonyServiceError as exc:
                raise HTTPException(status_code=503, detail=str(exc)) from exc
            alert["call_status"] = {
                "status": call_result["status"],
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "officer": officer_name,
                "provider": call_result["provider"],
                "phone_number": alert["officer_phone_number"],
                "external_id": call_result.get("external_id"),
            }
            _save_queue(queue)
            timeline = _load_timeline()
            timeline.append({
                "action": "CALL_COMPLETED",
                "title": "Officer Call Logged",
                "description": f"{officer_name} call initiated for {alert['location']} / {alert['vehicle_id']}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            _save_timeline(timeline)
            return {
                "success": True,
                "message": "Officer call initiated successfully",
                "officer": officer_name,
                "vehicle_id": alert["vehicle_id"],
                "location": alert["location"],
                "status": call_result["status"],
                "provider": call_result["provider"],
                "phone_number": alert["officer_phone_number"],
            }
    raise HTTPException(status_code=404, detail="Alert not found")


@router.post("/{alert_id}/resolve")
async def resolve_alert(alert_id: str, request: ResolveRequest = None):
    """Mark alert as resolved (OFFICER_ASSIGNED -> RESOLVED)."""
    queue = _load_queue()
    for alert in queue:
        if alert["id"] == alert_id:
            alert["status"] = "RESOLVED"
            if alert.get("officer"):
                DispatchService.release_officer(
                    alert["officer"]
                )
            created = (
                datetime.fromisoformat(
                    alert["created_at"]
                )
            )

            resolution_minutes = int(
                (
                    datetime.now()
                    - created
                ).total_seconds()
                / 60
            )

            alert[
                "resolution_minutes"
            ] = resolution_minutes
            if request and request.notes:
                alert["notes"] = request.notes
            _save_queue(queue)
            timeline = _load_timeline()
            timeline.append({
                "action": "RESOLVED",
                "title": "Alert Resolved",
                "description": f"Incident at {alert['location']} resolved by {alert.get('officer', 'Unknown')}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            _save_timeline(timeline)
            return {
                "success": True,
                "alert": alert,
                "resolution_minutes":
                    resolution_minutes,
            }
    raise HTTPException(status_code=404, detail="Alert not found")


@router.get("/timeline")
async def get_enforcement_timeline():
    """Get recent enforcement activity timeline (persisted across restarts)."""
    timeline = _load_timeline()
    return sorted(timeline, key=lambda x: x["timestamp"], reverse=True)[:20]


@router.get("/officers")
async def get_officers_status():

    officers = (
        DispatchService
        .load_officers()
    )

    return {
        "total": len(officers),

        "active": len([
            o
            for o in officers
            if not o["available"]
        ]),

        "available": len([
            o
            for o in officers
            if o["available"]
        ]),

        "officers": officers,
    }

@router.get("/stats")
async def get_enforcement_stats():
    """Get enforcement statistics from persisted queue."""
    queue = _load_queue()
    resolved = [
        a
        for a in queue
        if a["status"]
        == "RESOLVED"
        and
        "resolution_minutes"
        in a
    ]

    avg_response = (
        round(
            sum(
                a[
                    "resolution_minutes"
                ]
                for a in resolved
            )
            /
            len(resolved),
            1
        )
        if resolved
        else 0
    )
    officers = DispatchService.load_officers()
    return {
        "alerts_today": len(queue),
        "resolved_today": len([a for a in queue if a["status"] == "RESOLVED"]),
        "pending": len([a for a in queue if a["status"] != "RESOLVED"]),
        "officers_active": len(
            [
                o
                for o in officers
                if not o["available"]
            ]
        ),
        "avg_response_time": f"{avg_response} min",
        "sms_sent_today": len([a for a in queue if a.get("sms_sent_at")]),
        "calls_made_today": len([a for a in queue if a.get("call_status")]),
    }


@router.get("/communications/status")
async def get_communications_status():
    return {
        "sms_provider": sms_service.provider,
        "call_provider": telephony_service.provider,
        "simulation_allowed": ALLOW_SIMULATION_PROVIDERS,
    }
