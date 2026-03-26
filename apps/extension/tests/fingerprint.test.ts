import { describe, expect, it } from "vitest";

import { buildFingerprintFromSummary } from "../content/fingerprint";

describe("buildFingerprintFromSummary", () => {
  it("creates a versioned semantic fingerprint", () => {
    const fingerprint = buildFingerprintFromSummary({
      url: "https://example.com/docs/api",
      normalizedUrl: "https://example.com/docs/api",
      origin: "https://example.com",
      path: "/docs/api",
      title: "API docs",
      language: "en",
      viewport: { width: 1280, height: 900 },
      pageType: "docs",
      landmarks: {
        header: null,
        nav: { selector: "nav", stableSelector: "nav" },
        main: { selector: "main", stableSelector: "main" },
        aside: null,
        footer: null
      },
      headings: [],
      majorContentBlocks: [],
      interactiveCounts: { links: 10, buttons: 1, inputs: 0, selects: 0, tables: 0 },
      formFlags: {
        hasForms: false,
        hasSensitiveFields: false,
        hasPaymentFields: false,
        hasLoginFields: false
      },
      candidateRegions: [],
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
        noiseScore: 0
      },
      layoutHeuristics: {
        isCardHeavy: false,
        isListHeavy: false,
        isTableHeavy: false,
        topVisualBlocks: [],
        domComplexityScore: 0.25
      },
      spaHints: {
        framework: "react",
        routeLikeUrl: false
      }
    });

    expect(fingerprint.version).toBeTruthy();
    expect(fingerprint.features.structuralHash).toBeTruthy();
  });
});
