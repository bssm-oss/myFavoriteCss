import { describe, expect, it } from "vitest";

import { isSensitiveUrl, normalizeUrl, pathSignature } from "./index";

describe("normalizeUrl", () => {
  it("strips tracking params and preserves meaningful params", () => {
    expect(
      normalizeUrl("https://example.com/search?q=chairs&utm_source=newsletter&fbclid=123")
    ).toBe("https://example.com/search?q=chairs");
  });

  it("normalizes trailing slash and preserves allowed custom params", () => {
    expect(
      normalizeUrl("https://example.com/docs/?version=2.0&keep=this", { keepParams: ["keep"] })
    ).toBe("https://example.com/docs?keep=this&version=2.0");
  });
});

describe("pathSignature", () => {
  it("masks dynamic numbers", () => {
    expect(pathSignature("/product/12345/reviews")).toBe(pathSignature("/product/67890/reviews"));
  });
});

describe("isSensitiveUrl", () => {
  it("flags auth and billing paths", () => {
    expect(isSensitiveUrl("https://example.com/account/login")).toBe(true);
    expect(isSensitiveUrl("https://example.com/blog/post")).toBe(false);
  });
});
