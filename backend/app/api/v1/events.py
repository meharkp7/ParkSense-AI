from fastapi import APIRouter

from app.services.alert_service import (
    AlertService,
)

router = APIRouter()


@router.get("/events")
def get_events():
    return AlertService.get_live_events()