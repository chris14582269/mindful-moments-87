import enum
import uuid
from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import JSON, Boolean, DateTime, Enum, Float, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class UserRole(str, enum.Enum):
    public = "public"
    clinician = "clinician"
    dietitian = "dietitian"
    admin = "admin"


class MealSource(str, enum.Enum):
    web = "web"
    whatsapp = "whatsapp"
    api = "api"


class AuditAction(str, enum.Enum):
    create = "create"
    read = "read"
    update = "update"
    delete = "delete"
    login = "login"
    ai_analysis = "ai_analysis"
    webhook = "webhook"


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class Role(Base, TimestampMixin):
    __tablename__ = "roles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[UserRole] = mapped_column(Enum(UserRole), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(String(255))

    users: Mapped[list["User"]] = relationship(back_populates="role")
    permissions: Mapped[list["Permission"]] = relationship(back_populates="role", cascade="all, delete-orphan")


class Permission(Base, TimestampMixin):
    __tablename__ = "permissions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    resource: Mapped[str] = mapped_column(String(80), nullable=False)
    action: Mapped[str] = mapped_column(String(40), nullable=False)

    role: Mapped[Role] = relationship(back_populates="permissions")


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("roles.id"), nullable=False)
    whatsapp_number: Mapped[str | None] = mapped_column(String(32), unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    consent_pdpa_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    clinical_profile: Mapped[dict | None] = mapped_column(JSON)

    role: Mapped[Role] = relationship(back_populates="users")
    meals: Mapped[list["Meal"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    clinician_profile: Mapped["Clinician | None"] = relationship(back_populates="user")
    chat_messages: Mapped[list["ChatMessage"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class Clinician(Base, TimestampMixin):
    __tablename__ = "clinicians"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    license_number: Mapped[str | None] = mapped_column(String(80))
    organization: Mapped[str | None] = mapped_column(String(160))
    specialty: Mapped[str | None] = mapped_column(String(120))

    user: Mapped[User] = relationship(back_populates="clinician_profile")


class Meal(Base, TimestampMixin):
    __tablename__ = "meals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    source: Mapped[MealSource] = mapped_column(Enum(MealSource), default=MealSource.web, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    meal_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    status: Mapped[str] = mapped_column(String(40), default="pending")
    ai_confidence: Mapped[float | None] = mapped_column(Float)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(1536))

    user: Mapped[User] = relationship(back_populates="meals")
    images: Mapped[list["MealImage"]] = relationship(back_populates="meal", cascade="all, delete-orphan")
    food_items: Mapped[list["FoodItem"]] = relationship(back_populates="meal", cascade="all, delete-orphan")
    nutrition_result: Mapped["NutritionResult | None"] = relationship(back_populates="meal", cascade="all, delete-orphan")
    recommendations: Mapped[list["Recommendation"]] = relationship(back_populates="meal", cascade="all, delete-orphan")


class MealImage(Base, TimestampMixin):
    __tablename__ = "meal_images"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("meals.id"), nullable=False)
    s3_key: Mapped[str] = mapped_column(String(512), nullable=False)
    content_type: Mapped[str] = mapped_column(String(120), nullable=False)
    checksum_sha256: Mapped[str | None] = mapped_column(String(128))
    image_metadata: Mapped[dict | None] = mapped_column(JSON)

    meal: Mapped[Meal] = relationship(back_populates="images")


class FoodItem(Base, TimestampMixin):
    __tablename__ = "food_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("meals.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    portion: Mapped[str] = mapped_column(String(120), nullable=False)
    cooking_method: Mapped[str | None] = mapped_column(String(120))
    calories: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    protein_g: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    carbs_g: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    fat_g: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    fibre_g: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    sodium_mg: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    confidence: Mapped[float] = mapped_column(Float, default=0)

    meal: Mapped[Meal] = relationship(back_populates="food_items")


class NutritionResult(Base, TimestampMixin):
    __tablename__ = "nutrition_results"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("meals.id"), unique=True, nullable=False)
    calories: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    protein_g: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    carbs_g: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    fat_g: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    fibre_g: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    sodium_mg: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    fruit_servings: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    vegetable_servings: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    wholegrain_servings: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    sugar_g: Mapped[float] = mapped_column(Numeric(8, 2), default=0)
    healthy_eating_score: Mapped[int] = mapped_column(Integer, default=0)
    category: Mapped[str] = mapped_column(String(20), default="Poor")
    raw_ai_payload: Mapped[dict | None] = mapped_column(JSON)

    meal: Mapped[Meal] = relationship(back_populates="nutrition_result")


class ChatMessage(Base, TimestampMixin):
    __tablename__ = "chat_messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)
    channel: Mapped[str] = mapped_column(String(30), default="web")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    metadata_json: Mapped[dict | None] = mapped_column(JSON)

    user: Mapped[User] = relationship(back_populates="chat_messages")


class Recommendation(Base, TimestampMixin):
    __tablename__ = "recommendations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    meal_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("meals.id"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    priority: Mapped[str] = mapped_column(String(20), default="medium")
    title: Mapped[str] = mapped_column(String(160), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    rationale: Mapped[str | None] = mapped_column(Text)

    meal: Mapped[Meal | None] = relationship(back_populates="recommendations")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    actor_user_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("users.id"))
    action: Mapped[AuditAction] = mapped_column(Enum(AuditAction), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(80), nullable=False)
    resource_id: Mapped[str | None] = mapped_column(String(120))
    ip_address: Mapped[str | None] = mapped_column(String(80))
    user_agent: Mapped[str | None] = mapped_column(String(255))
    metadata_json: Mapped[dict | None] = mapped_column(JSON)
