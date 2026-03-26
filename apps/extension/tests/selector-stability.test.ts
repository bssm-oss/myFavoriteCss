// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from "vitest";

import { createStableSelector, resolveSelectorReference } from "../content/selector-stability";

beforeEach(() => {
  // @ts-expect-error jsdom does not provide CSS.escape.
  globalThis.CSS = { escape: (value: string) => value.replace(/"/g, '\\"') };
  document.body.innerHTML = `
    <main id="main">
      <button data-testid="primary-action">Apply</button>
      <button aria-label="Secondary action">Cancel</button>
    </main>
  `;
});

describe("createStableSelector", () => {
  it("prefers stable data attributes", () => {
    const button = document.querySelector("[data-testid='primary-action']")!;
    const reference = createStableSelector(button);
    expect(reference.stableSelector).toContain("[data-testid=\"primary-action\"]");
  });

  it("fuzzy-resolves when exact selector moves", () => {
    const button = document.querySelector("[aria-label='Secondary action']")!;
    const reference = createStableSelector(button);
    button.removeAttribute("aria-label");
    button.textContent = "Cancel";
    expect(resolveSelectorReference(reference)).toBe(button);
  });
});
