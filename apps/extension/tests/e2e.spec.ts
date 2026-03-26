import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { chromium, expect, test } from "@playwright/test";

const extensionPath = resolve(fileURLToPath(new URL("..", import.meta.url)), "dist");

test.describe.configure({ mode: "serial" });

test.skip(!existsSync(extensionPath), "Build the extension before running Playwright E2E.");

test("loads the fixture site and the extension runtime", async () => {
  const context = await chromium.launchPersistentContext("", {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });

  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/fixtures/article");
  await expect(page.locator("h1")).toContainText("Designing calmer reading experiences");
  await context.close();
});
