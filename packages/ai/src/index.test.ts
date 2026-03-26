import { afterEach, describe, expect, it, vi } from "vitest";

import type { PageSummary, PreferenceProfile, SiteSetting, TransformPlan } from "@morph-ui/shared";

import {
  compileTransformPlan,
  getProviderAdapter,
  listProviderCapabilities
} from "./index";

const sampleProfile: PreferenceProfile = {
  id: "profile-reader",
  name: "Reader Focus",
  isDefault: true,
  naturalLanguageInstruction: "Reduce distractions and emphasize the main article.",
  structuredPreferences: {
    density: "balanced",
    typographyScale: 1.1,
    contentWidth: "comfortable",
    contrastPreference: "system",
    themePreference: "system",
    hideDistractions: true,
    emphasizePrimaryContent: true,
    collapseRepetitiveChrome: true,
    preferListOverCards: false,
    preferCardsOverTables: false,
    stickySummary: false,
    stickyToc: true,
    simplifyNavigation: true,
    enlargeClickTargets: false,
    reduceAnimations: true,
    moveSecondaryContentToSide: false,
    preserveBrandIdentity: "strict",
    accessibilityPriority: "standard",
    aggressiveness: "balanced"
  },
  learnedAdjustments: []
};

const sampleSiteSetting: SiteSetting = {
  origin: "https://example.com",
  enabled: true,
  autoApply: false,
  privacyMode: "local-first",
  allowScreenshots: false,
  profileId: "profile-reader",
  overridePreferences: {}
};

const samplePageSummary: PageSummary = {
  url: "https://example.com/articles/morph-ui",
  normalizedUrl: "https://example.com/articles/morph-ui",
  origin: "https://example.com",
  path: "/articles/morph-ui",
  title: "Morph UI article",
  language: "en",
  viewport: {
    width: 1440,
    height: 900
  },
  pageType: "article",
  landmarks: {
    header: null,
    nav: null,
    main: {
      selector: "main",
      stableSelector: "main"
    },
    aside: null,
    footer: null
  },
  headings: [
    {
      level: 1,
      text: "Morph UI article",
      selector: "h1",
      stableSelector: "h1"
    }
  ],
  majorContentBlocks: [
    {
      selector: "main",
      stableSelector: "main",
      kind: "article-body",
      textSummary: "Main article content",
      importanceScore: 0.95,
      bounds: {
        x: 0,
        y: 120,
        width: 900,
        height: 1800
      }
    }
  ],
  interactiveCounts: {
    links: 24,
    buttons: 3,
    inputs: 0,
    selects: 0,
    tables: 0
  },
  formFlags: {
    hasForms: false,
    hasSensitiveFields: false,
    hasPaymentFields: false,
    hasLoginFields: false
  },
  candidateRegions: [
    {
      selector: "main",
      stableSelector: "main",
      kind: "article-body",
      textSummary: "Main article content",
      importanceScore: 0.95,
      bounds: {
        x: 0,
        y: 120,
        width: 900,
        height: 1800
      },
      role: "main",
      tagName: "main",
      repeatedCount: 0
    }
  ],
  repeatedBlockDetection: {
    repeatedGroups: [],
    strongestRepeatedPattern: null
  },
  sidebarDetection: {
    hasLeftSidebar: false,
    hasRightSidebar: false,
    selectors: []
  },
  adNoiseHeuristics: {
    likelyAdSelectors: [],
    noiseScore: 0.05
  },
  layoutHeuristics: {
    isCardHeavy: false,
    isListHeavy: true,
    isTableHeavy: false,
    topVisualBlocks: ["main"],
    domComplexityScore: 0.35
  },
  spaHints: {
    framework: "react",
    routeLikeUrl: true
  },
  fingerprint: {
    version: "1",
    normalizedUrl: "https://example.com/articles/morph-ui",
    origin: "https://example.com",
    pathSignature: "/articles/:slug",
    hash: "hash-123",
    features: {
      structuralHash: "struct-123",
      textHash: "text-123",
      landmarkSignature: ["main"],
      regionSignatures: ["main|article-body"],
      interactiveDensity: 0.12,
      layoutComplexity: 0.35,
      repeatedPatternScore: 0.1
    }
  }
};

const samplePlan: TransformPlan = {
  version: "1",
  pageIntent: "Reader mode",
  summary: "Reduce noise around the article body.",
  confidence: 0.92,
  reasoningSummaryForUser: "This keeps the main article centered and tones down supporting chrome.",
  themeTokens: [
    { key: "content-max-width", value: "72ch" }
  ],
  globalCssRules: [
    {
      selector: "main",
      declarations: {
        maxWidth: "72ch",
        marginInline: "auto"
      },
      media: "all",
      priority: 2
    }
  ],
  nodeOperations: [],
  overlays: [],
  preservedSelectors: ["form", "[role='dialog']"],
  blockedSelectors: [],
  accessibilityNotes: [
    {
      note: "Preserve visible focus rings.",
      severity: "info"
    }
  ],
  safetyFlags: {
    touchesSensitiveRegions: false,
    hidesCriticalControls: false,
    modifiesForms: false,
    requiresConservativeApply: false
  },
  requiresUserConfirmation: false,
  cacheHints: {
    recommendedTtlSeconds: 86400,
    pageStability: "stable",
    supportsInstantReapply: true
  },
  rollbackPlanMetadata: {
    expectedMutations: 0,
    abortIfMoreThanSelectorMismatchRate: 0.25
  }
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("@morph-ui/ai", () => {
  it("advertises local user-supplied key capability", () => {
    expect(listProviderCapabilities()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          provider: "openai",
          canUseUserSuppliedApiKey: true,
          canUseServerOwnedApiKey: false
        }),
        expect.objectContaining({
          provider: "gemini",
          canUseUserSuppliedApiKey: true,
          canUseServerOwnedApiKey: false
        })
      ])
    );
  });

  it("compiles safe CSS after normalizing camelCase declarations", () => {
    const compiled = compileTransformPlan(samplePlan);

    expect(compiled.compiledCssText).toContain("max-width: 72ch;");
    expect(compiled.compiledCssText).toContain("margin-inline: auto;");
  });

  it("validates OpenAI config against chat completions structured output", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({
                ok: true,
                provider: "openai",
                model: "gpt-4.1-mini"
              })
            }
          }
        ]
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getProviderAdapter("openai").validateConfig({
      apiKey: "sk-test-openai-key-value-1234567890",
      model: "gpt-4.1-mini"
    });

    expect(result.provider).toBe("openai");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.openai.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer sk-test-openai-key-value-1234567890"
        })
      })
    );
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    const parsedBody = JSON.parse(String(request.body));
    expect(parsedBody.response_format.json_schema.name).toBe("morph_ui_provider_validation");
    expect(parsedBody.messages[1].content).toContain("provider=openai");
  });

  it("plans with Gemini using header-based API auth and JSON schema output", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify(samplePlan)
                }
              ]
            }
          }
        ]
      })
    });
    vi.stubGlobal("fetch", fetchMock);

    const plan = await getProviderAdapter("gemini").planTransform({
      provider: "gemini",
      profile: sampleProfile,
      siteSetting: sampleSiteSetting,
      pageSummary: samplePageSummary
    }, {
      apiKey: "AIzaSyGeminiTestKey1234567890abcdef",
      model: "gemini-2.5-flash"
    });

    expect(plan.summary).toBe(samplePlan.summary);
    const [requestUrl, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(requestUrl).toBe("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent");
    expect(requestInit.headers).toEqual(expect.objectContaining({
      "x-goog-api-key": "AIzaSyGeminiTestKey1234567890abcdef"
    }));
    expect(requestUrl.includes("?key=")).toBe(false);
    const parsedBody = JSON.parse(String(requestInit.body));
    expect(parsedBody.generationConfig.responseMimeType).toBe("application/json");
  });
});
