/* Frontend-only cart persisted in localStorage. Stores only id, variant and quantity. */
const Cart = (function () {
  "use strict";
  const KEY = "khk_cart_v1", MAX_QTY = 10;
  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(raw)) return [];
      return raw.filter(i => i && typeof i.id === "string" && getProduct(i.id) && Number.isInteger(i.qty) && i.qty > 0)
        .map(i => ({ id: normId(i.id), color: String(i.color || "").slice(0, 40), size: String(i.size || "").slice(0, 20), qty: Math.min(i.qty, MAX_QTY) }));
    } catch (e) { return []; }
  }
  function write(items) { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {} updateCount(); }
  function clampQty(q) { q = parseInt(q, 10); return isNaN(q) ? 1 : Math.max(1, Math.min(MAX_QTY, q)); }
  function add(id, qty, color, size) {
    const items = read(); id = normId(id);
    const found = items.find(i => i.id === id && i.color === (color || "") && i.size === (size || ""));
    if (found) found.qty = Math.min(MAX_QTY, found.qty + clampQty(qty));
    else items.push({ id, color: color || "", size: size || "", qty: clampQty(qty) });
    write(items);
  }
  function setQty(index, qty) { const items = read(); if (!items[index]) return; items[index].qty = clampQty(qty); write(items); }
  function remove(index) { const items = read(); items.splice(index, 1); write(items); }
  function clear() { write([]); }
  function count() { return read().reduce((n, i) => n + i.qty, 0); }
  function subtotal() { return read().reduce((s, i) => s + getProduct(i.id).price * i.qty, 0); }
  function updateCount() {
    document.querySelectorAll("[data-cart-count]").forEach(e => { const n = count(); e.textContent = n; e.hidden = n === 0; });
  }
  document.addEventListener("DOMContentLoaded", updateCount);
  window.addEventListener("storage", updateCount);
  return { read, add, setQty, remove, clear, count, subtotal, MAX_QTY };
})();

/* Cart page rendering */
document.addEventListener("DOMContentLoaded", function () {
  const root = document.getElementById("cart-root"); if (!root) return;
  function render() {
    const items = Cart.read();
    if (!items.length) {
      root.innerHTML = '<div class="empty"><h2>Your cart is empty</h2><p class="muted">Browse the collection and add something you like.</p><a class="btn" href="shop.html">Continue Shopping</a></div>';
      return;
    }
    const rows = items.map((i, idx) => {
      const p = getProduct(i.id), v = [i.color, i.size].filter(Boolean).map(esc).join(" / ");
      return '<li class="cart-row"><a href="product.html?id=' + encodeURIComponent(p.id) + '"><img src="' + esc(p.images[0]) + '" alt="' + esc(p.name) + '" width="96" height="120" loading="lazy"></a>' +
        '<div class="cart-info"><h3><a href="product.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.name) + "</a></h3>" + (v ? '<p class="muted small">' + v + "</p>" : "") +
        "<p>" + formatINR(p.price) + '</p><button class="link-btn" data-remove="' + idx + '" type="button">Remove</button></div>' +
        '<div class="qty" role="group" aria-label="Quantity for ' + esc(p.name) + '"><button type="button" data-dec="' + idx + '" aria-label="Decrease quantity">−</button><span aria-live="polite">' + i.qty +
        '</span><button type="button" data-inc="' + idx + '" aria-label="Increase quantity">+</button></div>' +
        '<p class="line-total">' + formatINR(p.price * i.qty) + "</p></li>";
    }).join("");
    root.innerHTML = '<ul class="cart-list">' + rows + '</ul><aside class="cart-summary card"><h2>Summary</h2>' +
      '<p class="sum-row"><span>Product subtotal</span><strong>' + formatINR(Cart.subtotal()) + "</strong></p>" +
      '<p class="muted small">This cart is a shopping aid. Delivery charges and the final total are confirmed by the store on WhatsApp. No payment is taken on this website.</p>' +
      '<button id="cart-order" class="btn btn-wa" type="button">Proceed to WhatsApp Order</button>' +
      '<a class="btn btn-ghost" href="shop.html">Continue Shopping</a><button id="cart-clear" class="link-btn" type="button">Clear cart</button></aside>';
    const ob = document.getElementById("cart-order");
    if (!waConfigured()) { ob.disabled = true; ob.insertAdjacentHTML("afterend", '<p class="warn" role="alert">Setup needed: add the store WhatsApp number in js/config.js.</p>'); }
  }
  root.addEventListener("click", e => {
    const t = e.target, items = Cart.read();
    if (t.dataset.inc) Cart.setQty(+t.dataset.inc, items[+t.dataset.inc].qty + 1);
    else if (t.dataset.dec) { const i = +t.dataset.dec; items[i].qty <= 1 ? Cart.remove(i) : Cart.setQty(i, items[i].qty - 1); }
    else if (t.dataset.remove) Cart.remove(+t.dataset.remove);
    else if (t.id === "cart-clear") { if (confirm("Remove all items from your cart?")) Cart.clear(); }
    else if (t.id === "cart-order") { openWhatsApp(buildCartMessage(items)); return; }
    else return;
    render();
  });
  render();
});
