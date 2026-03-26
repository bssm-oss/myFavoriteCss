import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "@morph-ui/ui/styles.css";
import "../styles/extension.css";
import { AppShell, Badge, Button, KeyValueList, SectionCard } from "@morph-ui/ui";

import type { BootstrapPayload } from "../lib/chrome-messaging";
import { sendRuntimeMessage } from "../lib/chrome-messaging";

function PopupApp() {
  const [bootstrap, setBootstrap] = useState<BootstrapPayload | null>(null);

  useEffect(() => {
    void sendRuntimeMessage<BootstrapPayload>({ type: "GET_BOOTSTRAP" }).then(setBootstrap);
  }, []);

  if (!bootstrap) {
    return <div className="morph-loading">Loading…</div>;
  }

  return (
    <AppShell
      title="Morph UI"
      subtitle={bootstrap.origin ?? "No active site"}
      actions={<Badge tone={bootstrap.siteSetting?.enabled ? "success" : "neutral"}>{bootstrap.siteSetting?.enabled ? "Enabled" : "Disabled"}</Badge>}
    >
      <SectionCard title="Current site" description="Quick controls for the active tab.">
        <KeyValueList
          items={[
            { label: "Cache", value: bootstrap.cacheStatus },
            { label: "Page type", value: bootstrap.pageSummary?.pageType ?? "unknown" },
            { label: "Profile", value: bootstrap.profiles.find((profile) => profile.id === bootstrap.selectedProfileId)?.name ?? "none" }
          ]}
        />
        <div className="morph-actions">
          <Button tone="primary" onClick={() => void sendRuntimeMessage({ type: "OPEN_SIDE_PANEL" })}>
            Open side panel
          </Button>
          <Button disabled={!bootstrap.siteSetting?.enabled} onClick={() => void sendRuntimeMessage({ type: "QUICK_APPLY" })}>
            Quick apply
          </Button>
          <Button onClick={() => void sendRuntimeMessage({ type: "QUICK_UNDO" })}>
            Undo
          </Button>
        </div>
      </SectionCard>
    </AppShell>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>
);
