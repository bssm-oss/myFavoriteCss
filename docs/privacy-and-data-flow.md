# Privacy and data flow

Morph UI is designed so privacy rules are visible in product behavior, not buried in backend assumptions.

## Privacy modes

### `strict-local`

- no remote transform planning
- no server call for AI planning
- only previously cached local artifacts may be applied
- useful for highly sensitive browsing contexts

### `local-first`

- default mode
- local analysis and local cache first
- remote planning allowed only when the site is enabled and not blocked by sensitivity rules

### `sync-enabled`

- same remote planning posture as `local-first`
- accepted artifacts may also be synchronized to the user's remote cache

## What data stays local

Stored in the extension:

- site enablement flags
- selected profile IDs
- synced settings
- diagnostics
- preview state
- local transform artifact cache
- current tab bootstrap state

Stored in the page context transiently:

- analyzed `PageSummary`
- computed fingerprint
- runtime mutation journal for undo

## What goes to the Morph UI server

When server-assisted planning or remote cache is used, the extension may send:

- redacted page summary
- page fingerprint
- selected profile
- selected site setting
- accepted compiled artifact for cache save
- feedback events

The server does not need browser cookies or the raw DOM HTML to do its job in the current design.

## What may go to AI providers

Providers can receive only server-prepared, redacted structured input:

- preference profile
- site setting
- page summary
- optional previous accepted plan
- optional screenshot, only if policy allows it

Providers do not receive:

- extension storage
- browser cookies
- session storage
- hidden browser tabs or undocumented consumer sessions

## Sensitive-site policy

Morph UI blocks remote text and screenshot planning by default for likely sensitive contexts.

Current heuristics include:

- login and auth paths
- checkout and payment paths
- banking hints
- webmail hints
- healthcare hints
- government hints
- password-related paths
- likely internal enterprise URLs

The shared heuristic lives in `packages/config`.

## Screenshot policy

Screenshots are not part of the default happy path. They are secondary and optional.

Screenshot usage is allowed only when:

- the site is enabled
- privacy mode allows remote planning
- the site is not considered sensitive
- screenshot-on-miss is enabled
- the current situation actually benefits from a screenshot

In this repository, screenshots are treated as optional request payloads and are not persisted in the local artifact store. Only a hash or related metadata may be cached.

## Redaction policy

Before provider calls, Morph UI redacts or excludes likely sensitive values.

Examples:

- password input values
- hidden CSRF-like token fields
- obvious token strings
- email values when not needed
- payment card-like values
- contenteditable private content flagged as sensitive
- obvious secret material in code or config-like blocks

The intent is to send structural context and safe summaries, not user secrets.

## Product auth versus provider auth

Morph UI product sign-in is separate from AI provider identity.

That means:

- the user signs into Morph UI
- the server authenticates Morph UI requests
- providers are called with server-owned credentials
- the extension never stores provider secrets

This separation is intentional. It avoids pretending that a browser extension can safely and officially reuse a consumer ChatGPT or Gemini subscription when that flow is not supported here.

## Local and remote deletion model

Current storage classes:

- local extension storage
- local IndexedDB artifact cache
- remote per-user cache
- feedback and run history in Postgres

Current clearing behavior:

- site reset removes local artifacts for the origin
- local storage can be cleared by extension reinstall or by explicit storage cleanup paths
- remote cache writes are optional and per-user

## Review posture

Morph UI is built to be explainable during security or store review:

- no remote code execution
- no scraping of provider web apps
- no hidden data collection model
- no surprise screenshots by default
- no claim of consumer subscription reuse
