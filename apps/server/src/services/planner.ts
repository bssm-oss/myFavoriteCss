import { createCachePolicy, compileTransformPlan } from "@morph-ui/ai";
import { transformPlanRequestSchema, transformPlanResponseSchema, type TransformPlanRequest } from "@morph-ui/shared";
import { and, eq } from "drizzle-orm";

import { db } from "../db/client";
import { profiles, transformRuns } from "../db/schema";
import { getProviderAdapter } from "../providers";
import { redactForProvider, redactUnknown } from "./redaction";

async function resolvePersistedProfileId(profileId: string, userId?: string) {
  if (!userId) {
    return null;
  }

  const [profile] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(and(eq(profiles.id, profileId), eq(profiles.userId, userId)))
    .limit(1);

  return profile?.id ?? null;
}

export async function planTransformForRequest(input: TransformPlanRequest, userId?: string) {
  const parsed = transformPlanRequestSchema.parse(input);
  if (parsed.siteSetting.privacyMode === "strict-local") {
    throw new Error("Strict local privacy mode blocks remote transform planning.");
  }

  const adapter = getProviderAdapter(parsed.provider);
  const startedAt = Date.now();
  const redacted = redactForProvider({
    profile: parsed.profile,
    siteSetting: parsed.siteSetting,
    pageSummary: parsed.pageSummary
  });

  const plan = await adapter.planTransform({
    provider: parsed.provider,
    profile: redacted.profile,
    siteSetting: redacted.siteSetting,
    pageSummary: redacted.pageSummary,
    ...(parsed.screenshot ? { screenshot: parsed.screenshot } : {}),
    ...(parsed.previousPlan ? { previousPlan: parsed.previousPlan } : {})
  });

  const compiled = compileTransformPlan(plan);
  const cachePolicy = createCachePolicy(plan);
  const persistedProfileId = await resolvePersistedProfileId(parsed.profile.id, userId);

  try {
    await db.insert(transformRuns).values({
      userId,
      provider: parsed.provider,
      origin: parsed.pageSummary.origin,
      normalizedUrl: parsed.pageSummary.normalizedUrl,
      profileId: persistedProfileId,
      cacheStatus: "planned",
      pageType: parsed.pageSummary.pageType,
      requestPayloadRedactedJson: redactUnknown(parsed),
      modelResponseJson: redactUnknown(plan),
      success: true,
      latencyMs: Date.now() - startedAt
    });
  } catch (error) {
    console.warn("Failed to record transform run", error);
  }

  return transformPlanResponseSchema.parse({
    provider: parsed.provider,
    cacheStatus: "planned",
    plan,
    compiled,
    cachePolicy
  });
}
