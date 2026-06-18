"""
Enforcement Workflow Management API
Handles: Alert Queue -> Acknowledge -> Assign Officer -> SMS/Call -> Resolve
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import random

from app.core.config import ALLOW_SIMULATION_PROVIDERS, TWILIO_CALL_FROM
from app.services.sms_service import sms_service
from app.services.sms_service import SMSServiceError
from app.services.telephony_service import telephony_service
from app.services.telephony_service import TelephonyServiceError
from dotenv import load_dotenv

router = APIRouter()

# In-memory storage (use database in production)
alert_queue = []
timeline_events = []


class AssignOfficerRequest(BaseModel):
    officer: str


class SMSRequest(BaseModel):
    message: str


class ResolveRequest(BaseModel):
    notes: Optional[str] = None


class CallRequest(BaseModel):
    officer_name: Optional[str] = None


@router.get("/queue")
async def get_alert_queue():
    """Get all alerts in the enforcement queue"""
    # Simulate alert queue
    if not alert_queue:
        for i in range(15):
            alert_queue.append({
                "id": f"ALT-{i:04d}",
                "location": random.choice([
                    "MG Road Junction",
                    "Indiranagar Main",
                    "Koramangala 80ft",
                    "Whitefield Road",
                    "KR Market",
                    "Malleshwaram Circle"
                ]),
                "vehicle_id": f"KA{random.randint(1,5):02d}{random.choice(['AB','CD','EF'])}{random.randint(1000,9999)}",
                "severity": random.choice(["CRITICAL", "HIGH", "MEDIUM"]),
                "timestamp": (datetime.now() - timedelta(minutes=random.randint(1, 120))).strftime("%Y-%m-%d %H:%M"),
                "status": random.choice(["NEW", "ACKNOWLEDGED", "OFFICER_ASSIGNED", "RESOLVED"]),
                "officer": random.choice([None, "Officer Kumar", "Officer Sharma", "Officer Patel"]),
                "notes": None,
                "phone_number": "+918527673357",
                "officer_phone_number": "+918527673357",
                "sms_sent_at": None,
                "call_status": None,
            })
    
    return alert_queue


@router.post("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str):
    """Acknowledge an alert (NEW -> ACKNOWLEDGED)"""
    for alert in alert_queue:
        if alert["id"] == alert_id:
            alert["status"] = "ACKNOWLEDGED"
            timeline_events.append({
                "action": "ACKNOWLEDGED",
                "title": f"Alert Acknowledged",
                "description": f"Alert {alert_id} at {alert['location']} acknowledged by command center",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            return {"success": True, "alert": alert}
    
    raise HTTPException(status_code=404, detail="Alert not found")


@router.post("/{alert_id}/assign")
async def assign_officer(alert_id: str, request: AssignOfficerRequest):
    """Assign officer to alert (ACKNOWLEDGED -> OFFICER_ASSIGNED)"""
    for alert in alert_queue:
        if alert["id"] == alert_id:
            alert["status"] = "OFFICER_ASSIGNED"
            alert["officer"] = request.officer
            timeline_events.append({
                "action": "OFFICER_ASSIGNED",
                "title": f"Officer Assigned",
                "description": f"{request.officer} assigned to {alert['location']} - Vehicle {alert['vehicle_id']}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            return {"success": True, "alert": alert}
    
    raise HTTPException(status_code=404, detail="Alert not found")


@router.post("/{alert_id}/sms")
async def send_sms(alert_id: str, request: SMSRequest):
    """Send SMS notification to vehicle owner"""
    for alert in alert_queue:
        if alert["id"] == alert_id:
            try:
                sms_result = await sms_service._send_sms(
                    alert["phone_number"],
                    request.message
                )
            except SMSServiceError as exc:
                raise HTTPException(status_code=503, detail=str(exc)) from exc
            alert["sms_sent_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            timeline_events.append({
                "action": "SMS_SENT",
                "title": f"SMS Sent",
                "description": f"Warning SMS sent to owner of {alert['vehicle_id']} at {alert['phone_number']}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
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
    """Place or log field officer call activity"""
    for alert in alert_queue:
        if alert["id"] == alert_id:
            officer_name = (
                request.officer_name
                if request and request.officer_name
                else alert.get("officer")
                or "Assigned Officer"
            )
            call_message = (
                f"Officer {officer_name}, respond to illegal parking alert at {alert['location']} "
                f"for vehicle {alert['vehicle_id']}. Please acknowledge arrival with the command center."
            )
            try:
                call_result = await telephony_service.place_voice_call(
                    alert["officer_phone_number"],
                    call_message,
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
            timeline_events.append({
                "action": "CALL_COMPLETED",
                "title": "Officer Call Logged",
                "description": f"{officer_name} call initiated for {alert['location']} / {alert['vehicle_id']}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
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
    """Mark alert as resolved (OFFICER_ASSIGNED -> RESOLVED)"""
    for alert in alert_queue:
        if alert["id"] == alert_id:
            alert["status"] = "RESOLVED"
            if request and request.notes:
                alert["notes"] = request.notes
            timeline_events.append({
                "action": "RESOLVED",
                "title": f"Alert Resolved",
                "description": f"Incident at {alert['location']} resolved by {alert.get('officer', 'Unknown')}",
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            return {"success": True, "alert": alert}
    
    raise HTTPException(status_code=404, detail="Alert not found")


@router.get("/timeline")
async def get_enforcement_timeline():
    """Get recent enforcement activity timeline"""
    # Return recent events (last 20)
    return sorted(timeline_events, key=lambda x: x["timestamp"], reverse=True)[:20]


@router.get("/officers")
async def get_officers_status():
    """Get status of all field officers"""
    officers = [
        {"id": 1, "name": "Officer Kumar", "location": "MG Road", "status": "On Duty", "cases": 3, "available": False},
        {"id": 2, "name": "Officer Sharma", "location": "Indiranagar", "status": "Available", "cases": 1, "available": True},
        {"id": 3, "name": "Officer Patel", "location": "Koramangala", "status": "On Duty", "cases": 2, "available": False},
        {"id": 4, "name": "Officer Singh", "location": "Whitefield", "status": "Break", "cases": 0, "available": False},
        {"id": 5, "name": "Officer Reddy", "location": "KR Market", "status": "On Duty", "cases": 4, "available": False},
        {"id": 6, "name": "Officer Verma", "location": "Malleshwaram", "status": "Available", "cases": 0, "available": True},
    ]
    
    return {
        "total": len(officers),
        "active": len([o for o in officers if o["status"] == "On Duty"]),
        "available": len([o for o in officers if o["available"]]),
        "officers": officers
    }


@router.get("/stats")
async def get_enforcement_stats():
    """Get enforcement statistics"""
    return {
        "alerts_today": len(alert_queue),
        "resolved_today": len([a for a in alert_queue if a["status"] == "RESOLVED"]),
        "pending": len([a for a in alert_queue if a["status"] != "RESOLVED"]),
        "officers_active": 24,
        "avg_response_time": "8 minutes",
        "sms_sent_today": len([a for a in alert_queue if a.get("sms_sent_at")]),
        "calls_made_today": len([a for a in alert_queue if a.get("call_status")])
    }


@router.get("/communications/status")
async def get_communications_status():
    return {
        "sms_provider": sms_service.provider,
        "call_provider": telephony_service.provider,
        "simulation_allowed": ALLOW_SIMULATION_PROVIDERS,
    }
