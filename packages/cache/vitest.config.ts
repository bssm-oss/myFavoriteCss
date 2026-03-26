import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@morph-ui/shared": resolve(__dirname, "../shared/src/index.ts"),
      "@morph-ui/config": resolve(__dirname, "../config/src/index.ts")
    }
  }
});
