import {
  hashTransformPlan,
  recommendedTtlForPageType
} from "@morph-ui/cache";
import { defaultProviderModels } from "@morph-ui/config";
import {
  SAFE_CSS_PROPERTIES,
  TRANSFORM_PLAN_VERSION,
  type CompiledTransform,
  type PageSummary,
  type PreferenceProfile,
  type Provider,
  type ProviderCapabilities,
  type ProviderLocalConfig,
  type SiteSetting,
  type TransformPlan,
  compiledTransformSchema,
  transformPlanSchema
} from "@morph-ui/shared";

const SAFE_CSS_SET = new Set<string>(SAFE_CSS_PROPERTIES);

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

export interface ProviderValidationResult {
  provider: Provider;
  model: string;
  validatedAt: string;
}

export interface ProviderAdapter {
  readonly provider: Provider;
  capabilities(): ProviderCapabilities;
  redactAndPrepareInput(input: PlanTransformInput): ProviderPreparedInput;
  validateConfig(config: Pick<ProviderLocalConfig, "apiKey" | "model">): Promise<ProviderValidationResult>;
  planTransform(input: PlanTransformInput, config: Pick<ProviderLocalConfig, "apiKey" | "model">): Promise<TransformPlan>;
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

const LOCAL_PROVIDER_CAPABILITIES: Record<Provider, ProviderCapabilities> = {
  openai: {
    provider: "openai",
    canUseOfficialOAuth: false,
    canUseServerOwnedApiKey: false,
    canUseUserSuppliedApiKey: true,
    supportsVisionInput: true,
    supportsStructuredOutput: true,
    supportsConsumerAccountReuse: false,
    supportedModes: ["user-supplied-api-key"],
    status: "available",
    limitationReason: "Morph UI extension-only mode uses a user-supplied OpenAI API key stored locally in chrome.storage.local. ChatGPT consumer account reuse is not supported."
  },
  gemini: {
    provider: "gemini",
    canUseOfficialOAuth: false,
    canUseServerOwnedApiKey: false,
    canUseUserSuppliedApiKey: true,
    supportsVisionInput: true,
    supportsStructuredOutput: true,
    supportsConsumerAccountReuse: false,
    supportedModes: ["user-supplied-api-key"],
    status: "available",
    limitationReason: "Morph UI extension-only mode uses a user-supplied Gemini API key stored locally in chrome.storage.local. Gemini Advanced subscription reuse is not supported."
  }
};

function normalizeCssPropertyName(property: string) {
  return property.includes("-")
    ? property.toLowerCase()
    : property.replace(/[A-Z]/g, (character) => `-${character.toLowerCase()}`);
}

export function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) {
    return "configured";
  }
  return `${apiKey.slice(0, 4)}…${apiKey.slice(-4)}`;
}

export function listProviderCapabilities(): ProviderCapabilities[] {
  return Object.values(LOCAL_PROVIDER_CAPABILITIES);
}

export function getDefaultProviderModel(provider: Provider): string {
  return defaultProviderModels[provider];
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

function createValidationResponseSchema(): object {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      ok: { type: "boolean" },
      provider: { type: "string" },
      model: { type: "string" }
    },
    required: ["ok", "provider", "model"]
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
    planHash: hashTransformPlan(validated),
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
    allowRemoteSave: false,
    revalidateAfterSeconds: Math.max(60 * 60, Math.floor(ttlSeconds / 4))
  };
}

abstract class BaseProviderAdapter implements ProviderAdapter {
  abstract readonly provider: Provider;

  capabilities(): ProviderCapabilities {
    return LOCAL_PROVIDER_CAPABILITIES[this.provider];
  }

  redactAndPrepareInput(input: PlanTransformInput): ProviderPreparedInput {
    return {
      prompt: buildTransformPrompt(input),
      responseSchema: createTransformResponseSchema(),
      ...(input.screenshot ? { screenshot: input.screenshot } : {})
    };
  }

  mapProviderResponse(payload: unknown): TransformPlan {
    return mapRawProviderResponse(payload);
  }

  handleRefusal(payload: unknown): never {
    throw new Error(`${this.provider} did not return a usable structured response: ${JSON.stringify(payload)}`);
  }

  protected createValidationPrompt(model: string) {
    return [
      "Return JSON only.",
      "Return exactly one object with ok=true, provider, and model.",
      `provider=${this.provider}`,
      `model=${model}`
    ].join("\n");
  }

  abstract validateConfig(config: Pick<ProviderLocalConfig, "apiKey" | "model">): Promise<ProviderValidationResult>;
  abstract planTransform(input: PlanTransformInput, config: Pick<ProviderLocalConfig, "apiKey" | "model">): Promise<TransformPlan>;
}

class OpenAIProviderAdapter extends BaseProviderAdapter {
  readonly provider = "openai" as const;

  async validateConfig(config: Pick<ProviderLocalConfig, "apiKey" | "model">) {
    if (!config.apiKey) {
      throw new ProviderCapabilityError("OpenAI is not configured. Add a local API key first.", "openai");
    }

    const model = config.model || getDefaultProviderModel("openai");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 32,
        messages: [
          {
            role: "system",
            content: "Return JSON only."
          },
          {
            role: "user",
            content: this.createValidationPrompt(model)
          }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "morph_ui_provider_validation",
            strict: true,
            schema: createValidationResponseSchema()
          }
        }
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI validation failed: ${response.status} ${body}`.trim());
    }

    const body = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };
    const content = body.choices?.[0]?.message?.content;
    if (!content) {
      this.handleRefusal(body);
    }

    const parsed = JSON.parse(content) as {
      ok?: boolean;
      provider?: string;
      model?: string;
    };
    if (parsed.ok !== true) {
      throw new Error("OpenAI validation failed: provider returned an unexpected validation payload.");
    }

    return {
      provider: this.provider,
      model,
      validatedAt: new Date().toISOString()
    };
  }

  async planTransform(input: PlanTransformInput, config: Pick<ProviderLocalConfig, "apiKey" | "model">) {
    if (!config.apiKey) {
      throw new ProviderCapabilityError("OpenAI is not configured. Add a local API key first.", "openai");
    }

    const prepared = this.redactAndPrepareInput(input);
    const payload = {
      model: config.model || getDefaultProviderModel("openai"),
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "Return a safe Morph UI transform plan as strict JSON. Never emit markdown."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prepared.prompt
            },
            ...(prepared.screenshot
              ? [{
                  type: "image_url",
                  image_url: {
                    url: `data:${prepared.screenshot.mimeType};base64,${prepared.screenshot.base64}`
                  }
                }]
              : [])
          ]
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "morph_ui_transform_plan",
          strict: true,
          schema: prepared.responseSchema
        }
      }
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI planning failed: ${response.status} ${body}`.trim());
    }

    const body = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const content = body.choices?.[0]?.message?.content;
    if (!content) {
      this.handleRefusal(body);
    }

    return this.mapProviderResponse(JSON.parse(content));
  }
}

class GeminiProviderAdapter extends BaseProviderAdapter {
  readonly provider = "gemini" as const;

  async validateConfig(config: Pick<ProviderLocalConfig, "apiKey" | "model">) {
    if (!config.apiKey) {
      throw new ProviderCapabilityError("Gemini is not configured. Add a local API key first.", "gemini");
    }

    const model = config.model || getDefaultProviderModel("gemini");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": config.apiKey,
          "x-goog-api-client": "morph-ui-extension/0.1.0"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: this.createValidationPrompt(model) }
              ]
            }
          ],
          generationConfig: {
            temperature: 0,
            responseMimeType: "application/json",
            responseSchema: createValidationResponseSchema()
          }
        })
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gemini validation failed: ${response.status} ${body}`.trim());
    }

    const body = await response.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };
    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      this.handleRefusal(body);
    }

    const parsed = JSON.parse(text) as {
      ok?: boolean;
      provider?: string;
      model?: string;
    };
    if (parsed.ok !== true) {
      throw new Error("Gemini validation failed: provider returned an unexpected validation payload.");
    }

    return {
      provider: this.provider,
      model,
      validatedAt: new Date().toISOString()
    };
  }

  async planTransform(input: PlanTransformInput, config: Pick<ProviderLocalConfig, "apiKey" | "model">) {
    if (!config.apiKey) {
      throw new ProviderCapabilityError("Gemini is not configured. Add a local API key first.", "gemini");
    }

    const prepared = this.redactAndPrepareInput(input);
    const model = config.model || getDefaultProviderModel("gemini");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": config.apiKey,
          "x-goog-api-client": "morph-ui-extension/0.1.0"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prepared.prompt },
                ...(prepared.screenshot
                  ? [{
                      inline_data: {
                        mime_type: prepared.screenshot.mimeType,
                        data: prepared.screenshot.base64
                      }
                    }]
                  : [])
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: prepared.responseSchema
          }
        })
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Gemini planning failed: ${response.status} ${body}`.trim());
    }

    const body = await response.json() as {
      candidates?: Array<{
        content?: {
          parts?: Array<{ text?: string }>;
        };
      }>;
    };

    const text = body.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      this.handleRefusal(body);
    }

    return this.mapProviderResponse(JSON.parse(text));
  }
}

const providerAdapters: Record<Provider, ProviderAdapter> = {
  openai: new OpenAIProviderAdapter(),
  gemini: new GeminiProviderAdapter()
};

export function getProviderAdapter(provider: Provider): ProviderAdapter {
  return providerAdapters[provider];
}
