from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import CORS_ORIGINS

from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.map import router as map_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.predictions import router as prediction_router
from app.api.v1.ai import router as ai_router
from app.api.v1.hotspots import (
    router as hotspot_router,
)

from app.api.v1.alerts import (
    router as alerts_router,
)

from app.api.v1.timeline import (
    router as timeline_router,
)

from app.api.v1.events import (
    router as events_router,
)

from app.api.v1.copilot import (
    router as copilot_router,
)

from app.api.v1.anomaly import (
    router as anomaly_router,
)

from app.api.v1.city_health import (
    router as city_health_router,
)

from app.api.v1.resources import (
    router as resource_router,
)

from app.api.v1.detection import (
    router as detection_router,
)

from app.api.v1.enforcement_workflow import (
    router as enforcement_workflow_router,
)

from app.api.v1.reports import (
    router as reports_router,
)

from app.api.v1.forecast import (
    router as forecast_router,
)

from app.core.config import CORS_ORIGINS

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 ParkSense AI API started")
    yield
    print("🛑 ParkSense AI API stopped")


app = FastAPI(
    title="ParkSense AI API",
    version="1.0.0",
    description="AI-powered smart parking enforcement system",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://park-sense-ai-beta.vercel.app"],
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

app.include_router(
    ai_router,
    prefix="/api/v1",
    tags=["ai"],
)

app.include_router(
    hotspot_router,
    prefix="/api/v1",
    tags=["hotspots"],
)

app.include_router(
    alerts_router,
    prefix="/api/v1",
    tags=["alerts"],
)

app.include_router(
    timeline_router,
    prefix="/api/v1",
    tags=["timeline"],
)

app.include_router(
    events_router,
    prefix="/api/v1",
    tags=["events"],
)

app.include_router(
    copilot_router,
    prefix="/api/v1",
    tags=["copilot"],
)

app.include_router(
    anomaly_router,
    prefix="/api/v1",
    tags=["anomaly"],
)

app.include_router(
    city_health_router,
    prefix="/api/v1",
    tags=["city-health"],
)

app.include_router(
    resource_router,
    prefix="/api/v1",
    tags=["resources"],
)

app.include_router(
    detection_router,
    prefix="/api/v1/detection",
    tags=["detection"],
)

app.include_router(
    enforcement_workflow_router,
    prefix="/api/v1/enforcement",
    tags=["enforcement"],
)

app.include_router(
    reports_router,
    prefix="/api/v1/reports",
    tags=["reports"],
)

app.include_router(
    forecast_router,
    prefix="/api/v1",
    tags=["forecast"],
)

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "ParkSense AI",
        "version": "1.0.0",
    }
