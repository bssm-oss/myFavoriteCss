import { z } from "zod";

export const densityPreferenceSchema = z.enum(["spacious", "balanced", "compact"]);
export const contrastPreferenceSchema = z.enum(["system", "soft", "high"]);
export const themePreferenceSchema = z.enum(["system", "light", "dark", "sepia"]);
export const contentWidthSchema = z.enum(["narrow", "comfortable", "wide", "full"]);
export const accessibilityPrioritySchema = z.enum(["standard", "high", "strict"]);
export const aggressivenessSchema = z.enum(["conservative", "balanced", "bold"]);
export const privacyModeSchema = z.enum(["strict-local", "local-first", "sync-enabled"]);

export const structuredPreferencesSchema = z.object({
  density: densityPreferenceSchema.default("balanced"),
  typographyScale: z.number().min(0.85).max(1.8).default(1),
  contentWidth: contentWidthSchema.default("comfortable"),
  contrastPreference: contrastPreferenceSchema.default("system"),
  themePreference: themePreferenceSchema.default("system"),
  hideDistractions: z.boolean().default(true),
  emphasizePrimaryContent: z.boolean().default(true),
  collapseRepetitiveChrome: z.boolean().default(true),
  preferListOverCards: z.boolean().default(false),
  preferCardsOverTables: z.boolean().default(false),
  stickySummary: z.boolean().default(false),
  stickyToc: z.boolean().default(false),
  simplifyNavigation: z.boolean().default(true),
  enlargeClickTargets: z.boolean().default(false),
  reduceAnimations: z.boolean().default(true),
  moveSecondaryContentToSide: z.boolean().default(false),
  preserveBrandIdentity: z.enum(["strict", "loose"]).default("strict"),
  accessibilityPriority: accessibilityPrioritySchema.default("standard"),
  aggressiveness: aggressivenessSchema.default("balanced")
});

export const learnedAdjustmentSchema = z.object({
  sourceEventId: z.string(),
  adjustment: z.string(),
  weight: z.number().min(-1).max(1),
  createdAt: z.string().datetime()
});

export const preferenceProfileSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  name: z.string().min(1).max(80),
  isDefault: z.boolean().default(false),
  naturalLanguageInstruction: z.string().max(4000).default(""),
  structuredPreferences: structuredPreferencesSchema,
  learnedAdjustments: z.array(learnedAdjustmentSchema).default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export const siteSettingSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  origin: z.string().url(),
  enabled: z.boolean().default(false),
  autoApply: z.boolean().default(false),
  privacyMode: privacyModeSchema.default("local-first"),
  allowScreenshots: z.boolean().default(false),
  profileId: z.string().nullable().default(null),
  overridePreferences: structuredPreferencesSchema.partial().default({}),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export const pathOverrideSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  origin: z.string().url(),
  pathPattern: z.string().min(1),
  enabled: z.boolean().default(true),
  autoApply: z.boolean().default(false),
  profileId: z.string().nullable().default(null),
  overridePreferences: structuredPreferencesSchema.partial().default({}),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
});

export type StructuredPreferences = z.infer<typeof structuredPreferencesSchema>;
export type PreferenceProfile = z.infer<typeof preferenceProfileSchema>;
export type SiteSetting = z.infer<typeof siteSettingSchema>;
export type PathOverride = z.infer<typeof pathOverrideSchema>;
export type PrivacyMode = z.infer<typeof privacyModeSchema>;
