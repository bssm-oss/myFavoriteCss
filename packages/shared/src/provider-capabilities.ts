import { z } from "zod";

export const providerSchema = z.enum(["openai", "gemini"]);
export const providerModeSchema = z.enum(["user-supplied-api-key", "official-oauth", "consumer-link"]);
export const providerStatusSchema = z.enum(["available", "limited", "disabled"]);

export const providerCapabilitiesSchema = z.object({
  provider: providerSchema,
  canUseOfficialOAuth: z.boolean(),
  canUseServerOwnedApiKey: z.boolean(),
  canUseUserSuppliedApiKey: z.boolean(),
  supportsVisionInput: z.boolean(),
  supportsStructuredOutput: z.boolean(),
  supportsConsumerAccountReuse: z.boolean(),
  supportedModes: z.array(providerModeSchema),
  status: providerStatusSchema,
  limitationReason: z.string().default(""),
  updatedAt: z.string().datetime().optional()
});

export const providerLocalConfigSchema = z.object({
  provider: providerSchema,
  apiKey: z.string().min(20),
  model: z.string().min(1).max(120),
  configuredAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastValidatedAt: z.string().datetime().nullable().default(null),
  lastError: z.string().nullable().default(null)
});

export const providerConfigSummarySchema = z.object({
  provider: providerSchema,
  configured: z.boolean(),
  model: z.string().nullable(),
  maskedKey: z.string().nullable(),
  configuredAt: z.string().datetime().nullable().default(null),
  updatedAt: z.string().datetime().nullable().default(null),
  lastValidatedAt: z.string().datetime().nullable().default(null),
  lastError: z.string().nullable().default(null)
});

export type Provider = z.infer<typeof providerSchema>;
export type ProviderCapabilities = z.infer<typeof providerCapabilitiesSchema>;
export type ProviderLocalConfig = z.infer<typeof providerLocalConfigSchema>;
export type ProviderConfigSummary = z.infer<typeof providerConfigSummarySchema>;
