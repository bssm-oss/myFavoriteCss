import { AppShell, Notice, SectionCard } from "@morph-ui/ui";

export function HelpPage() {
  return (
    <AppShell title="Morph UI help" subtitle="Setup and workflow reference for engineers and reviewers.">
      <SectionCard title="Typical flow" description="How the extension behaves on an enabled site.">
        <ol>
          <li>Enable the current origin from the side panel and grant host permission.</li>
          <li>Content script extracts a DOM-first page summary and fingerprint.</li>
          <li>Background worker checks IndexedDB, then remote cache, then AI planning if needed.</li>
          <li>Preview applies reversibly. Accept saves the transform to local cache and optional remote sync.</li>
        </ol>
      </SectionCard>
      <Notice tone="warning" title="Provider honesty">
        Morph UI does not reuse ChatGPT Plus or Gemini Advanced subscriptions. v1 uses server-owned API credentials only.
      </Notice>
    </AppShell>
  );
}
