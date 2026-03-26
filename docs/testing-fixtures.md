# Testing fixtures and validation strategy

Morph UI uses a mix of schema tests, browser-safe unit tests, backend integration tests, and extension E2E smoke coverage.

## Fixture pages

`apps/web` exposes deterministic fixture routes:

- `/fixtures/article`
- `/fixtures/ecommerce`
- `/fixtures/dashboard`
- `/fixtures/docs`
- `/fixtures/form`

These pages are intentionally stable and shaped to stress different heuristics.

## Why fixture pages exist

They provide repeatable local targets for:

- page type guessing
- fingerprint stability
- stable selector generation
- privacy mode behavior
- cache-hit replay
- extension boot and runtime verification

## Fixture coverage by page type

### Article fixture

Used to validate:

- reader-focused transforms
- centered main content
- heading extraction
- noisy sidebar detection

### Ecommerce fixture

Used to validate:

- card-heavy heuristics
- preference signals for list-over-card layouts
- dense catalog profiles

### Dashboard fixture

Used to validate:

- metric emphasis
- compact versus calm dashboard transforms
- shorter TTL behavior for dynamic-looking layouts

### Docs fixture

Used to validate:

- TOC behavior
- content-width tuning
- docs-like page-type heuristics

### Form fixture

Used to validate:

- form-heavy classification
- sensitive-field handling
- privacy rules on pages with richer user input structure

## Unit tests

Current unit coverage includes:

- normalized URL behavior
- cache key logic
- fingerprint similarity logic
- selector stability logic
- privacy redaction logic
- shared Zod schema validation

## Backend integration test

The backend integration test uses Testcontainers and a real Postgres instance to verify:

- authenticated `POST /api/transform/plan`
- provider response normalization
- compiled transform payload generation
- persistence behavior around transform runs

Run it with:

```bash
pnpm test:integration
```

## Extension E2E test

The current Playwright harness verifies:

- extension build exists
- fixture web server boots
- Chromium loads the unpacked extension
- a fixture page is reachable with the extension runtime active

Run it with:

```bash
pnpm test:e2e
```

## Full verification commands

Recommended local verification sequence:

```bash
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:e2e
pnpm build
```

## Real local usage notes

This repository also includes a root-level smoke record from an actual local run:

- `tests/manual/local-smoke-2026-03-26.md`

That run confirmed:

- the fixture web app booted successfully on `127.0.0.1:4173`
- the extension E2E baseline passed
- the article fixture rendered the expected article heading
- the form fixture rendered the expected checkout heading and input structure

Related evidence files are stored under:

- `output/playwright/2026-03-26/`

## Current scope and future work

Current tests strongly cover contracts and boot/runtime safety. The next natural expansions are:

- deeper side-panel interaction E2E
- more cache-revalidation scenarios
- more selector-drift regressions
- richer fixture pages with controlled SPA transitions
