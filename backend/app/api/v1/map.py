from fastapi import APIRouter

from app.services.map_service import (
    MapService,
)

router = APIRouter()


@router.get("/hotspots")
def get_hotspots():

    return MapService.get_hotspots()