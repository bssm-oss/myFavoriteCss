import { z } from "zod";

import { pageFingerprintSchema, pageSummarySchema } from "./page-summary";
import { pathOverrideSchema, preferenceProfileSchema, siteSettingSchema } from "./preferences";
import {
  providerCapabilitiesSchema,
  providerConfigSummarySchema,
  providerLocalConfigSchema,
  providerSchema
} from "./provider-capabilities";
import { compiledTransformSchema, transformPlanSchema } from "./transform-plan";

export const cacheLookupRequestSchema = z.object({
  origin: z.string().url(),
  normalizedUrl: z.string().url(),
  pathSignature: z.string(),
  profileId: z.string(),
  fingerprint: pageFingerprintSchema
});

export const cacheLookupResponseSchema = z.object({
  status: z.enum(["hit", "stale-hit", "miss"]),
  similarity: z.number().min(0).max(1),
  cacheKey: z.string().optional(),
  plan: transformPlanSchema.optional(),
  compiled: compiledTransformSchema.optional(),
  revalidateAfter: z.string().datetime().optional()
});

export const cacheSaveRequestSchema = z.object({
  origin: z.string().url(),
  normalizedUrl: z.string().url(),
  pathSignature: z.string(),
  profileId: z.string(),
  fingerprint: pageFingerprintSchema,
  confidence: z.number().min(0).max(1),
  ttlSeconds: z.number().int().positive(),
  plan: transformPlanSchema,
  compiled: compiledTransformSchema
});

export const transformPlanRequestSchema = z.object({
  provider: providerSchema,
  profile: preferenceProfileSchema,
  siteSetting: siteSettingSchema,
  pageSummary: pageSummarySchema,
  fingerprint: pageFingerprintSchema,
  screenshot: z.object({
    mimeType: z.string(),
    base64: z.string()
  }).optional(),
  previousPlan: transformPlanSchema.optional()
});

export const transformPlanResponseSchema = z.object({
  provider: providerSchema,
  cacheStatus: z.enum(["planned", "cache-hit", "cache-stale-hit"]),
  plan: transformPlanSchema,
  compiled: compiledTransformSchema,
  cachePolicy: z.object({
    ttlSeconds: z.number().int().positive(),
    allowRemoteSave: z.boolean(),
    revalidateAfterSeconds: z.number().int().positive()
  })
});

export const feedbackEventSchema = z.object({
  eventType: z.enum(["accept", "undo", "reject", "tweak", "reset"]),
  cacheKey: z.string().optional(),
  pageContext: z.object({
    origin: z.string().url(),
    normalizedUrl: z.string().url(),
    profileId: z.string().optional()
  }),
  payload: z.record(z.unknown()).default({})
});

export const siteSettingsUpsertRequestSchema = siteSettingSchema;
export const profilesUpsertRequestSchema = preferenceProfileSchema;
export const pathOverrideUpsertRequestSchema = pathOverrideSchema;
export const providerLocalConfigUpsertRequestSchema = providerLocalConfigSchema;
export const providerConfigSummaryResponseSchema = z.array(providerConfigSummarySchema);

export const diagnosticsSchema = z.object({
  lastCacheStatus: z.enum(["none", "hit", "stale-hit", "miss", "planned"]).default("none"),
  lastProviderError: z.string().nullable().default(null),
  selectorMismatchRate: z.number().min(0).max(1).default(0),
  contentAnalysisMs: z.number().int().min(0).default(0),
  planLatencyMs: z.number().int().min(0).default(0)
});

export const syncedSettingsSchema = z.object({
  defaultProvider: providerSchema.default("openai"),
  privacyMode: z.enum(["strict-local", "local-first", "sync-enabled"]).default("local-first"),
  diagnosticsEnabled: z.boolean().default(false),
  onboardingCompleted: z.boolean().default(false),
  allowToasts: z.boolean().default(true),
  allowScreenshotsOnMiss: z.boolean().default(false)
});

export const providerCapabilitiesResponseSchema = z.array(providerCapabilitiesSchema);

export type SyncedSettings = z.infer<typeof syncedSettingsSchema>;
export type CacheLookupRequest = z.infer<typeof cacheLookupRequestSchema>;
export type CacheLookupResponse = z.infer<typeof cacheLookupResponseSchema>;
export type CacheSaveRequest = z.infer<typeof cacheSaveRequestSchema>;
export type TransformPlanRequest = z.infer<typeof transformPlanRequestSchema>;
export type TransformPlanResponse = z.infer<typeof transformPlanResponseSchema>;
export type FeedbackEvent = z.infer<typeof feedbackEventSchema>;
export type Diagnostics = z.infer<typeof diagnosticsSchema>;
