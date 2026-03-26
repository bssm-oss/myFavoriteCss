import { z } from "zod";

export const providerSchema = z.enum(["openai", "gemini"]);
export const providerModeSchema = z.enum(["server-owned-api", "official-oauth", "consumer-link"]);
export const providerStatusSchema = z.enum(["available", "limited", "disabled"]);

export const providerCapabilitiesSchema = z.object({
  provider: providerSchema,
  canUseOfficialOAuth: z.boolean(),
  canUseServerOwnedApiKey: z.boolean(),
  supportsVisionInput: z.boolean(),
  supportsStructuredOutput: z.boolean(),
  supportsConsumerAccountReuse: z.boolean(),
  supportedModes: z.array(providerModeSchema),
  status: providerStatusSchema,
  limitationReason: z.string().default(""),
  updatedAt: z.string().datetime().optional()
});

export type Provider = z.infer<typeof providerSchema>;
export type ProviderCapabilities = z.infer<typeof providerCapabilitiesSchema>;
