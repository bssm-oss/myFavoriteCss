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
  setup   Install deps and build the extension bundle
  dev     Run the fixture web app and the extension build watcher together
  verify  Run typecheck, tests, e2e, and build
EOF
}

require_command() {
  local command_name="$1"
  if ! command -v "$command_name" >/dev/null 2>&1; then
    printf 'Missing required command: %s\n' "$command_name" >&2
    exit 1
  fi
}

run_setup() {
  require_command pnpm

  printf 'Installing dependencies...\n'
  pnpm install

  printf 'Building extension bundle...\n'
  pnpm --filter @morph-ui/extension build

  cat <<'EOF'

Setup complete.

Next steps:
  1. Run: pnpm local:dev
  2. Load apps/extension/dist in chrome://extensions
  3. Add your provider API key from the extension side panel
EOF
}

run_dev() {
  require_command pnpm

  local web_pid=""
  local extension_pid=""

  cleanup() {
    for pid in "$web_pid" "$extension_pid"; do
      if [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1; then
        kill "$pid" >/dev/null 2>&1 || true
      fi
    done
    wait "$web_pid" "$extension_pid" 2>/dev/null || true
  }

  trap cleanup EXIT INT TERM

  printf 'Starting web app on http://localhost:5173 ...\n'
  pnpm dev:web &
  web_pid="$!"

  printf 'Starting extension builder ...\n'
  pnpm dev:extension &
  extension_pid="$!"

  cat <<'EOF'

Morph UI dev processes are running.

URLs:
  web:       http://localhost:5173
  fixtures:  http://localhost:5173/fixtures/article
  extension: apps/extension/dist

Press Ctrl+C to stop both processes.
EOF

  wait "$web_pid" "$extension_pid"
}

run_verify() {
  require_command pnpm
  pnpm typecheck
  pnpm test
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
