#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker-compose.yaml"

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "docker-compose.yaml not found at $COMPOSE_FILE" >&2
  exit 1
fi

python3 - "$COMPOSE_FILE" <<'PY'
import sys
from pathlib import Path

compose_path = Path(sys.argv[1])
lines = compose_path.read_text().splitlines()
result = []
skip_block = False
target_port = '"29017:27017"'

idx = 0
while idx < len(lines):
    line = lines[idx]
    stripped = line.strip()

    if stripped == 'ports:':
        block = []
        j = idx + 1
        while j < len(lines) and lines[j].lstrip().startswith('-'):
            block.append(lines[j])
            j += 1

        if any(target_port in entry for entry in block):
            remaining = [entry for entry in block if target_port not in entry]
            if remaining:
                result.append(line)
                result.extend(remaining)
            idx = j
            continue

    result.append(line)
    idx += 1

compose_path.write_text("\n".join(result) + "\n")
PY

echo "[production-ready] Removed 29017:27017 port mapping from docker-compose.yaml"
