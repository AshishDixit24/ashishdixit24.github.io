/* DevNotes
- Purpose: Tiny toast notifications (no deps).
- Runs: on every page load (deferred) and exposes window.toast(msg, opts).
- Where: uses #toastRegion container in base.njk.
*/

(function () {
  const regionId = "toastRegion";

  function ensureRegion() {
    return document.getElementById(regionId);
  }

  function toast(message, opts) {
    const options = opts || {};
    const ms = typeof options.ms === "number" ? options.ms : 2200;
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const region = ensureRegion();
    if (!region) return;

    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = String(message);

    region.appendChild(el);

    if (reduceMotion) {
      el.classList.add("show");
    } else {
      requestAnimationFrame(() => el.classList.add("show"));
    }
    
    window.setTimeout(() => {
      if (reduceMotion) {
        el.remove();
        return;
      }
      el.classList.remove("show");
      window.setTimeout(() => el.remove(), 220);
    }, ms);
  }

  window.toast = toast;
})();
