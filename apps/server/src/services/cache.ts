import { and, desc, eq } from "drizzle-orm";

import {
  cacheLookupResponseSchema,
  cacheSaveRequestSchema,
  type CacheLookupRequest,
  type CacheSaveRequest
} from "@morph-ui/shared";
import { createCacheKey, determineCacheMatch, scoreFingerprintSimilarity } from "@morph-ui/cache";

import { db } from "../db/client";
import { pageCache } from "../db/schema";

export async function lookupRemoteCache(userId: string, input: CacheLookupRequest) {
  const parsed = input;

  const candidate = await db.query.pageCache.findFirst({
    where: and(
      eq(pageCache.userId, userId),
      eq(pageCache.origin, parsed.origin),
      eq(pageCache.normalizedUrl, parsed.normalizedUrl)
    ),
    orderBy: desc(pageCache.updatedAt)
  });

  if (!candidate) {
    return cacheLookupResponseSchema.parse({
      status: "miss",
      similarity: 0
    });
  }

  const similarity = scoreFingerprintSimilarity(parsed.fingerprint, {
    version: candidate.fingerprintVersion,
    normalizedUrl: candidate.normalizedUrl,
    origin: candidate.origin,
    pathSignature: candidate.pathSignature,
    hash: candidate.fingerprintHash,
    features: candidate.fingerprintFeaturesJson as CacheLookupRequest["fingerprint"]["features"]
  });

  const match = determineCacheMatch(similarity);
  if (match === "miss") {
    return cacheLookupResponseSchema.parse({
      status: "miss",
      similarity
    });
  }

  return cacheLookupResponseSchema.parse({
    status: match === "conservative" ? "stale-hit" : "hit",
    similarity,
    cacheKey: createCacheKey({
      userId,
      origin: candidate.origin,
      normalizedUrl: candidate.normalizedUrl,
      profileId: candidate.profileId,
      fingerprintVersion: candidate.fingerprintVersion,
      pathSignature: candidate.pathSignature
    }),
    plan: candidate.transformPlanJson,
    compiled: {
      version: (candidate.transformPlanJson as { version: string }).version,
      planHash: createCacheKey({
        userId,
        origin: candidate.origin,
        normalizedUrl: candidate.normalizedUrl,
        profileId: candidate.profileId,
        fingerprintVersion: candidate.fingerprintVersion,
        pathSignature: candidate.pathSignature
      }),
      compiledCssText: candidate.compiledCssText,
      compiledOperations: candidate.compiledOpsJson,
      preservedSelectors: [],
      blockedSelectors: [],
      generatedAt: candidate.updatedAt.toISOString(),
      mode: match === "conservative" ? "conservative-css-only" : "full"
    },
    revalidateAfter: new Date(candidate.updatedAt.getTime() + candidate.ttlSeconds * 250).toISOString()
  });
}

export async function saveRemoteCache(userId: string, request: CacheSaveRequest) {
  const parsed = cacheSaveRequestSchema.parse(request);
  await db.insert(pageCache).values({
    userId,
    origin: parsed.origin,
    normalizedUrl: parsed.normalizedUrl,
    pathSignature: parsed.pathSignature,
    profileId: parsed.profileId,
    fingerprintVersion: parsed.fingerprint.version,
    fingerprintHash: parsed.fingerprint.hash,
    fingerprintFeaturesJson: parsed.fingerprint.features,
    transformPlanJson: parsed.plan,
    compiledCssText: parsed.compiled.compiledCssText,
    compiledOpsJson: parsed.compiled.compiledOperations,
    confidence: parsed.confidence,
    ttlSeconds: parsed.ttlSeconds
  }).onConflictDoUpdate({
    target: [
      pageCache.userId,
      pageCache.origin,
      pageCache.normalizedUrl,
      pageCache.profileId,
      pageCache.fingerprintVersion,
      pageCache.pathSignature
    ],
    set: {
      fingerprintHash: parsed.fingerprint.hash,
      fingerprintFeaturesJson: parsed.fingerprint.features,
      transformPlanJson: parsed.plan,
      compiledCssText: parsed.compiled.compiledCssText,
      compiledOpsJson: parsed.compiled.compiledOperations,
      confidence: parsed.confidence,
      ttlSeconds: parsed.ttlSeconds,
      updatedAt: new Date(),
      lastValidatedAt: new Date()
    }
  });
}
