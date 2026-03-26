function originToMatchPattern(origin: string) {
  const url = new URL(origin);
  return `${url.protocol}//${url.host}/*`;
}

function scriptIdForOrigin(origin: string) {
  return `morph-ui-${new URL(origin).host.replace(/[^a-z0-9]/gi, "-")}`;
}

export async function requestOriginPermission(origin: string) {
  return chrome.permissions.request({
    origins: [originToMatchPattern(origin)]
  });
}

export async function registerContentScriptForOrigin(origin: string) {
  const id = scriptIdForOrigin(origin);
  try {
    await chrome.scripting.unregisterContentScripts({
      ids: [id]
    });
  } catch {
    // No-op when not previously registered.
  }

  await chrome.scripting.registerContentScripts([
    {
      id,
      matches: [originToMatchPattern(origin)],
      js: ["content/content-script.js"],
      runAt: "document_idle",
      persistAcrossSessions: true
    }
  ]);
}

export async function unregisterContentScriptForOrigin(origin: string) {
  const id = scriptIdForOrigin(origin);
  await chrome.scripting.unregisterContentScripts({
    ids: [id]
  });
}
