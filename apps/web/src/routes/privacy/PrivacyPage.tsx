import { AppShell, SectionCard } from "@morph-ui/ui";

export function PrivacyPage() {
  return (
    <AppShell title="Morph UI privacy" subtitle="Exact data flow for local cache, server sync, and AI provider calls.">
      <SectionCard title="Stored locally" description="Chrome storage + IndexedDB">
        <ul>
          <li>Profiles, synced settings, enabled-site flags, diagnostics toggles, and local auth session metadata.</li>
          <li>IndexedDB stores transform plans, compiled CSS/operations, fingerprints, validation stats, and screenshot hashes.</li>
          <li>Screenshot bytes are not persisted in v1.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Sent to the Morph UI server" description="Only for enabled sites and only when privacy mode permits remote work.">
        <ul>
          <li>Redacted page summary JSON, selected profile, site policy, and fingerprint metadata.</li>
          <li>Accepted transform artifacts for optional remote cache sync.</li>
          <li>Feedback events such as accept, undo, reject, tweak, and reset.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Sent to AI providers" description="Only after server-side redaction.">
        <ul>
          <li>Structured page summaries, landmark text, and non-sensitive region summaries.</li>
          <li>Optional screenshot on cache miss when screenshot capture is enabled and the site is not sensitive.</li>
          <li>No cookies, tokens, password values, or consumer subscription reuse hacks.</li>
        </ul>
      </SectionCard>
    </AppShell>
  );
}
