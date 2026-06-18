from fastapi import APIRouter

from app.services.anomaly_service import (
    AnomalyService,
)

router = APIRouter()


@router.get(
    "/anomalies"
)
def get_anomalies():

    return (
        AnomalyService
        .get_anomalies()
    )