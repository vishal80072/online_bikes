from dotenv import load_dotenv
import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

load_dotenv()
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    DATABASE_URL: str = Field(default="postgresql+asyncpg://postgres:admin@localhost:5432/bike_booking", description="Database URL")
    REDIS_URL: str = Field(default="redis://localhost:6379", description="Redis URL")
    SECRET_KEY: str = Field(default="1234567890abcdefghijklmnopqrstuvwxyz", description="Secret key")
    GROQ_API_KEY: str = Field(default="<add your groq key>", description="Groq API key")

    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ADMIN_EMAIL: str = "admin@bikebook.com"
    ADMIN_PASSWORD: str = "Admin@123"

settings = Settings()
