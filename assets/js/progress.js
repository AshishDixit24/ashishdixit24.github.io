/* DevNotes
- Purpose: Reading progress bar for post pages.
- Runs: on post pages only (included by post layout).
- No deps. Uses rAF to avoid scroll-jank.
*/

(function () {
  const bar = document.getElementById("readingProgressBar");
  const article = document.getElementById("postContent");
  if (!bar || !article) return;

  let ticking = false;

  function update() {
    ticking = false;

    const rect = article.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;

    // Total scrollable height of article: from its top to its bottom relative to viewport.
    const total = rect.height - viewport;
    if (total <= 0) {
      bar.style.width = "100%";
      return;
    }

    // How far we've scrolled into the article
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const pct = Math.round((scrolled / total) * 100);
    bar.style.width = pct + "%";
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
