from __future__ import annotations

import json
from typing import Any

from openai import AsyncOpenAI

from app.core.config import get_settings
from app.schemas import FoodItemAnalysis, MealAnalysisResponse
from app.services.nutrition import build_analysis

SYSTEM_PROMPT = """You are a Singapore clinical nutrition assistant. Identify local foods, portions,
cooking method, calories, protein, carbs, fat, fibre and sodium. Return strict JSON with a foods array."""


async def analyse_meal_with_ai(description: str | None = None, image_url: str | None = None) -> MealAnalysisResponse:
    settings = get_settings()
    if not settings.openai_api_key:
        return build_analysis(description or "chicken rice")

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    content: list[dict[str, Any]] = [{"type": "input_text", "text": description or "Analyse this Singapore meal."}]
    if image_url:
        content.append({"type": "input_image", "image_url": image_url})

    response = await client.responses.create(
        model=settings.openai_vision_model,
        input=[{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": content}],
        text={"format": {"type": "json_object"}},
    )
    payload = json.loads(response.output_text)
    foods = [FoodItemAnalysis(**item) for item in payload.get("foods", [])]
    return build_analysis(description, foods=foods)


async def coach_reply(message: str, goal: str | None = None, conditions: list[str] | None = None) -> tuple[str, list[str]]:
    settings = get_settings()
    context = f"Goal: {goal or 'healthy eating'}. Conditions: {', '.join(conditions or []) or 'none'}."
    if not settings.openai_api_key:
        analysis = build_analysis(message)
        return (
            "Based on Singapore HPB guidance, focus on lower sodium, more vegetables, and wholegrain swaps for this meal.",
            analysis.recommendations,
        )

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    response = await client.responses.create(
        model=settings.openai_model,
        input=[
            {"role": "system", "content": "Give concise, safe Singapore-specific nutrition coaching. Avoid medical diagnosis."},
            {"role": "user", "content": f"{context}\nUser: {message}"},
        ],
    )
    return response.output_text, build_analysis(message).recommendations
