const state = {
  terms: [],
  category: "전체",
  query: "",
  tag: "",
};

const els = {
  tabs: document.querySelector("#categoryTabs"),
  grid: document.querySelector("#termGrid"),
  count: document.querySelector("#resultCount"),
  search: document.querySelector("#searchInput"),
  reset: document.querySelector("#resetButton"),
  empty: document.querySelector("#emptyState"),
  activeFilter: document.querySelector("#activeFilter"),
};

const normalize = (value) => String(value ?? "").trim().toLocaleLowerCase("ko-KR");

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const searchText = (term) =>
  normalize([
    term.term,
    term.category,
    term.definition,
    term.example,
    ...(term.tags ?? []),
  ].join(" "));

const uniqueCategories = () => [
  "전체",
  ...Array.from(new Set(state.terms.map((term) => term.category))).filter(Boolean),
];

const filteredTerms = () => {
  const query = normalize(state.query);
  const tag = normalize(state.tag);

  return state.terms.filter((term) => {
    const categoryMatches = state.category === "전체" || term.category === state.category;
    const queryMatches = !query || searchText(term).includes(query);
    const tagMatches = !tag || (term.tags ?? []).some((termTag) => normalize(termTag) === tag);
    return categoryMatches && queryMatches && tagMatches;
  });
};

const renderTabs = () => {
  els.tabs.innerHTML = uniqueCategories()
    .map((category) => {
      const isActive = category === state.category;
      return `<button class="category-tab" type="button" aria-pressed="${isActive}" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`;
    })
    .join("");
};

const renderTerms = () => {
  const terms = filteredTerms();
  els.count.textContent = terms.length;
  els.activeFilter.textContent = state.tag ? `· #${state.tag}` : "";
  els.empty.hidden = terms.length > 0;

  els.grid.innerHTML = terms
    .map((term) => {
      const tags = (term.tags ?? [])
        .map((tag) => {
          const isActive = normalize(tag) === normalize(state.tag);
          return `
            <li>
              <button class="tag-button" type="button" aria-pressed="${isActive}" data-tag="${escapeHtml(tag)}">#${escapeHtml(tag)}</button>
            </li>
          `;
        })
        .join("");
      const source = term.sourceUrl
        ? `<a class="source-link" href="${escapeHtml(term.sourceUrl)}" target="_blank" rel="noreferrer">영상 구간 보기</a>`
        : "";

      return `
        <article class="term-card">
          <header>
            <span class="category-pill">${escapeHtml(term.category)}</span>
            <h2>${escapeHtml(term.term)}</h2>
          </header>
          <p class="term-definition">${escapeHtml(term.definition)}</p>
          ${term.example ? `<p class="term-example">${escapeHtml(term.example)}</p>` : ""}
          ${tags ? `<ul class="term-meta">${tags}</ul>` : ""}
          ${source}
        </article>
      `;
    })
    .join("");
};

const render = () => {
  renderTabs();
  renderTerms();
};

els.tabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  render();
});

els.search.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderTerms();
});

els.grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tag]");
  if (!button) return;
  state.tag = button.dataset.tag;
  state.category = "전체";
  state.query = "";
  els.search.value = "";
  render();
});

els.reset.addEventListener("click", () => {
  state.category = "전체";
  state.query = "";
  state.tag = "";
  els.search.value = "";
  render();
});

fetch("data/terms.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`용어 데이터를 불러오지 못했습니다. (${response.status})`);
    }
    return response.json();
  })
  .then((data) => {
    state.terms = data.terms ?? [];
    render();
  })
  .catch((error) => {
    els.grid.innerHTML = "";
    els.empty.hidden = false;
    els.empty.textContent = error.message;
  });
