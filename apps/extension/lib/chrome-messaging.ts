import type {
  CacheLookupResponse,
  CompiledTransform,
  Diagnostics,
  PageSummary,
  PreferenceProfile,
  ProviderCapabilities,
  SessionExchangeResponse,
  SiteSetting,
  SyncedSettings,
  TransformPlan
} from "@morph-ui/shared";

export interface BootstrapPayload {
  tabId: number | null;
  tabUrl: string | null;
  origin: string | null;
  pageSummary: PageSummary | null;
  cacheStatus: CacheLookupResponse["status"] | "none";
  session: SessionExchangeResponse | null;
  profiles: PreferenceProfile[];
  selectedProfileId: string | null;
  siteSetting: SiteSetting | null;
  providerCapabilities: ProviderCapabilities[];
  syncedSettings: SyncedSettings;
  diagnostics: Diagnostics;
  previewPlan: TransformPlan | null;
}

export type RuntimeMessage =
  | { type: "GET_BOOTSTRAP" }
  | { type: "START_GOOGLE_SIGN_IN" }
  | { type: "SAVE_PROFILE"; profile: PreferenceProfile }
  | { type: "UPSERT_SITE_SETTING"; siteSetting: SiteSetting }
  | { type: "UPDATE_SYNCED_SETTINGS"; settings: Partial<SyncedSettings> }
  | { type: "ENABLE_SITE"; origin: string }
  | { type: "DISABLE_SITE"; origin: string }
  | { type: "PREVIEW_TRANSFORM"; tabId?: number }
  | { type: "APPLY_TRANSFORM"; tabId?: number }
  | { type: "UNDO_TRANSFORM"; tabId?: number }
  | { type: "RESET_SITE"; origin: string; tabId?: number }
  | { type: "TOGGLE_AUTO_APPLY"; origin: string; autoApply: boolean }
  | { type: "PAGE_READY"; tabId: number; pageSummary: PageSummary }
  | { type: "INSPECT_CACHE"; tabId?: number }
  | { type: "OPEN_SIDE_PANEL" }
  | { type: "QUICK_APPLY" }
  | { type: "QUICK_UNDO" };

export type ContentMessage =
  | { type: "MORPH_ANALYZE_PAGE" }
  | {
      type: "MORPH_APPLY_COMPILED";
      compiled: CompiledTransform;
      preview: boolean;
      reason: "cache-hit" | "cache-stale-hit" | "preview" | "apply";
      toast?: string;
    }
  | { type: "MORPH_UNDO_TRANSFORM" }
  | { type: "MORPH_RESET_SITE" }
  | { type: "MORPH_GET_RUNTIME_STATE" };

export function sendRuntimeMessage<TResponse = unknown>(message: RuntimeMessage): Promise<TResponse> {
  return chrome.runtime.sendMessage(message) as Promise<TResponse>;
}

export function sendTabMessage<TResponse = unknown>(tabId: number, message: ContentMessage): Promise<TResponse> {
  return chrome.tabs.sendMessage(tabId, message) as Promise<TResponse>;
}
