# Transform plan spec

Morph UI does not allow providers to return freeform prose and then hope runtime code interprets it correctly. Providers must return strict JSON that validates against the shared transform-plan schema.

Canonical source:

- `packages/shared/src/transform-plan.ts`
- `packages/ai/src/index.ts`

## Purpose of the plan

The plan is the provider-independent description of how Morph UI wants to adapt a page.

It is not:

- arbitrary JavaScript
- raw HTML snippets
- executable code
- unbounded CSS text

It is:

- structured
- validated
- compiled locally
- reversible by design

## Top-level shape

Current top-level fields:

- `version`
- `pageIntent`
- `summary`
- `confidence`
- `reasoningSummaryForUser`
- `themeTokens`
- `globalCssRules`
- `nodeOperations`
- `overlays`
- `preservedSelectors`
- `blockedSelectors`
- `accessibilityNotes`
- `safetyFlags`
- `requiresUserConfirmation`
- `cacheHints`
- `rollbackPlanMetadata`

## CSS rules

Each CSS rule includes:

- `selector`
- `declarations`
- `media`
- `priority`

Important constraint:

- model output declarations are filtered against a safe allowlist during compilation

The compiler also normalizes camelCase CSS property names to kebab-case before allowlist filtering.

Examples:

- `maxWidth` becomes `max-width`
- `backgroundColor` becomes `background-color`

## Allowed CSS posture

The safe property list is intentionally limited. Examples include:

- `max-width`
- `padding`
- `margin`
- `font-size`
- `line-height`
- `grid-template-columns`
- `gap`
- `opacity`
- `position`
- `top`

Anything outside the allowlist is dropped during compilation.

## Node operations

The schema supports these operation kinds:

- `hide`
- `show`
- `group`
- `wrap`
- `reorder`
- `moveBefore`
- `moveAfter`
- `moveInto`
- `elevate`
- `demote`
- `makeSticky`
- `convertToReaderBlock`
- `mergeRepeatedControls`
- `compressSpacing`
- `emphasize`
- `deEmphasize`

Each operation includes:

- operation ID
- type
- target selector reference
- optional destination selector reference
- optional wrapper metadata
- justification
- confidence
- reversibility strategy
- safety category
- confirmation requirement

## Selector references

Operations do not target opaque provider-invented node IDs. They target selector references produced by the page-analysis pipeline.

That means provider output depends on:

- stable selector generation
- semantic anchors
- fuzzy fallback when exact selectors drift

## Safety categories

Current categories:

- `cosmetic`
- `layout`
- `navigation`
- `content-emphasis`
- `reader-mode`
- `sensitive`

These categories are meant to help runtime decision-making and UX disclosure.

## Safety flags

The plan carries explicit safety flags:

- `touchesSensitiveRegions`
- `hidesCriticalControls`
- `modifiesForms`
- `requiresConservativeApply`

These flags let the runtime decide whether to:

- block
- downgrade
- require confirmation
- proceed

## Overlays

The schema supports controlled overlays such as:

- `reader-mode-banner`
- `summary-chip`
- `toc-rail`

These are still declarative and typed, not arbitrary UI injection.

## Rollback metadata

The plan includes rollback expectations:

- expected number of mutations
- mismatch-rate threshold that should abort structural apply

This lets the runtime fail closed when the page no longer matches the original assumptions.

## Compilation

Compilation happens after plan validation and before page apply.

Compilation produces:

- `planHash`
- `compiledCssText`
- `compiledOperations`
- preserved selector list
- blocked selector list
- generation timestamp
- apply mode

Apply modes:

- `full`
- `conservative-css-only`

## Rules providers are expected to follow

Prompting instructs providers to:

- return JSON only
- prefer CSS-only changes first
- avoid destructive deletion
- avoid touching scripts and styles
- avoid moving inputs outside forms
- avoid hiding auth, payment, consent, or security controls without confirmation

## Why this contract matters

The transform plan is the boundary that makes Morph UI auditable:

- provider output is visible and typed
- runtime behavior is deterministic after compilation
- unsafe output is easier to reject or downgrade
- cache artifacts remain portable across provider implementations
