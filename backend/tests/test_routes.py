from types import SimpleNamespace
from uuid import uuid4

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.api.routes.chat import chat
from app.api.routes.dashboards import admin_dashboard, clinician_dashboard, user_dashboard
from app.api.routes.meals import persist_analysis
from app.api.routes.whatsapp import verify_webhook
from app.core.security import get_current_user, require_roles
from app.db.models import AuditLog, FoodItem, Meal, NutritionResult, Recommendation, Role, User, UserRole
from app.main import app
from app.schemas import ChatRequest, MealCreate
from app.services.nutrition import build_analysis


class FakeDb:
    def __init__(self, scalars=None):
        self.added = []
        self.committed = False
        self._scalars = list(scalars or [])

    def add(self, item):
        self.added.append(item)

    def flush(self):
        for item in self.added:
            if getattr(item, "id", None) is None:
                item.id = uuid4()

    def commit(self):
        self.committed = True

    def scalar(self, _statement):
        return self._scalars.pop(0) if self._scalars else None


class RoleName:
    value = "public"


class UserRoleRef:
    name = RoleName()


def make_user(role=UserRole.public):
    role_model = Role(id=uuid4(), name=role, description="role")
    user = User(id=uuid4(), email="u@example.com", full_name="User", hashed_password="hash", role_id=role_model.id, is_active=True)
    user.role = role_model
    return user


def test_health_endpoint():
    client = TestClient(app)

    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_persist_analysis_records_meal_food_nutrition_recommendation_and_audit():
    db = FakeDb()
    user = make_user()
    analysis = build_analysis("chicken rice")

    meal = persist_analysis(db, user, MealCreate(description="chicken rice"), analysis)

    assert meal.status == "analysed"
    assert any(isinstance(item, FoodItem) for item in db.added)
    assert any(isinstance(item, NutritionResult) for item in db.added)
    assert any(isinstance(item, Recommendation) for item in db.added)
    assert any(isinstance(item, AuditLog) for item in db.added)


@pytest.mark.asyncio
async def test_chat_route_persists_user_and_assistant_messages(monkeypatch):
    async def fake_coach_reply(message, goal, conditions):
        return "reply", ["recommendation"]

    monkeypatch.setattr("app.api.routes.chat.coach_reply", fake_coach_reply)
    db = FakeDb()

    result = await chat(ChatRequest(message="laksa", goal="healthy aging"), make_user(), db)

    assert result.reply == "reply"
    assert db.committed is True
    assert len(db.added) == 2


def test_dashboard_routes_return_metrics():
    user = make_user(UserRole.public)
    assert user_dashboard(user, FakeDb([3, 72.5]))["average_hpb_score"] == 72.5
    assert clinician_dashboard(make_user(UserRole.clinician), FakeDb([12, 2]))["nutrition_risk_alerts"] == 2
    assert admin_dashboard(make_user(UserRole.admin), FakeDb([10, 20, 30]))["system_health"] == "ok"


def test_get_current_user_accepts_valid_token(monkeypatch):
    from app.core.security import create_access_token

    user = make_user()
    token = create_access_token(user.email, ["public"])

    assert get_current_user(token, FakeDb([user])) == user


def test_require_roles_rejects_wrong_role():
    dependency = require_roles(UserRole.admin)

    with pytest.raises(HTTPException) as exc:
        dependency(make_user(UserRole.public))

    assert exc.value.status_code == 403


def test_whatsapp_verification_success_and_failure():
    assert verify_webhook("subscribe", "local-verify-token", "123") == 123
    with pytest.raises(HTTPException):
        verify_webhook("subscribe", "bad", "123")
