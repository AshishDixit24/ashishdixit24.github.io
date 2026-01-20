/* DevNotes
- Purpose: A11y + UX hardening for <details> mobile menu.
- Behavior:
  - Keeps aria-expanded + aria-label in sync
  - Focuses first link on open
  - Closes on Esc, outside click, or link click
  - Restores focus to toggle when appropriate
*/

(function () {
  const details = document.getElementById("primaryMenu");
  if (!details) return;

  const summary = document.getElementById("menuToggle") || details.querySelector("summary");
  const panel = document.getElementById("primaryNavPanel") || details.querySelector(".nav-panel");
  if (!summary || !panel) return;

  function syncA11y() {
    const open = !!details.open;
    summary.setAttribute("aria-expanded", open ? "true" : "false");
    summary.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  function focusFirstLink() {
    const first = panel.querySelector("a, button, [tabindex]:not([tabindex='-1'])");
    if (first && typeof first.focus === "function") first.focus();
  }

  syncA11y();

  details.addEventListener("toggle", () => {
    syncA11y();

    if (details.open) {
      focusFirstLink();
      return;
    }

    // Restore focus only if focus was in the menu or nowhere useful.
    const active = document.activeElement;
    const focusWasInMenu = active && details.contains(active);
    const focusIsBody = !active || active === document.body || active === document.documentElement;

    if (focusWasInMenu || focusIsBody) summary.focus();
  });

  // Close on Escape (when focus is inside details)
  details.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    details.open = false;
    e.preventDefault();
    e.stopPropagation();
  });

  // Close when clicking a nav link
  panel.addEventListener("click", (e) => {
    const link = e.target && e.target.closest ? e.target.closest("a") : null;
    if (!link) return;
    details.open = false;
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!details.open) return;
    if (details.contains(e.target)) return;
    details.open = false;
  });
})();
