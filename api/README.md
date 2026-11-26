# token-ninja API

FastAPI + Postgres backend for token-ninja. It holds the conversion rates and does the math;
the app in `../app` only talks to it over HTTP.

## Run it locally

Requires [uv](https://docs.astral.sh/uv/) and Docker.

```bash
docker compose up -d db          # from the repo root: starts Postgres
cd api
cp .env.example .env
uv sync
uv run token-ninja-seed          # creates tables and loads config/rates.yaml
uv run uvicorn token_ninja_api.main:app --reload
```

Interactive docs: http://localhost:8000/docs. The OpenAPI spec at
http://localhost:8000/openapi.json can generate a typed client for the app.

## How conversion works

Tokens move through two ratios, much like credit card reward points:

1. **Buying:** each currency has `tokens_per_unit`. `$25 x 100 = 2,500 tokens`.
2. **Redeeming:** each vendor sets its own `tokens_per_unit` for one unit of its compute.
   500 tokens buy 2 GPU-hours at `gpu-cloud` (250 per hour) but 125 minutes at
   `render-farm` (4 per minute).

Rates are data, not code. Edit `config/rates.yaml` and re-run the seed, or change the
`currencies` and `vendors` tables directly. Results round down, so the system never issues
more tokens or compute than was paid for.

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/health` | Liveness check |
| GET | `/v1/currencies` | Currencies you can buy tokens with |
| GET | `/v1/vendors` | Vendors and their token price per compute unit |
| POST | `/v1/quotes/purchase` | `{currency, amount}` to tokens |
| POST | `/v1/quotes/redemption` | `{vendor_id, tokens}` to vendor compute units |

## Layout

```
src/token_ninja_api/
  conversion.py   pure conversion math (reused later by SIP/SWP jobs)
  models.py       SQLAlchemy tables
  schemas.py      request and response shapes
  routers/        HTTP endpoints, versioned under /v1
  seed.py         loads config/rates.yaml into the database
```

## Tests

```bash
uv run pytest        # uses in-memory SQLite, no Postgres needed
uv run ruff check .
```
