import type { PageSummary, PageType } from "@morph-ui/shared";

import { normalizePageUrl } from "../lib/normalized-url";
import { buildFingerprintFromSummary } from "./fingerprint";
import { createStableSelector } from "./selector-stability";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getVisibleCandidates() {
  const selectors = [
    "main",
    "article",
    "section",
    "aside",
    "nav",
    "header",
    "footer",
    "form",
    "table",
    "[role='region']",
    "[role='complementary']",
    "[data-testid]",
    ".card",
    ".panel"
  ];

  return Array.from(document.querySelectorAll(selectors.join(",")))
    .filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width >= 40 && rect.height >= 20;
    })
    .slice(0, 24);
}

function summarizeText(text: string) {
  return text.replace(/\s+/g, " ").trim().slice(0, 200);
}

function detectPageType(input: {
  hasForms: boolean;
  hasTable: boolean;
  repeatedCards: number;
  headings: string[];
  url: string;
}) : PageType {
  const joinedHeadings = input.headings.join(" ").toLowerCase();
  const lowerUrl = input.url.toLowerCase();

  if (input.hasForms && (/login|sign in|checkout|payment/.test(joinedHeadings) || /login|signup|checkout|payment/.test(lowerUrl))) {
    return "form-heavy";
  }
  if (/docs|documentation|guide|reference/.test(joinedHeadings) || /docs|reference/.test(lowerUrl)) {
    return "docs";
  }
  if (/article|reading|blog|news/.test(lowerUrl) || document.querySelector("article")) {
    return "article";
  }
  if (input.hasTable && /dashboard|analytics|report|overview/.test(joinedHeadings)) {
    return "dashboard";
  }
  if (input.repeatedCards >= 6) {
    return "product-list";
  }
  if (/product|pricing|buy|cart/.test(joinedHeadings) && document.querySelector("[data-product-id], [itemtype*='Product']")) {
    return "product-detail";
  }
  if (/search/.test(lowerUrl)) {
    return "search-results";
  }
  return "unknown";
}

function landmark(selector: string) {
  const element = document.querySelector(selector);
  if (!element) {
    return null;
  }
  const stable = createStableSelector(element);
  return {
    selector: stable.selector,
    stableSelector: stable.stableSelector,
    label: summarizeText((element.getAttribute("aria-label") ?? element.textContent ?? "").slice(0, 60))
  };
}

function detectRepeatedGroups(elements: Element[]) {
  const buckets = new Map<string, string[]>();

  for (const element of elements) {
    const signature = `${element.tagName.toLowerCase()}:${element.getAttribute("role") ?? ""}:${element.className}`;
    const stable = createStableSelector(element).stableSelector;
    const entry = buckets.get(signature) ?? [];
    entry.push(stable);
    buckets.set(signature, entry);
  }

  const repeatedGroups = [...buckets.entries()]
    .filter(([, selectors]) => selectors.length >= 2)
    .map(([signature, selectors]) => ({
      signature,
      count: selectors.length,
      selectors
    }));

  return {
    repeatedGroups,
    strongestRepeatedPattern: repeatedGroups[0]?.signature ?? null
  };
}

export function collectPageSummary(): PageSummary {
  const { normalizedUrl } = normalizePageUrl(window.location.href);
  const url = new URL(normalizedUrl);
  const candidateElements = getVisibleCandidates();
  const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((element) => {
    const stable = createStableSelector(element);
    return {
      level: Number(element.tagName.slice(1)),
      text: summarizeText(element.textContent ?? ""),
      selector: stable.selector,
      stableSelector: stable.stableSelector
    };
  });

  const links = document.querySelectorAll("a[href]").length;
  const buttons = document.querySelectorAll("button, [role='button']").length;
  const inputs = document.querySelectorAll("input, textarea").length;
  const selects = document.querySelectorAll("select").length;
  const tables = document.querySelectorAll("table").length;
  const forms = document.querySelectorAll("form").length;
  const sensitiveFields = document.querySelectorAll(
    "input[type='password'], input[autocomplete='cc-number'], input[name*='token'], input[type='hidden'][value]"
  ).length;

  const repeatedBlocks = detectRepeatedGroups(
    Array.from(document.querySelectorAll("article, li, [role='listitem'], .card, .product-card"))
  );

  const majorContentBlocks = candidateElements.map((element) => {
    const stable = createStableSelector(element);
    const rect = element.getBoundingClientRect();
    const lowerText = (element.textContent ?? "").toLowerCase();
    const kind: PageSummary["majorContentBlocks"][number]["kind"] = element.matches("form")
      ? "form"
      : element.matches("table")
        ? "table"
        : element.matches("aside")
          ? "sidebar"
          : element.matches("nav")
            ? "navigation"
            : element.matches("header")
              ? "header"
              : element.matches("footer")
                ? "footer"
                : /article|blog|story/.test(lowerText)
                  ? "article-body"
                  : /card|product/.test(element.className.toLowerCase())
                    ? "card-grid"
                    : "unknown";

    return {
      selector: stable.selector,
      stableSelector: stable.stableSelector,
      kind,
      heading: summarizeText(element.querySelector("h1, h2, h3")?.textContent ?? ""),
      textSummary: summarizeText(element.textContent ?? ""),
      importanceScore: clamp((rect.width * rect.height) / (window.innerWidth * window.innerHeight * 2), 0, 1),
      bounds: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
      }
    } satisfies PageSummary["majorContentBlocks"][number];
  });

  const summaryWithoutFingerprint = {
    url: window.location.href,
    normalizedUrl,
    origin: url.origin,
    path: url.pathname,
    title: document.title,
    language: document.documentElement.lang || navigator.language || "unknown",
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    pageType: detectPageType({
      hasForms: forms > 0,
      hasTable: tables > 0,
      repeatedCards: repeatedBlocks.repeatedGroups.length,
      headings: headings.map((heading) => heading.text),
      url: window.location.href
    }),
    landmarks: {
      header: landmark("header, [role='banner']"),
      nav: landmark("nav, [role='navigation']"),
      main: landmark("main, [role='main']"),
      aside: landmark("aside, [role='complementary']"),
      footer: landmark("footer, [role='contentinfo']")
    },
    headings,
    majorContentBlocks,
    interactiveCounts: {
      links,
      buttons,
      inputs,
      selects,
      tables
    },
    formFlags: {
      hasForms: forms > 0,
      hasSensitiveFields: sensitiveFields > 0,
      hasPaymentFields: document.querySelectorAll("input[autocomplete='cc-number'], input[name*='card']").length > 0,
      hasLoginFields: document.querySelectorAll("input[type='password']").length > 0
    },
    candidateRegions: majorContentBlocks.map((block) => ({
      ...block,
      role: document.querySelector(block.selector)?.getAttribute("role") ?? undefined,
      tagName: document.querySelector(block.selector)?.tagName.toLowerCase() ?? "div",
      repeatedCount: repeatedBlocks.repeatedGroups.find((group) => group.selectors.includes(block.stableSelector))?.count ?? 0
    })),
    repeatedBlockDetection: repeatedBlocks,
    sidebarDetection: {
      hasLeftSidebar: majorContentBlocks.some((block) => block.kind === "sidebar" && block.bounds.x < window.innerWidth * 0.25),
      hasRightSidebar: majorContentBlocks.some((block) => block.kind === "sidebar" && block.bounds.x > window.innerWidth * 0.65),
      selectors: majorContentBlocks.filter((block) => block.kind === "sidebar").map((block) => block.stableSelector)
    },
    adNoiseHeuristics: {
      likelyAdSelectors: Array.from(document.querySelectorAll("[class*='ad'], [id*='ad'], [data-ad], [class*='promo']"))
        .slice(0, 8)
        .map((element) => createStableSelector(element).stableSelector),
      noiseScore: clamp(
        document.querySelectorAll("[class*='ad'], [id*='ad'], [data-ad], [class*='promo']").length / 12,
        0,
        1
      )
    },
    layoutHeuristics: {
      isCardHeavy: document.querySelectorAll(".card, [class*='card']").length > 6,
      isListHeavy: document.querySelectorAll("ul li, ol li, [role='listitem']").length > 10,
      isTableHeavy: tables > 0,
      topVisualBlocks: majorContentBlocks.slice(0, 6).map((block) => block.stableSelector),
      domComplexityScore: clamp(document.querySelectorAll("*").length / 1200, 0, 1)
    },
    spaHints: {
      framework: (document.querySelector("[data-reactroot], [data-react-helmet]")
        ? "react"
        : document.querySelector("#__next")
          ? "nextjs"
          : document.querySelector("[ng-version]")
            ? "angular"
            : document.querySelector("[data-v-app]")
              ? "vue"
              : document.querySelector("[data-sveltekit]")
                ? "svelte"
                : "unknown") as PageSummary["spaHints"]["framework"],
      routeLikeUrl: Boolean(history.state)
    }
  };

  return {
    ...summaryWithoutFingerprint,
    fingerprint: buildFingerprintFromSummary(summaryWithoutFingerprint)
  };
}
