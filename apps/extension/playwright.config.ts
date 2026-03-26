import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["e2e.spec.ts"],
  timeout: 120_000,
  use: {
    headless: true,
    baseURL: "http://127.0.0.1:4173"
  },
  webServer: {
    command: "pnpm --filter @morph-ui/web exec vite --host 127.0.0.1 --port 4173",
    port: 4173,
    reuseExistingServer: true
  }
});
