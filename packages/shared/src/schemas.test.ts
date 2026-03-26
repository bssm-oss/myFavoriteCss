import { describe, expect, it } from "vitest";

import {
  preferenceProfileSchema,
  siteSettingSchema,
  transformPlanSchema
} from "./index";

describe("shared schemas", () => {
  it("parses a valid preference profile", () => {
    const parsed = preferenceProfileSchema.parse({
      id: "profile-1",
      name: "Reader Focus",
      isDefault: true,
      naturalLanguageInstruction: "Focus the article",
      structuredPreferences: {
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
        stickyToc: true,
        simplifyNavigation: true,
        enlargeClickTargets: false,
        reduceAnimations: true,
        moveSecondaryContentToSide: false,
        preserveBrandIdentity: "strict",
        accessibilityPriority: "standard",
        aggressiveness: "balanced"
      }
    });

    expect(parsed.structuredPreferences.stickyToc).toBe(true);
  });

  it("rejects invalid site setting origin", () => {
    expect(() => siteSettingSchema.parse({
      origin: "not-a-url",
      enabled: true,
      autoApply: false,
      privacyMode: "local-first",
      allowScreenshots: false,
      profileId: null,
      overridePreferences: {}
    })).toThrow();
  });

  it("rejects transform plans with out-of-range confidence", () => {
    expect(() => transformPlanSchema.parse({
      version: "1",
      pageIntent: "Reader mode",
      summary: "Summary",
      confidence: 1.2,
      reasoningSummaryForUser: "Reason",
      themeTokens: [],
      globalCssRules: [],
      nodeOperations: [],
      overlays: [],
      preservedSelectors: [],
      blockedSelectors: [],
      accessibilityNotes: [],
      safetyFlags: {
        touchesSensitiveRegions: false,
        hidesCriticalControls: false,
        modifiesForms: false,
        requiresConservativeApply: false
      },
      requiresUserConfirmation: false,
      cacheHints: {
        recommendedTtlSeconds: 1000,
        pageStability: "stable",
        supportsInstantReapply: true
      },
      rollbackPlanMetadata: {
        expectedMutations: 0,
        abortIfMoreThanSelectorMismatchRate: 0.3
      }
    })).toThrow();
  });
});
