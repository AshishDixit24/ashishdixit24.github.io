/* DevNotes
- Purpose: Share/copy link actions on post pages.
- Runs: on post pages only (included by post layout).
- Uses: window.toast if available.
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
    // Fallback
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

  async function doCopy() {
    try {
      await copyToClipboard(url);
      if (window.toast) window.toast("Link copied");
    } catch {
      if (window.toast) window.toast("Copy failed");
    }
  }

  async function doShare() {
    try {
      if (navigator.share) {
        await navigator.share({ url });
        if (window.toast) window.toast("Shared");
      } else {
        await doCopy();
      }
    } catch {
      // user cancelled share -> do nothing
    }
  }

  if (copyBtn) copyBtn.addEventListener("click", doCopy);
  if (shareBtn) shareBtn.addEventListener("click", doShare);
})();
