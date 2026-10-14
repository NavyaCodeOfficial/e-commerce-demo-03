/* Dynamic SEO for the product detail page (static pages carry their own metadata). */
document.addEventListener("DOMContentLoaded", function () {
  const page = document.body.dataset.page; if (page !== "product") return;
  const p = getProduct(new URLSearchParams(location.search).get("id")); if (!p) return;
  const set = (sel, attr, val) => { const e = document.querySelector(sel); if (e) e.setAttribute(attr, val); };
  const url = productUrl(p), title = p.name + " | " + STORE_CONFIG.name;
  document.title = title;
  set('meta[name="description"]', "content", p.name + " at " + STORE_CONFIG.name + ". Order or enquire on WhatsApp.");
  set('link[rel="canonical"]', "href", url);
  set('meta[property="og:title"]', "content", title);
  set('meta[property="og:url"]', "content", url);
  set('meta[property="og:image"]', "content", siteUrl(p.images[0]));
  const crumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    ["Home", siteUrl("index.html")], ["Shop", siteUrl("shop.html")], [p.name, url]].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: c[1] })) };
  const blocks = [crumbs];
  // Product/Offer markup only for real, verified products.
  if (!STORE_CONFIG.sampleCatalogue) blocks.push({ "@context": "https://schema.org", "@type": "Product", name: p.name, image: [siteUrl(p.images[0])], description: p.description, sku: p.id,
    offers: { "@type": "Offer", url: url, priceCurrency: STORE_CONFIG.currency, price: String(p.price) } });
  blocks.forEach(b => { const s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(b); document.head.appendChild(s); });
});
