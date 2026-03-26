import type { PreferenceProfile, StructuredPreferences } from "@morph-ui/shared";

const TRACKING_PARAM_PATTERNS = [
  /^utm_/i,
  /^fbclid$/i,
  /^gclid$/i,
  /^mc_[a-z]+$/i,
  /^igshid$/i,
  /^ref$/i,
  /^ref_src$/i,
  /^session(id)?$/i,
  /^spm$/i,
  /^yclid$/i
] as const;

const MEANINGFUL_PARAMS = new Set([
  "q",
  "query",
  "search",
  "category",
  "tag",
  "product",
  "sku",
  "id",
  "slug",
  "page",
  "sort",
  "filter",
  "version",
  "lang"
]);

const SENSITIVE_PATH_HINTS = [
  "login",
  "signin",
  "signup",
  "checkout",
  "payment",
  "billing",
  "wallet",
  "bank",
  "mail",
  "webmail",
  "government",
  "health",
  "medical",
  "password",
  "auth",
  "oauth"
];

const SENSITIVE_HOST_HINTS = [
  "mail.google.com",
  "outlook.office.com",
  "accounts.google.com",
  "login.microsoftonline.com",
  "myaccount.google.com"
];

export interface NormalizeUrlOptions {
  preserveHash?: boolean;
  keepParams?: string[];
  dropParams?: string[];
}

export function normalizeUrl(rawUrl: string, options: NormalizeUrlOptions = {}): string {
  const url = new URL(rawUrl);
  const keepParams = new Set([...MEANINGFUL_PARAMS, ...(options.keepParams ?? [])]);
  const dropParams = new Set(options.dropParams ?? []);
  const nextParams = new URLSearchParams();

  [...url.searchParams.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, value]) => {
      const shouldDropByPattern = TRACKING_PARAM_PATTERNS.some((pattern) => pattern.test(key));
      if (dropParams.has(key) || shouldDropByPattern) {
        return;
      }

      if (keepParams.has(key)) {
        nextParams.set(key, value);
      }
    });

  url.search = nextParams.toString();
  if (!options.preserveHash) {
    url.hash = "";
  }

  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }

  return url.toString();
}

export function pathSignature(pathname: string): string {
  const normalized = pathname.replace(/\d+/g, ":n");
  let hash = 2166136261;

  for (let index = 0; index < normalized.length; index += 1) {
    hash ^= normalized.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function isSensitiveUrl(rawUrl: string): boolean {
  const url = new URL(rawUrl);
  const joined = `${url.hostname}${url.pathname}`.toLowerCase();
  return SENSITIVE_HOST_HINTS.some((host) => url.hostname === host)
    || SENSITIVE_PATH_HINTS.some((hint) => joined.includes(hint))
    || rawUrl.toLowerCase().includes("internal");
}

export function createDefaultStructuredPreferences(
  override: Partial<StructuredPreferences> = {}
): StructuredPreferences {
  return {
    density: "balanced",
    typographyScale: 1,
    contentWidth: "comfortable",
    contrastPreference: "system",
    themePreference: "system",
    hideDistractions: true,
    emphasizePrimaryContent: true,
    collapseRepetitiveChrome: true,
    preferListOverCards: false,
    preferCardsOverTables: false,
    stickySummary: false,
    stickyToc: false,
    simplifyNavigation: true,
    enlargeClickTargets: false,
    reduceAnimations: true,
    moveSecondaryContentToSide: false,
    preserveBrandIdentity: "strict",
    accessibilityPriority: "standard",
    aggressiveness: "balanced",
    ...override
  };
}

export const seededProfiles: PreferenceProfile[] = [
  {
    id: "seed-reader-focus",
    name: "Reader Focus",
    isDefault: true,
    naturalLanguageInstruction: "Center the main article, reduce visual noise, and make reading calmer without removing useful navigation.",
    structuredPreferences: createDefaultStructuredPreferences({
      density: "spacious",
      contentWidth: "narrow",
      hideDistractions: true,
      stickyToc: true,
      typographyScale: 1.08
    }),
    learnedAdjustments: []
  },
  {
    id: "seed-dense-catalog",
    name: "Dense Catalog",
    isDefault: false,
    naturalLanguageInstruction: "Show more products at once, favor list-like scanning, and compress secondary chrome.",
    structuredPreferences: createDefaultStructuredPreferences({
      density: "compact",
      preferListOverCards: true,
      collapseRepetitiveChrome: true,
      contentWidth: "wide"
    }),
    learnedAdjustments: []
  },
  {
    id: "seed-calm-dashboard",
    name: "Calm Dashboard",
    isDefault: false,
    naturalLanguageInstruction: "Reduce dashboard clutter, emphasize the key metrics, and tone down decorative cards.",
    structuredPreferences: createDefaultStructuredPreferences({
      density: "balanced",
      hideDistractions: true,
      emphasizePrimaryContent: true,
      moveSecondaryContentToSide: true,
      reduceAnimations: true
    }),
    learnedAdjustments: []
  },
  {
    id: "seed-docs-navigator",
    name: "Docs Navigator",
    isDefault: false,
    naturalLanguageInstruction: "Keep docs readable, preserve code blocks, and pin table of contents when useful.",
    structuredPreferences: createDefaultStructuredPreferences({
      stickyToc: true,
      contentWidth: "comfortable",
      density: "balanced",
      simplifyNavigation: true
    }),
    learnedAdjustments: []
  },
  {
    id: "seed-accessible-contrast",
    name: "Accessible Contrast",
    isDefault: false,
    naturalLanguageInstruction: "Increase readability, contrast, click target size, and reduce motion without breaking layout.",
    structuredPreferences: createDefaultStructuredPreferences({
      contrastPreference: "high",
      enlargeClickTargets: true,
      reduceAnimations: true,
      accessibilityPriority: "strict",
      typographyScale: 1.12
    }),
    learnedAdjustments: []
  }
];

export const sensitivePolicy = {
  hostHints: SENSITIVE_HOST_HINTS,
  pathHints: SENSITIVE_PATH_HINTS
};

export const normalizationPolicy = {
  trackingPatterns: TRACKING_PARAM_PATTERNS.map((pattern) => pattern.source),
  meaningfulParams: [...MEANINGFUL_PARAMS]
};
