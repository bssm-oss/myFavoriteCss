import { pathSignature } from "@morph-ui/config";
import { FINGERPRINT_VERSION, type PageFingerprint, type PageSummary } from "@morph-ui/shared";

function fastHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

export function buildFingerprintFromSummary(summary: Omit<PageSummary, "fingerprint">): PageFingerprint {
  const landmarkSignature = Object.values(summary.landmarks)
    .filter(Boolean)
    .map((landmark) => landmark!.stableSelector);
  const regionSignatures = summary.candidateRegions.slice(0, 12).map((region) => `${region.kind}:${region.stableSelector}`);

  const features = {
    structuralHash: fastHash([
      summary.pageType,
      ...landmarkSignature,
      ...summary.majorContentBlocks.map((block) => `${block.kind}:${block.stableSelector}`)
    ].join("|")),
    textHash: fastHash(summary.headings.map((heading) => heading.text).join("|")),
    landmarkSignature,
    regionSignatures,
    interactiveDensity: Number(
      (
        (summary.interactiveCounts.links
        + summary.interactiveCounts.buttons
        + summary.interactiveCounts.inputs) / Math.max(summary.candidateRegions.length, 1)
      ).toFixed(3)
    ),
    layoutComplexity: summary.layoutHeuristics.domComplexityScore,
    repeatedPatternScore: summary.repeatedBlockDetection.repeatedGroups.length
      ? Math.min(1, summary.repeatedBlockDetection.repeatedGroups.length / 6)
      : 0
  };

  return {
    version: FINGERPRINT_VERSION,
    normalizedUrl: summary.normalizedUrl,
    origin: summary.origin,
    pathSignature: pathSignature(new URL(summary.normalizedUrl).pathname),
    hash: fastHash(JSON.stringify(features)),
    features
  };
}
