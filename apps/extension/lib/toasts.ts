export function showPageToast(message: string) {
  const existing = document.getElementById("morph-ui-toast");
  if (existing) {
    existing.textContent = message;
    return;
  }

  const toast = document.createElement("div");
  toast.id = "morph-ui-toast";
  toast.textContent = message;
  toast.setAttribute("role", "status");
  toast.style.position = "fixed";
  toast.style.right = "16px";
  toast.style.bottom = "16px";
  toast.style.zIndex = "2147483647";
  toast.style.maxWidth = "320px";
  toast.style.padding = "10px 14px";
  toast.style.borderRadius = "999px";
  toast.style.background = "rgba(18, 32, 51, 0.92)";
  toast.style.color = "white";
  toast.style.font = '500 13px/1.4 Inter, system-ui, sans-serif';
  toast.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)";
  document.body.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 2200);
}
