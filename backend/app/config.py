import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True)

    PROJECT_NAME: str = "ContractIQ"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./contractiq.db")
    
    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super_secret_jwt_key_change_in_production_contractiq_2026")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    # AI Provider
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "mock") # mock, openai, anthropic, gemini
    AI_API_KEY: str = os.getenv("AI_API_KEY", "")
    AI_MODEL: str = os.getenv("AI_MODEL", "gpt-4o")
    
    # Storage
    STORAGE_PROVIDER: str = os.getenv("STORAGE_PROVIDER", "local")
    STORAGE_DIR: str = os.getenv("STORAGE_DIR", "./uploaded_contracts")
    
    # CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

settings = Settings()
