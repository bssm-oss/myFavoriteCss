import { createHash } from "node:crypto";

import {
  SAFE_CSS_PROPERTIES,
  TRANSFORM_PLAN_VERSION,
  type CompiledTransform,
  type PageSummary,
  type PreferenceProfile,
  type Provider,
  type ProviderCapabilities,
  type SiteSetting,
  type TransformPlan,
  compiledTransformSchema,
  transformPlanSchema
} from "@morph-ui/shared";

import { recommendedTtlForPageType } from "@morph-ui/cache";

const SAFE_CSS_SET = new Set<string>(SAFE_CSS_PROPERTIES);

function normalizeCssPropertyName(property: string) {
  return property.includes("-")
    ? property.toLowerCase()
    : property.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}

export interface ScreenshotPayload {
  mimeType: string;
  base64: string;
}

export interface PlanTransformInput {
  provider: Provider;
  profile: PreferenceProfile;
  siteSetting: SiteSetting;
  pageSummary: PageSummary;
  screenshot?: ScreenshotPayload;
  previousPlan?: TransformPlan;
}

export interface ProviderPreparedInput {
  prompt: string;
  responseSchema: object;
  screenshot?: ScreenshotPayload;
}

export interface ProviderAdapter {
  readonly provider: Provider;
  capabilities(): ProviderCapabilities;
  redactAndPrepareInput(input: PlanTransformInput): ProviderPreparedInput;
  planTransform(input: PlanTransformInput): Promise<TransformPlan>;
  mapProviderResponse(payload: unknown): TransformPlan;
  handleRefusal(payload: unknown): never;
}

export class ProviderCapabilityError extends Error {
  constructor(
    message: string,
    public readonly provider: Provider
  ) {
    super(message);
    this.name = "ProviderCapabilityError";
  }
}

export function buildTransformPrompt(input: PlanTransformInput): string {
  const { profile, siteSetting, pageSummary, previousPlan } = input;
  const learnedAdjustments = profile.learnedAdjustments.map((entry) => ({
    adjustment: entry.adjustment,
    weight: entry.weight
  }));

  return [
    "You are Morph UI, a browser-extension transformation planner.",
    "Return JSON only. Do not include markdown. Do not include prose outside the schema.",
    "Never generate scripts, HTML snippets, or arbitrary CSS text. Use safe selectors and allowlisted declaration maps only.",
    "Prefer CSS-only changes first. Prefer reversible wrappers and order changes over destructive edits.",
    "Do not hide auth, consent, payment, checkout, submit, or security controls without requiresUserConfirmation=true.",
    "Do not move inputs outside their forms.",
    "Do not modify scripts, styles, canvases, or iframes.",
    `Profile: ${JSON.stringify(profile)}`,
    `Site setting: ${JSON.stringify(siteSetting)}`,
    `Page summary: ${JSON.stringify(pageSummary)}`,
    `Learned adjustments: ${JSON.stringify(learnedAdjustments)}`,
    `Previous accepted plan: ${JSON.stringify(previousPlan ?? null)}`,
    `Plan version: ${TRANSFORM_PLAN_VERSION}`
  ].join("\n");
}

export function createTransformResponseSchema(): object {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      version: { type: "string" },
      pageIntent: { type: "string" },
      summary: { type: "string" },
      confidence: { type: "number" },
      reasoningSummaryForUser: { type: "string" },
      themeTokens: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            key: { type: "string" },
            value: { type: "string" }
          },
          required: ["key", "value"]
        }
      },
      globalCssRules: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            selector: { type: "string" },
            declarations: { type: "object" },
            media: { type: "string", enum: ["all", "narrow", "wide"] },
            priority: { type: "number" }
          },
          required: ["selector", "declarations", "media", "priority"]
        }
      },
      nodeOperations: { type: "array", items: { type: "object" } },
      overlays: { type: "array", items: { type: "object" } },
      preservedSelectors: { type: "array", items: { type: "string" } },
      blockedSelectors: { type: "array", items: { type: "string" } },
      accessibilityNotes: { type: "array", items: { type: "object" } },
      safetyFlags: { type: "object" },
      requiresUserConfirmation: { type: "boolean" },
      cacheHints: { type: "object" },
      rollbackPlanMetadata: { type: "object" }
    },
    required: [
      "version",
      "pageIntent",
      "summary",
      "confidence",
      "reasoningSummaryForUser",
      "themeTokens",
      "globalCssRules",
      "nodeOperations",
      "overlays",
      "preservedSelectors",
      "blockedSelectors",
      "accessibilityNotes",
      "safetyFlags",
      "requiresUserConfirmation",
      "cacheHints",
      "rollbackPlanMetadata"
    ]
  };
}

export function mapRawProviderResponse(payload: unknown): TransformPlan {
  return transformPlanSchema.parse(payload);
}

export function compileTransformPlan(
  plan: TransformPlan,
  mode: "full" | "conservative-css-only" = "full"
): CompiledTransform {
  const validated = transformPlanSchema.parse(plan);
  const safeRules = validated.globalCssRules.map((rule) => ({
    ...rule,
    declarations: Object.fromEntries(
      Object.entries(rule.declarations)
        .map(([property, value]) => [normalizeCssPropertyName(property), value] as const)
        .filter(([property]) => SAFE_CSS_SET.has(property))
    )
  })).filter((rule) => Object.keys(rule.declarations).length > 0);

  const cssText = safeRules
    .sort((left, right) => left.priority - right.priority)
    .map((rule) => {
      const body = Object.entries(rule.declarations)
        .map(([property, value]) => `${property}: ${String(value)};`)
        .join(" ");
      const wrapped = `.morph-ui-scope ${rule.selector} { ${body} }`;
      if (rule.media === "narrow") {
        return `@media (max-width: 767px) { ${wrapped} }`;
      }
      if (rule.media === "wide") {
        return `@media (min-width: 1024px) { ${wrapped} }`;
      }
      return wrapped;
    })
    .join("\n");

  const compiled = {
    version: validated.version,
    planHash: createHash("sha256").update(JSON.stringify(validated)).digest("hex"),
    compiledCssText: [
      ".morph-ui-scope { --morph-ui-outline-color: #0f5fff; }",
      ".morph-ui-scope :focus-visible { outline: 2px solid var(--morph-ui-outline-color); outline-offset: 2px; }",
      cssText
    ].join("\n"),
    compiledOperations: mode === "conservative-css-only"
      ? []
      : validated.nodeOperations.map((operation) => ({
          id: operation.id,
          type: operation.type,
          targetSelector: operation.target.stableSelector,
          destinationSelector: operation.destination?.stableSelector,
          wrapperTag: operation.wrapperTag,
          requiresConfirmation: operation.requiresConfirmation
        })),
    preservedSelectors: validated.preservedSelectors,
    blockedSelectors: validated.blockedSelectors,
    generatedAt: new Date().toISOString(),
    mode
  } satisfies CompiledTransform;

  return compiledTransformSchema.parse(compiled);
}

export function createCachePolicy(plan: TransformPlan): {
  ttlSeconds: number;
  allowRemoteSave: boolean;
  revalidateAfterSeconds: number;
} {
  const ttlSeconds = Math.max(
    plan.cacheHints.recommendedTtlSeconds,
    recommendedTtlForPageType("unknown")
  );

  return {
    ttlSeconds,
    allowRemoteSave: true,
    revalidateAfterSeconds: Math.max(60 * 60, Math.floor(ttlSeconds / 4))
  };
}
