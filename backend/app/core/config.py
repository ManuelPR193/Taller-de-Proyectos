from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "EcoLogística Huancayo"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "ecologistica_huancayo_super_secret_jwt_key_2026_mantaro"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day
    MAX_FAILED_LOGIN_ATTEMPTS: int = 3 # RN-001
    LOCKOUT_DURATION_MINUTES: int = 15 # RN-001
    
    # Database
    DATABASE_URL: str = "sqlite:///./ecologistica.db"
    
    # Business Rules Defaults
    DEPOT_LAT: float = -12.0656  # Plaza Constitución / Centro Huancayo
    DEPOT_LNG: float = -75.2048
    MAX_DRIVER_HOURS_PER_DAY: float = 8.0 # RN-003
    TREE_CO2_ABSORPTION_KG_YEAR: float = 22.0 # RN-009
    
    class Config:
        case_sensitive = True

settings = Settings()
