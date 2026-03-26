# Root test assets

This folder is for cross-cutting smoke and manual verification artifacts that sit above the colocated unit, integration, and extension E2E suites.

## What belongs here

- human-readable smoke checklists
- manual regression charters
- dated execution notes from real local runs
- links to screenshots and browser artifacts captured during those runs

## What does not belong here

- package unit tests
- extension Vitest files
- server Vitest files
- Playwright spec sources already colocated under app packages

Those remain where they already live:

- `apps/extension/tests`
- `apps/server/src/tests`
- `packages/*/src/*.test.ts`

## Structure

- `smoke/`
  deterministic release-gate style checklists
- `manual/`
  dated notes from actual local usage
- `evidence/`
  references to captured artifacts

Actual browser artifacts for the runs documented here are stored in `output/playwright/`.
