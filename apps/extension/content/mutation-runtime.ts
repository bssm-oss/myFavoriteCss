import type { CompiledTransform } from "@morph-ui/shared";

export interface MutationRuntimeHandle {
  setCompiledTransform(compiled: CompiledTransform | null): void;
}

export function setupMutationRuntime(onRouteChange: () => void): MutationRuntimeHandle {
  let current: CompiledTransform | null = null;
  let queued = false;

  const observer = new MutationObserver(() => {
    if (!current || queued) {
      return;
    }
    queued = true;
    window.setTimeout(() => {
      queued = false;
      if (current && !document.getElementById("morph-ui-style")) {
        const event = new CustomEvent("morph-ui-refresh-style");
        window.dispatchEvent(event);
      }
    }, 250);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  const notifyRouteChange = () => onRouteChange();
  const wrapHistory = <T extends typeof history.pushState | typeof history.replaceState>(method: T) =>
    function wrapped(this: History, ...args: Parameters<T>) {
      const value = method.apply(this, args);
      notifyRouteChange();
      return value;
    };

  history.pushState = wrapHistory(history.pushState);
  history.replaceState = wrapHistory(history.replaceState);
  window.addEventListener("popstate", notifyRouteChange);

  return {
    setCompiledTransform(compiled) {
      current = compiled;
    }
  };
}
