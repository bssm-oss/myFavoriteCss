create extension if not exists pgcrypto;

create type provider as enum ('openai', 'gemini');
create type privacy_mode as enum ('strict-local', 'local-first', 'sync-enabled');
create type feedback_event_type as enum ('accept', 'undo', 'reject', 'tweak', 'reset');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists auth_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  provider text not null,
  provider_user_id text not null,
  access_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider, provider_user_id)
);

create table if not exists auth_flows (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  state text not null unique,
  extension_redirect_uri text not null,
  extension_state text not null,
  code_challenge text not null,
  exchange_code_hash text,
  user_id uuid references users(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  access_token_hash text not null unique,
  refresh_token_hash text not null unique,
  access_expires_at timestamptz not null,
  refresh_expires_at timestamptz not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  is_default boolean not null default false,
  natural_language_instruction text not null default '',
  structured_preferences_json jsonb not null,
  learned_adjustments_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_user_idx on profiles(user_id);

create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  origin text not null,
  enabled boolean not null default false,
  auto_apply boolean not null default false,
  privacy_mode privacy_mode not null default 'local-first',
  allow_screenshots boolean not null default false,
  profile_id uuid references profiles(id) on delete set null,
  override_preferences_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, origin)
);

create table if not exists path_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  origin text not null,
  path_pattern text not null,
  enabled boolean not null default true,
  auto_apply boolean not null default false,
  profile_id uuid references profiles(id) on delete set null,
  override_preferences_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, origin, path_pattern)
);

create table if not exists page_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  origin text not null,
  normalized_url text not null,
  path_signature text not null,
  profile_id uuid not null references profiles(id) on delete cascade,
  fingerprint_version text not null,
  fingerprint_hash text not null,
  fingerprint_features_json jsonb not null,
  transform_plan_json jsonb not null,
  compiled_css_text text not null,
  compiled_ops_json jsonb not null,
  confidence real not null,
  ttl_seconds integer not null,
  last_validated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, origin, normalized_url, profile_id, fingerprint_version, path_signature)
);

create index if not exists page_cache_lookup_idx on page_cache(user_id, origin, normalized_url);

create table if not exists transform_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  provider provider not null,
  origin text not null,
  normalized_url text not null,
  profile_id uuid references profiles(id) on delete set null,
  cache_status text not null,
  page_type text not null,
  request_payload_redacted_json jsonb not null,
  model_response_json jsonb not null,
  success boolean not null default false,
  latency_ms integer not null,
  created_at timestamptz not null default now()
);

create table if not exists feedback_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  page_cache_id uuid references page_cache(id) on delete set null,
  event_type feedback_event_type not null,
  event_payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists provider_capabilities (
  provider provider primary key,
  can_use_official_oauth boolean not null default false,
  can_use_server_owned_api boolean not null default true,
  supports_consumer_account_reuse boolean not null default false,
  supports_vision boolean not null default true,
  supports_structured_output boolean not null default true,
  limitation_reason text not null default '',
  updated_at timestamptz not null default now()
);
