"""
SMS Notification Service
Integration with Twilio, MSG91, or Fast2SMS
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional
from urllib import error, parse, request
import base64
import json

from app.core.config import (
    ALLOW_SIMULATION_PROVIDERS,
    FAST2SMS_API_KEY,
    FAST2SMS_ROUTE,
    FAST2SMS_SENDER_ID,
    MSG91_AUTH_KEY,
    MSG91_COUNTRY,
    MSG91_ROUTE,
    MSG91_SENDER_ID,
    SMS_PROVIDER,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_SMS_FROM,
)


class SMSServiceError(RuntimeError):
    """Raised when an SMS provider cannot process a request."""


class SMSService:
    """
    SMS Service for sending notifications
    Supports: Twilio, MSG91, Fast2SMS
    """
    
    def __init__(self, provider: str | None = None):
        self.provider = (provider or SMS_PROVIDER).lower()
        
    async def send_violation_alert(
        self,
        phone_number: str,
        vehicle_id: str,
        location: str,
        fine_amount: Optional[int] = None
    ) -> dict:
        """Send violation alert SMS to vehicle owner"""
        message = (
            f"BBMP PARKING ALERT\n"
            f"Vehicle: {vehicle_id}\n"
            f"Location: {location}\n"
            f"Illegal parking detected. Please move immediately.\n"
        )
        
        if fine_amount:
            message += f"Fine: ₹{fine_amount}\n"
            
        message += "Contact: 1800-XXX-XXXX"
        
        return await self._send_sms(phone_number, message)
    
    async def send_officer_alert(
        self,
        phone_number: str,
        officer_name: str,
        location: str,
        vehicle_id: str
    ) -> dict:
        """Send alert to field officer"""
        message = (
            f"ENFORCEMENT ALERT\n"
            f"Officer: {officer_name}\n"
            f"Location: {location}\n"
            f"Vehicle: {vehicle_id}\n"
            f"Action Required: Immediate response needed"
        )
        
        return await self._send_sms(phone_number, message)
    
    async def send_supervisor_report(
        self,
        phone_number: str,
        total_violations: int,
        resolved: int,
        pending: int
    ) -> dict:
        """Send daily report to supervisor"""
        message = (
            f"DAILY ENFORCEMENT REPORT\n"
            f"Total Violations: {total_violations}\n"
            f"Resolved: {resolved}\n"
            f"Pending: {pending}\n"
            f"Date: {datetime.now().strftime('%Y-%m-%d')}"
        )
        
        return await self._send_sms(phone_number, message)
    
    async def _send_sms(self, phone_number: str, message: str) -> dict:
        """Internal method to send SMS via selected provider"""
        if self.provider == "twilio":
            return await self._send_via_twilio(phone_number, message)

        if self.provider == "msg91":
            return await self._send_via_msg91(phone_number, message)

        if self.provider == "fast2sms":
            return await self._send_via_fast2sms(phone_number, message)

        if self.provider in {"simulation", "disabled"} and ALLOW_SIMULATION_PROVIDERS:
            return self._simulate_sms(phone_number, message)

        raise SMSServiceError(
            "SMS provider is not configured. Set PARKSENSE_SMS_PROVIDER and provider credentials."
        )

    async def _send_via_twilio(self, phone_number: str, message: str) -> dict:
        """Send SMS via Twilio"""
        if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_SMS_FROM:
            raise SMSServiceError(
                "Twilio SMS provider is missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_SMS_FROM."
            )

        payload = parse.urlencode(
            {
                "To": phone_number,
                "From": TWILIO_SMS_FROM,
                "Body": message,
            }
        ).encode()
        endpoint = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json"
        auth_value = base64.b64encode(
            f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}".encode()
        ).decode()
        headers = {
            "Authorization": f"Basic {auth_value}",
            "Content-Type": "application/x-www-form-urlencoded",
        }

        body = self._perform_request(endpoint, payload, headers)
        return {
            "success": True,
            "provider": "twilio",
            "status": body.get("status", "queued"),
            "phone_number": phone_number,
            "external_id": body.get("sid"),
        }
    
    async def _send_via_msg91(self, phone_number: str, message: str) -> dict:
        """Send SMS via MSG91"""
        if not MSG91_AUTH_KEY or not MSG91_SENDER_ID:
            raise SMSServiceError(
                "MSG91 SMS provider is missing MSG91_AUTH_KEY or MSG91_SENDER_ID."
            )

        endpoint = "https://control.msg91.com/api/v5/sms"
        payload = json.dumps(
            {
                "sender": MSG91_SENDER_ID,
                "route": MSG91_ROUTE,
                "country": MSG91_COUNTRY,
                "sms": [
                    {
                        "message": message,
                        "to": [self._normalize_number(phone_number)],
                    }
                ],
            }
        ).encode()
        headers = {
            "authkey": MSG91_AUTH_KEY,
            "Content-Type": "application/json",
        }

        body = self._perform_request(endpoint, payload, headers)
        return {
            "success": True,
            "provider": "msg91",
            "status": body.get("type", "submitted"),
            "phone_number": phone_number,
            "external_id": body.get("request_id"),
        }
    
    async def _send_via_fast2sms(self, phone_number: str, message: str) -> dict:
        """Send SMS via Fast2SMS"""
        if not FAST2SMS_API_KEY:
            raise SMSServiceError(
                "Fast2SMS provider is missing FAST2SMS_API_KEY."
            )

        endpoint = "https://www.fast2sms.com/dev/bulkV2"
        payload_dict: Dict[str, Any] = {
            "route": FAST2SMS_ROUTE,
            "message": message,
            "language": "english",
            "numbers": self._normalize_number(phone_number),
        }
        if FAST2SMS_SENDER_ID:
            payload_dict["sender_id"] = FAST2SMS_SENDER_ID

        payload = json.dumps(payload_dict).encode()
        headers = {
            "authorization": FAST2SMS_API_KEY,
            "Content-Type": "application/json",
        }

        body = self._perform_request(endpoint, payload, headers)
        return {
            "success": True,
            "provider": "fast2sms",
            "status": body.get("return", "submitted"),
            "phone_number": phone_number,
            "external_id": str(body.get("request_id", "")) or None,
        }

    def _simulate_sms(self, phone_number: str, message: str) -> dict:
        return {
            "success": True,
            "provider": "simulation",
            "phone_number": phone_number,
            "message": message,
            "status": "sent",
            "timestamp": datetime.now().isoformat(),
        }

    def _perform_request(
        self,
        endpoint: str,
        payload: bytes,
        headers: Dict[str, str],
    ) -> Dict[str, Any]:
        req = request.Request(endpoint, data=payload, headers=headers, method="POST")

        try:
            with request.urlopen(req, timeout=15) as response:
                raw = response.read().decode()
        except error.HTTPError as exc:
            detail = exc.read().decode()
            raise SMSServiceError(f"SMS request failed: {detail}") from exc
        except error.URLError as exc:
            raise SMSServiceError(f"Unable to reach SMS provider: {exc.reason}") from exc

        if not raw:
            return {}

        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"raw_response": raw}

    def _normalize_number(self, phone_number: str) -> str:
        digits = "".join(char for char in phone_number if char.isdigit())
        if digits.startswith("91") and len(digits) > 10:
            return digits[2:]
        return digits[-10:]


# Global SMS service instance
sms_service = SMSService()
