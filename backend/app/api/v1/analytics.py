from fastapi import APIRouter

from app.services.analytics_service import (
    AnalyticsService,
)

router = APIRouter()


@router.get("/roads/top")
def top_roads():

    return AnalyticsService.get_top_roads()

@router.get("/analytics/pci")
def pci_trend():

    return AnalyticsService.get_pci_trend()