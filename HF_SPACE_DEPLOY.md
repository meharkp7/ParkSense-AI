# Hugging Face Space Deploy

Use this repo as a Docker Space for the backend only.

## Space Settings

- SDK: `Docker`
- App Port: `8000`
- Suggested hardware: `CPU Basic`

## Deploy Steps

1. Create a new Hugging Face Space.
2. Choose `Docker` as the SDK.
3. Import this repository or push this repository to the Space.
4. Add runtime variables in the Space settings if needed:
   - `PARKSENSE_CORS_ORIGINS`
   - `PARKSENSE_ALLOW_SIMULATION_PROVIDERS`
   - any SMS or call provider secrets
5. Let the Space build and start.

## Expected API Base URL

Once deployed, the backend will be available at:

`https://<your-space-subdomain>.hf.space/api/v1`

Set your Vercel frontend variable:

`VITE_API_BASE_URL=https://<your-space-subdomain>.hf.space/api/v1`

## Notes

- This deploy uses the root-level `Dockerfile`, but only copies `backend/`.
- Processed pickle data in `backend/data/processed` is included.
- Raw data and notebooks are excluded from the Docker build context.
