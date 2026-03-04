from pydantic import computed_field
from pydantic_settings import BaseSettings
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    database_url: str = "sqlite:///./navout_payments.db"
    jwt_secret_key: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    log_level: str = "INFO"
    log_file: Optional[str] = None
    debug: bool = False
    cors_origins: str = "http://localhost:3000,http://localhost:3001"

    @computed_field
    @property
    def cors_origins_list(self) -> list[str]:
        return [x.strip() for x in self.cors_origins.split(",") if x.strip()]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
logger.info("Settings loaded")
