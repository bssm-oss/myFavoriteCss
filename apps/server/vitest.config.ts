import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@morph-ui/shared": resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@morph-ui/config": resolve(__dirname, "../../packages/config/src/index.ts"),
      "@morph-ui/cache": resolve(__dirname, "../../packages/cache/src/index.ts"),
      "@morph-ui/ai": resolve(__dirname, "../../packages/ai/src/index.ts")
    }
  }
});
