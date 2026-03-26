import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

export const providerEnum = pgEnum("provider", ["openai", "gemini"]);
export const privacyModeEnum = pgEnum("privacy_mode", ["strict-local", "local-first", "sync-enabled"]);
export const feedbackEventTypeEnum = pgEnum("feedback_event_type", ["accept", "undo", "reject", "tweak", "reset"]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
};

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  ...timestamps
}, (table) => ({
  emailUnique: uniqueIndex("users_email_unique").on(table.email)
}));

export const authAccounts = pgTable("auth_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull(),
  providerUserId: text("provider_user_id").notNull(),
  accessMetadata: jsonb("access_metadata").$type<Record<string, unknown>>().default({}).notNull(),
  ...timestamps
}, (table) => ({
  providerUserUnique: uniqueIndex("auth_accounts_provider_user_unique").on(table.provider, table.providerUserId)
}));

export const authFlows = pgTable("auth_flows", {
  id: uuid("id").defaultRandom().primaryKey(),
  provider: text("provider").notNull(),
  state: text("state").notNull(),
  extensionRedirectUri: text("extension_redirect_uri").notNull(),
  extensionState: text("extension_state").notNull(),
  codeChallenge: text("code_challenge").notNull(),
  exchangeCodeHash: text("exchange_code_hash"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  ...timestamps
}, (table) => ({
  stateUnique: uniqueIndex("auth_flows_state_unique").on(table.state)
}));

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  accessTokenHash: text("access_token_hash").notNull(),
  refreshTokenHash: text("refresh_token_hash").notNull(),
  accessExpiresAt: timestamp("access_expires_at", { withTimezone: true }).notNull(),
  refreshExpiresAt: timestamp("refresh_expires_at", { withTimezone: true }).notNull(),
  userAgent: text("user_agent"),
  ...timestamps
}, (table) => ({
  accessUnique: uniqueIndex("sessions_access_token_hash_unique").on(table.accessTokenHash),
  refreshUnique: uniqueIndex("sessions_refresh_token_hash_unique").on(table.refreshTokenHash)
}));

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  naturalLanguageInstruction: text("natural_language_instruction").default("").notNull(),
  structuredPreferencesJson: jsonb("structured_preferences_json").$type<Record<string, unknown>>().notNull(),
  learnedAdjustmentsJson: jsonb("learned_adjustments_json").$type<Record<string, unknown>[]>().default([]).notNull(),
  ...timestamps
}, (table) => ({
  profileUserIndex: index("profiles_user_idx").on(table.userId)
}));

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  origin: text("origin").notNull(),
  enabled: boolean("enabled").default(false).notNull(),
  autoApply: boolean("auto_apply").default(false).notNull(),
  privacyMode: privacyModeEnum("privacy_mode").default("local-first").notNull(),
  allowScreenshots: boolean("allow_screenshots").default(false).notNull(),
  profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "set null" }),
  overridePreferencesJson: jsonb("override_preferences_json").$type<Record<string, unknown>>().default({}).notNull(),
  ...timestamps
}, (table) => ({
  userOriginUnique: uniqueIndex("site_settings_user_origin_unique").on(table.userId, table.origin)
}));

export const pathOverrides = pgTable("path_overrides", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  origin: text("origin").notNull(),
  pathPattern: text("path_pattern").notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  autoApply: boolean("auto_apply").default(false).notNull(),
  profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "set null" }),
  overridePreferencesJson: jsonb("override_preferences_json").$type<Record<string, unknown>>().default({}).notNull(),
  ...timestamps
}, (table) => ({
  userOriginPathUnique: uniqueIndex("path_overrides_user_origin_path_unique").on(table.userId, table.origin, table.pathPattern)
}));

export const pageCache = pgTable("page_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  origin: text("origin").notNull(),
  normalizedUrl: text("normalized_url").notNull(),
  pathSignature: text("path_signature").notNull(),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  fingerprintVersion: text("fingerprint_version").notNull(),
  fingerprintHash: text("fingerprint_hash").notNull(),
  fingerprintFeaturesJson: jsonb("fingerprint_features_json").$type<Record<string, unknown>>().notNull(),
  transformPlanJson: jsonb("transform_plan_json").$type<Record<string, unknown>>().notNull(),
  compiledCssText: text("compiled_css_text").notNull(),
  compiledOpsJson: jsonb("compiled_ops_json").$type<Record<string, unknown>[]>().notNull(),
  confidence: real("confidence").notNull(),
  ttlSeconds: integer("ttl_seconds").notNull(),
  lastValidatedAt: timestamp("last_validated_at", { withTimezone: true }).defaultNow().notNull(),
  ...timestamps
}, (table) => ({
  userOriginUrlProfileUnique: uniqueIndex("page_cache_user_origin_url_profile_unique")
    .on(table.userId, table.origin, table.normalizedUrl, table.profileId, table.fingerprintVersion, table.pathSignature),
  lookupIndex: index("page_cache_lookup_idx").on(table.userId, table.origin, table.normalizedUrl)
}));

export const transformRuns = pgTable("transform_runs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  provider: providerEnum("provider").notNull(),
  origin: text("origin").notNull(),
  normalizedUrl: text("normalized_url").notNull(),
  profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "set null" }),
  cacheStatus: text("cache_status").notNull(),
  pageType: text("page_type").notNull(),
  requestPayloadRedactedJson: jsonb("request_payload_redacted_json").$type<Record<string, unknown>>().notNull(),
  modelResponseJson: jsonb("model_response_json").$type<Record<string, unknown>>().notNull(),
  success: boolean("success").default(false).notNull(),
  latencyMs: integer("latency_ms").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const feedbackEvents = pgTable("feedback_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  pageCacheId: uuid("page_cache_id").references(() => pageCache.id, { onDelete: "set null" }),
  eventType: feedbackEventTypeEnum("event_type").notNull(),
  eventPayloadJson: jsonb("event_payload_json").$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
});

export const providerCapabilities = pgTable("provider_capabilities", {
  provider: providerEnum("provider").primaryKey(),
  canUseOfficialOAuth: boolean("can_use_official_oauth").default(false).notNull(),
  canUseServerOwnedApi: boolean("can_use_server_owned_api").default(true).notNull(),
  supportsConsumerAccountReuse: boolean("supports_consumer_account_reuse").default(false).notNull(),
  supportsVision: boolean("supports_vision").default(true).notNull(),
  supportsStructuredOutput: boolean("supports_structured_output").default(true).notNull(),
  limitationReason: text("limitation_reason").default("").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
});
