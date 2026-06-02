import pytest

from app.services.ai import analyse_meal_with_ai, coach_reply
from app.services.storage import create_presigned_upload
from app.worker import analyse_meal_task


@pytest.mark.asyncio
async def test_ai_analysis_falls_back_without_api_key():
    analysis = await analyse_meal_with_ai(description="fish soup with vegetables")

    assert analysis.nutrition.calories > 0
    assert analysis.confidence > 0


@pytest.mark.asyncio
async def test_coach_reply_falls_back_without_api_key():
    reply, recommendations = await coach_reply("chicken rice", goal="weight loss", conditions=["diabetes prevention"])

    assert "Singapore HPB" in reply
    assert recommendations


def test_create_presigned_upload_uses_s3_encryption(monkeypatch):
    calls = {}

    class FakeS3:
        def generate_presigned_url(self, ClientMethod, Params, ExpiresIn):
            calls["method"] = ClientMethod
            calls["params"] = Params
            calls["expires"] = ExpiresIn
            return "https://example.com/upload"

    monkeypatch.setattr("app.services.storage.boto3.client", lambda *args, **kwargs: FakeS3())

    result = create_presigned_upload("meal.jpg", "image/jpeg")

    assert result["url"] == "https://example.com/upload"
    assert calls["params"]["ServerSideEncryption"] == "AES256"
    assert calls["expires"] == 900


def test_worker_task_reports_queued_status():
    assert analyse_meal_task("meal-1") == {"meal_id": "meal-1", "status": "queued"}
