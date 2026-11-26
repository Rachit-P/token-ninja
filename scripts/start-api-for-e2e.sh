#!/usr/bin/env bash
# Start the API in the background for end-to-end tests, using SQLite so no Postgres
# service is needed (macOS CI runners can't run service containers).
set -euo pipefail

cd "$(dirname "$0")/../api"
export TOKEN_NINJA_DATABASE_URL="sqlite:///$PWD/e2e.db"
export TOKEN_NINJA_CORS_ORIGINS="${TOKEN_NINJA_CORS_ORIGINS:-http://localhost:8081}"
rm -f e2e.db

uv sync --quiet
uv run token-ninja-seed
nohup uv run uvicorn token_ninja_api.main:app --host 127.0.0.1 --port 8000 > e2e-api.log 2>&1 &

for _ in $(seq 1 30); do
  if curl -sf http://127.0.0.1:8000/health > /dev/null; then
    echo "API is up on http://127.0.0.1:8000"
    exit 0
  fi
  sleep 1
done
echo "API did not start. Log:" >&2
cat e2e-api.log >&2
exit 1
