---
title: ParkSense AI Backend
sdk: docker
app_port: 8000
pinned: false
---

# ParkSense AI

ParkSense AI is a smart city parking intelligence and enforcement platform for monitoring violations, surfacing congestion hotspots, prioritizing enforcement action, and coordinating field operations.

## Deployment Readiness

The project now supports configurable frontend API URLs, backend CORS origins, provider-backed SMS, provider-backed officer calls, Docker builds, and Docker Compose for local production-style smoke testing.

### Quick Production Smoke Test

1. Copy `.env.example` to `.env`
2. Copy `frontend/.env.example` to `frontend/.env` if you want a local frontend override
3. Fill in your provider credentials
4. Run:

```bash
docker compose up --build
```

Frontend will be available at `http://localhost:8080` and backend at `http://localhost:8000`.

## Communications Deployment

The enforcement workflow now supports provider-backed SMS and call actions.

### Environment

Copy `.env.example` to `.env` and configure at least one SMS provider plus one call provider.

### Supported SMS Providers

- `twilio`
- `msg91`
- `fast2sms`

### Supported Call Providers

- `twilio`

### Required Variables

For Twilio:

- `PARKSENSE_SMS_PROVIDER=twilio`
- `PARKSENSE_CALL_PROVIDER=twilio`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_SMS_FROM`
- `TWILIO_CALL_FROM`

For MSG91:

- `PARKSENSE_SMS_PROVIDER=msg91`
- `MSG91_AUTH_KEY`
- `MSG91_SENDER_ID`

For Fast2SMS:

- `PARKSENSE_SMS_PROVIDER=fast2sms`
- `FAST2SMS_API_KEY`

### Development Mode

If you still need provider simulation locally, set:

`PARKSENSE_ALLOW_SIMULATION_PROVIDERS=true`

In production, keep that value `false` so misconfiguration fails loudly instead of silently simulating delivery.

## Deployment Notes

- Frontend reads `VITE_API_BASE_URL`
- Backend reads `PARKSENSE_CORS_ORIGINS`
- Backend production image uses `backend/requirements-prod.txt`
- Twilio calls are supported for officer call workflows
- SMS can use Twilio, MSG91, or Fast2SMS
