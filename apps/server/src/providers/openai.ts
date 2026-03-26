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

const OPENAI_CAPABILITIES: ProviderCapabilities = {
  provider: "openai",
  canUseOfficialOAuth: false,
  canUseServerOwnedApiKey: true,
  supportsVisionInput: true,
  supportsStructuredOutput: true,
  supportsConsumerAccountReuse: false,
  supportedModes: ["server-owned-api"],
  status: "limited",
  limitationReason: "Morph UI uses server-owned OpenAI API credentials in v1. Consumer ChatGPT account reuse is not available in this extension flow."
};

export class OpenAIProviderAdapter implements ProviderAdapter {
  readonly provider = "openai" as const;

  capabilities(): ProviderCapabilities {
    return OPENAI_CAPABILITIES;
  }

  redactAndPrepareInput(input: PlanTransformInput) {
    return {
      prompt: buildTransformPrompt(input),
      responseSchema: createTransformResponseSchema(),
      ...(input.screenshot ? { screenshot: input.screenshot } : {})
    };
  }

  async planTransform(input: PlanTransformInput) {
    if (!env.OPENAI_API_KEY) {
      throw new ProviderCapabilityError("OPENAI_API_KEY is not configured.", "openai");
    }

    const prepared = this.redactAndPrepareInput(input);

    const payload = {
      model: env.OPENAI_MODEL,
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
        Authorization: `Bearer ${env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`OpenAI planning failed: ${response.status}`);
    }

    const body = await response.json() as {
      choices?: Array<{
        finish_reason?: string;
        message?: {
          content?: string;
          refusal?: string;
        };
      }>;
    };

    const first = body.choices?.[0];
    if (!first?.message?.content) {
      this.handleRefusal(body);
    }

    return this.mapProviderResponse(JSON.parse(first.message.content));
  }

  mapProviderResponse(payload: unknown) {
    return mapRawProviderResponse(payload);
  }

  handleRefusal(payload: unknown): never {
    throw new Error(`OpenAI did not return a usable structured response: ${JSON.stringify(payload)}`);
  }
}
