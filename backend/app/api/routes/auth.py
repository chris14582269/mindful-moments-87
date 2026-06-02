from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.db.models import Role, User, UserRole
from app.db.session import get_db
from app.schemas import Token, UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["authentication"])


def ensure_role(db: Session, role_name: UserRole) -> Role:
    role = db.scalar(select(Role).where(Role.name == role_name))
    if role:
        return role
    role = Role(name=role_name, description=f"{role_name.value} role")
    db.add(role)
    db.flush()
    return role


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Annotated[Session, Depends(get_db)]):
    if db.scalar(select(User).where(User.email == payload.email)):
        raise HTTPException(status_code=409, detail="Email already registered")
    role = ensure_role(db, UserRole.public)
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        role_id=role.id,
        consent_pdpa_at=datetime.now(timezone.utc) if payload.consent_pdpa else None,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return UserRead(id=user.id, email=user.email, full_name=user.full_name, role=user.role.name.value)


@router.post("/token", response_model=Token)
def token(form: Annotated[OAuth2PasswordRequestForm, Depends()], db: Annotated[Session, Depends(get_db)]):
    user = db.scalar(select(User).where(User.email == form.username))
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return Token(access_token=create_access_token(user.email, [user.role.name.value]))
