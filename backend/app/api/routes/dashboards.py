from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import get_current_user, require_roles
from app.db.models import AuditLog, Meal, NutritionResult, User, UserRole
from app.db.session import get_db

router = APIRouter(prefix="/dashboards", tags=["dashboards"])


@router.get("/user")
def user_dashboard(current_user: Annotated[User, Depends(get_current_user)], db: Annotated[Session, Depends(get_db)]):
    total_meals = db.scalar(select(func.count(Meal.id)).where(Meal.user_id == current_user.id)) or 0
    avg_score = db.scalar(select(func.avg(NutritionResult.healthy_eating_score)).join(Meal).where(Meal.user_id == current_user.id)) or 0
    return {"total_meals": total_meals, "average_hpb_score": round(float(avg_score), 1), "weekly_trends": [], "macro_breakdown": {}}


@router.get("/clinician")
def clinician_dashboard(
    _: Annotated[User, Depends(require_roles(UserRole.clinician, UserRole.dietitian, UserRole.admin))],
    db: Annotated[Session, Depends(get_db)],
):
    patients = db.scalar(select(func.count(User.id))) or 0
    high_risk = db.scalar(select(func.count(NutritionResult.id)).where(NutritionResult.healthy_eating_score < 50)) or 0
    return {"patient_count": patients, "nutrition_risk_alerts": high_risk, "adherence_monitoring": []}


@router.get("/admin")
def admin_dashboard(_: Annotated[User, Depends(require_roles(UserRole.admin))], db: Annotated[Session, Depends(get_db)]):
    return {
        "users": db.scalar(select(func.count(User.id))) or 0,
        "meals": db.scalar(select(func.count(Meal.id))) or 0,
        "audit_logs": db.scalar(select(func.count(AuditLog.id))) or 0,
        "system_health": "ok",
    }
