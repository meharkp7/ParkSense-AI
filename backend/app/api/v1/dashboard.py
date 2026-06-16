from fastapi import APIRouter

from app.schemas.dashboard import (
    KPIResponse,
)

from app.services.dashboard_service import (
    DashboardService,
)

router = APIRouter()


@router.get(
    "/kpis",
    response_model=KPIResponse,
)
def get_kpis():

    return DashboardService.get_kpis()