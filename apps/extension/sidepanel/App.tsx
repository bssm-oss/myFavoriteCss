import { useEffect, useMemo, useState } from "react";

import type { PreferenceProfile, StructuredPreferences, SyncedSettings } from "@morph-ui/shared";
import {
  AppShell,
  Badge,
  Button,
  EmptyState,
  Field,
  InlineStat,
  KeyValueList,
  Notice,
  SectionCard,
  Select,
  TextArea,
  Toggle
} from "@morph-ui/ui";

import type { BootstrapPayload } from "../lib/chrome-messaging";
import { sendRuntimeMessage } from "../lib/chrome-messaging";

function PreferenceEditor({
  profile,
  onSave
}: {
  profile: PreferenceProfile | null;
  onSave: (profile: PreferenceProfile) => Promise<void>;
}) {
  const [draft, setDraft] = useState<PreferenceProfile | null>(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  if (!draft) {
    return <EmptyState title="No profile selected" body="Choose a profile to edit its preference model." />;
  }

  const updateStructured = <K extends keyof StructuredPreferences>(key: K, value: StructuredPreferences[K]) => {
    setDraft({
      ...draft,
      structuredPreferences: {
        ...draft.structuredPreferences,
        [key]: value
      }
    });
  };

  return (
    <div className="morph-grid">
      <Field label="Profile name">
        <input
          className="mui-input"
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
        />
      </Field>
      <Field label="Natural language instruction">
        <TextArea
          value={draft.naturalLanguageInstruction}
          onChange={(event) => setDraft({ ...draft, naturalLanguageInstruction: event.target.value })}
        />
      </Field>
      <Field label="Density">
        <Select
          value={draft.structuredPreferences.density}
          onChange={(event) => updateStructured("density", event.target.value as StructuredPreferences["density"])}
        >
          <option value="spacious">Spacious</option>
          <option value="balanced">Balanced</option>
          <option value="compact">Compact</option>
        </Select>
      </Field>
      <Field label="Typography scale">
        <input
          className="mui-input"
          min={0.85}
          max={1.8}
          step={0.05}
          type="number"
          value={draft.structuredPreferences.typographyScale}
          onChange={(event) => updateStructured("typographyScale", Number(event.target.value))}
        />
      </Field>
      <Field label="Content width">
        <Select
          value={draft.structuredPreferences.contentWidth}
          onChange={(event) => updateStructured("contentWidth", event.target.value as StructuredPreferences["contentWidth"])}
        >
          <option value="narrow">Narrow</option>
          <option value="comfortable">Comfortable</option>
          <option value="wide">Wide</option>
          <option value="full">Full</option>
        </Select>
      </Field>
      <Field label="Aggressiveness">
        <Select
          value={draft.structuredPreferences.aggressiveness}
          onChange={(event) => updateStructured("aggressiveness", event.target.value as StructuredPreferences["aggressiveness"])}
        >
          <option value="conservative">Conservative</option>
          <option value="balanced">Balanced</option>
          <option value="bold">Bold</option>
        </Select>
      </Field>
      <Toggle
        checked={draft.structuredPreferences.hideDistractions}
        label="Hide distractions"
        onChange={(value) => updateStructured("hideDistractions", value)}
      />
      <Toggle
        checked={draft.structuredPreferences.emphasizePrimaryContent}
        label="Emphasize primary content"
        onChange={(value) => updateStructured("emphasizePrimaryContent", value)}
      />
      <Toggle
        checked={draft.structuredPreferences.simplifyNavigation}
        label="Simplify navigation"
        onChange={(value) => updateStructured("simplifyNavigation", value)}
      />
      <Toggle
        checked={draft.structuredPreferences.reduceAnimations}
        label="Reduce animations"
        onChange={(value) => updateStructured("reduceAnimations", value)}
      />
      <Toggle
        checked={draft.structuredPreferences.enlargeClickTargets}
        label="Enlarge click targets"
        onChange={(value) => updateStructured("enlargeClickTargets", value)}
      />
      <Button tone="primary" onClick={() => onSave(draft)}>
        Save profile
      </Button>
    </div>
  );
}

function PrivacyControls({
  settings,
  onChange
}: {
  settings: SyncedSettings;
  onChange: (next: Partial<SyncedSettings>) => Promise<void>;
}) {
  return (
    <div className="morph-grid">
      <Field label="Privacy mode">
        <Select
          value={settings.privacyMode}
          onChange={(event) => onChange({ privacyMode: event.target.value as SyncedSettings["privacyMode"] })}
        >
          <option value="strict-local">Strict local</option>
          <option value="local-first">Local first</option>
          <option value="sync-enabled">Sync enabled</option>
        </Select>
      </Field>
      <Toggle
        checked={settings.allowScreenshotsOnMiss}
        label="Allow screenshots on cache miss"
        description="Only for non-sensitive enabled sites and only when needed."
        onChange={(checked) => onChange({ allowScreenshotsOnMiss: checked })}
      />
      <Toggle
        checked={settings.diagnosticsEnabled}
        label="Enable developer diagnostics"
        description="Shows fingerprint and cache debugging details."
        onChange={(checked) => onChange({ diagnosticsEnabled: checked })}
      />
    </div>
  );
}

export function App() {
  const [bootstrap, setBootstrap] = useState<BootstrapPayload | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = async () => {
    const result = await sendRuntimeMessage<BootstrapPayload>({ type: "GET_BOOTSTRAP" });
    setBootstrap(result);
  };

  useEffect(() => {
    void refresh();
  }, []);

  const activeProfile = useMemo(
    () => bootstrap?.profiles.find((profile) => profile.id === bootstrap.selectedProfileId)
      ?? bootstrap?.profiles.find((profile) => profile.isDefault)
      ?? bootstrap?.profiles[0]
      ?? null,
    [bootstrap]
  );

  async function runAction(label: string, fn: () => Promise<unknown>) {
    setBusy(label);
    setMessage(null);
    try {
      await fn();
      await refresh();
      setMessage(`${label} complete.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `${label} failed.`);
    } finally {
      setBusy(null);
    }
  }

  if (!bootstrap) {
    return <div className="morph-loading">Loading Morph UI…</div>;
  }

  const previewMessage = bootstrap.tabId === null
    ? { type: "PREVIEW_TRANSFORM" as const }
    : { type: "PREVIEW_TRANSFORM" as const, tabId: bootstrap.tabId };
  const applyMessage = bootstrap.tabId === null
    ? { type: "APPLY_TRANSFORM" as const }
    : { type: "APPLY_TRANSFORM" as const, tabId: bootstrap.tabId };
  const undoMessage = bootstrap.tabId === null
    ? { type: "UNDO_TRANSFORM" as const }
    : { type: "UNDO_TRANSFORM" as const, tabId: bootstrap.tabId };
  const resetMessage = bootstrap.origin
    ? bootstrap.tabId === null
      ? { type: "RESET_SITE" as const, origin: bootstrap.origin }
      : { type: "RESET_SITE" as const, origin: bootstrap.origin, tabId: bootstrap.tabId }
    : null;
  const siteSettingDraft = bootstrap.origin
    ? bootstrap.siteSetting ?? {
        origin: bootstrap.origin,
        enabled: true,
        autoApply: false,
        privacyMode: bootstrap.syncedSettings.privacyMode,
        allowScreenshots: bootstrap.syncedSettings.allowScreenshotsOnMiss,
        profileId: null,
        overridePreferences: {}
      }
    : null;

  return (
    <AppShell
      title="Morph UI"
      subtitle="Safe, reversible page adaptations with instant cache reapply."
      actions={<Badge tone={bootstrap.session ? "success" : "warning"}>{bootstrap.session ? "Signed in" : "Sign-in required"}</Badge>}
    >
      {message ? (
        <Notice tone={message.includes("failed") || message.includes("required") ? "warning" : "success"} title="Status">
          {message}
        </Notice>
      ) : null}

      {!bootstrap.session ? (
        <SectionCard title="Onboarding" description="Morph UI only sends enabled-site page summaries to the server. Consumer AI subscriptions are not silently reused.">
          <Notice tone="info" title="What gets read">
            DOM structure, headings, landmark summaries, and cached transform metadata. Screenshots are opt-in and blocked on sensitive sites.
          </Notice>
          <Button tone="primary" disabled={busy === "Sign in"} onClick={() => runAction("Sign in", () => sendRuntimeMessage({ type: "START_GOOGLE_SIGN_IN" }))}>
            Sign in with Google
          </Button>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Current page status"
        description={bootstrap.origin ?? "Open a regular tab to begin."}
        actions={<Badge tone={bootstrap.siteSetting?.enabled ? "success" : "neutral"}>{bootstrap.siteSetting?.enabled ? "Enabled" : "Disabled"}</Badge>}
      >
        <div className="morph-stats">
          <InlineStat label="Page type" value={bootstrap.pageSummary?.pageType ?? "unknown"} />
          <InlineStat label="Cache status" value={bootstrap.cacheStatus} />
          <InlineStat label="Profile" value={activeProfile?.name ?? "none"} />
        </div>
        {bootstrap.origin ? (
          <div className="morph-actions">
            {bootstrap.siteSetting?.enabled ? (
              <Button disabled={Boolean(busy)} onClick={() => runAction("Disable site", () => sendRuntimeMessage({ type: "DISABLE_SITE", origin: bootstrap.origin! }))}>
                Disable on this site
              </Button>
            ) : (
              <Button tone="primary" disabled={Boolean(busy)} onClick={() => runAction("Enable site", () => sendRuntimeMessage({ type: "ENABLE_SITE", origin: bootstrap.origin! }))}>
                Enable on this site
              </Button>
            )}
            <Toggle
              checked={bootstrap.siteSetting?.autoApply ?? false}
              label="Always auto-apply on this site"
              onChange={(checked) => runAction("Update auto-apply", () => sendRuntimeMessage({
                type: "TOGGLE_AUTO_APPLY",
                origin: bootstrap.origin!,
                autoApply: checked
              }))}
              disabled={!bootstrap.siteSetting?.enabled}
            />
          </div>
        ) : (
          <EmptyState title="No supported tab selected" body="Open an HTTP(S) page to inspect and transform it." />
        )}
      </SectionCard>

      <SectionCard title="Profile selection" description="Choose the global profile used for this page.">
        <Field label="Global profile">
          <Select
            value={activeProfile?.id}
            onChange={(event) => siteSettingDraft && runAction("Select profile", () => sendRuntimeMessage({
              type: "UPSERT_SITE_SETTING",
              siteSetting: {
                ...siteSettingDraft,
                profileId: event.target.value
              }
            }))}
          >
            {bootstrap.profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>{profile.name}</option>
            ))}
          </Select>
        </Field>
      </SectionCard>

      <SectionCard title="Preference editor" description="Edit the active preference profile.">
        <PreferenceEditor
          profile={activeProfile}
          onSave={(profile) => runAction("Save profile", () => sendRuntimeMessage({ type: "SAVE_PROFILE", profile }))}
        />
      </SectionCard>

      <SectionCard title="Live transform preview" description="Preview the current page, then commit or undo.">
        <div className="morph-actions">
          <Button tone="primary" disabled={Boolean(busy) || !bootstrap.siteSetting?.enabled} onClick={() => runAction("Preview", () => sendRuntimeMessage(previewMessage))}>
            Preview
          </Button>
          <Button disabled={Boolean(busy) || !bootstrap.siteSetting?.enabled} onClick={() => runAction("Apply", () => sendRuntimeMessage(applyMessage))}>
            Apply
          </Button>
          <Button disabled={Boolean(busy)} onClick={() => runAction("Undo", () => sendRuntimeMessage(undoMessage))}>
            Undo
          </Button>
          <Button tone="danger" disabled={Boolean(busy) || !resetMessage} onClick={() => resetMessage && runAction("Reset site", () => sendRuntimeMessage(resetMessage))}>
            Reset site
          </Button>
        </div>
        {bootstrap.previewPlan ? (
          <KeyValueList
            items={[
              { label: "Intent", value: bootstrap.previewPlan.pageIntent },
              { label: "Summary", value: bootstrap.previewPlan.summary },
              { label: "Confidence", value: `${Math.round(bootstrap.previewPlan.confidence * 100)}%` },
              { label: "Requires confirmation", value: bootstrap.previewPlan.requiresUserConfirmation ? "Yes" : "No" }
            ]}
          />
        ) : (
          <EmptyState title="No preview active" body="Run Preview to inspect the next reversible transform plan." />
        )}
      </SectionCard>

      <SectionCard title="Cache status" description="Local IndexedDB is the fast path. Remote cache is used only when sync is enabled and you are signed in.">
        <KeyValueList
          items={[
            { label: "Last cache result", value: bootstrap.cacheStatus },
            { label: "Selector mismatch rate", value: `${Math.round(bootstrap.diagnostics.selectorMismatchRate * 100)}%` },
            { label: "Diagnostics", value: bootstrap.syncedSettings.diagnosticsEnabled ? "Enabled" : "Disabled" }
          ]}
        />
      </SectionCard>

      <SectionCard title="Provider status" description="Capability flags are shown as implemented, not inferred from consumer subscriptions.">
        <div className="morph-grid">
          {bootstrap.providerCapabilities.map((capability) => (
            <Notice key={capability.provider} tone={capability.status === "available" ? "success" : "warning"} title={capability.provider.toUpperCase()}>
              <KeyValueList
                items={[
                  { label: "Server-owned API", value: capability.canUseServerOwnedApiKey ? "Yes" : "No" },
                  { label: "Official OAuth", value: capability.canUseOfficialOAuth ? "Supported architecture" : "Not used in v1" },
                  { label: "Consumer account reuse", value: capability.supportsConsumerAccountReuse ? "Supported" : "Disabled" }
                ]}
              />
              <p>{capability.limitationReason}</p>
            </Notice>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Privacy mode controls" description="Set the default privacy policy used across sites unless a site override says otherwise.">
        <PrivacyControls
          settings={bootstrap.syncedSettings}
          onChange={(next) => runAction("Update privacy settings", () => sendRuntimeMessage({ type: "UPDATE_SYNCED_SETTINGS", settings: next }))}
        />
      </SectionCard>

      {bootstrap.syncedSettings.diagnosticsEnabled ? (
        <SectionCard title="Developer diagnostics" description="Runtime details for debugging cache and selector drift.">
          <KeyValueList
            items={[
              { label: "Tab", value: bootstrap.tabId ?? "none" },
              { label: "Last provider error", value: bootstrap.diagnostics.lastProviderError ?? "none" },
              { label: "Analysis latency", value: `${bootstrap.diagnostics.contentAnalysisMs}ms` },
              { label: "Plan latency", value: `${bootstrap.diagnostics.planLatencyMs}ms` }
            ]}
          />
        </SectionCard>
      ) : null}
    </AppShell>
  );
}
