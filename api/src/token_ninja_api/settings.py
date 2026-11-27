from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

API_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="TOKEN_NINJA_", env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://tokenninja:tokenninja@localhost:5432/tokenninja"
    cors_origins: str = "http://localhost:8081"
    seed_file: Path = API_ROOT / "config" / "rates.yaml"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
