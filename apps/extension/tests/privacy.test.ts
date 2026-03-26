import { describe, expect, it } from "vitest";

import { shouldAllowRemotePlanning } from "../lib/privacy";

describe("privacy policy helpers", () => {
  it("blocks remote planning in strict-local mode", () => {
    expect(shouldAllowRemotePlanning({
      origin: "https://example.com",
      enabled: true,
      autoApply: false,
      privacyMode: "strict-local",
      allowScreenshots: false,
      profileId: null,
      overridePreferences: {}
    }, {
      defaultProvider: "openai",
      privacyMode: "local-first",
      diagnosticsEnabled: false,
      onboardingCompleted: true,
      allowToasts: true,
      allowScreenshotsOnMiss: false
    }, "https://example.com/docs")).toBe(false);
  });

  it("blocks sensitive URLs even when sync is allowed", () => {
    expect(shouldAllowRemotePlanning(null, {
      defaultProvider: "openai",
      privacyMode: "sync-enabled",
      diagnosticsEnabled: false,
      onboardingCompleted: true,
      allowToasts: true,
      allowScreenshotsOnMiss: true
    }, "https://example.com/checkout")).toBe(false);
  });
});
