import { seededProfiles } from "@morph-ui/config";
import {
  diagnosticsSchema,
  preferenceProfileSchema,
  siteSettingSchema,
  syncedSettingsSchema,
  type Diagnostics,
  type PreferenceProfile,
  type SessionExchangeResponse,
  type SiteSetting,
  type SyncedSettings
} from "@morph-ui/shared";

const LOCAL_KEYS = {
  session: "authSession",
  siteSettings: "siteSettingsByOrigin",
  lastCacheStatusByTab: "lastCacheStatusByTab",
  selectedProfileByOrigin: "selectedProfileByOrigin",
  diagnosticsByTab: "diagnosticsByTab"
} as const;

const SYNC_KEYS = {
  settings: "syncedSettings",
  profiles: "profiles"
} as const;

type LocalStorageShape = {
  [LOCAL_KEYS.session]?: SessionExchangeResponse | null;
  [LOCAL_KEYS.siteSettings]?: Record<string, SiteSetting>;
  [LOCAL_KEYS.lastCacheStatusByTab]?: Record<string, string>;
  [LOCAL_KEYS.selectedProfileByOrigin]?: Record<string, string>;
  [LOCAL_KEYS.diagnosticsByTab]?: Record<string, Diagnostics>;
};

type SyncStorageShape = {
  [SYNC_KEYS.settings]?: SyncedSettings;
  [SYNC_KEYS.profiles]?: PreferenceProfile[];
};

export async function ensureSeededProfiles(): Promise<PreferenceProfile[]> {
  const existing = await chrome.storage.sync.get(SYNC_KEYS.profiles) as SyncStorageShape;
  const profiles = existing[SYNC_KEYS.profiles];
  if (profiles?.length) {
    return profiles.map((profile) => preferenceProfileSchema.parse(profile));
  }

  await chrome.storage.sync.set({
    [SYNC_KEYS.profiles]: seededProfiles
  });
  return seededProfiles;
}

export async function getProfiles(): Promise<PreferenceProfile[]> {
  return ensureSeededProfiles();
}

export async function saveProfile(profile: PreferenceProfile): Promise<PreferenceProfile[]> {
  const profiles = await ensureSeededProfiles();
  const next = [...profiles];
  const index = next.findIndex((entry) => entry.id === profile.id);
  if (index >= 0) {
    next[index] = preferenceProfileSchema.parse(profile);
  } else {
    next.push(preferenceProfileSchema.parse(profile));
  }
  await chrome.storage.sync.set({
    [SYNC_KEYS.profiles]: next
  });
  return next;
}

export async function getSyncedSettings(): Promise<SyncedSettings> {
  const value = await chrome.storage.sync.get(SYNC_KEYS.settings) as SyncStorageShape;
  const parsed = syncedSettingsSchema.safeParse(value[SYNC_KEYS.settings]);
  if (parsed.success) {
    return parsed.data;
  }
  const defaults = syncedSettingsSchema.parse({});
  await chrome.storage.sync.set({
    [SYNC_KEYS.settings]: defaults
  });
  return defaults;
}

export async function updateSyncedSettings(settings: Partial<SyncedSettings>): Promise<SyncedSettings> {
  const next = syncedSettingsSchema.parse({
    ...(await getSyncedSettings()),
    ...settings
  });
  await chrome.storage.sync.set({
    [SYNC_KEYS.settings]: next
  });
  return next;
}

export async function getSession(): Promise<SessionExchangeResponse | null> {
  const value = await chrome.storage.local.get(LOCAL_KEYS.session) as LocalStorageShape;
  return (value[LOCAL_KEYS.session] ?? null) as SessionExchangeResponse | null;
}

export async function setSession(session: SessionExchangeResponse | null) {
  await chrome.storage.local.set({
    [LOCAL_KEYS.session]: session
  });
}

export async function getSiteSettings(): Promise<Record<string, SiteSetting>> {
  const value = await chrome.storage.local.get(LOCAL_KEYS.siteSettings) as LocalStorageShape;
  const raw = value[LOCAL_KEYS.siteSettings] ?? {};
  return Object.fromEntries(
    Object.entries(raw).map(([origin, setting]) => [origin, siteSettingSchema.parse(setting)])
  );
}

export async function saveSiteSetting(siteSetting: SiteSetting) {
  const settings = await getSiteSettings();
  settings[siteSetting.origin] = siteSettingSchema.parse(siteSetting);
  await chrome.storage.local.set({
    [LOCAL_KEYS.siteSettings]: settings
  });
  return settings[siteSetting.origin];
}

export async function removeSiteSetting(origin: string) {
  const settings = await getSiteSettings();
  delete settings[origin];
  await chrome.storage.local.set({
    [LOCAL_KEYS.siteSettings]: settings
  });
}

export async function getSelectedProfileByOrigin(origin: string | null): Promise<string | null> {
  if (!origin) {
    return null;
  }
  const value = await chrome.storage.local.get(LOCAL_KEYS.selectedProfileByOrigin) as LocalStorageShape;
  return value[LOCAL_KEYS.selectedProfileByOrigin]?.[origin] ?? null;
}

export async function setSelectedProfileByOrigin(origin: string, profileId: string) {
  const value = await chrome.storage.local.get(LOCAL_KEYS.selectedProfileByOrigin) as LocalStorageShape;
  const next = {
    ...(value[LOCAL_KEYS.selectedProfileByOrigin] ?? {}),
    [origin]: profileId
  };
  await chrome.storage.local.set({
    [LOCAL_KEYS.selectedProfileByOrigin]: next
  });
}

export async function setLastCacheStatus(tabId: number, status: string) {
  const value = await chrome.storage.local.get(LOCAL_KEYS.lastCacheStatusByTab) as LocalStorageShape;
  const next = {
    ...(value[LOCAL_KEYS.lastCacheStatusByTab] ?? {}),
    [String(tabId)]: status
  };
  await chrome.storage.local.set({
    [LOCAL_KEYS.lastCacheStatusByTab]: next
  });
}

export async function getLastCacheStatus(tabId: number | null): Promise<string> {
  if (tabId === null) {
    return "none";
  }
  const value = await chrome.storage.local.get(LOCAL_KEYS.lastCacheStatusByTab) as LocalStorageShape;
  return value[LOCAL_KEYS.lastCacheStatusByTab]?.[String(tabId)] ?? "none";
}

export async function setDiagnostics(tabId: number, diagnostics: Diagnostics) {
  const value = await chrome.storage.local.get(LOCAL_KEYS.diagnosticsByTab) as LocalStorageShape;
  const next = {
    ...(value[LOCAL_KEYS.diagnosticsByTab] ?? {}),
    [String(tabId)]: diagnosticsSchema.parse(diagnostics)
  };
  await chrome.storage.local.set({
    [LOCAL_KEYS.diagnosticsByTab]: next
  });
}

export async function getDiagnostics(tabId: number | null): Promise<Diagnostics> {
  if (tabId === null) {
    return diagnosticsSchema.parse({});
  }
  const value = await chrome.storage.local.get(LOCAL_KEYS.diagnosticsByTab) as LocalStorageShape;
  return diagnosticsSchema.parse(value[LOCAL_KEYS.diagnosticsByTab]?.[String(tabId)] ?? {});
}
