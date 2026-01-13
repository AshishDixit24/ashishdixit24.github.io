/* DevNotes
- Purpose: Light/dark theme toggle with localStorage persistence.
- Runs: on every page load (deferred).
- Config: default theme uses prefers-color-scheme unless user explicitly chose a theme.
- Implementation: sets <html data-theme="light|dark">.
*/

(function () {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const btn = document.getElementById("themeToggle");
    if (btn) btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  function toggleTheme() {
    const next = (root.dataset.theme === "dark") ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);

    if (window.toast) {
      window.toast(`Theme: ${next}`);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(getPreferredTheme());

    const btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", toggleTheme);
  });
})();
