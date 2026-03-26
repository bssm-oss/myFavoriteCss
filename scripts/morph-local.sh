#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

PATH="/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:$PATH"

print_help() {
  cat <<'EOF'
Morph UI local helper

Usage:
  ./scripts/morph-local.sh setup
  ./scripts/morph-local.sh dev
  ./scripts/morph-local.sh verify

Commands:
  setup   Install deps, create .env if missing, start Postgres, migrate, seed, and build extension
  dev     Load .env and run server, web, and extension dev processes together
  verify  Run typecheck, tests, integration test, e2e, and build
EOF
}

require_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    printf 'Missing required command: %s\n' "$command_name" >&2
    exit 1
  fi
}

ensure_env_file() {
  if [[ ! -f ".env" ]]; then
    cp .env.example .env
    printf 'Created .env from .env.example\n'
  fi
}

load_env_file() {
  ensure_env_file
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
}

run_setup() {
  require_command pnpm
  require_command docker

  printf 'Installing dependencies...\n'
  pnpm install

  ensure_env_file

  printf 'Starting Postgres with docker compose...\n'
  docker compose up -d postgres

  load_env_file

  printf 'Running migrations...\n'
  pnpm db:migrate

  printf 'Seeding development data...\n'
  pnpm db:seed

  printf 'Building extension bundle...\n'
  pnpm --filter @morph-ui/extension build

  cat <<'EOF'

Setup complete.

Next steps:
  1. Review .env and replace placeholder credentials if you need Google auth or real provider calls
  2. Run: pnpm local:dev
  3. Load apps/extension/dist in chrome://extensions
EOF
}

run_dev() {
  require_command pnpm
  load_env_file

  local server_pid=""
  local web_pid=""
  local extension_pid=""

  cleanup() {
    for pid in "$server_pid" "$web_pid" "$extension_pid"; do
      if [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1; then
        kill "$pid" >/dev/null 2>&1 || true
      fi
    done
    wait "$server_pid" "$web_pid" "$extension_pid" 2>/dev/null || true
  }

  trap cleanup EXIT INT TERM

  printf 'Starting server on http://localhost:8787 ...\n'
  pnpm dev:server &
  server_pid="$!"

  printf 'Starting web app on http://localhost:5173 ...\n'
  pnpm dev:web &
  web_pid="$!"

  printf 'Starting extension builder ...\n'
  pnpm dev:extension &
  extension_pid="$!"

  cat <<'EOF'

Morph UI dev processes are running.

URLs:
  server:    http://localhost:8787
  web:       http://localhost:5173
  fixtures:  http://localhost:5173/fixtures/article
  extension: apps/extension/dist

Press Ctrl+C to stop all three processes.
EOF

  wait "$server_pid" "$web_pid" "$extension_pid"
}

run_verify() {
  require_command pnpm
  load_env_file
  pnpm typecheck
  pnpm test
  pnpm test:integration
  pnpm test:e2e
  pnpm build
}

command_name="${1:-help}"
extra_arg="${2:-}"

if [[ "$extra_arg" == "-h" || "$extra_arg" == "--help" ]]; then
  print_help
  exit 0
fi

if [[ "$#" -gt 1 ]]; then
  printf 'Unexpected extra arguments: %s\n\n' "${*:2}" >&2
  print_help
  exit 1
fi

case "$command_name" in
  setup)
    run_setup
    ;;
  dev)
    run_dev
    ;;
  verify)
    run_verify
    ;;
  help|-h|--help)
    print_help
    ;;
  *)
    printf 'Unknown command: %s\n\n' "$command_name" >&2
    print_help
    exit 1
    ;;
esac
