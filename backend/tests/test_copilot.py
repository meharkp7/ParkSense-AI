import pytest

from app.services.copilot_service import (
    CopilotService
)


@pytest.mark.asyncio
async def test_copilot_response():

    result = await (
        CopilotService
        .answer(
            "KR Market"
        )
    )

    assert "answer" in result
    assert "mode" in result