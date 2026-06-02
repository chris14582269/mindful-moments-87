from typing import Annotated

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.models import AuditAction
from app.db.session import get_db
from app.schemas import WhatsAppWebhookPayload
from app.services.audit import write_audit_log
from app.services.ai import analyse_meal_with_ai

router = APIRouter(prefix="/webhooks/whatsapp", tags=["whatsapp"])


@router.get("")
def verify_webhook(
    mode: str = Query(alias="hub.mode"),
    token: str = Query(alias="hub.verify_token"),
    challenge: str = Query(alias="hub.challenge"),
):
    settings = get_settings()
    if mode == "subscribe" and token == settings.whatsapp_verify_token:
        return int(challenge) if challenge.isdigit() else challenge
    raise HTTPException(status_code=403, detail="Invalid verification token")


@router.post("")
async def receive_webhook(payload: WhatsAppWebhookPayload, request: Request, db: Annotated[Session, Depends(get_db)]):
    settings = get_settings()
    messages = _extract_messages(payload.entry)
    responses = []
    for message in messages:
        text = message.get("text") or "Food photo received via WhatsApp"
        analysis = await analyse_meal_with_ai(description=text)
        response_text = _format_analysis(analysis)
        responses.append({"to": message.get("from"), "response": response_text})
        if settings.whatsapp_access_token and settings.whatsapp_phone_number_id and message.get("from"):
            await _send_whatsapp_message(message["from"], response_text)
    write_audit_log(db, action=AuditAction.webhook, resource_type="whatsapp", metadata={"count": len(messages), "ip": request.client.host if request.client else None})
    db.commit()
    return {"status": "received", "messages": len(messages), "responses": responses}


def _extract_messages(entries: list[dict]) -> list[dict]:
    output = []
    for entry in entries:
        for change in entry.get("changes", []):
            value = change.get("value", {})
            for message in value.get("messages", []):
                text = message.get("text", {}).get("body")
                output.append({"from": message.get("from"), "text": text, "type": message.get("type")})
    return output


def _format_analysis(analysis) -> str:
    foods = ", ".join(food.name for food in analysis.foods)
    return f"Food AI SG analysis: {foods}. {analysis.nutrition.calories:.0f} kcal, HPB score {analysis.nutrition.healthy_eating_score}/100 ({analysis.nutrition.category}). Tip: {analysis.recommendations[0] if analysis.recommendations else 'Keep meals balanced.'}"


async def _send_whatsapp_message(to: str, text: str) -> None:
    settings = get_settings()
    url = f"https://graph.facebook.com/v20.0/{settings.whatsapp_phone_number_id}/messages"
    headers = {"Authorization": f"Bearer {settings.whatsapp_access_token}"}
    payload = {"messaging_product": "whatsapp", "to": to, "type": "text", "text": {"body": text}}
    async with httpx.AsyncClient(timeout=10) as client:
        await client.post(url, headers=headers, json=payload)
