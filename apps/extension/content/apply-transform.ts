import type { CompiledTransform } from "@morph-ui/shared";

import { showPageToast } from "../lib/toasts";
import { resolveSelectorReference } from "./selector-stability";

type JournalEntry = {
  revert: () => void;
};

type RuntimeState = {
  appliedPlanHash: string | null;
  compiled: CompiledTransform | null;
  journal: JournalEntry[];
  preview: boolean;
};

declare global {
  interface Window {
    __MORPH_UI_RUNTIME__?: RuntimeState;
  }
}

function runtimeState(): RuntimeState {
  if (!window.__MORPH_UI_RUNTIME__) {
    window.__MORPH_UI_RUNTIME__ = {
      appliedPlanHash: null,
      compiled: null,
      journal: [],
      preview: false
    };
  }
  return window.__MORPH_UI_RUNTIME__;
}

function currentScope() {
  document.documentElement.classList.add("morph-ui-scope");
  return document.documentElement;
}

function upsertStyleTag(compiled: CompiledTransform) {
  const styleId = "morph-ui-style";
  let tag = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!tag) {
    tag = document.createElement("style");
    tag.id = styleId;
    document.documentElement.appendChild(tag);
  }
  tag.textContent = [
    compiled.compiledCssText,
    ".morph-ui-emphasize { box-shadow: 0 0 0 1px rgba(22, 93, 255, 0.18), 0 18px 32px rgba(12, 39, 83, 0.08); }",
    ".morph-ui-deemphasize { opacity: 0.72; }",
    ".morph-ui-compact { row-gap: 8px !important; gap: 8px !important; }",
    ".morph-ui-elevate { position: relative; z-index: 2; }"
  ].join("\n");
  return tag;
}

function isSensitiveElement(element: Element) {
  return Boolean(
    element.closest("form")
    || element.matches("input, textarea, select")
    || element.querySelector("input[type='password'], input[autocomplete='cc-number'], input[name*='token']")
  );
}

function applyOperation(compiled: CompiledTransform, index: number, journal: JournalEntry[]) {
  const operation = compiled.compiledOperations[index];
  if (!operation) {
    return false;
  }

  const target = document.querySelector(operation.targetSelector);
  if (!target) {
    return false;
  }

  if (isSensitiveElement(target) && operation.requiresConfirmation) {
    return false;
  }

  switch (operation.type) {
    case "hide": {
      const previous = (target as HTMLElement).style.display;
      (target as HTMLElement).style.display = "none";
      journal.push({ revert: () => { (target as HTMLElement).style.display = previous; } });
      return true;
    }
    case "show": {
      const previous = (target as HTMLElement).style.display;
      (target as HTMLElement).style.display = "";
      journal.push({ revert: () => { (target as HTMLElement).style.display = previous; } });
      return true;
    }
    case "moveInto":
    case "moveBefore":
    case "moveAfter": {
      const destination = operation.destinationSelector ? document.querySelector(operation.destinationSelector) : null;
      if (!destination) {
        return false;
      }
      const originalParent = target.parentElement;
      const originalNext = target.nextSibling;
      if (!originalParent) {
        return false;
      }
      if (operation.type === "moveInto") {
        destination.appendChild(target);
      } else if (operation.type === "moveBefore") {
        destination.parentElement?.insertBefore(target, destination);
      } else {
        destination.parentElement?.insertBefore(target, destination.nextSibling);
      }
      journal.push({
        revert: () => {
          originalParent.insertBefore(target, originalNext);
        }
      });
      return true;
    }
    case "wrap":
    case "group":
    case "convertToReaderBlock": {
      const wrapper = document.createElement(operation.wrapperTag ?? "section");
      wrapper.dataset.morphUiWrapper = operation.id;
      wrapper.setAttribute("aria-label", "Morph UI wrapper");
      const originalParent = target.parentElement;
      const originalNext = target.nextSibling;
      if (!originalParent) {
        return false;
      }
      originalParent.insertBefore(wrapper, target);
      wrapper.appendChild(target);
      journal.push({
        revert: () => {
          originalParent.insertBefore(target, originalNext);
          wrapper.remove();
        }
      });
      return true;
    }
    case "makeSticky": {
      const previous = (target as HTMLElement).style.cssText;
      (target as HTMLElement).style.position = "sticky";
      (target as HTMLElement).style.top = "12px";
      (target as HTMLElement).style.alignSelf = "start";
      journal.push({ revert: () => { (target as HTMLElement).style.cssText = previous; } });
      return true;
    }
    case "compressSpacing": {
      target.classList.add("morph-ui-compact");
      journal.push({ revert: () => { target.classList.remove("morph-ui-compact"); } });
      return true;
    }
    case "emphasize":
    case "elevate": {
      target.classList.add("morph-ui-emphasize", "morph-ui-elevate");
      journal.push({ revert: () => { target.classList.remove("morph-ui-emphasize", "morph-ui-elevate"); } });
      return true;
    }
    case "deEmphasize":
    case "demote": {
      target.classList.add("morph-ui-deemphasize");
      journal.push({ revert: () => { target.classList.remove("morph-ui-deemphasize"); } });
      return true;
    }
    default:
      return true;
  }
}

export function undoCurrentTransform() {
  const runtime = runtimeState();
  const journal = [...runtime.journal].reverse();
  for (const entry of journal) {
    entry.revert();
  }
  runtime.journal = [];
  runtime.compiled = null;
  runtime.appliedPlanHash = null;
  runtime.preview = false;
  document.documentElement.classList.remove("morph-ui-scope");
  document.getElementById("morph-ui-style")?.remove();
}

export function getRuntimeStatus() {
  const runtime = runtimeState();
  return {
    appliedPlanHash: runtime.appliedPlanHash,
    preview: runtime.preview
  };
}

export function applyCompiledTransform(input: {
  compiled: CompiledTransform;
  preview: boolean;
  reason: "cache-hit" | "cache-stale-hit" | "preview" | "apply";
  toast?: string;
}) {
  undoCurrentTransform();

  const runtime = runtimeState();
  const styleTag = upsertStyleTag(input.compiled);
  const journal: JournalEntry[] = [
    {
      revert: () => styleTag.remove()
    }
  ];

  currentScope();
  let mismatches = 0;
  const total = input.compiled.compiledOperations.length;

  for (let index = 0; index < total; index += 1) {
    const applied = applyOperation(input.compiled, index, journal);
    if (!applied) {
      mismatches += 1;
    }
  }

  if (total > 0 && mismatches / total > 0.35) {
    undoCurrentTransform();
    throw new Error("Too many selector mismatches. Needs re-analysis.");
  }

  runtime.journal = journal;
  runtime.compiled = input.compiled;
  runtime.appliedPlanHash = input.compiled.planHash;
  runtime.preview = input.preview;

  if (input.toast) {
    showPageToast(input.toast);
  }

  return {
    mismatches,
    total
  };
}
