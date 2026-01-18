/* DevNotes
- Purpose: Share/copy link actions on post pages.
- Runs: on post pages only.
- Behavior:
  - If Web Share is available and succeeds: share.
  - If Web Share fails (common on Windows): fallback to copy.
  - Copy always available. Uses window.toast when present.
*/

(function () {
  const shareBtn = document.getElementById("shareBtn");
  const copyBtn = document.getElementById("copyLinkBtn");
  if (!shareBtn && !copyBtn) return;

  const url = window.location.href;

  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "true");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }

  async function doCopy(message) {
    try {
      await copyToClipboard(url);
      if (window.toast) window.toast(message || "Link copied");
    } catch {
      if (window.toast) window.toast("Copy failed");
    }
  }

  async function doShare() {
    // If share is unavailable, just copy.
    if (!navigator.share) {
      await doCopy("Link copied");
      return;
    }

    // Some platforms claim support but fail when invoked.
    try {
      // Use canShare when available (not guaranteed everywhere).
      if (navigator.canShare && !navigator.canShare({ url })) {
        await doCopy("Link copied");
        return;
      }

      await navigator.share({ url });
      if (window.toast) window.toast("Shared");
    } catch {
      // Fallback: Windows share sheet errors, user cancels, etc.
      await doCopy("Link copied");
    }
  }

  if (shareBtn) shareBtn.addEventListener("click", doShare);
  if (copyBtn) copyBtn.addEventListener("click", () => doCopy("Link copied"));
})();
