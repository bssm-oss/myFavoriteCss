# Local development

This document is the practical setup guide for engineers working on Morph UI.

## Prerequisites

- Node.js 20 or newer
- pnpm 9 or newer
- Docker
- Chrome 120 or newer

## Install

```bash
pnpm install
```

## Start local Postgres

```bash
docker compose up -d postgres
```

The default container exposed by this repo listens on port `54329`.

## Create `.env`

```bash
cp .env.example .env
```

Minimum recommended local values:

- `SESSION_TOKEN_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_OAUTH_REDIRECT_URI`
- `OPENAI_API_KEY` or `GEMINI_API_KEY`

## Run migrations and seed data

```bash
pnpm db:migrate
pnpm db:seed
```

## Start the apps

Open three terminals:

### Terminal 1

```bash
pnpm dev:server
```

### Terminal 2

```bash
pnpm dev:web
```

### Terminal 3

```bash
pnpm dev:extension
```

## Local URLs

- Fastify server: `http://localhost:8787`
- Web app and fixtures: `http://localhost:5173`
- Extension bundle output: `apps/extension/dist`

## Load the unpacked extension

1. Open `chrome://extensions`
2. Enable Developer mode
3. Click `Load unpacked`
4. Choose `apps/extension/dist`
5. Open the side panel from the extension action

## Suggested smoke test

1. Visit `http://localhost:5173/fixtures/article`
2. Open the side panel
3. Enable the site
4. Choose `Reader Focus`
5. Preview the transform
6. Apply it
7. Reload the page
8. Confirm the page can reuse local cache

## Useful commands

### Typecheck

```bash
pnpm typecheck
```

### Unit and package tests

```bash
pnpm test
```

### Backend integration test

```bash
pnpm test:integration
```

### Extension E2E harness

```bash
pnpm test:e2e
```

### Full build

```bash
pnpm build
```

## Manual smoke assets

This repository now keeps root-level smoke records separate from colocated automated tests.

Read:

- `tests/README.md`
- `tests/smoke/extension-happy-path.checklist.md`
- `tests/manual/local-smoke-2026-03-26.md`

Captured browser artifacts referenced by that smoke run live in:

- `output/playwright/2026-03-26/`

## Common local debugging targets

### Extension auth flow

Check:

- Google OAuth redirect URI matches local backend callback
- extension can reach the local server origin
- session refresh endpoint is reachable

### Provider planning failures

Check:

- provider API key exists in `.env`
- selected provider matches the configured key
- privacy mode is not `strict-local`
- current site is enabled

### Cache debugging

Check:

- site setting is enabled for the origin
- selected profile matches the stored artifact profile
- normalized URL is stable between visits
- similarity score is high enough for auto-apply

### Extension load issues

Check:

- `pnpm dev:extension` or `pnpm --filter @morph-ui/extension build` has produced `apps/extension/dist`
- Chrome extension page is loading the latest bundle
- the current site has been granted host permission
