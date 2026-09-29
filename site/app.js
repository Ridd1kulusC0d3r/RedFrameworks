const state = { items: [], filtered: [] };

const $ = (id) => document.getElementById(id);

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function optionize(select, values) {
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStats(items) {
  const verified = items.filter(i => i.status === "verified").length;
  const domains = unique(items.flatMap(i => i.domains || [])).length;
  const watchlist = items.filter(i => i.status === "watchlist").length;
  $("stats").innerHTML = [
    ["Catalog entries", items.length],
    ["Verified references", verified],
    ["Domains", domains],
    ["Watchlist", watchlist],
  ].map(([label, value]) =>
    '<div class="stat"><strong>' + value + '</strong><span>' + label + '</span></div>'
  ).join("");
}

function card(item) {
  const badges = [
    item.type,
    item.status,
    item.model,
    ...(item.domains || []),
  ].filter(Boolean).map(value =>
    '<span class="badge ' + escapeHtml(item.status) + '">' + escapeHtml(value) + '</span>'
  ).join("");

  const source = item.url
    ? '<a href="' + escapeHtml(item.url) + '" target="_blank" rel="noopener">Official / upstream source ↗</a>'
    : '<span>Review before promotion</span>';

  return '<article class="card">' +
    '<div class="badges">' + badges + '</div>' +
    '<h2>' + escapeHtml(item.name) + '</h2>' +
    '<p>' + escapeHtml(item.summary || "No summary available.") + '</p>' +
    '<div class="source">' + source + '</div>' +
    '</article>';
}

function applyFilters() {
  const q = $("search").value.trim().toLowerCase();
  const type = $("type-filter").value;
  const domain = $("domain-filter").value;
  const status = $("status-filter").value;
  const model = $("model-filter").value;

  state.filtered = state.items.filter(item => {
    const haystack = [
      item.name, item.type, item.status, item.model, item.summary,
      ...(item.domains || [])
    ].join(" ").toLowerCase();

    return (!q || haystack.includes(q))
      && (!type || item.type === type)
      && (!domain || (item.domains || []).includes(domain))
      && (!status || item.status === status)
      && (!model || item.model === model);
  });

  $("result-count").textContent = state.filtered.length + " entries";
  $("catalog").innerHTML = state.filtered.map(card).join("") ||
    '<div class="panel">No entries match the current filters.</div>';
}

async function init() {
  const response = await fetch("data/catalog.json");
  const data = await response.json();
  state.items = data.items || [];

  optionize($("type-filter"), unique(state.items.map(i => i.type)));
  optionize($("domain-filter"), unique(state.items.flatMap(i => i.domains || [])));
  optionize($("status-filter"), unique(state.items.map(i => i.status)));
  optionize($("model-filter"), unique(state.items.map(i => i.model)));

  renderStats(state.items);

  for (const id of ["search", "type-filter", "domain-filter", "status-filter", "model-filter"]) {
    $(id).addEventListener(id === "search" ? "input" : "change", applyFilters);
  }

  $("reset").addEventListener("click", () => {
    $("search").value = "";
    for (const id of ["type-filter", "domain-filter", "status-filter", "model-filter"]) $(id).value = "";
    applyFilters();
  });

  applyFilters();
}

init().catch(error => {
  $("result-count").textContent = "Catalog failed to load";
  $("catalog").innerHTML = '<div class="panel">' + escapeHtml(error.message) + '</div>';
});
