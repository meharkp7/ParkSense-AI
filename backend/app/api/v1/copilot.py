from fastapi import APIRouter
from pydantic import BaseModel

from app.services.copilot_service import (
    CopilotService,
)

router = APIRouter()


class Query(BaseModel):
    question: str


@router.post("/copilot")
def ask(query: Query):

    return CopilotService.answer(
        query.question
    )