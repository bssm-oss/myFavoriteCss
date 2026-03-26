# Morph UI

Morph UI is a production-oriented Chrome Extension plus backend that adapts existing webpages into a user-preferred UI state without replacing the page shell. The product is designed around four constraints:

- transformations must be reversible
- cache-hit revisits must feel immediate
- provider capabilities must be represented honestly
- privacy-sensitive work must default to local DOM analysis first

Morph UI is not a toy demo. The repository includes a real MV3 extension, a Fastify server, a Postgres schema, provider adapters for OpenAI and Gemini, local and remote cache layers, runtime validation with Zod, and automated tests.

## What the product does

Users can:

- define a global UI preference profile
- override preferences per site
- preview a transform before committing it
- apply, undo, or reset a transform
- enable auto-apply on a site
- inspect cache status and diagnostics
- choose a provider while seeing actual supported capability flags

The runtime is DOM-first and CSS-first. Morph UI tries to reshape the page with safe CSS and reversible DOM wrappers before doing anything more structural. Screenshots are optional and gated by privacy settings and sensitive-site rules.

## Core architecture

Morph UI is a `pnpm` monorepo:

- `apps/extension`
  Chrome MV3 extension. The side panel is the main UX. The background service worker coordinates auth, permissions, AI planning, and cache. Content scripts analyze and transform the live page.
- `apps/server`
  Fastify + Drizzle + Postgres backend. Owns product session handling, provider adapters, remote cache, redaction, and transform planning.
- `apps/web`
  Small React app used for privacy/help pages and deterministic fixture routes for Playwright and manual extension testing.
- `packages/shared`
  Zod-first schemas and shared types used across extension and server.
- `packages/config`
  URL normalization policy, sensitive-site heuristics, and seeded default profiles.
- `packages/cache`
  Cache keys, fingerprint matching, TTL policy, and conservative fallback compilation.
- `packages/ai`
  Provider abstraction, prompt construction, strict JSON mapping, and safe transform compilation.
- `packages/ui`
  Shared React primitives and design tokens used by the extension and web app.

For the detailed design, start with [docs/README.md](./docs/README.md).

## Monorepo tree

```text
.
├── README.md
├── .env.example
├── docker-compose.yml
├── docs/
│   ├── README.md
│   ├── architecture.md
│   ├── api-contracts.md
│   ├── cache-and-fingerprint.md
│   ├── data-model.md
│   ├── extension-runtime.md
│   ├── local-development.md
│   ├── privacy-and-data-flow.md
│   ├── provider-capabilities.md
│   ├── testing-fixtures.md
│   └── transform-plan-spec.md
├── apps/
│   ├── extension/
│   ├── server/
│   └── web/
└── packages/
    ├── ai/
    ├── cache/
    ├── config/
    ├── shared/
    └── ui/
```

## Product guarantees

- The side panel is the primary UX.
- Content scripts analyze and transform the real page in place.
- Transforms are reversible and journaled.
- Large artifacts are stored in IndexedDB.
- Small synced settings are stored in `chrome.storage.sync`.
- Server-owned credentials are used for AI providers.
- Consumer ChatGPT Plus or Gemini Advanced subscriptions are not reused or implied.
- Privacy mode can block remote planning entirely.
- Sensitive sites are blocked by default from remote text or screenshot planning.

## Runtime flow

1. The user opens the side panel and enables the current site.
2. The extension requests optional host permission for that origin.
3. The background worker registers the content script for the origin.
4. The content script extracts a `PageSummary` and fingerprint from the live DOM.
5. The background worker looks for a local IndexedDB cache hit.
6. If similarity is strong enough, the cached transform is applied immediately.
7. If there is no usable local hit, the worker may ask the remote cache.
8. If remote planning is allowed, the server calls the selected provider with redacted structured input.
9. The server validates the provider response against the shared `TransformPlan` schema.
10. The plan is compiled into allowlisted CSS plus reversible DOM operations.
11. The user can preview or apply it, then accepted artifacts are saved locally and optionally remotely.

## Provider model

Morph UI separates product auth from AI provider execution.

- Product auth:
  Google OAuth is used to sign the user into Morph UI itself.
- Provider execution:
  OpenAI and Gemini are called by the server using official APIs and server-owned credentials.
- Consumer account reuse:
  deliberately unsupported in v1 and shown as unsupported in the UI and docs.

More detail: [docs/provider-capabilities.md](./docs/provider-capabilities.md)

## Privacy model

Morph UI supports three privacy modes:

- `strict-local`
  No remote transform planning. Only local cached transforms may be applied.
- `local-first`
  Default. Local analysis and cache first, remote planning allowed on enabled non-sensitive sites.
- `sync-enabled`
  Same planning behavior as `local-first`, plus optional remote artifact sync.

Morph UI does not send passwords, browser cookies, full auth tokens, payment card numbers, or obvious secrets to AI providers.

More detail: [docs/privacy-and-data-flow.md](./docs/privacy-and-data-flow.md)

## Requirements

- Node.js 20+
- pnpm 9+
- Docker for local Postgres and the integration test path
- Chrome 120+ for the extension

## Environment setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start Postgres:

   ```bash
   docker compose up -d postgres
   ```

3. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

4. Fill in the required values.

### Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | no | `development`, `test`, or `production` |
| `APP_ORIGIN` | yes | Allowed origin for the extension-facing app runtime |
| `WEB_ORIGIN` | yes | Allowed origin for the web docs and fixture app |
| `DATABASE_URL` | yes | Main Postgres connection string |
| `TEST_DATABASE_URL` | recommended | Separate database URL for integration tests |
| `SESSION_TOKEN_SECRET` | yes | Secret used to hash and validate Morph UI session tokens |
| `GOOGLE_CLIENT_ID` | yes for auth | Google OAuth client ID for Morph UI product sign-in |
| `GOOGLE_CLIENT_SECRET` | yes for auth | Google OAuth client secret |
| `GOOGLE_OAUTH_REDIRECT_URI` | yes for auth | Backend callback URL, defaults to local Fastify callback |
| `OPENAI_API_KEY` | required if using OpenAI | Server-owned OpenAI API key |
| `OPENAI_MODEL` | no | Defaults to `gpt-4.1-mini` |
| `GEMINI_API_KEY` | required if using Gemini | Server-owned Gemini API key |
| `GEMINI_MODEL` | no | Defaults to `gemini-2.5-flash` |
| `DEFAULT_PROVIDER` | no | `openai` or `gemini` |
| `ENABLE_REMOTE_CACHE` | no | Enables per-user remote cache writes and lookups |
| `PORT` | no | Fastify port, defaults to `8787` |

## Database setup

Run migrations and seed default records:

```bash
pnpm db:migrate
pnpm db:seed
```

The seed creates:

- provider capability rows
- sample preference profiles
- a demo local user record for development convenience

Schema detail: [docs/data-model.md](./docs/data-model.md)

## Local development

Run each surface in its own terminal:

```bash
pnpm dev:server
pnpm dev:web
pnpm dev:extension
```

Default local URLs:

- server: `http://localhost:8787`
- web app and fixtures: `http://localhost:5173`
- extension build output: `apps/extension/dist`

Detailed dev workflow: [docs/local-development.md](./docs/local-development.md)

## Loading the extension

1. Open `chrome://extensions`
2. Turn on Developer mode
3. Click `Load unpacked`
4. Select `apps/extension/dist`
5. Pin the extension if needed
6. Click the extension action and open the side panel

## Local usage walkthrough

1. Start the server and web app.
2. Load the unpacked extension.
3. Navigate to one of the fixture pages:
   - `http://localhost:5173/fixtures/article`
   - `http://localhost:5173/fixtures/ecommerce`
   - `http://localhost:5173/fixtures/dashboard`
   - `http://localhost:5173/fixtures/docs`
   - `http://localhost:5173/fixtures/form`
4. Open the Morph UI side panel.
5. Sign in if server-assisted planning is needed.
6. Enable the site.
7. Pick a profile.
8. Preview a transform.
9. Apply or undo it.
10. Reload the page and confirm cache-hit behavior.

## Build commands

Build the whole workspace:

```bash
pnpm build
```

Useful targeted commands:

```bash
pnpm --filter @morph-ui/extension build
pnpm --filter @morph-ui/server build
pnpm --filter @morph-ui/web build
```

## Test commands

Workspace unit and package tests:

```bash
pnpm test
```

Type checking:

```bash
pnpm typecheck
```

Backend integration test with Testcontainers:

```bash
pnpm test:integration
```

Extension E2E harness:

```bash
pnpm test:e2e
```

Human-run smoke assets and recent real local verification notes:

- `tests/README.md`
- `tests/smoke/extension-happy-path.checklist.md`
- `tests/manual/local-smoke-2026-03-26.md`
- `output/playwright/2026-03-26/`

## Current API surface

Implemented server routes:

- `GET /api/health`
- `GET /api/auth/google/start`
- `GET /api/auth/google/callback`
- `POST /api/auth/session/exchange`
- `POST /api/auth/session/refresh`
- `GET /api/provider/capabilities`
- `GET /api/profiles`
- `POST /api/profiles`
- `GET /api/site-settings`
- `POST /api/site-settings`
- `POST /api/cache/lookup`
- `POST /api/cache/save`
- `POST /api/transform/plan`
- `POST /api/feedback`

Detailed request and response shapes: [docs/api-contracts.md](./docs/api-contracts.md)

## Documentation map

- [Docs index](./docs/README.md)
- [Architecture](./docs/architecture.md)
- [API contracts](./docs/api-contracts.md)
- [Data model](./docs/data-model.md)
- [Transform plan spec](./docs/transform-plan-spec.md)
- [Cache and fingerprint design](./docs/cache-and-fingerprint.md)
- [Privacy and data flow](./docs/privacy-and-data-flow.md)
- [Provider capabilities](./docs/provider-capabilities.md)
- [Extension runtime](./docs/extension-runtime.md)
- [Local development](./docs/local-development.md)
- [Testing fixtures](./docs/testing-fixtures.md)
- [Root smoke assets](./tests/README.md)

## Known limitations

- v1 does not implement provider-linked end-user billing or consumer subscription reuse.
- The transform schema supports more operation kinds than the current safe apply engine chooses to execute on every page.
- Path override data model exists in shared schema and database, but the side panel UX in this repo is centered on site-level override flows first.
- Screenshot planning is intentionally secondary to DOM/CSS planning and is blocked by privacy rules on many classes of pages.

## License and review posture

The extension is designed to stay within a Chrome Web Store-friendly posture:

- no remote hosted executable code
- no `eval`
- no `new Function`
- no cookie scraping
- no hidden browser-session reuse
- minimal declared permissions with origin access requested when needed
