from fastapi import APIRouter

from app.services.city_health_service import (
    CityHealthService,
)

router = APIRouter()


@router.get(
    "/city-health"
)
def city_health():

    return (
        CityHealthService
        .get_health()
    )