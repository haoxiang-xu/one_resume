#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker CLI not found. Install Docker Desktop and retry." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon is not running. Start Docker and re-run this script." >&2
  exit 1
fi

if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD=(docker-compose)
else
  echo "Docker Compose is not available. Install Docker Compose V2 or V1 and retry." >&2
  exit 1
fi

if [ ! -f backend/.env ]; then
  echo "backend/.env is missing. Create it before building the backend service." >&2
  exit 1
fi

if [ ! -f frontend/package.json ]; then
  echo "frontend/package.json is missing. Run this from the project root." >&2
  exit 1
fi

echo "[update] Rebuilding frontend and backend images"
"${COMPOSE_CMD[@]}" build frontend backend

echo "[update] Restarting frontend and backend containers"
"${COMPOSE_CMD[@]}" up -d --no-deps frontend backend

echo "[update] Current status for frontend/backend"
"${COMPOSE_CMD[@]}" ps frontend backend

cat <<'MSG'

Frontend and backend have been refreshed.
Database container was left untouched.
MSG
