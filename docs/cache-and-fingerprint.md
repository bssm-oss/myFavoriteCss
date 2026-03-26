# Cache and fingerprint design

Cache behavior is central to Morph UI. The product is not meant to re-plan the same page on every visit. The expected experience is:

- cache hit feels immediate
- stale cache degrades safely
- AI calls are deduplicated and rate-limited by design

## Cache layers

### `chrome.storage.local`

Used for small local metadata that must be fast to read and write:

- site enabled flags
- selected profile by origin
- last cache status
- session metadata
- diagnostics

### `chrome.storage.sync`

Used for small synchronized settings:

- default provider
- privacy mode
- diagnostics toggle
- onboarding completion
- screenshot-on-miss preference

### IndexedDB

Used for large local artifacts:

- `TransformPlan`
- compiled CSS text
- compiled operation list
- fingerprint metadata
- validation stats
- created and updated timestamps
- TTL metadata

### Remote Postgres cache

Used for optional per-user sync across machines:

- canonical accepted transform artifact
- fingerprint metadata
- confidence and TTL
- compiled outputs

Remote cache is per-user in this repository. There is no cross-user shared corpus.

## URL normalization

Normalized URL identity is generated before cache lookup. The policy keeps meaningful query parameters and removes obvious tracking or session noise.

Examples of dropped params:

- `utm_*`
- `fbclid`
- `gclid`
- `ref`
- `session`

Examples of preserved params:

- `q`
- `search`
- `category`
- `product`
- `id`
- `page`
- `sort`
- `filter`
- `version`

This policy lives in `packages/config/src/index.ts`.

## Path signature

The path signature reduces volatile path segments by normalizing numbers and hashing the structural pattern. This helps related URLs map together without assuming literal path equality is enough.

Example:

- `/product/12345/details`
- `/product/67890/details`

These collapse into the same structural path signature even though the raw URLs differ.

## Fingerprint inputs

Fingerprints are intentionally semantic rather than class-name dependent.

Current inputs include:

- normalized URL
- origin
- path signature
- page type guess
- landmark signature
- region signatures
- interactive density
- layout complexity
- repeated pattern score
- text and structural hashes

The content script produces a fingerprint alongside the `PageSummary`.

## Similarity scoring

Similarity is evaluated through `packages/cache`.

Current thresholds:

- `1.00`
  exact match
- `>= 0.88`
  safe auto-apply
- `0.72 - 0.87`
  conservative fallback band
- `< 0.72`
  requires re-analysis

## Conservative fallback

When a cached artifact is not an exact match but still similar enough, Morph UI can downgrade to a conservative reapply mode.

That means:

- CSS layer can still be reused
- structural DOM operations can be withheld
- page gets a fast partial improvement
- background revalidation can determine whether a full refreshed plan is needed

This behavior keeps cache-hit performance while lowering the risk of applying stale structural operations to drifted pages.

## TTL policy

TTL is driven by page type stability.

Current defaults:

- article: 30 days
- docs: 30 days
- product list: 7 days
- product detail: 7 days
- dashboard: 1 day
- social feed: 1 day
- default: 7 days

The plan itself can recommend a TTL, but policy still passes through server-side and shared compilation logic.

## Cache lookup flow

### Local-first lookup

1. Page summary and fingerprint are collected.
2. Site enablement is checked.
3. IndexedDB lookup runs for the normalized URL and profile.
4. Best match is selected by similarity score.
5. Exact or auto-apply matches are applied immediately.

### Remote fallback

If local lookup misses and remote work is allowed:

1. Background calls `/api/cache/lookup`
2. If remote cache hits, the artifact is stored locally
3. The local copy is used for apply

### AI fallback

If no cache is usable:

1. Background calls `/api/transform/plan`
2. Server validates and compiles provider output
3. Extension previews or applies the returned artifact
4. Accepted artifacts are written to local cache and may be pushed to remote cache

## Cache invalidation triggers

- fingerprint version change
- transform-plan schema change
- selected profile change
- site override change
- mismatch rate higher than tolerated threshold
- page drift below conservative similarity threshold
- TTL expiry

## Why compiled artifacts are cached

Morph UI caches both the logical plan and the compiled transform because:

- compile work should not be repeated unnecessarily
- cached apply should be as close to instant as possible
- debugging is easier when both logical and executable representations are available

## Operational safety rules

- one page/profile/TTL window should not trigger repeated AI storms
- stale cache must degrade conservatively, not optimistically
- cache writes happen after successful validation
- preview artifacts can be held in memory without remote persistence
