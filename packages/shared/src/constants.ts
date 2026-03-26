export const MORPH_UI_SCHEMA_VERSION = "1.0.0";
export const FINGERPRINT_VERSION = "2026-03-26";
export const TRANSFORM_PLAN_VERSION = "2026-03-26";

export const CACHE_SIMILARITY_THRESHOLDS = {
  exact: 1,
  autoApply: 0.88,
  conservative: 0.72
} as const;

export const CACHE_TTL_SECONDS = {
  article: 60 * 60 * 24 * 30,
  docs: 60 * 60 * 24 * 30,
  productList: 60 * 60 * 24 * 7,
  productDetail: 60 * 60 * 24 * 7,
  dashboard: 60 * 60 * 24,
  socialFeed: 60 * 60 * 24,
  default: 60 * 60 * 24 * 7
} as const;

export const SAFE_CSS_PROPERTIES = [
  "background",
  "background-color",
  "border",
  "border-color",
  "border-radius",
  "box-shadow",
  "color",
  "display",
  "filter",
  "font-size",
  "font-weight",
  "gap",
  "grid-template-columns",
  "justify-content",
  "letter-spacing",
  "line-height",
  "margin",
  "margin-inline",
  "max-width",
  "min-height",
  "opacity",
  "outline",
  "padding",
  "padding-inline",
  "position",
  "row-gap",
  "scroll-margin-top",
  "text-align",
  "text-transform",
  "top",
  "transform",
  "transition",
  "visibility",
  "width"
] as const;

export const SUPPORTED_NODE_OPERATIONS = [
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
] as const;
