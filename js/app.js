/* Shared helpers, header/menu behaviour, product card pattern. */
(function () {
  "use strict";
  const C = STORE_CONFIG;

  window.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  };
  window.formatINR = function (n) {
    return "₹" + Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  };
  window.normId = function (v) {
    return String(v || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 80);
  };
  window.getProduct = function (id) {
    id = normId(id);
    return PRODUCTS.find(p => p.id === id) || null;
  };
  window.waConfigured = function () {
    return /^\d{8,15}$/.test(String(C.whatsappNumber || ""));
  };
  window.siteUrl = function (path) {
    return C.siteUrl.replace(/\/$/, "") + "/" + (path || "").replace(/^\//, "");
  };
  window.productUrl = function (p) { return siteUrl("product.html?id=" + encodeURIComponent(p.id)); };
  window.categoryName = function (id) { const c = CATEGORIES.find(c => c.id === id); return c ? c.name : id; };

  window.productCard = function (p) {
    const needs = (p.sizes && p.sizes.length) || (p.colors && p.colors.length);
    const link = "product.html?id=" + encodeURIComponent(p.id);
    const price = '<span class="price">' + formatINR(p.price) + "</span>" +
      (p.originalPrice ? ' <s class="price-old">' + formatINR(p.originalPrice) + "</s>" : "");
    const variants = [].concat(p.colors || [], p.sizes || []).slice(0, 4).map(esc).join(" · ");
    return '<article class="card product-card">' +
      '<a class="card-media" href="' + link + '"><img src="' + esc(p.images[0]) + '" alt="' + esc(p.name) + '" width="800" height="1000" loading="lazy" decoding="async"></a>' +
      '<div class="card-body"><p class="eyebrow">' + esc(categoryName(p.category)) + "</p>" +
      '<h3 class="card-title"><a href="' + link + '">' + esc(p.name) + "</a></h3>" +
      "<p>" + price + "</p>" + (variants ? '<p class="muted small">' + variants + "</p>" : "") +
      '<div class="card-actions"><a class="btn btn-ghost btn-sm" href="' + link + '">View Product</a>' +
      (needs ? '<a class="btn btn-sm" href="' + link + '#options">Choose Options</a>'
             : '<button class="btn btn-sm" type="button" data-add="' + esc(p.id) + '">Add to Cart</button>') +
      "</div></div></article>";
  };

  window.toast = function (msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  };

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-year]").forEach(e => e.textContent = new Date().getFullYear());
    const ann = document.getElementById("announce-text"); if (ann) ann.textContent = C.announcement;
    // Mobile menu
    const btn = document.getElementById("menu-toggle"), nav = document.getElementById("site-nav");
    if (btn && nav) {
      btn.addEventListener("click", () => {
        const open = nav.classList.toggle("open"); btn.setAttribute("aria-expanded", open);
      });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); } });
    }
    // Generic WhatsApp links
    document.querySelectorAll("[data-wa-chat]").forEach(a => {
      if (!waConfigured()) { a.setAttribute("aria-disabled", "true"); a.title = "WhatsApp number not configured yet"; a.addEventListener("click", e => { e.preventDefault(); toast("Store WhatsApp number is not configured yet."); }); }
      else { a.href = waLink("Hello " + C.name + "! I have a question."); a.target = "_blank"; a.rel = "noopener noreferrer"; }
    });
    // Home featured grid + collection counts
    const feat = document.getElementById("featured-grid");
    if (feat) feat.innerHTML = PRODUCTS.filter(p => p.featured).slice(0, 4).map(productCard).join("");
    document.querySelectorAll("[data-count-cat]").forEach(e => {
      const n = PRODUCTS.filter(p => p.category === e.dataset.countCat).length; e.textContent = n + (n === 1 ? " product" : " products");
    });
    const colGrid = document.getElementById("collection-products");
    if (colGrid) colGrid.innerHTML = CATEGORIES.map(c =>
      '<section class="section" aria-labelledby="c-' + c.id + '"><div class="container"><div class="section-head"><h2 id="c-' + c.id + '">' + esc(c.name) + '</h2><a class="link" href="shop.html?category=' + c.id + '">View all ' + esc(c.name) + '</a></div><div class="grid">' +
      PRODUCTS.filter(p => p.category === c.id).map(productCard).join("") + "</div></div></section>").join("");
    const note = document.getElementById("sample-note");
    if (note && C.sampleCatalogue) { note.hidden = false; }
    // Add-to-cart buttons (cards)
    document.body.addEventListener("click", e => {
      const b = e.target.closest("[data-add]"); if (!b) return;
      const p = getProduct(b.dataset.add); if (!p) return;
      Cart.add(p.id, 1, "", ""); toast("Added to cart");
    });
  });
})();
