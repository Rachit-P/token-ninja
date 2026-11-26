from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from token_ninja_api.db import Base, get_session
from token_ninja_api.main import create_app
from token_ninja_api.seed import load_seed
from token_ninja_api.settings import get_settings


@pytest.fixture
def client() -> Iterator[TestClient]:
    # In-memory SQLite keeps tests fast and independent of a running Postgres.
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine, expire_on_commit=False)
    with factory() as session:
        load_seed(session, get_settings().seed_file)

    def override_session() -> Iterator[Session]:
        with factory() as session:
            yield session

    app = create_app()
    app.dependency_overrides[get_session] = override_session
    with TestClient(app) as test_client:
        yield test_client
