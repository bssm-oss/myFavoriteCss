import {
  ProviderCapabilityError,
  buildTransformPrompt,
  createTransformResponseSchema,
  mapRawProviderResponse,
  type PlanTransformInput,
  type ProviderAdapter
} from "@morph-ui/ai";
import { type ProviderCapabilities } from "@morph-ui/shared";

import { env } from "../env";

const GEMINI_CAPABILITIES: ProviderCapabilities = {
  provider: "gemini",
  canUseOfficialOAuth: true,
  canUseServerOwnedApiKey: true,
  supportsVisionInput: true,
  supportsStructuredOutput: true,
  supportsConsumerAccountReuse: false,
  supportedModes: ["server-owned-api", "official-oauth"],
  status: "limited",
  limitationReason: "Morph UI uses server-owned Gemini API credentials in v1. Gemini Advanced subscription reuse is not wired into this product."
};

export class GeminiProviderAdapter implements ProviderAdapter {
  readonly provider = "gemini" as const;

  capabilities(): ProviderCapabilities {
    return GEMINI_CAPABILITIES;
  }

  redactAndPrepareInput(input: PlanTransformInput) {
    return {
      prompt: buildTransformPrompt(input),
      responseSchema: createTransformResponseSchema(),
      ...(input.screenshot ? { screenshot: input.screenshot } : {})
    };
  }

  async planTransform(input: PlanTransformInput) {
    if (!env.GEMINI_API_KEY) {
      throw new ProviderCapabilityError("GEMINI_API_KEY is not configured.", "gemini");
    }

    const prepared = this.redactAndPrepareInput(input);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
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
      throw new Error(`Gemini planning failed: ${response.status}`);
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

  mapProviderResponse(payload: unknown) {
    return mapRawProviderResponse(payload);
  }

  handleRefusal(payload: unknown): never {
    throw new Error(`Gemini did not return a usable structured response: ${JSON.stringify(payload)}`);
  }
}
