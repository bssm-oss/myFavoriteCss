import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@morph-ui/shared": resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@morph-ui/config": resolve(__dirname, "../../packages/config/src/index.ts"),
      "@morph-ui/cache": resolve(__dirname, "../../packages/cache/src/index.ts"),
      "@morph-ui/ui": resolve(__dirname, "../../packages/ui/src/index.tsx")
    }
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/e2e.spec.ts"]
  }
});
