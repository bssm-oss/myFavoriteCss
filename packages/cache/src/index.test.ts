import { describe, expect, it } from "vitest";

import { createCacheKey, determineCacheMatch, scoreFingerprintSimilarity } from "./index";

const baseFingerprint = {
  version: "v1",
  normalizedUrl: "https://example.com/docs/api",
  origin: "https://example.com",
  pathSignature: "abcd1234",
  hash: "hash-a",
  features: {
    structuralHash: "struct-a",
    textHash: "text-a",
    landmarkSignature: ["main", "nav"],
    regionSignatures: ["article:#main", "nav:#nav"],
    interactiveDensity: 1.2,
    layoutComplexity: 0.4,
    repeatedPatternScore: 0.1
  }
};

describe("cache key", () => {
  it("is deterministic", () => {
    expect(createCacheKey({
      origin: "https://example.com",
      normalizedUrl: "https://example.com/docs/api",
      profileId: "profile-1",
      fingerprintVersion: "v1",
      pathSignature: "abcd1234"
    })).toBe(createCacheKey({
      origin: "https://example.com",
      normalizedUrl: "https://example.com/docs/api",
      profileId: "profile-1",
      fingerprintVersion: "v1",
      pathSignature: "abcd1234"
    }));
  });
});

describe("fingerprint similarity", () => {
  it("returns exact for identical hashes", () => {
    expect(scoreFingerprintSimilarity(baseFingerprint, baseFingerprint)).toBe(1);
    expect(determineCacheMatch(1)).toBe("exact");
  });

  it("downgrades partial structural drift", () => {
    const next = {
      ...baseFingerprint,
      hash: "hash-b",
      features: {
        ...baseFingerprint.features,
        textHash: "text-b",
        landmarkSignature: ["main"],
        regionSignatures: ["article:#main"]
      }
    };
    const score = scoreFingerprintSimilarity(baseFingerprint, next);
    expect(score).toBeGreaterThanOrEqual(0.72);
    expect(determineCacheMatch(score)).toBe("conservative");
  });
});
