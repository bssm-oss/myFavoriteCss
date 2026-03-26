import type { PageSummary, PreferenceProfile, SiteSetting } from "@morph-ui/shared";

const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const CARD_PATTERN = /\b(?:\d[ -]*?){13,19}\b/g;
const SECRET_PATTERN = /\b(?:sk|pk|ghp|xox[baprs]?)-[A-Za-z0-9_\-]{8,}\b/g;
const BEARER_PATTERN = /\bBearer\s+[A-Za-z0-9._-]+\b/gi;

export function redactString(value: string): string {
  return value
    .replace(EMAIL_PATTERN, "[redacted-email]")
    .replace(CARD_PATTERN, "[redacted-card]")
    .replace(SECRET_PATTERN, "[redacted-secret]")
    .replace(BEARER_PATTERN, "Bearer [redacted-token]");
}

export function redactUnknown<T>(value: T): T {
  if (typeof value === "string") {
    return redactString(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactUnknown(item)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, redactUnknown(entry)])
    ) as T;
  }
  return value;
}

export function redactForProvider(input: {
  profile: PreferenceProfile;
  siteSetting: SiteSetting;
  pageSummary: PageSummary;
}) {
  const copy = structuredClone(input);
  copy.profile.naturalLanguageInstruction = redactString(copy.profile.naturalLanguageInstruction);
  copy.pageSummary.headings = copy.pageSummary.headings.map((heading) => ({
    ...heading,
    text: redactString(heading.text)
  }));
  copy.pageSummary.majorContentBlocks = copy.pageSummary.majorContentBlocks.map((block) => ({
    ...block,
    textSummary: redactString(block.textSummary)
  }));
  copy.pageSummary.candidateRegions = copy.pageSummary.candidateRegions.map((region) => ({
    ...region,
    textSummary: redactString(region.textSummary)
  }));
  return copy;
}
