# Extension runtime

Morph UI is a Manifest V3 extension built around a side panel workflow and origin-scoped content-script registration.

## Runtime surfaces

### Background service worker

Primary responsibilities:

- configure side panel behavior on install
- initiate product auth flow
- refresh sessions
- request and manage optional host permissions
- register content scripts per origin
- coordinate cache lookup and save
- orchestrate preview, apply, undo, and reset
- assemble side-panel bootstrap payloads

### Side panel

Primary product UI.

Current sections include:

- current page status
- site enablement
- auto-apply
- profile selection
- preference editing
- preview and apply controls
- cache information
- provider capability status
- privacy settings
- diagnostics

### Popup

Small quick-action surface.

Current controls:

- open side panel
- quick apply
- quick undo
- cache-state visibility

### Content script

Runs only on enabled origins and handles:

- DOM analysis
- page summary generation
- fingerprint generation
- compiled transform application
- undo/reset runtime behavior
- SPA route change observation

## Messaging model

The shared extension message contract lives in `apps/extension/lib/chrome-messaging.ts`.

### Runtime messages

Examples:

- `GET_BOOTSTRAP`
- `START_GOOGLE_SIGN_IN`
- `SAVE_PROFILE`
- `UPSERT_SITE_SETTING`
- `PREVIEW_TRANSFORM`
- `APPLY_TRANSFORM`
- `UNDO_TRANSFORM`
- `RESET_SITE`
- `TOGGLE_AUTO_APPLY`
- `PAGE_READY`
- `INSPECT_CACHE`

### Content messages

Examples:

- `MORPH_ANALYZE_PAGE`
- `MORPH_APPLY_COMPILED`
- `MORPH_UNDO_TRANSFORM`
- `MORPH_RESET_SITE`
- `MORPH_GET_RUNTIME_STATE`

## Permission model

The extension keeps declared permissions narrow:

- `storage`
- `sidePanel`
- `scripting`
- `tabs`
- `identity`

Host access is not granted globally up front. Instead:

1. user enables a site
2. extension requests permission for that origin
3. content script is registered for that origin

This keeps the review posture tighter than broad upfront host access.

## Page analysis lifecycle

1. Content script loads on a permitted origin.
2. It extracts the current page summary.
3. It computes a semantic fingerprint.
4. It reports readiness to the background worker.
5. Background decides whether to:
   - use local cache
   - use remote cache
   - call remote planning
   - do nothing because the site is disabled or blocked by privacy rules

## Apply lifecycle

### Preview path

- background receives preview request
- current page summary is refreshed
- cache or provider artifact is selected
- content script applies compiled payload in preview mode
- preview artifact is held for later commit or discard

### Commit path

- background applies the selected artifact in commit mode
- accepted artifact is eligible for local persistence
- remote cache save is best-effort when enabled

### Undo path

- content script restores the page using the runtime mutation journal
- page-scoped styles injected by Morph UI are removed or disabled

### Reset path

- local artifacts for the origin are removed
- page reset message is sent
- site-level runtime state is cleared

## Transform application layers

### Layer 1: compiled CSS

Used for:

- spacing adjustments
- width constraints
- typography scaling
- visibility tweaks
- simple emphasis changes

### Layer 2: reversible DOM ops

Used for:

- wrappers
- grouping
- reordering
- sticky containers
- emphasis classes

The runtime intentionally avoids destructive deletion.

### Layer 3: preservation on dynamic pages

Handled by:

- `MutationObserver`
- SPA route change detection
- controlled reapply logic

## Safety mechanics

- allowlisted CSS properties only
- strict transform-plan validation before apply
- mismatch-rate checks before structural apply
- journaled runtime changes for undo
- protection around sensitive form regions
- conservative fallback when stale similarity is not strong enough for full apply

## Auth lifecycle

1. Side panel requests Google sign-in.
2. Background uses `chrome.identity.launchWebAuthFlow`.
3. Backend returns a one-time exchange code on the extension callback URL.
4. Extension exchanges that code for Morph UI session tokens.
5. Tokens are stored in local extension storage, not in page context.

Provider credentials never enter extension storage.

## Current implementation boundaries

- The extension is production-structured, but some broader transform operation kinds in the schema are still intentionally compiled or applied conservatively.
- Side-panel UX is richer than popup UX by design.
- Path override storage exists in the broader architecture, but site-level control is the dominant surfaced workflow in the current side panel.
