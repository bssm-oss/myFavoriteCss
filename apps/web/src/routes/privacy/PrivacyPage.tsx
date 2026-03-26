import { AppShell, SectionCard } from "@morph-ui/ui";

export function PrivacyPage() {
  return (
    <AppShell title="Morph UI privacy" subtitle="Exact data flow for local cache and direct AI provider calls from the extension.">
      <SectionCard title="Stored locally" description="Chrome storage + IndexedDB">
        <ul>
          <li>Profiles, synced settings, enabled-site flags, diagnostics toggles, and provider configuration summaries.</li>
          <li>IndexedDB stores transform plans, compiled CSS/operations, fingerprints, validation stats, and screenshot hashes.</li>
          <li>Provider API keys are stored only in `chrome.storage.local` inside the extension and are never synced.</li>
          <li>Screenshot bytes are not persisted in v1.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Sent directly to AI providers" description="Only for enabled sites and only when privacy mode permits provider-assisted planning.">
        <ul>
          <li>Structured page summaries, selected profile, site policy, and fingerprint metadata.</li>
          <li>Optional screenshot on cache miss when screenshot capture is enabled and the site is not sensitive.</li>
          <li>No cookies, tokens, password values, or consumer subscription reuse hacks are used.</li>
        </ul>
      </SectionCard>
    </AppShell>
  );
}
