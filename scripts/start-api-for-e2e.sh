#!/usr/bin/env bash
# Start the API in the background for end-to-end tests, using SQLite so no Postgres
# service is needed (macOS CI runners can't run service containers).
# Stop it with: pkill -f "uvicorn token_ninja_api"
set -euo pipefail

PORT=8000
HEALTH_URL="http://127.0.0.1:$PORT/health"

# Refuse to start if something already answers on the port; otherwise the health check
# below would pass against that old server while ours failed to bind.
if curl -sf "$HEALTH_URL" > /dev/null 2>&1; then
  echo "Something is already serving on port $PORT (probably an earlier API run)." >&2
  echo "Stop it with: pkill -f \"uvicorn token_ninja_api\"   then run this script again." >&2
  exit 1
fi

cd "$(dirname "$0")/../api"
export TOKEN_NINJA_DATABASE_URL="sqlite:///$PWD/e2e.db"
export TOKEN_NINJA_CORS_ORIGINS="${TOKEN_NINJA_CORS_ORIGINS:-http://localhost:8081}"
rm -f e2e.db

uv sync --quiet
uv run token-ninja-seed
# Run uvicorn with the environment's Python directly, not via `uv run`: a long-lived uv
# process holds uv's cache lock, which makes setup-uv's post-job cache prune fail in CI.
# `python -m uvicorn` works even where the `uvicorn` launcher script isn't in the env's bin/.
PYTHON="$(uv run --no-sync python -c 'import sys; print(sys.executable)')"
nohup "$PYTHON" -m uvicorn token_ninja_api.main:app --host 127.0.0.1 --port "$PORT" \
  > e2e-api.log 2>&1 &
API_PID=$!

for _ in $(seq 1 30); do
  if ! kill -0 "$API_PID" 2> /dev/null; then
    break # our server exited, e.g. it couldn't bind the port
  fi
  if curl -sf "$HEALTH_URL" > /dev/null; then
    echo "API is up on http://127.0.0.1:$PORT (pid $API_PID)"
    exit 0
  fi
  sleep 1
done
echo "API did not start. Log:" >&2
cat e2e-api.log >&2
exit 1
