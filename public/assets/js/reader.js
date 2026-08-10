(function () {
  "use strict";

  const dataElement = document.getElementById("reader-data");
  const entries = JSON.parse(dataElement.textContent || "[]");
  const state = { selectedId: entries[0]?.id || "", mode: "search", query: "" };
  const page = document.querySelector(".reader-page");
  const els = {
    sidebarToggle: document.getElementById("sidebar-toggle"),
    search: document.getElementById("reader-search"),
    count: document.getElementById("result-count"),
    results: document.getElementById("search-results"),
    tags: document.getElementById("tag-tree"),
    timeline: document.getElementById("timeline-tree"),
    tabTitle: document.getElementById("editor-tab-title"),
    path: document.getElementById("editor-path"),
    source: document.getElementById("markdown-source"),
    openOriginal: document.getElementById("open-original"),
  };

  function setSidebarCollapsed(collapsed) {
    page.classList.toggle("is-sidebar-collapsed", collapsed);
    els.sidebarToggle.textContent = collapsed ? "›" : "‹";
    els.sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
    els.sidebarToggle.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
    localStorage.setItem("reader-sidebar-collapsed", String(collapsed));
  }

  function getEntry(id) {
    return entries.find((entry) => entry.id === id) || entries[0];
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createFileItem(entry) {
    const button = createElement("button", "file-item");
    button.type = "button";
    button.dataset.entryId = entry.id;
    button.append(
      createElement("span", "file-item__icon", "◇"),
      createElement("span", "file-item__name", entry.title),
      createElement("time", "file-item__date", entry.dateLabel)
    );
    return button;
  }

  function selectEntry(id) {
    const entry = getEntry(id);
    if (!entry) return;
    state.selectedId = entry.id;
    els.tabTitle.textContent = entry.title;
    els.path.textContent = `_posts/${entry.id}.md`;
    els.openOriginal.href = entry.url;
    els.source.replaceChildren();
    entry.source.split("\n").forEach((line, index) => {
      const row = createElement("span", "source-line");
      row.append(
        createElement("span", "source-line__number", String(index + 1)),
        createElement("span", "source-line__content", line || " ")
      );
      els.source.append(row);
    });
    document.querySelectorAll("[data-entry-id]").forEach((item) => {
      item.classList.toggle("is-selected", item.dataset.entryId === entry.id);
    });
    history.replaceState(null, "", `#${encodeURIComponent(entry.id)}`);
    els.source.parentElement.scrollTop = 0;
    els.source.parentElement.scrollLeft = 0;
  }

  function renderSearch() {
    const query = state.query.trim().toLowerCase();
    const filtered = entries.filter((entry) => {
      if (!query) return true;
      return `${entry.title}\n${entry.tags.join(" ")}\n${entry.source}`.toLowerCase().includes(query);
    });
    els.count.textContent = query ? `${filtered.length} results` : `${entries.length} recent files`;
    els.results.replaceChildren(...filtered.map(createFileItem));
  }

  function renderTags() {
    const grouped = new Map();
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => {
        if (!grouped.has(tag)) grouped.set(tag, []);
        grouped.get(tag).push(entry);
      });
    });
    els.tags.replaceChildren();
    [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b, "zh-CN")).forEach(([tag, taggedEntries]) => {
      const details = createElement("details", "tree-folder");
      details.open = true;
      const summary = createElement("summary", "tree-folder__summary");
      summary.append(createElement("span", "tree-folder__chevron", "⌄"), createElement("span", "tree-folder__name", tag));
      details.append(summary);
      const children = createElement("div", "tree-folder__children");
      taggedEntries.forEach((entry) => children.append(createFileItem(entry)));
      details.append(children);
      els.tags.append(details);
    });
  }

  function renderTimeline() {
    const years = new Map();
    entries.forEach((entry) => {
      if (!years.has(entry.year)) years.set(entry.year, []);
      years.get(entry.year).push(entry);
    });
    els.timeline.replaceChildren();
    [...years.entries()].sort(([a], [b]) => b - a).forEach(([year, yearEntries]) => {
      const details = createElement("details", "tree-folder");
      details.open = true;
      const summary = createElement("summary", "tree-folder__summary");
      summary.append(createElement("span", "tree-folder__chevron", "⌄"), createElement("span", "tree-folder__name", String(year)));
      details.append(summary);
      const children = createElement("div", "tree-folder__children");
      yearEntries.forEach((entry) => children.append(createFileItem(entry)));
      details.append(children);
      els.timeline.append(details);
    });
  }

  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll(".reader-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.mode === mode));
    document.querySelectorAll(".reader-panel").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === mode));
    if (mode === "search") els.search.focus();
  }

  document.querySelectorAll(".reader-tab").forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.mode));
  });
  els.search.addEventListener("input", () => {
    state.query = els.search.value;
    renderSearch();
  });
  els.sidebarToggle.addEventListener("click", () => {
    setSidebarCollapsed(!page.classList.contains("is-sidebar-collapsed"));
  });
  document.querySelector(".reader-sidebar-body").addEventListener("click", (event) => {
    const item = event.target.closest("[data-entry-id]");
    if (item) selectEntry(item.dataset.entryId);
  });

  renderSearch();
  renderTags();
  renderTimeline();
  setSidebarCollapsed(localStorage.getItem("reader-sidebar-collapsed") === "true");
  const hashId = decodeURIComponent(window.location.hash.slice(1));
  selectEntry(entries.some((entry) => entry.id === hashId) ? hashId : state.selectedId);
})();
