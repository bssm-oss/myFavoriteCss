import {
  CACHE_SIMILARITY_THRESHOLDS,
  CACHE_TTL_SECONDS,
  type CompiledTransform,
  type PageFingerprint,
  type PageSummary,
  type TransformPlan
} from "@morph-ui/shared";

function fastHash(value: string): string {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

export interface CacheKeyInput {
  userId?: string;
  origin: string;
  normalizedUrl: string;
  profileId: string;
  fingerprintVersion: string;
  pathSignature: string;
}

export function createCacheKey(input: CacheKeyInput): string {
  const payload = [
    input.userId ?? "anon",
    input.origin,
    input.normalizedUrl,
    input.profileId,
    input.fingerprintVersion,
    input.pathSignature
  ].join("|");

  return fastHash(payload);
}

export function hashTransformPlan(plan: TransformPlan): string {
  return fastHash(JSON.stringify(plan));
}

export function scoreFingerprintSimilarity(
  left: PageFingerprint,
  right: PageFingerprint
): number {
  if (left.version !== right.version) {
    return 0;
  }

  if (left.hash === right.hash) {
    return 1;
  }

  let score = 0;

  if (left.pathSignature === right.pathSignature) {
    score += 0.2;
  }
  if (left.features.structuralHash === right.features.structuralHash) {
    score += 0.35;
  }
  if (left.features.textHash === right.features.textHash) {
    score += 0.1;
  }

  const sharedLandmarks = left.features.landmarkSignature.filter((entry) =>
    right.features.landmarkSignature.includes(entry)
  ).length;
  const maxLandmarks = Math.max(left.features.landmarkSignature.length, right.features.landmarkSignature.length, 1);
  score += (sharedLandmarks / maxLandmarks) * 0.15;

  const sharedRegions = left.features.regionSignatures.filter((entry) =>
    right.features.regionSignatures.includes(entry)
  ).length;
  const maxRegions = Math.max(left.features.regionSignatures.length, right.features.regionSignatures.length, 1);
  score += (sharedRegions / maxRegions) * 0.2;

  const densityDelta = Math.abs(left.features.interactiveDensity - right.features.interactiveDensity);
  score += Math.max(0, 0.1 - densityDelta * 0.02);

  return Math.max(0, Math.min(1, Number(score.toFixed(3))));
}

export function determineCacheMatch(similarity: number): "exact" | "auto" | "conservative" | "miss" {
  if (similarity >= CACHE_SIMILARITY_THRESHOLDS.exact) {
    return "exact";
  }
  if (similarity >= CACHE_SIMILARITY_THRESHOLDS.autoApply) {
    return "auto";
  }
  if (similarity >= CACHE_SIMILARITY_THRESHOLDS.conservative) {
    return "conservative";
  }
  return "miss";
}

export function recommendedTtlForPageType(pageType: PageSummary["pageType"]): number {
  switch (pageType) {
    case "article":
      return CACHE_TTL_SECONDS.article;
    case "docs":
      return CACHE_TTL_SECONDS.docs;
    case "product-list":
      return CACHE_TTL_SECONDS.productList;
    case "product-detail":
      return CACHE_TTL_SECONDS.productDetail;
    case "dashboard":
      return CACHE_TTL_SECONDS.dashboard;
    case "social-feed":
      return CACHE_TTL_SECONDS.socialFeed;
    default:
      return CACHE_TTL_SECONDS.default;
  }
}

export function isTransformExpired(updatedAtIso: string, ttlSeconds: number, now = Date.now()): boolean {
  const updatedAt = new Date(updatedAtIso).getTime();
  return updatedAt + ttlSeconds * 1000 <= now;
}

export function createCompiledFallback(compiled: CompiledTransform): CompiledTransform {
  return {
    ...compiled,
    mode: "conservative-css-only",
    compiledOperations: []
  };
}
