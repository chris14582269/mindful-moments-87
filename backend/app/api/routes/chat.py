from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.models import ChatMessage, User
from app.db.session import get_db
from app.schemas import ChatRequest, ChatResponse
from app.services.ai import coach_reply

router = APIRouter(prefix="/chat", tags=["ai nutrition coach"])


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, current_user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    db.add(ChatMessage(user_id=current_user.id, role="user", content=payload.message, metadata_json={"goal": payload.goal, "conditions": payload.conditions}))
    reply, recommendations = await coach_reply(payload.message, payload.goal, payload.conditions)
    db.add(ChatMessage(user_id=current_user.id, role="assistant", content=reply, metadata_json={"recommendations": recommendations}))
    db.commit()
    return ChatResponse(reply=reply, recommendations=recommendations)
