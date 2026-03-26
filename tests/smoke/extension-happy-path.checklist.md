# Extension happy path checklist

Use this checklist when validating a local Morph UI build manually.

## Preconditions

- `pnpm dev:server` is running
- `pnpm dev:web` is running
- `pnpm dev:extension` or `pnpm --filter @morph-ui/extension build` has produced `apps/extension/dist`
- the unpacked extension is loaded in Chrome

## Flow

1. Open `http://localhost:5173/fixtures/article`
2. Open the Morph UI side panel
3. Enable the site and grant origin permission
4. Select the `Reader Focus` profile
5. Preview the transform
6. Apply the transform
7. Undo the transform
8. Re-apply the transform
9. Reload the page
10. Confirm cached reapply behavior

## Expected results

- site enablement persists
- preview applies without breaking the page
- undo restores the page
- re-apply succeeds
- reload can use cached state instead of forcing a new plan every time
- diagnostics show a sensible cache status

## Automated baseline

The current repo-level extension smoke baseline is:

```bash
pnpm test:e2e
```
