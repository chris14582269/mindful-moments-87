from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(min_length=12)
    consent_pdpa: bool = True


class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str


class FoodItemAnalysis(BaseModel):
    name: str
    portion: str
    cooking_method: str | None = None
    calories: float = 0
    protein: float = 0
    carbs: float = 0
    fat: float = 0
    fibre: float = 0
    sodium: float = 0
    confidence: float = Field(default=0.75, ge=0, le=1)


class NutritionSummary(BaseModel):
    calories: float
    protein: float
    carbs: float
    fat: float
    fibre: float
    sodium: float
    fruit_servings: float = 0
    vegetable_servings: float = 0
    wholegrain_servings: float = 0
    sugar: float = 0
    healthy_eating_score: int
    category: str


class MealCreate(BaseModel):
    description: str | None = None
    source: str = "web"


class MealAnalysisResponse(BaseModel):
    meal_id: UUID | None = None
    foods: list[FoodItemAnalysis]
    nutrition: NutritionSummary
    recommendations: list[str]
    confidence: float
    created_at: datetime | None = None


class ChatRequest(BaseModel):
    message: str
    goal: str | None = None
    conditions: list[str] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str
    recommendations: list[str]


class WhatsAppWebhookPayload(BaseModel):
    object: str | None = None
    entry: list[dict] = Field(default_factory=list)


class DashboardMetric(BaseModel):
    label: str
    value: str | int | float
    trend: str | None = None
