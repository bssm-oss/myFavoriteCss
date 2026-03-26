import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_ORIGIN: z.string().url(),
  WEB_ORIGIN: z.string().url(),
  DATABASE_URL: z.string().min(1),
  TEST_DATABASE_URL: z.string().optional(),
  SESSION_TOKEN_SECRET: z.string().min(24),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_OAUTH_REDIRECT_URI: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  DEFAULT_PROVIDER: z.enum(["openai", "gemini"]).default("openai"),
  ENABLE_REMOTE_CACHE: z.coerce.boolean().default(true),
  PORT: z.coerce.number().int().positive().default(8787)
});

export const env = envSchema.parse(process.env);
export type AppEnv = typeof env;
