from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from token_ninja_api.conversion import ConversionError
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

    @app.exception_handler(ConversionError)
    def conversion_error(_: Request, exc: ConversionError) -> JSONResponse:
        # A bad conversion is the caller's input problem, not a server crash.
        return JSONResponse(status_code=422, content={"detail": str(exc)})

    @app.get("/health", tags=["meta"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    # Version the API from day one so the app can keep working while it evolves.
    app.include_router(catalog.router, prefix="/v1")
    app.include_router(quotes.router, prefix="/v1")
    return app


app = create_app()
