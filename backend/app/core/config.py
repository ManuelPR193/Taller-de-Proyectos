from pydantic_settings import BaseSettings
from pydantic import model_validator
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "EcoLogística Huancayo"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "dev-only-change-this-jwt-secret-now"
    DATA_ENCRYPTION_KEY: str = "dev-only-change-this-data-key-now"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day
    MAX_FAILED_LOGIN_ATTEMPTS: int = 3 # RN-001
    LOCKOUT_DURATION_MINUTES: int = 15 # RN-001
    
    # Database
    DATABASE_URL: str = "sqlite:///./ecologistica.db"
    CORS_ORIGINS: str = "http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:8000,http://localhost:8000"
    SLOW_QUERY_MS: float = 250.0
    
    # Business Rules Defaults
    DEPOT_LAT: float = -12.0656  # Plaza Constitución / Centro Huancayo
    DEPOT_LNG: float = -75.2048
    MAX_DRIVER_HOURS_PER_DAY: float = 8.0 # RN-003
    TREE_CO2_ABSORPTION_KG_YEAR: float = 22.0 # RN-009

    @model_validator(mode='after')
    def production_secrets(self):
        if self.ENVIRONMENT.lower() in ('production', 'staging'):
            if self.SECRET_KEY.startswith('dev-only') or self.DATA_ENCRYPTION_KEY.startswith('dev-only'):
                raise ValueError('Configure SECRET_KEY y DATA_ENCRYPTION_KEY fuera del código')
        return self
    
    class Config:
        case_sensitive = True
        env_file = '.env'

settings = Settings()
