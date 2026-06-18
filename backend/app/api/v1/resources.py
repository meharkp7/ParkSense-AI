from fastapi import APIRouter

from app.services.resource_service import (
    ResourceService,
)

router = APIRouter()


@router.get(
    "/resources"
)
def resources():

    return (
        ResourceService
        .get_resources()
    )