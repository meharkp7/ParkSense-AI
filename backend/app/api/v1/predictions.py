from typing import List

from fastapi import APIRouter

from app.schemas.prediction import (
    PredictionResponse,
)

from app.services.prediction_service import (
    PredictionService,
)

router = APIRouter()


@router.get(
    "/predictions",
    response_model=List[
        PredictionResponse
    ],
)
def get_predictions():

    return (
        PredictionService
        .get_predictions()
    )