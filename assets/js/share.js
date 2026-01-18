/* DevNotes
- Purpose: Copy post URL to clipboard.
- Runs: on post pages only (included by post layout).
- Uses: window.toast if available.
*/

(function () {
  const copyBtn = document.getElementById("copyLinkBtn");
  if (!copyBtn) return;

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

  copyBtn.addEventListener("click", async () => {
    try {
      await copyToClipboard(url);
      if (window.toast) window.toast("Link copied");
    } catch {
      if (window.toast) window.toast("Copy failed");
    }
  });
})();
