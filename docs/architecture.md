# Morph UI architecture

Morph UI is built as a browser-extension product with a strict separation between page execution, extension orchestration, and server-owned AI/provider concerns.

## High-level goals

The system is optimized for:

- safe and reversible UI adaptation
- fast local cache-hit revisits
- explicit privacy boundaries
- provider abstraction without pretending unsupported auth models exist

## Monorepo structure

### Apps

- `apps/extension`
  Manifest V3 Chrome extension.
- `apps/server`
  Fastify API, auth backend, provider orchestrator, and remote cache.
- `apps/web`
  Privacy/help pages and deterministic fixture pages for local testing.

### Shared packages

- `packages/shared`
  Zod schemas and types shared between extension and server.
- `packages/config`
  URL normalization rules, sensitive-site heuristics, and seeded profiles.
- `packages/cache`
  Cache keys, similarity scoring, stale handling, and TTL helpers.
- `packages/ai`
  Provider contract, prompt builder, response normalization, and safe compilation.
- `packages/ui`
  Shared React primitives and design tokens.

## Responsibility split

### Extension

The extension owns anything that must happen in or near the browser page:

- permission requests
- tab and side panel coordination
- current-page analysis
- local cache lookup and immediate reapply
- preview and apply UX
- undo/reset actions
- dynamic page reapply on SPA transitions

### Server

The server owns anything that must not live in extension storage or page context:

- Morph UI product auth and session exchange
- provider API keys
- redaction before provider calls
- provider adapter selection
- transform-plan validation and compilation
- remote per-user cache
- feedback persistence

### Shared contracts

Everything crossing the boundary is validated in `packages/shared`.

That includes:

- preference profiles
- site settings
- page summaries
- fingerprints
- transform plans
- compiled transform payloads
- API request and response bodies

## End-to-end runtime flow

### First visit on an enabled site

1. User enables a site from the side panel.
2. Background requests optional host permission for the origin.
3. Background registers the content script for that origin.
4. Content script extracts `PageSummary` and fingerprint.
5. Background checks local IndexedDB.
6. If local cache misses, background optionally checks remote cache.
7. If no usable cache exists and privacy rules permit it, background calls the server.
8. Server redacts input, calls the selected provider, validates the response, compiles the transform, and returns a provider-independent artifact.
9. Extension applies preview or commit to the current page.
10. On accept, the artifact is stored locally and optionally remotely.

### Revisit on a previously transformed page

1. Content script computes a fresh fingerprint quickly.
2. Background finds the best local artifact for the normalized URL and profile.
3. If similarity is high, the transform is applied immediately.
4. If similarity is only conservative, CSS-only fallback may be applied first and revalidation can happen in the background.
5. If drift is too large, the cached structural plan is withheld and a new plan is required.

## Why the system is DOM-first and CSS-first

Morph UI does not rebuild pages in iframes or replace the whole document shell for normal operation.

The default strategy is:

1. understand the page from DOM structure
2. normalize the page identity
3. generate safe declarative changes
4. compile into allowlisted CSS plus reversible DOM operations

This keeps the original page functional:

- forms still submit normally
- links still navigate normally
- keyboard navigation remains native
- accessibility tree changes are constrained and reviewable

## Extension surfaces

### Side panel

Main product surface. It exposes:

- current page status
- enable or disable on this site
- profile selection
- site override editing
- preview, apply, undo, and reset
- auto-apply
- cache state
- provider capability display
- privacy controls
- diagnostics

### Popup

Minimal quick-control surface:

- open side panel
- quick apply
- quick undo
- view current cache state

### Content script

Runs on enabled origins only and owns:

- page analysis
- selector generation
- fingerprint generation
- compiled transform application
- mutation journal and undo
- SPA route detection

### Background service worker

Acts as orchestrator:

- content script registration
- auth flow kickoff
- session refresh
- local and remote cache coordination
- preview/apply command routing
- bootstrap payload assembly for the side panel

## Design principles

- Prefer CSS over DOM mutation when the same visual result is possible.
- Prefer wrappers and non-destructive grouping over moving or hiding critical nodes.
- Never trust provider output without Zod validation.
- Never let logging or analytics become a hard dependency for a successful user action.
- Default to local analysis first and remote planning second.

## Current scope versus future scope

Implemented in this repository:

- site-level settings
- seeded profiles
- remote and local cache
- provider abstraction
- strict transform schema
- extension build and fixture-driven testing

Designed into the schema and data model but not yet fully surfaced in the UI:

- richer path-level override authoring
- broader transform operation coverage in the page apply engine
- deeper side-panel E2E automation beyond runtime smoke coverage
