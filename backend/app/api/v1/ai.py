from fastapi import APIRouter
from app.services.ai_service import AIService

router = APIRouter()


@router.get("/ai/insights")
def get_insights():
    return AIService.generate_insights()