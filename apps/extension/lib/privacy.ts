import { isSensitiveUrl } from "@morph-ui/config";
import type { PageSummary, SiteSetting, SyncedSettings } from "@morph-ui/shared";

export function isStrictLocal(siteSetting: SiteSetting | null, syncedSettings: SyncedSettings) {
  return (siteSetting?.privacyMode ?? syncedSettings.privacyMode) === "strict-local";
}

export function shouldAllowRemotePlanning(siteSetting: SiteSetting | null, syncedSettings: SyncedSettings, url: string) {
  return !isStrictLocal(siteSetting, syncedSettings) && !isSensitiveUrl(url);
}

export function shouldAllowScreenshot(input: {
  siteSetting: SiteSetting | null;
  syncedSettings: SyncedSettings;
  pageSummary: PageSummary;
  userRequested: boolean;
}): boolean {
  if (isSensitiveUrl(input.pageSummary.url)) {
    return false;
  }
  if ((input.siteSetting?.allowScreenshots ?? false) === false && input.syncedSettings.allowScreenshotsOnMiss === false) {
    return false;
  }
  return input.userRequested;
}
