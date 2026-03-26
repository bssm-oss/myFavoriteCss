import { createCacheKey } from "@morph-ui/cache";
import type { PageFingerprint } from "@morph-ui/shared";

export function buildArtifactKey(input: {
  origin: string;
  normalizedUrl: string;
  profileId: string;
  fingerprint: PageFingerprint;
}): string {
  return createCacheKey({
    origin: input.origin,
    normalizedUrl: input.normalizedUrl,
    profileId: input.profileId,
    fingerprintVersion: input.fingerprint.version,
    pathSignature: input.fingerprint.pathSignature
  });
}

export function buildUrlProfileKey(input: {
  origin: string;
  normalizedUrl: string;
  profileId: string;
}): string {
  return `${input.origin}|${input.normalizedUrl}|${input.profileId}`;
}
