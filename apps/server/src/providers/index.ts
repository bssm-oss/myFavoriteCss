import type { Provider } from "@morph-ui/shared";

import { GeminiProviderAdapter } from "./gemini";
import { OpenAIProviderAdapter } from "./openai";

const providers = {
  openai: new OpenAIProviderAdapter(),
  gemini: new GeminiProviderAdapter()
};

export function getProviderAdapter(provider: Provider) {
  return providers[provider];
}

export function listProviderAdapters() {
  return Object.values(providers);
}
