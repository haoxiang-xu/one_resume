#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[setup] Checking Docker prerequisites"

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
  echo "backend/.env is missing. Create it before running the containers." >&2
  exit 1
fi

echo "[setup] Building local images"
"${COMPOSE_CMD[@]}" build

echo "[setup] Starting containers"
"${COMPOSE_CMD[@]}" up -d

echo "[setup] Current container status"
"${COMPOSE_CMD[@]}" ps

cat <<'MSG'

Docker stack started.
Frontend (via Nginx): http://localhost
API (proxied): http://localhost/api/
MongoDB is only accessible from the backend container.

Use "${COMPOSE_CMD[*]} logs -f" to follow logs.
MSG
