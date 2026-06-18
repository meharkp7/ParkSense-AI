from fastapi import APIRouter

from app.services.timeline_service import (
    TimelineService,
)

router = APIRouter()


@router.get("/timeline")
def get_timeline(
    location: str,
):
    return TimelineService.get_timeline(
        location
    )