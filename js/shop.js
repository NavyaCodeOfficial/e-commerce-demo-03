/* Shop page: search, filter, sort. Works on the local PRODUCTS dataset. */
document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("shop-grid"); if (!grid) return;
  const q = document.getElementById("f-search"), cat = document.getElementById("f-category"),
    sort = document.getElementById("f-sort"), color = document.getElementById("f-color"),
    count = document.getElementById("result-count"), empty = document.getElementById("empty-state");
  cat.innerHTML = '<option value="">All categories</option>' + CATEGORIES.map(c => '<option value="' + c.id + '">' + esc(c.name) + "</option>").join("");
  const colors = [...new Set(PRODUCTS.flatMap(p => p.colors || []))].sort();
  color.innerHTML = '<option value="">All colours</option>' + colors.map(c => '<option value="' + esc(c) + '">' + esc(c) + "</option>").join("");
  const params = new URLSearchParams(location.search);
  q.value = (params.get("q") || "").slice(0, 80);
  if (CATEGORIES.some(c => c.id === params.get("category"))) cat.value = params.get("category");
  if (params.get("focus") === "search") q.focus();

  function apply() {
    const term = q.value.trim().toLowerCase();
    let list = PRODUCTS.filter(p => (!term || p.name.toLowerCase().includes(term)) && (!cat.value || p.category === cat.value) && (!color.value || (p.colors || []).includes(color.value)));
    const s = sort.value;
    if (s === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (s === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (s === "newest") list.sort((a, b) => b.added.localeCompare(a.added));
    else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    grid.innerHTML = list.map(productCard).join("");
    empty.hidden = list.length > 0;
    count.textContent = list.length + (list.length === 1 ? " product" : " products");
  }
  [q, cat, sort, color].forEach(el => el.addEventListener("input", apply));
  document.getElementById("f-clear").addEventListener("click", () => { q.value = ""; cat.value = ""; color.value = ""; sort.value = "featured"; apply(); });
  document.getElementById("filter-toggle").addEventListener("click", function () {
    const p = document.getElementById("filters"); const open = p.classList.toggle("open"); this.setAttribute("aria-expanded", open);
  });
  apply();
});
