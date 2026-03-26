import { z } from "zod";

export const pageTypeSchema = z.enum([
  "article",
  "product-list",
  "product-detail",
  "dashboard",
  "docs",
  "search-results",
  "form-heavy",
  "social-feed",
  "unknown"
]);

export const landmarkSchema = z.object({
  selector: z.string(),
  stableSelector: z.string(),
  label: z.string().optional()
});

export const selectorReferenceSchema = z.object({
  selector: z.string(),
  stableSelector: z.string(),
  textHash: z.string().optional(),
  role: z.string().optional(),
  tagName: z.string().optional(),
  fuzzyText: z.string().optional(),
  attributes: z.record(z.string()).default({})
});

export const headingSchema = z.object({
  level: z.number().int().min(1).max(6),
  text: z.string(),
  selector: z.string(),
  stableSelector: z.string()
});

export const contentBlockSchema = z.object({
  selector: z.string(),
  stableSelector: z.string(),
  kind: z.enum([
    "header",
    "navigation",
    "hero",
    "article-body",
    "card-grid",
    "table",
    "sidebar",
    "toolbar",
    "footer",
    "form",
    "unknown"
  ]),
  heading: z.string().optional(),
  textSummary: z.string().max(320),
  importanceScore: z.number().min(0).max(1),
  bounds: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
  })
});

export const candidateRegionSchema = contentBlockSchema.extend({
  role: z.string().optional(),
  tagName: z.string(),
  repeatedCount: z.number().int().min(0).default(0)
});

export const pageFingerprintFeatureSchema = z.object({
  structuralHash: z.string(),
  textHash: z.string(),
  landmarkSignature: z.array(z.string()),
  regionSignatures: z.array(z.string()),
  interactiveDensity: z.number().min(0),
  layoutComplexity: z.number().min(0).max(1),
  repeatedPatternScore: z.number().min(0).max(1)
});

export const pageFingerprintSchema = z.object({
  version: z.string(),
  normalizedUrl: z.string().url(),
  origin: z.string().url(),
  pathSignature: z.string(),
  hash: z.string(),
  features: pageFingerprintFeatureSchema
});

export const pageSummarySchema = z.object({
  url: z.string().url(),
  normalizedUrl: z.string().url(),
  origin: z.string().url(),
  path: z.string(),
  title: z.string(),
  language: z.string().default("unknown"),
  viewport: z.object({
    width: z.number().int().positive(),
    height: z.number().int().positive()
  }),
  pageType: pageTypeSchema,
  landmarks: z.object({
    header: landmarkSchema.nullable(),
    nav: landmarkSchema.nullable(),
    main: landmarkSchema.nullable(),
    aside: landmarkSchema.nullable(),
    footer: landmarkSchema.nullable()
  }),
  headings: z.array(headingSchema),
  majorContentBlocks: z.array(contentBlockSchema),
  interactiveCounts: z.object({
    links: z.number().int().min(0),
    buttons: z.number().int().min(0),
    inputs: z.number().int().min(0),
    selects: z.number().int().min(0),
    tables: z.number().int().min(0)
  }),
  formFlags: z.object({
    hasForms: z.boolean(),
    hasSensitiveFields: z.boolean(),
    hasPaymentFields: z.boolean(),
    hasLoginFields: z.boolean()
  }),
  candidateRegions: z.array(candidateRegionSchema),
  repeatedBlockDetection: z.object({
    repeatedGroups: z.array(z.object({
      signature: z.string(),
      count: z.number().int().min(2),
      selectors: z.array(z.string())
    })),
    strongestRepeatedPattern: z.string().nullable()
  }),
  sidebarDetection: z.object({
    hasLeftSidebar: z.boolean(),
    hasRightSidebar: z.boolean(),
    selectors: z.array(z.string())
  }),
  adNoiseHeuristics: z.object({
    likelyAdSelectors: z.array(z.string()),
    noiseScore: z.number().min(0).max(1)
  }),
  layoutHeuristics: z.object({
    isCardHeavy: z.boolean(),
    isListHeavy: z.boolean(),
    isTableHeavy: z.boolean(),
    topVisualBlocks: z.array(z.string()),
    domComplexityScore: z.number().min(0).max(1)
  }),
  spaHints: z.object({
    framework: z.enum(["react", "vue", "angular", "nextjs", "svelte", "unknown"]),
    routeLikeUrl: z.boolean()
  }),
  fingerprint: pageFingerprintSchema
});

export type PageType = z.infer<typeof pageTypeSchema>;
export type SelectorReference = z.infer<typeof selectorReferenceSchema>;
export type PageFingerprint = z.infer<typeof pageFingerprintSchema>;
export type PageSummary = z.infer<typeof pageSummarySchema>;
