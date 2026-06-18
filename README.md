# ParkSense AI

ParkSense AI is a smart city parking intelligence and enforcement platform for monitoring violations, surfacing congestion hotspots, prioritizing enforcement action, and coordinating field operations.

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
