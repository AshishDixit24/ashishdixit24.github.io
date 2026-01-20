/* DevNotes
- Purpose: Client-side search/sort/tag filter for /blog/ (no deps).
- Data source: /search-index.json (built by Eleventy).
- Behavior:
  - Filters cards already on the page (no full re-render required).
  - Multi-select tag filters, search matches title/description/tags/series.
  - Uses window.toast for brief feedback.
*/

(function () {
  const searchEl = document.getElementById("blogSearch");
  const sortEl = document.getElementById("blogSort");
  const clearBtn = document.getElementById("clearFilters");
  const tagWrap = document.getElementById("blogTagFilters");
  const hintEl = document.getElementById("resultHint");

  if (!searchEl || !sortEl || !clearBtn || !tagWrap || !hintEl) return;

  const cards = Array.from(document.querySelectorAll(".card[data-title]"));
  const state = {
    q: "",
    sort: "newest",
    tags: new Set(),
    index: [],
  };
  let lastVisible = null;
  function norm(s) {
    return String(s || "").toLowerCase().trim();
  }

  function cardData(card) {
    return {
      el: card,
      title: norm(card.getAttribute("data-title")),
      desc: norm(card.getAttribute("data-desc")),
      tags: norm(card.getAttribute("data-tags")),
      date: card.getAttribute("data-date") || "",
    };
  }

  const cardInfo = cards.map(cardData);

  function uniqueTagsFromIndex(items) {
    const set = new Set();
    items.forEach((p) => (p.tags || []).forEach((t) => set.add(String(t))));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  function renderTagFilters(tags) {
    tagWrap.innerHTML = "";
    if (!tags.length) return;

    tags.forEach((t) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip chip-btn";
      btn.textContent = t;
      btn.setAttribute("aria-pressed", "false");

      btn.addEventListener("click", () => {
        if (state.tags.has(t)) state.tags.delete(t);
        else state.tags.add(t);

        btn.setAttribute("aria-pressed", state.tags.has(t) ? "true" : "false");
        apply();
      });

      tagWrap.appendChild(btn);
    });
  }

  function matchesQuery(ci, q) {
    if (!q) return true;
    return (
      ci.title.includes(q) ||
      ci.desc.includes(q) ||
      ci.tags.includes(q)
    );
  }

  function matchesTags(ci) {
    if (state.tags.size === 0) return true;
    // require all selected tags
    for (const t of state.tags) {
      if (!ci.tags.split(",").map((x) => norm(x)).includes(norm(t))) return false;
    }
    return true;
  }

  function applySort(list) {
    const sort = state.sort;
    if (sort === "title") {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sort === "oldest") {
      return list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    }
    // newest
    return list.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }

  function apply() {
    const q = norm(state.q);
    let visible = 0;

    const filtered = cardInfo.filter((ci) => matchesQuery(ci, q) && matchesTags(ci));
    applySort(filtered);

    // reorder DOM to match sort
    const parent = cards[0] ? cards[0].parentElement : null;
    if (parent) {
      filtered.forEach((ci) => parent.appendChild(ci.el));
    }

    // show/hide
    const visibleSet = new Set(filtered.map((x) => x.el));
    cardInfo.forEach((ci) => {
      const show = visibleSet.has(ci.el);
      ci.el.style.display = show ? "" : "none";
      if (show) visible += 1;
    });

    hintEl.textContent = `${visible} result${visible === 1 ? "" : "s"}`;

    if (visible === 0 && lastVisible !== 0 && window.toast) window.toast("No results");
    lastVisible = visible;

  }

  function clearAll() {
    state.q = "";
    state.sort = "newest";
    state.tags.clear();
    searchEl.value = "";
    sortEl.value = "newest";
    Array.from(tagWrap.querySelectorAll(".chip-btn")).forEach((b) => b.setAttribute("aria-pressed", "false"));
    apply();
  }

  // Load index and render tag filters
  fetch("/search-index.json", { cache: "no-store" })
    .then((r) => r.json())
    .then((idx) => {
      state.index = Array.isArray(idx) ? idx : [];
      renderTagFilters(uniqueTagsFromIndex(state.index));
      apply();
    })
    .catch(() => {
      // If index missing, still allow search over cards (no tag filter list).
      apply();
    });

  searchEl.addEventListener("input", () => {
    state.q = searchEl.value;
    apply();
  });

  sortEl.addEventListener("change", () => {
    state.sort = sortEl.value;
    apply();
  });

  clearBtn.addEventListener("click", clearAll);
})();
