# Data model

Morph UI uses Postgres through Drizzle. The schema is designed around per-user state, explicit cache artifacts, and provider capability transparency.

Canonical schema:

- `apps/server/src/db/schema.ts`
- `apps/server/src/db/migrations/0001_init.sql`

## Tables

### `users`

Stores Morph UI product users.

Key columns:

- `id`
- `email`
- `name`
- `avatar_url`
- timestamps

### `auth_accounts`

Stores external identity provider linkage for product auth.

Key columns:

- `user_id`
- `provider`
- `provider_user_id`
- `access_metadata`

Constraint:

- unique on `(provider, provider_user_id)`

### `auth_flows`

Stores in-flight Google OAuth continuation state for extension auth.

Key columns:

- `state`
- `extension_redirect_uri`
- `extension_state`
- `code_challenge`
- `exchange_code_hash`
- `expires_at`
- `used_at`

### `sessions`

Stores hashed Morph UI product session tokens.

Key columns:

- `user_id`
- `access_token_hash`
- `refresh_token_hash`
- `access_expires_at`
- `refresh_expires_at`
- `user_agent`

### `profiles`

Stores user preference profiles.

Key columns:

- `user_id`
- `name`
- `is_default`
- `natural_language_instruction`
- `structured_preferences_json`
- `learned_adjustments_json`

### `site_settings`

Stores per-origin behavior.

Key columns:

- `user_id`
- `origin`
- `enabled`
- `auto_apply`
- `privacy_mode`
- `allow_screenshots`
- `profile_id`
- `override_preferences_json`

Constraint:

- unique on `(user_id, origin)`

### `path_overrides`

Stores optional path-level overrides.

Key columns:

- `user_id`
- `origin`
- `path_pattern`
- `enabled`
- `auto_apply`
- `profile_id`
- `override_preferences_json`

Constraint:

- unique on `(user_id, origin, path_pattern)`

### `page_cache`

Stores canonical remote transform artifacts for the user.

Key columns:

- `user_id`
- `origin`
- `normalized_url`
- `path_signature`
- `profile_id`
- `fingerprint_version`
- `fingerprint_hash`
- `fingerprint_features_json`
- `transform_plan_json`
- `compiled_css_text`
- `compiled_ops_json`
- `confidence`
- `ttl_seconds`
- `last_validated_at`

Constraint:

- unique on `(user_id, origin, normalized_url, profile_id, fingerprint_version, path_signature)`

### `transform_runs`

Stores a record of provider-backed planning attempts.

Key columns:

- `user_id`
- `provider`
- `origin`
- `normalized_url`
- `profile_id`
- `cache_status`
- `page_type`
- `request_payload_redacted_json`
- `model_response_json`
- `success`
- `latency_ms`

Note:

- `profile_id` is nullable at write time if the provided profile is not persisted yet. Planning should not fail just because observability metadata cannot attach a foreign key.

### `feedback_events`

Stores user feedback on applied or previewed transforms.

Key columns:

- `user_id`
- `page_cache_id`
- `event_type`
- `event_payload_json`

### `provider_capabilities`

Stores the declared platform capability posture for each provider.

Key columns:

- `provider`
- `can_use_official_oauth`
- `can_use_server_owned_api`
- `supports_consumer_account_reuse`
- `supports_vision`
- `supports_structured_output`
- `limitation_reason`

## Seed data

Current seed behavior creates:

- provider capability rows
- sample preference profiles
- a demo development user

Seeded profile set:

- Reader Focus
- Dense Catalog
- Calm Dashboard
- Docs Navigator
- Accessible Contrast

## How database state maps to product behavior

### Profile selection

- persisted profiles come from `profiles`
- selected profile by origin is stored locally in the extension for fast runtime decisions

### Site behavior

- whether a site is enabled comes from `site_settings`
- whether a site auto-applies comes from `site_settings`
- privacy mode and screenshot permission also come from `site_settings`

### Remote cache

- accepted artifacts are written to `page_cache`
- lookups search by user, origin, normalized URL, and profile context

### Learning loop

- user feedback becomes `feedback_events`
- selected feedback types update `profiles.learned_adjustments_json`

## Migration model

The repo currently includes a single initial SQL migration:

- `apps/server/src/db/migrations/0001_init.sql`

For local work:

```bash
pnpm db:migrate
pnpm db:seed
```
