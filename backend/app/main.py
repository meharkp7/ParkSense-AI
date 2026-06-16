from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.dashboard import (
    router as dashboard_router,
)

from app.api.v1.map import (
    router as map_router,
)

from app.api.v1.analytics import (
    router as analytics_router,
)

from app.api.v1.predictions import (
    router as prediction_router,
)

app = FastAPI(
    title="ParkSense AI API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    dashboard_router,
    prefix="/api/v1",
    tags=["dashboard"],
)

app.include_router(
    map_router,
    prefix="/api/v1",
    tags=["map"],
)

app.include_router(
    analytics_router,
    prefix="/api/v1",
    tags=["analytics"],
)

app.include_router(
    prediction_router,
    prefix="/api/v1",
    tags=["predictions"],
)

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }