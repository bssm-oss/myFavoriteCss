import { z } from "zod";

import { selectorReferenceSchema } from "./page-summary";

export const safetyCategorySchema = z.enum([
  "cosmetic",
  "layout",
  "navigation",
  "content-emphasis",
  "reader-mode",
  "sensitive"
]);

export const themeTokenSchema = z.object({
  key: z.string(),
  value: z.string()
});

export const cssRuleSchema = z.object({
  selector: z.string(),
  declarations: z.record(z.union([z.string(), z.number()])),
  media: z.enum(["all", "narrow", "wide"]).default("all"),
  priority: z.number().int().min(0).max(10).default(5)
});

export const nodeOperationSchema = z.object({
  id: z.string(),
  type: z.enum([
    "hide",
    "show",
    "group",
    "wrap",
    "reorder",
    "moveBefore",
    "moveAfter",
    "moveInto",
    "elevate",
    "demote",
    "makeSticky",
    "convertToReaderBlock",
    "mergeRepeatedControls",
    "compressSpacing",
    "emphasize",
    "deEmphasize"
  ]),
  target: selectorReferenceSchema,
  destination: selectorReferenceSchema.optional(),
  wrapperTag: z.enum(["section", "div", "aside", "nav", "article"]).optional(),
  wrapperLabel: z.string().optional(),
  justification: z.string().min(1).max(500),
  confidence: z.number().min(0).max(1),
  reversibility: z.object({
    canUndo: z.boolean(),
    strategy: z.enum(["unwrap", "restore-display", "restore-parent", "remove-clone", "restore-order"])
  }),
  safetyCategory: safetyCategorySchema,
  requiresConfirmation: z.boolean().default(false)
});

export const overlaySchema = z.object({
  id: z.string(),
  kind: z.enum(["reader-mode-banner", "summary-chip", "toc-rail"]),
  selector: z.string(),
  label: z.string(),
  dismissible: z.boolean().default(true)
});

export const accessibilityNoteSchema = z.object({
  note: z.string(),
  severity: z.enum(["info", "warning", "critical"]).default("info")
});

export const transformPlanSchema = z.object({
  version: z.string(),
  pageIntent: z.string().min(1).max(120),
  summary: z.string().min(1).max(400),
  confidence: z.number().min(0).max(1),
  reasoningSummaryForUser: z.string().min(1).max(700),
  themeTokens: z.array(themeTokenSchema),
  globalCssRules: z.array(cssRuleSchema),
  nodeOperations: z.array(nodeOperationSchema),
  overlays: z.array(overlaySchema),
  preservedSelectors: z.array(z.string()),
  blockedSelectors: z.array(z.string()),
  accessibilityNotes: z.array(accessibilityNoteSchema),
  safetyFlags: z.object({
    touchesSensitiveRegions: z.boolean().default(false),
    hidesCriticalControls: z.boolean().default(false),
    modifiesForms: z.boolean().default(false),
    requiresConservativeApply: z.boolean().default(false)
  }),
  requiresUserConfirmation: z.boolean().default(false),
  cacheHints: z.object({
    recommendedTtlSeconds: z.number().int().positive(),
    pageStability: z.enum(["stable", "semi-stable", "dynamic"]),
    supportsInstantReapply: z.boolean()
  }),
  rollbackPlanMetadata: z.object({
    expectedMutations: z.number().int().min(0),
    abortIfMoreThanSelectorMismatchRate: z.number().min(0).max(1)
  })
});

export const compiledOperationSchema = z.object({
  id: z.string(),
  type: nodeOperationSchema.shape.type,
  targetSelector: z.string(),
  destinationSelector: z.string().optional(),
  wrapperTag: z.string().optional(),
  requiresConfirmation: z.boolean().default(false)
});

export const compiledTransformSchema = z.object({
  version: z.string(),
  planHash: z.string(),
  compiledCssText: z.string(),
  compiledOperations: z.array(compiledOperationSchema),
  preservedSelectors: z.array(z.string()),
  blockedSelectors: z.array(z.string()),
  generatedAt: z.string().datetime(),
  mode: z.enum(["full", "conservative-css-only"])
});

export type TransformPlan = z.infer<typeof transformPlanSchema>;
export type CompiledTransform = z.infer<typeof compiledTransformSchema>;
