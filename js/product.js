/* Product detail page driven by ?id=slug */
document.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("product-root"); if (!root) return;
  const p = getProduct(new URLSearchParams(location.search).get("id"));
  if (!p) {
    document.title = "Product not found | " + STORE_CONFIG.name;
    root.innerHTML = '<div class="empty"><h1>Product not found</h1><p class="muted">This product may have been removed or the link is incorrect.</p><a class="btn" href="shop.html">Browse the Shop</a></div>';
    const r = document.createElement("meta"); r.name = "robots"; r.content = "noindex"; document.head.appendChild(r);
    return;
  }
  const state = { color: "", size: "", qty: 1, img: 0 };
  const hasColors = p.colors && p.colors.length, hasSizes = p.sizes && p.sizes.length;
  const crumbs = document.getElementById("crumbs");
  crumbs.innerHTML = '<a href="index.html">Home</a><span aria-hidden="true">/</span><a href="shop.html">Shop</a><span aria-hidden="true">/</span><a href="shop.html?category=' + p.category + '">' + esc(categoryName(p.category)) +
    '</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(p.name) + "</span>";

  const opt = (label, key, arr) => '<fieldset class="opt" id="' + (key === "color" ? "options" : "opt-" + key) + '"><legend>' + label + ': <strong id="sel-' + key + '">Select</strong></legend>' +
    arr.map(v => '<label class="chip"><input type="radio" name="' + key + '" value="' + esc(v) + '"><span>' + esc(v) + "</span></label>").join("") + "</fieldset>";

  root.innerHTML =
    '<div class="pd-gallery"><div class="pd-main card"><img id="pd-img" src="' + esc(p.images[0]) + '" alt="' + esc(p.name) + '" width="800" height="1000" fetchpriority="high"></div>' +
    '<div class="pd-thumbs">' + p.images.map((s, i) => '<button type="button" class="thumb' + (i ? "" : " active") + '" data-i="' + i + '" aria-label="Show image ' + (i + 1) + '"><img src="' + esc(s) + '" alt="" width="80" height="100" loading="lazy"></button>').join("") + "</div></div>" +
    '<div class="pd-info"><p class="eyebrow">' + esc(categoryName(p.category)) + "</p><h1>" + esc(p.name) + "</h1>" +
    '<p class="pd-price">' + formatINR(p.price) + (p.originalPrice ? ' <s class="price-old">' + formatINR(p.originalPrice) + "</s>" : "") + "</p>" +
    "<p>" + esc(p.description) + "</p>" +
    '<dl class="specs"><div><dt>Material</dt><dd>' + esc(p.material) + "</dd></div><div><dt>Care</dt><dd>" + esc(p.care) + "</dd></div></dl>" +
    (hasColors ? opt("Colour", "color", p.colors) : "") + (hasSizes ? opt("Size", "size", p.sizes) : "") +
    '<div class="opt"><span class="label">Quantity</span><div class="qty"><button type="button" id="q-dec" aria-label="Decrease quantity">−</button><span id="q-val" aria-live="polite">1</span><button type="button" id="q-inc" aria-label="Increase quantity">+</button></div></div>' +
    '<p class="warn" id="need" role="status" hidden>Please choose the required options above.</p>' +
    '<div class="pd-actions"><button class="btn" id="b-cart" type="button">Add to Cart</button><button class="btn btn-wa" id="b-order" type="button">Order on WhatsApp</button><button class="btn btn-ghost" id="b-ask" type="button">Ask a Question on WhatsApp</button></div>' +
    '<p class="muted small">Orders are requests until confirmed by the store. See <a href="shipping-policy.html">Shipping</a> and <a href="return-refund-policy.html">Returns &amp; Refunds</a>.</p>' +
    (STORE_CONFIG.sampleCatalogue ? '<p class="notice small">Sample product shown for demonstration. Details and prices are placeholders.</p>' : "") + "</div>";

  const img = document.getElementById("pd-img");
  root.querySelectorAll(".thumb").forEach(b => b.addEventListener("click", () => {
    img.src = p.images[+b.dataset.i]; root.querySelectorAll(".thumb").forEach(x => x.classList.remove("active")); b.classList.add("active");
  }));
  root.querySelectorAll("input[type=radio]").forEach(r => r.addEventListener("change", () => {
    state[r.name] = r.value; document.getElementById("sel-" + r.name).textContent = r.value; document.getElementById("need").hidden = true;
  }));
  const qv = document.getElementById("q-val");
  document.getElementById("q-dec").onclick = () => { state.qty = Math.max(1, state.qty - 1); qv.textContent = state.qty; };
  document.getElementById("q-inc").onclick = () => { state.qty = Math.min(Cart.MAX_QTY, state.qty + 1); qv.textContent = state.qty; };
  function ready() {
    if ((hasColors && !state.color) || (hasSizes && !state.size)) {
      const n = document.getElementById("need"); n.hidden = false; (document.getElementById("options") || n).scrollIntoView({ block: "center" }); return false;
    } return true;
  }
  document.getElementById("b-cart").onclick = () => { if (ready()) { Cart.add(p.id, state.qty, state.color, state.size); toast("Added to cart"); } };
  const ob = document.getElementById("b-order"), ab = document.getElementById("b-ask");
  ob.onclick = () => { if (ready()) openWhatsApp(buildProductMessage(p, state.qty, state.color, state.size)); };
  ab.onclick = () => openWhatsApp("Hello " + STORE_CONFIG.name + "! I have a question about: " + p.name + "\n" + productUrl(p));
  if (!waConfigured()) { ob.disabled = ab.disabled = true; ob.title = ab.title = "WhatsApp number not configured yet"; }

  const rel = PRODUCTS.filter(x => x.id !== p.id && x.category === p.category).concat(PRODUCTS.filter(x => x.category !== p.category)).slice(0, 4);
  document.getElementById("related-grid").innerHTML = rel.map(productCard).join("");
});
