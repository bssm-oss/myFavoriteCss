import type { ContentMessage } from "../lib/chrome-messaging";

import { collectPageSummary } from "./page-summary";
import { applyCompiledTransform, getRuntimeStatus, undoCurrentTransform } from "./apply-transform";
import { setupMutationRuntime } from "./mutation-runtime";

async function reportPageReady() {
  const pageSummary = collectPageSummary();
  if (!chrome.runtime?.id) {
    return;
  }
  const tabId = await chrome.runtime.sendMessage({
    type: "PAGE_READY",
    tabId: -1,
    pageSummary
  }).catch(() => null);
  return tabId;
}

const mutationRuntime = setupMutationRuntime(() => {
  void reportPageReady();
});

window.addEventListener("morph-ui-refresh-style", () => {
  const runtime = getRuntimeStatus();
  if (runtime.appliedPlanHash) {
    document.documentElement.classList.add("morph-ui-scope");
  }
});

chrome.runtime.onMessage.addListener((message: ContentMessage, _sender, sendResponse) => {
  if (message.type === "MORPH_ANALYZE_PAGE") {
    sendResponse({
      pageSummary: collectPageSummary(),
      runtime: getRuntimeStatus()
    });
    return true;
  }

  if (message.type === "MORPH_APPLY_COMPILED") {
    try {
      const result = applyCompiledTransform({
        compiled: message.compiled,
        preview: message.preview,
        reason: message.reason,
        ...(message.toast ? { toast: message.toast } : {})
      });
      mutationRuntime.setCompiledTransform(message.compiled);
      sendResponse({
        ok: true,
        ...result
      });
    } catch (error) {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Unknown apply error."
      });
    }
    return true;
  }

  if (message.type === "MORPH_UNDO_TRANSFORM" || message.type === "MORPH_RESET_SITE") {
    undoCurrentTransform();
    mutationRuntime.setCompiledTransform(null);
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === "MORPH_GET_RUNTIME_STATE") {
    sendResponse(getRuntimeStatus());
    return true;
  }

  return false;
});

void reportPageReady();
