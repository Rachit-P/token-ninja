from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from token_ninja_api.routers import catalog, quotes
from token_ninja_api.settings import get_settings


def create_app() -> FastAPI:
    app = FastAPI(
        title="token-ninja API",
        version="0.1.0",
        description="Convert currency into compute tokens and redeem them at vendors.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_settings().cors_origin_list,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["meta"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    # Version the API from day one so the app can keep working while it evolves.
    app.include_router(catalog.router, prefix="/v1")
    app.include_router(quotes.router, prefix="/v1")
    return app


app = create_app()
