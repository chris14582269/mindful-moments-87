"""initial schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-06-02
"""
from alembic import op
import sqlalchemy as sa
from pgvector.sqlalchemy import Vector
from sqlalchemy.dialects import postgresql

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    user_role = postgresql.ENUM("public", "clinician", "dietitian", "admin", name="userrole")
    meal_source = postgresql.ENUM("web", "whatsapp", "api", name="mealsource")
    audit_action = postgresql.ENUM("create", "read", "update", "delete", "login", "ai_analysis", "webhook", name="auditaction")
    user_role.create(op.get_bind(), checkfirst=True)
    meal_source.create(op.get_bind(), checkfirst=True)
    audit_action.create(op.get_bind(), checkfirst=True)
    op.create_table("roles", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("name", user_role, nullable=False, unique=True), sa.Column("description", sa.String(255)), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("permissions", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("role_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("roles.id", ondelete="CASCADE"), nullable=False), sa.Column("resource", sa.String(80), nullable=False), sa.Column("action", sa.String(40), nullable=False), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("users", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("email", sa.String(320), nullable=False, unique=True), sa.Column("full_name", sa.String(160), nullable=False), sa.Column("hashed_password", sa.String(255), nullable=False), sa.Column("role_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("roles.id"), nullable=False), sa.Column("whatsapp_number", sa.String(32), unique=True), sa.Column("is_active", sa.Boolean(), default=True), sa.Column("consent_pdpa_at", sa.DateTime(timezone=True)), sa.Column("clinical_profile", sa.JSON()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_index("ix_users_email", "users", ["email"])
    op.create_table("clinicians", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, unique=True), sa.Column("license_number", sa.String(80)), sa.Column("organization", sa.String(160)), sa.Column("specialty", sa.String(120)), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("meals", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False), sa.Column("source", meal_source, nullable=False), sa.Column("description", sa.Text()), sa.Column("meal_time", sa.DateTime(timezone=True)), sa.Column("status", sa.String(40)), sa.Column("ai_confidence", sa.Float()), sa.Column("embedding", Vector(1536)), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_index("ix_meals_user_id", "meals", ["user_id"])
    op.create_table("meal_images", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("meal_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("meals.id"), nullable=False), sa.Column("s3_key", sa.String(512), nullable=False), sa.Column("content_type", sa.String(120), nullable=False), sa.Column("checksum_sha256", sa.String(128)), sa.Column("image_metadata", sa.JSON()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("food_items", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("meal_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("meals.id"), nullable=False), sa.Column("name", sa.String(160), nullable=False), sa.Column("portion", sa.String(120), nullable=False), sa.Column("cooking_method", sa.String(120)), sa.Column("calories", sa.Numeric(8, 2)), sa.Column("protein_g", sa.Numeric(8, 2)), sa.Column("carbs_g", sa.Numeric(8, 2)), sa.Column("fat_g", sa.Numeric(8, 2)), sa.Column("fibre_g", sa.Numeric(8, 2)), sa.Column("sodium_mg", sa.Numeric(8, 2)), sa.Column("confidence", sa.Float()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("nutrition_results", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("meal_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("meals.id"), nullable=False, unique=True), sa.Column("calories", sa.Numeric(8, 2)), sa.Column("protein_g", sa.Numeric(8, 2)), sa.Column("carbs_g", sa.Numeric(8, 2)), sa.Column("fat_g", sa.Numeric(8, 2)), sa.Column("fibre_g", sa.Numeric(8, 2)), sa.Column("sodium_mg", sa.Numeric(8, 2)), sa.Column("fruit_servings", sa.Numeric(5, 2)), sa.Column("vegetable_servings", sa.Numeric(5, 2)), sa.Column("wholegrain_servings", sa.Numeric(5, 2)), sa.Column("sugar_g", sa.Numeric(8, 2)), sa.Column("healthy_eating_score", sa.Integer()), sa.Column("category", sa.String(20)), sa.Column("raw_ai_payload", sa.JSON()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("chat_messages", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False), sa.Column("role", sa.String(20), nullable=False), sa.Column("channel", sa.String(30)), sa.Column("content", sa.Text(), nullable=False), sa.Column("metadata_json", sa.JSON()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("recommendations", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("meal_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("meals.id")), sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False), sa.Column("priority", sa.String(20)), sa.Column("title", sa.String(160), nullable=False), sa.Column("body", sa.Text(), nullable=False), sa.Column("rationale", sa.Text()), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()))
    op.create_table("audit_logs", sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True), sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()), sa.Column("actor_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id")), sa.Column("action", audit_action, nullable=False), sa.Column("resource_type", sa.String(80), nullable=False), sa.Column("resource_id", sa.String(120)), sa.Column("ip_address", sa.String(80)), sa.Column("user_agent", sa.String(255)), sa.Column("metadata_json", sa.JSON()))


def downgrade() -> None:
    for table in ["audit_logs", "recommendations", "chat_messages", "nutrition_results", "food_items", "meal_images", "meals", "clinicians", "users", "permissions", "roles"]:
        op.drop_table(table)
    op.execute("DROP TYPE IF EXISTS auditaction")
    op.execute("DROP TYPE IF EXISTS mealsource")
    op.execute("DROP TYPE IF EXISTS userrole")
