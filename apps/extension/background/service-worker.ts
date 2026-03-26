import {
  compileTransformPlan,
  createCachePolicy,
  getProviderAdapter,
  getDefaultProviderModel,
  listProviderCapabilities
} from "@morph-ui/ai";
import { createCompiledFallback } from "@morph-ui/cache";
import {
  structuredPreferencesSchema,
  type CompiledTransform,
  type PageSummary,
  type PreferenceProfile,
  type Provider,
  type SiteSetting,
  type TransformPlan
} from "@morph-ui/shared";

import { buildArtifactKey } from "../lib/cache-keys";
import type { BootstrapPayload, RuntimeMessage } from "../lib/chrome-messaging";
import { findBestArtifact, putTransformArtifact, removeArtifactsForOrigin, type TransformArtifactRecord } from "../lib/indexeddb";
import { requestOriginPermission, registerContentScriptForOrigin, unregisterContentScriptForOrigin } from "../lib/permissions";
import { shouldAllowProviderPlanning } from "../lib/privacy";
import {
  ensureSeededProfiles,
  getDiagnostics,
  getLastCacheStatus,
  getProfiles,
  getProviderConfig,
  getProviderConfigSummaries,
  getSelectedProfileByOrigin,
  getSiteSettings,
  getSyncedSettings,
  removeProviderConfig,
  removeSiteSetting,
  saveProfile,
  saveProviderConfig,
  saveSiteSetting,
  setDiagnostics,
  setLastCacheStatus,
  setProviderConfigError,
  setSelectedProfileByOrigin,
  updateSyncedSettings
} from "../lib/storage";

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

async function sendAnalyzeMessage(tabId: number) {
  const result = await chrome.tabs.sendMessage(tabId, {
    type: "MORPH_ANALYZE_PAGE"
  }).catch(() => null) as { pageSummary: PageSummary } | null;
  return result?.pageSummary ?? latestPageSummaryByTab.get(tabId) ?? null;
}

function mergeProfileWithSiteSetting(profile: PreferenceProfile, siteSetting: SiteSetting | null): PreferenceProfile {
  if (!siteSetting) {
    return profile;
  }

  return {
    ...profile,
    structuredPreferences: structuredPreferencesSchema.parse({
      ...profile.structuredPreferences,
      ...siteSetting.overridePreferences
    })
  };
}

async function getCurrentProfile(origin: string | null, siteSetting: SiteSetting | null): Promise<PreferenceProfile> {
  const profiles = await getProfiles();
  const requestedProfileId = siteSetting?.profileId ?? (origin ? await getSelectedProfileByOrigin(origin) : null);
  const selected = profiles.find((profile) => profile.id === requestedProfileId)
    ?? profiles.find((profile) => profile.isDefault)
    ?? profiles[0]!;
  return mergeProfileWithSiteSetting(selected, siteSetting);
}

async function getCurrentSiteSetting(origin: string | null): Promise<SiteSetting | null> {
  if (!origin) {
    return null;
  }
  const settings = await getSiteSettings();
  return settings[origin] ?? null;
}

function createArtifactRecord(input: {
  profileId: string;
  pageSummary: PageSummary;
  plan: TransformPlan;
  compiled: CompiledTransform;
  ttlSeconds: number;
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
    plan: input.plan,
    compiled: input.compiled,
    confidence: input.plan.confidence,
    ttlSeconds: input.ttlSeconds,
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

async function createPlanArtifact(input: {
  provider: Provider;
  pageSummary: PageSummary;
  profile: PreferenceProfile;
  siteSetting: SiteSetting;
  previousPlan?: TransformPlan | undefined;
}): Promise<TransformArtifactRecord> {
  const providerConfig = await getProviderConfig(input.provider);
  if (!providerConfig) {
    throw new Error(`Configure ${input.provider.toUpperCase()} with an API key before planning.`);
  }

  const adapter = getProviderAdapter(input.provider);
  const plan = await adapter.planTransform({
    provider: input.provider,
    profile: input.profile,
    siteSetting: input.siteSetting,
    pageSummary: input.pageSummary,
    ...(input.previousPlan ? { previousPlan: input.previousPlan } : {})
  }, {
    apiKey: providerConfig.apiKey,
    model: providerConfig.model
  });

  await setProviderConfigError(input.provider, null);
  const cachePolicy = createCachePolicy(plan);
  const compiled = compileTransformPlan(
    plan,
    plan.safetyFlags.requiresConservativeApply ? "conservative-css-only" : "full"
  );

  return createArtifactRecord({
    profileId: input.profile.id,
    pageSummary: input.pageSummary,
    plan,
    compiled,
    ttlSeconds: cachePolicy.ttlSeconds
  });
}

async function previewOrPlan(tabId: number, commit: boolean) {
  const analysisStartedAt = Date.now();
  const pageSummary = await sendAnalyzeMessage(tabId);
  if (!pageSummary) {
    throw new Error("The current page could not be analyzed.");
  }

  latestPageSummaryByTab.set(tabId, pageSummary);
  const syncedSettings = await getSyncedSettings();
  const siteSetting = await getCurrentSiteSetting(pageSummary.origin);
  const profile = await getCurrentProfile(pageSummary.origin, siteSetting);
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

    await setDiagnostics(tabId, {
      lastCacheStatus: "hit",
      lastProviderError: null,
      selectorMismatchRate: localCandidate.record.validationStats.selectorMismatchRate,
      contentAnalysisMs: Date.now() - analysisStartedAt,
      planLatencyMs: 0
    });
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
      toast: "Applied conservatively while re-planning"
    });
  }

  if (!shouldAllowProviderPlanning(siteSetting, syncedSettings, pageSummary.url)) {
    if (localCandidate) {
      await setDiagnostics(tabId, {
        lastCacheStatus: "stale-hit",
        lastProviderError: "Strict local mode blocks provider-assisted planning on this page.",
        selectorMismatchRate: localCandidate.record.validationStats.selectorMismatchRate,
        contentAnalysisMs: Date.now() - analysisStartedAt,
        planLatencyMs: 0
      });
      return localCandidate.record;
    }
    throw new Error("Provider-assisted planning is disabled for this page under the current privacy mode.");
  }

  const inflightKey = `${tabId}:${pageSummary.normalizedUrl}:${profile.id}`;
  if (!inFlightByTab.has(inflightKey)) {
    const selectedProvider = syncedSettings.defaultProvider;
    inFlightByTab.set(inflightKey, (async () => {
      const startedAt = Date.now();
      try {
        const artifact = await createPlanArtifact({
          provider: selectedProvider,
          pageSummary,
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
          ...(localCandidate?.record.plan ? { previousPlan: localCandidate.record.plan } : {})
        });
        await putTransformArtifact(artifact);
        await setDiagnostics(tabId, {
          lastCacheStatus: "planned",
          lastProviderError: null,
          selectorMismatchRate: 0,
          contentAnalysisMs: Date.now() - analysisStartedAt,
          planLatencyMs: Date.now() - startedAt
        });
        return artifact;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown planning error.";
        await setProviderConfigError(selectedProvider, message);
        await setDiagnostics(tabId, {
          lastCacheStatus: localCandidate ? "stale-hit" : "miss",
          lastProviderError: message,
          selectorMismatchRate: localCandidate?.record.validationStats.selectorMismatchRate ?? 0,
          contentAnalysisMs: Date.now() - analysisStartedAt,
          planLatencyMs: Date.now() - startedAt
        });
        if (localCandidate) {
          return localCandidate.record;
        }
        throw error;
      }
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
  const providerCapabilities = listProviderCapabilities();
  const providerConfigs = await getProviderConfigSummaries(providerCapabilities);
  const selectedProfileId = origin ? await getSelectedProfileByOrigin(origin) : null;

  return {
    tabId: tab?.id ?? null,
    tabUrl: tab?.url ?? null,
    origin,
    pageSummary,
    cacheStatus: (await getLastCacheStatus(tab?.id ?? null)) as BootstrapPayload["cacheStatus"],
    profiles,
    selectedProfileId,
    siteSetting,
    providerCapabilities,
    providerConfigs,
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
  const syncedSettings = await getSyncedSettings();
  await saveSiteSetting({
    origin,
    enabled: true,
    autoApply: false,
    privacyMode: syncedSettings.privacyMode,
    allowScreenshots: syncedSettings.allowScreenshotsOnMiss,
    profileId: null,
    overridePreferences: {}
  });

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
      case "SAVE_PROFILE": {
        const profiles = await saveProfile(message.profile);
        sendResponse(profiles);
        break;
      }
      case "UPSERT_SITE_SETTING": {
        const siteSetting = await saveSiteSetting(message.siteSetting);
        sendResponse(siteSetting);
        break;
      }
      case "SAVE_PROVIDER_CONFIG": {
        const apiKey = message.apiKey.trim();
        const model = message.model.trim() || getDefaultProviderModel(message.provider);
        const adapter = getProviderAdapter(message.provider);
        let validation;
        try {
          validation = await adapter.validateConfig({
            apiKey,
            model
          });
        } catch (error) {
          await setProviderConfigError(
            message.provider,
            error instanceof Error ? error.message : "Provider validation failed."
          );
          throw error;
        }
        const config = await saveProviderConfig({
          provider: validation.provider,
          apiKey,
          model: validation.model,
          lastValidatedAt: validation.validatedAt,
          lastError: null
        });
        sendResponse(config);
        break;
      }
      case "CLEAR_PROVIDER_CONFIG":
        await removeProviderConfig(message.provider);
        sendResponse({ ok: true });
        break;
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

        const profile = await getCurrentProfile(message.pageSummary.origin, siteSetting);
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
