"""
Voice call service for field operations.
Supports provider-backed calling with deployment-friendly configuration.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict
from urllib import error, parse, request
from xml.sax.saxutils import escape
import base64
import json

from app.core.config import (
    ALLOW_SIMULATION_PROVIDERS,
    CALL_PROVIDER,
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_CALL_FROM,
)


class TelephonyServiceError(RuntimeError):
    """Raised when the call provider is unavailable or misconfigured."""


class TelephonyService:
    def __init__(self, provider: str | None = None):
        self.provider = (provider or CALL_PROVIDER).lower()

    async def place_voice_call(
        self,
        phone_number: str,
        message: str,
    ) -> Dict[str, Any]:
        if self.provider == "twilio":
            return self._place_via_twilio(phone_number, message)

        if self.provider in {"simulation", "disabled"} and ALLOW_SIMULATION_PROVIDERS:
            return self._simulate_call(phone_number, message)

        raise TelephonyServiceError(
            "Call provider is not configured. Set PARKSENSE_CALL_PROVIDER and provider credentials."
        )

    def _place_via_twilio(
        self,
        phone_number: str,
        message: str,
    ) -> Dict[str, Any]:
        if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN or not TWILIO_CALL_FROM:
            raise TelephonyServiceError(
                "Twilio call provider is missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_CALL_FROM."
            )

        twiml = f"<Response><Say voice='alice'>{escape(message)}</Say></Response>"
        payload = parse.urlencode(
            {
                "To": phone_number,
                "From": TWILIO_CALL_FROM,
                "Twiml": twiml,
            }
        ).encode()
        endpoint = f"https://api.twilio.com/2010-04-01/Accounts/{TWILIO_ACCOUNT_SID}/Calls.json"
        auth_value = base64.b64encode(
            f"{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}".encode()
        ).decode()
        headers = {
            "Authorization": f"Basic {auth_value}",
            "Content-Type": "application/x-www-form-urlencoded",
        }

        try:
          req = request.Request(endpoint, data=payload, headers=headers, method="POST")
          with request.urlopen(req, timeout=15) as response:
              body = json.loads(response.read().decode())
        except error.HTTPError as exc:
          detail = exc.read().decode()
          raise TelephonyServiceError(f"Twilio call request failed: {detail}") from exc
        except error.URLError as exc:
          raise TelephonyServiceError(f"Unable to reach Twilio call API: {exc.reason}") from exc

        return {
            "success": True,
            "provider": "twilio",
            "status": body.get("status", "queued"),
            "phone_number": phone_number,
            "external_id": body.get("sid"),
        }

    def _simulate_call(
        self,
        phone_number: str,
        message: str,
    ) -> Dict[str, Any]:
        return {
            "success": True,
            "provider": "simulation",
            "status": "completed",
            "phone_number": phone_number,
            "message": message,
            "external_id": None,
            "timestamp": datetime.now().isoformat(),
        }


telephony_service = TelephonyService()
