import { createCompiledFallback } from "@morph-ui/cache";
import type {
  CacheLookupResponse,
  CompiledTransform,
  PageSummary,
  PreferenceProfile,
  SessionExchangeResponse,
  SiteSetting,
  SyncedSettings,
  TransformPlan,
  TransformPlanResponse
} from "@morph-ui/shared";

import { buildArtifactKey } from "../lib/cache-keys";
import type { BootstrapPayload, RuntimeMessage } from "../lib/chrome-messaging";
import { findBestArtifact, putTransformArtifact, removeArtifactsForOrigin, type TransformArtifactRecord } from "../lib/indexeddb";
import { requestOriginPermission, registerContentScriptForOrigin, unregisterContentScriptForOrigin } from "../lib/permissions";
import { shouldAllowRemotePlanning } from "../lib/privacy";
import {
  ensureSeededProfiles,
  getDiagnostics,
  getLastCacheStatus,
  getProfiles,
  getSelectedProfileByOrigin,
  getSession,
  getSiteSettings,
  getSyncedSettings,
  removeSiteSetting,
  saveProfile,
  saveSiteSetting,
  setDiagnostics,
  setLastCacheStatus,
  setSelectedProfileByOrigin,
  setSession,
  updateSyncedSettings
} from "../lib/storage";

const SERVER_ORIGIN = import.meta.env.VITE_SERVER_ORIGIN ?? "http://localhost:8787";

const pendingPreviewByTab = new Map<number, TransformArtifactRecord>();
const latestPageSummaryByTab = new Map<number, PageSummary>();
const inFlightByTab = new Map<string, Promise<TransformArtifactRecord>>();

chrome.runtime.onInstalled.addListener(() => {
  void chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true
  });
  void ensureSeededProfiles();
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    void chrome.sidePanel.open({ tabId: tab.id });
  }
});

async function getActiveTab() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });
  return tabs[0] ?? null;
}

async function ensureFreshSession(session: SessionExchangeResponse | null) {
  if (!session) {
    return null;
  }

  if (new Date(session.expiresAt).getTime() > Date.now() + 30_000) {
    return session;
  }

  const response = await fetch(`${SERVER_ORIGIN}/api/auth/session/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      refreshToken: session.refreshToken
    })
  });

  if (!response.ok) {
    await setSession(null);
    return null;
  }

  const refreshed = await response.json() as SessionExchangeResponse;
  await setSession(refreshed);
  return refreshed;
}

async function authenticatedFetch(path: string, init: RequestInit = {}) {
  const session = await ensureFreshSession(await getSession());
  if (!session) {
    throw new Error("Morph UI sign-in is required for server-assisted planning.");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.accessToken}`);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${SERVER_ORIGIN}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed for ${path}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function fetchProviderCapabilities() {
  const response = await fetch(`${SERVER_ORIGIN}/api/provider/capabilities`);
  if (!response.ok) {
    return [];
  }
  return response.json();
}

async function sendAnalyzeMessage(tabId: number) {
  const result = await chrome.tabs.sendMessage(tabId, {
    type: "MORPH_ANALYZE_PAGE"
  }).catch(() => null) as { pageSummary: PageSummary } | null;
  return result?.pageSummary ?? latestPageSummaryByTab.get(tabId) ?? null;
}

async function getCurrentProfile(origin: string | null): Promise<PreferenceProfile> {
  const profiles = await getProfiles();
  const selected = origin ? await getSelectedProfileByOrigin(origin) : null;
  return profiles.find((profile) => profile.id === selected)
    ?? profiles.find((profile) => profile.isDefault)
    ?? profiles[0]!;
}

async function getCurrentSiteSetting(origin: string | null): Promise<SiteSetting | null> {
  if (!origin) {
    return null;
  }
  const settings = await getSiteSettings();
  return settings[origin] ?? null;
}

function createArtifactFromServer(input: {
  profileId: string;
  pageSummary: PageSummary;
  response: TransformPlanResponse;
}): TransformArtifactRecord {
  return {
    key: buildArtifactKey({
      origin: input.pageSummary.origin,
      normalizedUrl: input.pageSummary.normalizedUrl,
      profileId: input.profileId,
      fingerprint: input.pageSummary.fingerprint
    }),
    origin: input.pageSummary.origin,
    normalizedUrl: input.pageSummary.normalizedUrl,
    urlProfileKey: `${input.pageSummary.origin}|${input.pageSummary.normalizedUrl}|${input.profileId}`,
    profileId: input.profileId,
    pathSignature: input.pageSummary.fingerprint.pathSignature,
    fingerprint: input.pageSummary.fingerprint,
    plan: input.response.plan,
    compiled: input.response.compiled,
    confidence: input.response.plan.confidence,
    ttlSeconds: input.response.cachePolicy.ttlSeconds,
    validationStats: {
      lastValidatedAt: new Date().toISOString(),
      selectorMismatchRate: 0
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

async function applyArtifactToTab(tabId: number, artifact: TransformArtifactRecord, input: {
  preview: boolean;
  reason: "cache-hit" | "cache-stale-hit" | "preview" | "apply";
  toast?: string;
}) {
  await chrome.tabs.sendMessage(tabId, {
    type: "MORPH_APPLY_COMPILED",
    compiled: artifact.compiled,
    preview: input.preview,
    reason: input.reason,
    toast: input.toast
  });
  await setLastCacheStatus(tabId, input.reason);
}

async function maybeSaveRemoteCache(artifact: TransformArtifactRecord) {
  try {
    await authenticatedFetch("/api/cache/save", {
      method: "POST",
      body: JSON.stringify({
        origin: artifact.origin,
        normalizedUrl: artifact.normalizedUrl,
        pathSignature: artifact.pathSignature,
        profileId: artifact.profileId,
        fingerprint: artifact.fingerprint,
        confidence: artifact.confidence,
        ttlSeconds: artifact.ttlSeconds,
        plan: artifact.plan,
        compiled: artifact.compiled
      })
    });
  } catch {
    // Remote sync is best-effort.
  }
}

async function previewOrPlan(tabId: number, commit: boolean) {
  const pageSummary = await sendAnalyzeMessage(tabId);
  if (!pageSummary) {
    throw new Error("The current page could not be analyzed.");
  }

  latestPageSummaryByTab.set(tabId, pageSummary);
  const syncedSettings = await getSyncedSettings();
  const siteSetting = await getCurrentSiteSetting(pageSummary.origin);
  const profile = await getCurrentProfile(pageSummary.origin);

  await setSelectedProfileByOrigin(pageSummary.origin, profile.id);

  const localCandidate = await findBestArtifact({
    origin: pageSummary.origin,
    normalizedUrl: pageSummary.normalizedUrl,
    profileId: profile.id,
    fingerprint: pageSummary.fingerprint
  });

  if (localCandidate?.match === "exact" || localCandidate?.match === "auto") {
    await applyArtifactToTab(tabId, localCandidate.record, {
      preview: !commit,
      reason: "cache-hit",
      toast: "Applied from local cache"
    });
    if (commit) {
      pendingPreviewByTab.delete(tabId);
    } else {
      pendingPreviewByTab.set(tabId, localCandidate.record);
    }
    return localCandidate.record;
  }

  if (localCandidate?.match === "conservative") {
    const staleArtifact = {
      ...localCandidate.record,
      compiled: createCompiledFallback(localCandidate.record.compiled)
    };
    await applyArtifactToTab(tabId, staleArtifact, {
      preview: !commit,
      reason: "cache-stale-hit",
      toast: "Applied conservatively while revalidating"
    });
  }

  if (!shouldAllowRemotePlanning(siteSetting, syncedSettings, pageSummary.url)) {
    if (localCandidate) {
      return localCandidate.record;
    }
    throw new Error("Remote planning is disabled for this page under the current privacy mode.");
  }

  const inflightKey = `${tabId}:${pageSummary.normalizedUrl}:${profile.id}`;
  if (!inFlightByTab.has(inflightKey)) {
    inFlightByTab.set(inflightKey, (async () => {
      const remoteLookup = await authenticatedFetch("/api/cache/lookup", {
        method: "POST",
        body: JSON.stringify({
          origin: pageSummary.origin,
          normalizedUrl: pageSummary.normalizedUrl,
          pathSignature: pageSummary.fingerprint.pathSignature,
          profileId: profile.id,
          fingerprint: pageSummary.fingerprint
        })
      }) as CacheLookupResponse;

      if (remoteLookup.status === "hit" || remoteLookup.status === "stale-hit") {
        const artifact: TransformArtifactRecord = {
          key: remoteLookup.cacheKey ?? buildArtifactKey({
            origin: pageSummary.origin,
            normalizedUrl: pageSummary.normalizedUrl,
            profileId: profile.id,
            fingerprint: pageSummary.fingerprint
          }),
          origin: pageSummary.origin,
          normalizedUrl: pageSummary.normalizedUrl,
          urlProfileKey: `${pageSummary.origin}|${pageSummary.normalizedUrl}|${profile.id}`,
          profileId: profile.id,
          pathSignature: pageSummary.fingerprint.pathSignature,
          fingerprint: pageSummary.fingerprint,
          plan: remoteLookup.plan as TransformPlan,
          compiled: remoteLookup.compiled as CompiledTransform,
          confidence: (remoteLookup.plan as TransformPlan).confidence,
          ttlSeconds: 7 * 24 * 60 * 60,
          validationStats: {
            lastValidatedAt: new Date().toISOString(),
            selectorMismatchRate: 0
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await putTransformArtifact(artifact);
        return artifact;
      }

      const response = await authenticatedFetch("/api/transform/plan", {
        method: "POST",
        body: JSON.stringify({
          provider: syncedSettings.defaultProvider,
          profile,
          siteSetting: siteSetting ?? {
            origin: pageSummary.origin,
            enabled: true,
            autoApply: false,
            privacyMode: syncedSettings.privacyMode,
            allowScreenshots: syncedSettings.allowScreenshotsOnMiss,
            profileId: profile.id,
            overridePreferences: {}
          },
          pageSummary,
          fingerprint: pageSummary.fingerprint
        })
      }) as TransformPlanResponse;

      const artifact = createArtifactFromServer({
        profileId: profile.id,
        pageSummary,
        response
      });
      await putTransformArtifact(artifact);
      return artifact;
    })().finally(() => {
      inFlightByTab.delete(inflightKey);
    }));
  }

  const artifact = await inFlightByTab.get(inflightKey)!;
  await applyArtifactToTab(tabId, artifact, {
    preview: !commit,
    reason: commit ? "apply" : "preview",
    toast: commit ? "Transformation applied" : "Preview ready"
  });

  if (commit) {
    await maybeSaveRemoteCache(artifact);
    pendingPreviewByTab.delete(tabId);
  } else {
    pendingPreviewByTab.set(tabId, artifact);
  }

  return artifact;
}

async function buildBootstrap(): Promise<BootstrapPayload> {
  const tab = await getActiveTab();
  const pageSummary = tab?.id ? await sendAnalyzeMessage(tab.id) : null;
  const origin = pageSummary?.origin ?? (tab?.url ? new URL(tab.url).origin : null);
  const siteSetting = await getCurrentSiteSetting(origin);
  const profiles = await getProfiles();
  const syncedSettings = await getSyncedSettings();
  const providerCapabilities = await fetchProviderCapabilities();
  const session = await ensureFreshSession(await getSession());
  const selectedProfileId = origin ? await getSelectedProfileByOrigin(origin) : null;

  return {
    tabId: tab?.id ?? null,
    tabUrl: tab?.url ?? null,
    origin,
    pageSummary,
    cacheStatus: (await getLastCacheStatus(tab?.id ?? null)) as BootstrapPayload["cacheStatus"],
    session,
    profiles,
    selectedProfileId,
    siteSetting,
    providerCapabilities,
    syncedSettings,
    diagnostics: await getDiagnostics(tab?.id ?? null),
    previewPlan: tab?.id ? pendingPreviewByTab.get(tab.id)?.plan ?? null : null
  };
}

async function enableOrigin(origin: string) {
  const granted = await requestOriginPermission(origin);
  if (!granted) {
    throw new Error("Host permission was not granted.");
  }

  await registerContentScriptForOrigin(origin);
  const siteSetting = await saveSiteSetting({
    origin,
    enabled: true,
    autoApply: false,
    privacyMode: (await getSyncedSettings()).privacyMode,
    allowScreenshots: false,
    profileId: null,
    overridePreferences: {}
  });

  try {
    await authenticatedFetch("/api/site-settings", {
      method: "POST",
      body: JSON.stringify(siteSetting)
    });
  } catch {
    // Local-first. Remote sync is best-effort.
  }

  const tab = await getActiveTab();
  if (tab?.id) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content/content-script.js"]
    });
  }
}

async function disableOrigin(origin: string) {
  await unregisterContentScriptForOrigin(origin);
  await removeSiteSetting(origin);
}

chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  void (async () => {
    switch (message.type) {
      case "GET_BOOTSTRAP":
        sendResponse(await buildBootstrap());
        break;
      case "START_GOOGLE_SIGN_IN": {
        const verifierBytes = crypto.getRandomValues(new Uint8Array(32));
        const codeVerifier = btoa(String.fromCharCode(...verifierBytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(codeVerifier));
        const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
        const state = crypto.randomUUID();
        const extensionRedirectUri = chrome.identity.getRedirectURL("morph-ui");
        const authUrl = new URL(`${SERVER_ORIGIN}/api/auth/google/start`);
        authUrl.searchParams.set("extensionRedirectUri", extensionRedirectUri);
        authUrl.searchParams.set("state", state);
        authUrl.searchParams.set("codeChallenge", codeChallenge);
        const redirect = await chrome.identity.launchWebAuthFlow({
          url: authUrl.toString(),
          interactive: true
        });
        if (!redirect) {
          throw new Error("Sign-in was cancelled.");
        }
        const redirectUrl = new URL(redirect);
        const exchangeCode = redirectUrl.searchParams.get("code");
        if (!exchangeCode) {
          throw new Error("Missing exchange code from auth redirect.");
        }
        const session = await fetch(`${SERVER_ORIGIN}/api/auth/session/exchange`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            exchangeCode,
            codeVerifier
          })
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Session exchange failed.");
          }
          return response.json();
        }) as SessionExchangeResponse;
        await setSession(session);
        sendResponse(session);
        break;
      }
      case "SAVE_PROFILE": {
        const profiles = await saveProfile(message.profile);
        try {
          await authenticatedFetch("/api/profiles", {
            method: "POST",
            body: JSON.stringify(message.profile)
          });
        } catch {
          // Local-first mode.
        }
        sendResponse(profiles);
        break;
      }
      case "UPSERT_SITE_SETTING": {
        const siteSetting = await saveSiteSetting(message.siteSetting);
        try {
          await authenticatedFetch("/api/site-settings", {
            method: "POST",
            body: JSON.stringify(siteSetting)
          });
        } catch {
          // Local-first mode.
        }
        sendResponse(siteSetting);
        break;
      }
      case "UPDATE_SYNCED_SETTINGS":
        sendResponse(await updateSyncedSettings(message.settings));
        break;
      case "ENABLE_SITE":
        await enableOrigin(message.origin);
        sendResponse({ ok: true });
        break;
      case "DISABLE_SITE":
        await disableOrigin(message.origin);
        sendResponse({ ok: true });
        break;
      case "PREVIEW_TRANSFORM": {
        const tabId = message.tabId ?? (await getActiveTab())?.id;
        if (!tabId) {
          throw new Error("No active tab available.");
        }
        sendResponse(await previewOrPlan(tabId, false));
        break;
      }
      case "APPLY_TRANSFORM": {
        const tabId = message.tabId ?? (await getActiveTab())?.id;
        if (!tabId) {
          throw new Error("No active tab available.");
        }
        const artifact = pendingPreviewByTab.get(tabId) ?? await previewOrPlan(tabId, true);
        await applyArtifactToTab(tabId, artifact, {
          preview: false,
          reason: "apply",
          toast: "Transformation applied"
        });
        await maybeSaveRemoteCache(artifact);
        pendingPreviewByTab.delete(tabId);
        sendResponse(artifact);
        break;
      }
      case "UNDO_TRANSFORM": {
        const tabId = message.tabId ?? (await getActiveTab())?.id;
        if (!tabId) {
          throw new Error("No active tab available.");
        }
        await chrome.tabs.sendMessage(tabId, { type: "MORPH_UNDO_TRANSFORM" });
        await setLastCacheStatus(tabId, "none");
        sendResponse({ ok: true });
        break;
      }
      case "RESET_SITE": {
        const tabId = message.tabId ?? (await getActiveTab())?.id;
        if (tabId) {
          await chrome.tabs.sendMessage(tabId, { type: "MORPH_RESET_SITE" }).catch(() => null);
        }
        await removeArtifactsForOrigin(message.origin);
        await removeSiteSetting(message.origin);
        sendResponse({ ok: true });
        break;
      }
      case "TOGGLE_AUTO_APPLY": {
        const siteSetting = await getCurrentSiteSetting(message.origin);
        if (!siteSetting) {
          throw new Error("Site must be enabled before auto-apply can be toggled.");
        }
        const next = await saveSiteSetting({
          ...siteSetting,
          autoApply: message.autoApply
        });
        sendResponse(next);
        break;
      }
      case "PAGE_READY": {
        const tabId = sender.tab?.id ?? message.tabId;
        if (!tabId || tabId < 0) {
          sendResponse({ ok: true });
          break;
        }

        latestPageSummaryByTab.set(tabId, message.pageSummary);
        const siteSetting = await getCurrentSiteSetting(message.pageSummary.origin);
        if (!siteSetting?.enabled) {
          sendResponse({ ok: true });
          break;
        }

        const profile = await getCurrentProfile(message.pageSummary.origin);
        await setSelectedProfileByOrigin(message.pageSummary.origin, profile.id);
        const localCandidate = await findBestArtifact({
          origin: message.pageSummary.origin,
          normalizedUrl: message.pageSummary.normalizedUrl,
          profileId: profile.id,
          fingerprint: message.pageSummary.fingerprint
        });

        if (localCandidate && siteSetting.autoApply) {
          const artifact = localCandidate.match === "conservative"
            ? { ...localCandidate.record, compiled: createCompiledFallback(localCandidate.record.compiled) }
            : localCandidate.record;
          await applyArtifactToTab(tabId, artifact, {
            preview: false,
            reason: localCandidate.match === "conservative" ? "cache-stale-hit" : "cache-hit",
            toast: localCandidate.match === "conservative" ? "Applied from stale cache" : "Applied from cache"
          });
        }

        await setDiagnostics(tabId, {
          lastCacheStatus: (localCandidate?.match === "conservative" ? "stale-hit" : localCandidate ? "hit" : "miss"),
          lastProviderError: null,
          selectorMismatchRate: localCandidate?.record.validationStats.selectorMismatchRate ?? 0,
          contentAnalysisMs: 0,
          planLatencyMs: 0
        });
        sendResponse({ ok: true });
        break;
      }
      case "INSPECT_CACHE": {
        const tabId = message.tabId ?? (await getActiveTab())?.id ?? null;
        sendResponse({
          cacheStatus: await getLastCacheStatus(tabId),
          diagnostics: await getDiagnostics(tabId)
        });
        break;
      }
      case "OPEN_SIDE_PANEL": {
        const tab = await getActiveTab();
        if (tab?.id) {
          await chrome.sidePanel.open({ tabId: tab.id });
        }
        sendResponse({ ok: true });
        break;
      }
      case "QUICK_APPLY": {
        const tab = await getActiveTab();
        if (!tab?.id) {
          throw new Error("No active tab available.");
        }
        sendResponse(await previewOrPlan(tab.id, true));
        break;
      }
      case "QUICK_UNDO": {
        const tab = await getActiveTab();
        if (!tab?.id) {
          throw new Error("No active tab available.");
        }
        await chrome.tabs.sendMessage(tab.id, { type: "MORPH_UNDO_TRANSFORM" });
        sendResponse({ ok: true });
        break;
      }
      default:
        sendResponse({ error: "Unknown message type." });
    }
  })().catch((error) => {
    sendResponse({
      error: error instanceof Error ? error.message : "Unknown extension error."
    });
  });

  return true;
});
