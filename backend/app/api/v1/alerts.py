from fastapi import APIRouter
from app.services.alert_service import AlertService

router = APIRouter()


@router.get("/alerts")
def get_alerts():

    return (
        AlertService
        .get_live_events()
    )