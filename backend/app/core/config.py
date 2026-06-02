from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Food AI Singapore"
    environment: Literal["local", "test", "staging", "production"] = "local"
    api_prefix: str = "/api/v1"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])

    database_url: str = "postgresql+psycopg://food_ai:food_ai@postgres:5432/food_ai"
    redis_url: str = "redis://redis:6379/0"

    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    openai_api_key: str | None = None
    openai_model: str = "gpt-5.5"
    openai_vision_model: str = "gpt-5.5"

    aws_region: str = "ap-southeast-1"
    s3_bucket: str = "food-ai-singapore-meal-images"

    whatsapp_verify_token: str = "local-verify-token"
    whatsapp_access_token: str | None = None
    whatsapp_phone_number_id: str | None = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
