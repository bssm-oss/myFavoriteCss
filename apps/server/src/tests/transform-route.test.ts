import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { GenericContainer } from "testcontainers";
import { Pool } from "pg";

const runIntegration = Boolean(process.env.RUN_INTEGRATION_TESTS);

describe.skipIf(!runIntegration)("POST /api/transform/plan", () => {
  let app: Awaited<ReturnType<(typeof import("../app"))["buildServer"]>>;
  let pool: Pool;
  let accessToken = "";
  let sessionModule: typeof import("../services/tokens");
  let dbModule: typeof import("../db/client");
  let schemaModule: typeof import("../db/schema");
  let container: Awaited<ReturnType<GenericContainer["start"]>>;

  beforeAll(async () => {
    container = await new GenericContainer("postgres:16-alpine")
      .withEnvironment({
        POSTGRES_USER: "morph",
        POSTGRES_PASSWORD: "morph",
        POSTGRES_DB: "morph_ui_test"
      })
      .withExposedPorts(5432)
      .start();

    const connectionString = `postgres://morph:morph@${container.getHost()}:${container.getMappedPort(5432)}/morph_ui_test`;
    process.env.NODE_ENV = "test";
    process.env.APP_ORIGIN = "http://localhost:5174";
    process.env.WEB_ORIGIN = "http://localhost:5173";
    process.env.DATABASE_URL = connectionString;
    process.env.TEST_DATABASE_URL = connectionString;
    process.env.SESSION_TOKEN_SECRET = "integration-secret-value-that-is-long-enough";
    process.env.OPENAI_API_KEY = "test-openai-key";
    process.env.OPENAI_MODEL = "gpt-4.1-mini";

    pool = new Pool({ connectionString });
    await pool.query("create extension if not exists pgcrypto;");
    await pool.query(await readFile(join(process.cwd(), "src/db/migrations/0001_init.sql"), "utf8"));

    vi.stubGlobal("fetch", vi.fn(async (input: string | URL) => {
      const url = String(input);
      if (url.includes("openai.com/v1/chat/completions")) {
        return new Response(JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  version: "2026-03-26",
                  pageIntent: "Reader focus",
                  summary: "Compress noise and center primary content",
                  confidence: 0.93,
                  reasoningSummaryForUser: "The page has a clear article region and a noisy sidebar.",
                  themeTokens: [{ key: "surface", value: "#ffffff" }],
                  globalCssRules: [{ selector: "main", declarations: { maxWidth: "760px" }, media: "all", priority: 5 }],
                  nodeOperations: [],
                  overlays: [],
                  preservedSelectors: ["form"],
                  blockedSelectors: [],
                  accessibilityNotes: [{ note: "Maintain focus order", severity: "info" }],
                  safetyFlags: {
                    touchesSensitiveRegions: false,
                    hidesCriticalControls: false,
                    modifiesForms: false,
                    requiresConservativeApply: false
                  },
                  requiresUserConfirmation: false,
                  cacheHints: {
                    recommendedTtlSeconds: 604800,
                    pageStability: "stable",
                    supportsInstantReapply: true
                  },
                  rollbackPlanMetadata: {
                    expectedMutations: 0,
                    abortIfMoreThanSelectorMismatchRate: 0.4
                  }
                })
              }
            }
          ]
        }), { status: 200 });
      }
      throw new Error(`Unexpected fetch in integration test: ${url}`);
    }));

    dbModule = await import("../db/client");
    schemaModule = await import("../db/schema");
    sessionModule = await import("../services/tokens");
    const serverModule = await import("../app");
    app = serverModule.buildServer();
    await app.ready();
  }, 120_000);

  beforeEach(async () => {
    await pool.query("truncate table feedback_events, transform_runs, page_cache, path_overrides, site_settings, profiles, sessions, auth_accounts, auth_flows, users cascade;");
    const [user] = await dbModule.db.insert(schemaModule.users).values({
      email: "integration@example.com",
      name: "Integration User",
      avatarUrl: null
    }).returning();

    if (!user) {
      throw new Error("Failed to create integration test user.");
    }

    accessToken = "access-token";
    await dbModule.db.insert(schemaModule.sessions).values({
      userId: user.id,
      accessTokenHash: sessionModule.sha256(accessToken),
      refreshTokenHash: sessionModule.sha256("refresh-token"),
      accessExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      refreshExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  });

  afterAll(async () => {
    vi.unstubAllGlobals();
    await app.close();
    await dbModule.pool.end();
    await pool.end();
    await container.stop();
  });

  it("returns a compiled provider-independent transform payload", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/transform/plan",
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      payload: {
        provider: "openai",
        profile: {
          id: crypto.randomUUID(),
          name: "Reader Focus",
          isDefault: true,
          naturalLanguageInstruction: "Make articles calmer",
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
          },
          learnedAdjustments: []
        },
        siteSetting: {
          origin: "https://example.com",
          enabled: true,
          autoApply: false,
          privacyMode: "local-first",
          allowScreenshots: false,
          profileId: null,
          overridePreferences: {}
        },
        pageSummary: {
          url: "https://example.com/docs/article",
          normalizedUrl: "https://example.com/docs/article",
          origin: "https://example.com",
          path: "/docs/article",
          title: "Article",
          language: "en",
          viewport: { width: 1280, height: 900 },
          pageType: "article",
          landmarks: {
            header: null,
            nav: null,
            main: { selector: "main", stableSelector: "main" },
            aside: null,
            footer: null
          },
          headings: [],
          majorContentBlocks: [],
          interactiveCounts: { links: 4, buttons: 2, inputs: 0, selects: 0, tables: 0 },
          formFlags: {
            hasForms: false,
            hasSensitiveFields: false,
            hasPaymentFields: false,
            hasLoginFields: false
          },
          candidateRegions: [],
          repeatedBlockDetection: { repeatedGroups: [], strongestRepeatedPattern: null },
          sidebarDetection: { hasLeftSidebar: false, hasRightSidebar: false, selectors: [] },
          adNoiseHeuristics: { likelyAdSelectors: [], noiseScore: 0.1 },
          layoutHeuristics: {
            isCardHeavy: false,
            isListHeavy: false,
            isTableHeavy: false,
            topVisualBlocks: [],
            domComplexityScore: 0.4
          },
          spaHints: { framework: "react", routeLikeUrl: false },
          fingerprint: {
            version: "2026-03-26",
            normalizedUrl: "https://example.com/docs/article",
            origin: "https://example.com",
            pathSignature: "abcd1234",
            hash: "fingerprint-hash",
            features: {
              structuralHash: "struct",
              textHash: "text",
              landmarkSignature: ["main"],
              regionSignatures: ["article:main"],
              interactiveDensity: 0.6,
              layoutComplexity: 0.4,
              repeatedPatternScore: 0.1
            }
          }
        },
        fingerprint: {
          version: "2026-03-26",
          normalizedUrl: "https://example.com/docs/article",
          origin: "https://example.com",
          pathSignature: "abcd1234",
          hash: "fingerprint-hash",
          features: {
            structuralHash: "struct",
            textHash: "text",
            landmarkSignature: ["main"],
            regionSignatures: ["article:main"],
            interactiveDensity: 0.6,
            layoutComplexity: 0.4,
            repeatedPatternScore: 0.1
          }
        }
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.provider).toBe("openai");
    expect(body.plan.pageIntent).toBe("Reader focus");
    expect(body.compiled.compiledCssText).toContain("max-width");
  });
});
