from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.models import AuditAction, FoodItem, Meal, MealImage, MealSource, NutritionResult, Recommendation, User
from app.db.session import get_db
from app.schemas import MealAnalysisResponse, MealCreate
from app.services.ai import analyse_meal_with_ai
from app.services.audit import write_audit_log
from app.services.storage import create_presigned_upload

router = APIRouter(prefix="/meals", tags=["meals"])


@router.post("/analyse-text", response_model=MealAnalysisResponse)
async def analyse_text_meal(
    payload: MealCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    analysis = await analyse_meal_with_ai(description=payload.description)
    meal = persist_analysis(db, current_user, payload, analysis)
    analysis.meal_id = meal.id
    analysis.created_at = meal.created_at
    db.commit()
    return analysis


@router.post("/upload", response_model=MealAnalysisResponse)
async def upload_meal_photo(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
    file: UploadFile | None = None,
    description: str | None = None,
):
    image_key = None
    image_url = None
    if file:
        image_key = f"users/{current_user.id}/meals/{file.filename}"
        image_url = create_presigned_upload(image_key, file.content_type or "application/octet-stream")["url"]
    analysis = await analyse_meal_with_ai(description=description, image_url=image_url)
    meal = persist_analysis(db, current_user, MealCreate(description=description, source="web"), analysis)
    if image_key and file:
        db.add(MealImage(meal_id=meal.id, s3_key=image_key, content_type=file.content_type or "application/octet-stream"))
    analysis.meal_id = meal.id
    analysis.created_at = meal.created_at
    db.commit()
    return analysis


@router.get("/{meal_id}", response_model=MealAnalysisResponse)
def get_meal(
    meal_id: UUID,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    meal = db.get(Meal, meal_id)
    if not meal or meal.user_id != current_user.id:
        from fastapi import HTTPException

        raise HTTPException(status_code=404, detail="Meal not found")
    foods = [
        {
            "name": item.name,
            "portion": item.portion,
            "cooking_method": item.cooking_method,
            "calories": float(item.calories),
            "protein": float(item.protein_g),
            "carbs": float(item.carbs_g),
            "fat": float(item.fat_g),
            "fibre": float(item.fibre_g),
            "sodium": float(item.sodium_mg),
            "confidence": item.confidence,
        }
        for item in meal.food_items
    ]
    result = meal.nutrition_result
    return MealAnalysisResponse(
        meal_id=meal.id,
        foods=foods,
        nutrition={
            "calories": float(result.calories),
            "protein": float(result.protein_g),
            "carbs": float(result.carbs_g),
            "fat": float(result.fat_g),
            "fibre": float(result.fibre_g),
            "sodium": float(result.sodium_mg),
            "fruit_servings": float(result.fruit_servings),
            "vegetable_servings": float(result.vegetable_servings),
            "wholegrain_servings": float(result.wholegrain_servings),
            "sugar": float(result.sugar_g),
            "healthy_eating_score": result.healthy_eating_score,
            "category": result.category,
        },
        recommendations=[rec.body for rec in meal.recommendations],
        confidence=meal.ai_confidence or 0,
        created_at=meal.created_at,
    )


def persist_analysis(db: Session, user: User, payload: MealCreate, analysis: MealAnalysisResponse) -> Meal:
    meal = Meal(user_id=user.id, source=MealSource(payload.source), description=payload.description, status="analysed", ai_confidence=analysis.confidence)
    db.add(meal)
    db.flush()
    for food in analysis.foods:
        db.add(
            FoodItem(
                meal_id=meal.id,
                name=food.name,
                portion=food.portion,
                cooking_method=food.cooking_method,
                calories=food.calories,
                protein_g=food.protein,
                carbs_g=food.carbs,
                fat_g=food.fat,
                fibre_g=food.fibre,
                sodium_mg=food.sodium,
                confidence=food.confidence,
            )
        )
    n = analysis.nutrition
    db.add(
        NutritionResult(
            meal_id=meal.id,
            calories=n.calories,
            protein_g=n.protein,
            carbs_g=n.carbs,
            fat_g=n.fat,
            fibre_g=n.fibre,
            sodium_mg=n.sodium,
            fruit_servings=n.fruit_servings,
            vegetable_servings=n.vegetable_servings,
            wholegrain_servings=n.wholegrain_servings,
            sugar_g=n.sugar,
            healthy_eating_score=n.healthy_eating_score,
            category=n.category,
            raw_ai_payload=analysis.model_dump(),
        )
    )
    for body in analysis.recommendations:
        db.add(Recommendation(meal_id=meal.id, user_id=user.id, title="Nutrition coaching", body=body, priority="medium"))
    write_audit_log(db, action=AuditAction.ai_analysis, resource_type="meal", actor=user, resource_id=str(meal.id))
    return meal
