/* WhatsApp ordering and enquiry. Uses official wa.me click-to-chat links. */
function waLink(text) {
  return "https://wa.me/" + STORE_CONFIG.whatsappNumber + "?text=" + encodeURIComponent(text);
}
function openWhatsApp(text) {
  if (!waConfigured()) { toast("Store WhatsApp number is not configured yet."); return false; }
  window.open(waLink(text), "_blank", "noopener,noreferrer");
  return true;
}
function buildProductMessage(p, qty, color, size) {
  const lines = ["Hello " + STORE_CONFIG.name + "! I'd like to order:", "",
    "Product: " + p.name, "Product ID: " + p.id, "Link: " + productUrl(p)];
  if (color) lines.push("Colour/variant: " + color);
  if (size) lines.push("Size: " + size);
  lines.push("Quantity: " + qty, "Unit price: " + formatINR(p.price), "Product subtotal: " + formatINR(p.price * qty), "",
    "Please confirm availability, delivery charges and the final total.");
  return lines.join("\n");
}
function buildCartMessage(items) {
  const lines = ["Hello " + STORE_CONFIG.name + "! I'd like to order:", ""];
  let total = 0;
  items.forEach((i, n) => {
    const p = getProduct(i.id), line = p.price * i.qty; total += line;
    const v = [i.color, i.size].filter(Boolean).join(", ");
    lines.push((n + 1) + ". " + p.name + (v ? " (" + v + ")" : ""), "   " + i.qty + " x " + formatINR(p.price) + " = " + formatINR(line), "   " + productUrl(p));
  });
  lines.push("", "Product subtotal: " + formatINR(total), "", "Please confirm availability, delivery charges and the final order total.");
  return lines.join("\n");
}

/* Enquiry forms (contact page + product page) */
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("form[data-enquiry]").forEach(form => {
    const err = (name, msg) => {
      const f = form.elements[name], box = form.querySelector('[data-err="' + name + '"]');
      if (box) box.textContent = msg || ""; if (f) f.setAttribute("aria-invalid", msg ? "true" : "false"); return !msg;
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const v = n => (form.elements[n] ? form.elements[n].value.trim() : "");
      let ok = true, first = null;
      const check = (name, msg) => { const good = err(name, msg); if (!good && !first) first = form.elements[name]; ok = ok && good; };
      check("name", v("name").length < 2 ? "Please enter your full name." : "");
      const ph = v("phone").replace(/[\s-]/g, "");
      check("phone", ph && !/^\+?\d{8,15}$/.test(ph) ? "Enter a valid phone number or leave this blank." : "");
      check("type", v("type") ? "" : "Please choose an enquiry type.");
      check("message", v("message").length < 5 ? "Please type your message (at least 5 characters)." : "");
      check("consent", form.elements.consent.checked ? "" : "Please acknowledge the privacy notice to continue.");
      if (!ok) { first && first.focus(); return; }
      const lines = ["Hello " + STORE_CONFIG.name + "! New enquiry:", "", "Name: " + v("name")];
      if (ph) lines.push("My WhatsApp number: " + ph);
      lines.push("Type: " + v("type"));
      if (v("product")) lines.push("Product: " + v("product"));
      lines.push("", v("message"));
      openWhatsApp(lines.join("\n"));
    });
  });
  if (!waConfigured()) document.querySelectorAll("[data-setup-warning]").forEach(e => e.hidden = false);
});
