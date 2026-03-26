# Local smoke run - 2026-03-26

This file records a real local usage pass executed against the current repository state.

## Environment

- date: `2026-03-26`
- fixture host: `http://127.0.0.1:4173`
- browser automation: Playwright CLI and the extension E2E harness

## Commands executed

```bash
pnpm --filter @morph-ui/web exec vite --host 127.0.0.1 --port 4173
pnpm test:e2e
```

Playwright CLI sessions were then used to open fixture pages directly and collect observations.

## Verified extension baseline

Command:

```bash
pnpm test:e2e
```

Observed result:

- passed
- current spec: `apps/extension/tests/e2e.spec.ts`
- scope: verifies fixture site load plus unpacked extension runtime boot

## Verified article fixture

URL:

- `http://127.0.0.1:4173/fixtures/article`

Observed values:

- `h1`: `Designing calmer reading experiences on dense news pages`
- heading count for `h2, h3`: `3`
- page rendered normally in browser automation

Artifacts:

- `output/playwright/2026-03-26/article-fixture.png`
- `output/playwright/2026-03-26/article-fixture-snapshot.yml`
- `output/playwright/2026-03-26/article-fixture-console.log`

Console note:

- only observed console error was a `404` for `/favicon.ico`

## Verified form fixture

URL:

- `http://127.0.0.1:4173/fixtures/form`

Observed values:

- `h1`: `Checkout`
- `document.forms.length`: `1`
- `document.querySelectorAll('input, textarea, select').length`: `3`
- page rendered normally in browser automation

Artifacts:

- `output/playwright/2026-03-26/form-fixture.png`
- `output/playwright/2026-03-26/form-fixture-snapshot.yml`
- `output/playwright/2026-03-26/form-fixture-console.log`

Console note:

- only observed console error was a `404` for `/favicon.ico`

## Summary

This smoke pass confirmed three things:

- the local fixture app was reachable and rendered expected fixture content
- the extension E2E baseline still passed
- the docs can safely reference concrete, recently observed local fixture behavior instead of only describing intended behavior
