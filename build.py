#!/usr/bin/env python3
"""Static page generator for Navya Fashion Store.

Run:  SITE_URL=https://your-domain.com python3 build.py
It writes all HTML pages, sitemap.xml, robots.txt and placeholder SVG images.
The shared header/footer live here so every page stays consistent and fully
crawlable without JavaScript.
"""
import os, re, json, datetime, pathlib

ROOT = pathlib.Path(__file__).parent
SITE = os.environ.get("SITE_URL", "https://www.example.com").rstrip("/")
NAME = "Navya Fashion Store"
IG = "https://www.instagram.com/navyacode/"
STAGING = os.environ.get("STAGING") == "1"
TODO = lambda t: '<span class="todo">[TO BE CONFIRMED BY STORE OWNER: %s]</span>' % t

# ---------- placeholder images (replace with real, authorised photos) ----------
def svg(bg, body, label):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000" role="img" aria-label="%s">'
            '<rect width="800" height="1000" fill="%s"/>%s'
            '<text x="400" y="940" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#8a7a66">Placeholder image</text></svg>') % (label, bg, body)

WATCH = '<rect x="330" y="80" width="140" height="260" rx="30" fill="#c8b9a6"/><rect x="330" y="660" width="140" height="260" rx="30" fill="#c8b9a6"/><circle cx="400" cy="500" r="190" fill="#fff" stroke="#202020" stroke-width="14"/><circle cx="400" cy="500" r="150" fill="#f8f8f6"/><path d="M400 500V390M400 500l70 40" stroke="#202020" stroke-width="10" stroke-linecap="round"/><circle cx="400" cy="500" r="12" fill="#202020"/>'
SUN = '<g fill="#202020"><rect x="120" y="400" width="250" height="190" rx="70"/><rect x="430" y="400" width="250" height="190" rx="70"/></g><path d="M370 450q30-30 60 0" stroke="#202020" stroke-width="16" fill="none"/><path d="M120 440L70 400M680 440l50-40" stroke="#202020" stroke-width="16" stroke-linecap="round"/>'
BAG = '<path d="M270 400v-70a130 130 0 0 1 260 0v70" fill="none" stroke="#202020" stroke-width="24"/><path d="M180 400h440l40 380a30 30 0 0 1-30 34H170a30 30 0 0 1-30-34z" fill="#c8b9a6" stroke="#202020" stroke-width="10"/><circle cx="400" cy="520" r="22" fill="#202020"/>'
TINTS = ["#F0F0ED", "#F5EFE6", "#E9ECEA"]

def write(rel, text):
    p = ROOT / rel; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(text, encoding="utf-8")

for name, body, label in (("watch", WATCH, "Placeholder watch illustration"), ("sunglasses", SUN, "Placeholder sunglasses illustration"), ("bag", BAG, "Placeholder handbag illustration")):
    for i, t in enumerate(TINTS, 1):
        write("assets/images/%s-%d.svg" % (name, i), svg(t, body, label))
write("assets/images/hero-placeholder.svg", svg("#F0F0ED", WATCH.replace('r="190"', 'r="230"'), "Placeholder campaign image"))
write("assets/images/og-placeholder.svg", svg("#F0F0ED", WATCH, "Navya Fashion Store"))

# ---------- shared layout ----------
ICON = lambda p: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">%s</svg>' % p
NAV = [("index.html", "Home"), ("shop.html", "Shop"), ("collections.html", "Collections"), ("about.html", "About"), ("contact.html", "Contact")]

def header(active):
    links = "".join('<a href="%s"%s>%s</a>' % (h, ' aria-current="page"' if h == active else "", t) for h, t in NAV)
    return ('<a class="skip" href="#main">Skip to content</a>'
        '<div class="announce"><p id="announce-text">Order requests are confirmed by the store on WhatsApp.</p></div>'
        '<header class="site-header"><div class="container header-in">'
        '<a class="wordmark" href="index.html" aria-label="Navya Fashion Store home">Navya <span>Fashion Store</span></a>'
        '<nav id="site-nav" class="nav" aria-label="Main">%s</nav>'
        '<a class="icon-btn" href="shop.html?focus=search" aria-label="Search products">%s</a>'
        '<a class="icon-btn" href="cart.html" aria-label="Shopping bag">%s<span class="badge" data-cart-count hidden>0</span></a>'
        '<button id="menu-toggle" class="icon-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">%s</button>'
        '</div></header>') % (links,
        ICON('<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>'),
        ICON('<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
        ICON('<path d="M4 7h16M4 12h16M4 17h16"/>'))

FOOTER = ('<footer class="site-footer"><div class="container"><div class="foot-grid">'
    '<div><h2>Navya Fashion Store</h2><p class="muted">Browse the collection and send your order request through WhatsApp.</p></div>'
    '<nav aria-label="Footer"><h2>Explore</h2><ul><li><a href="shop.html">Shop</a></li><li><a href="collections.html">Collections</a></li><li><a href="about.html">About</a></li><li><a href="faq.html">FAQ</a></li><li><a href="contact.html">Contact</a></li></ul></nav>'
    '<nav aria-label="Policies"><h2>Policies</h2><ul><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="terms-and-conditions.html">Terms and Conditions</a></li><li><a href="shipping-policy.html">Shipping Policy</a></li><li><a href="return-refund-policy.html">Return &amp; Refund Policy</a></li><li><a href="sitemap.xml">Sitemap</a></li></ul></nav>'
    '<div><h2>Connect</h2><ul><li><a href="#" data-wa-chat>Chat on WhatsApp</a></li><li><a href="' + IG + '" target="_blank" rel="noopener noreferrer">Instagram</a></li></ul></div>'
    '</div><p class="copy">&copy; <span data-year>2026</span> Navya Fashion Store. All rights reserved.</p></div></footer>')

ORG = {"@context": "https://schema.org", "@type": "Organization", "name": NAME, "url": SITE + "/", "sameAs": [IG]}  # only verified facts
def website():
    return {"@context": "https://schema.org", "@type": "WebSite", "name": NAME, "url": SITE + "/"}

def crumb_ld(items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + "/" + u} for i, (n, u) in enumerate(items)]}

def page(file, title, desc, body, active="", ld=None, noindex=False, scripts=("config", "products", "app", "cart", "whatsapp"), data_page=""):
    canon = SITE + "/" + ("" if file == "index.html" else file)
    robots = "noindex, nofollow" if (noindex or STAGING) else "index, follow"
    ldjson = "".join('<script type="application/ld+json">%s</script>' % json.dumps(x) for x in (ld or []))
    sc = "".join('<script src="js/%s.js" defer></script>' % s for s in scripts)
    html = ('<!DOCTYPE html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        '<title>%s</title><meta name="description" content="%s"><meta name="robots" content="%s"><meta name="theme-color" content="#ffffff">'
        '<link rel="canonical" href="%s"><meta property="og:type" content="website"><meta property="og:site_name" content="%s">'
        '<meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:url" content="%s">'
        '<meta property="og:image" content="%s/assets/images/og-placeholder.svg"><meta name="twitter:card" content="summary_large_image">'
        '<link rel="icon" href="assets/images/watch-1.svg" type="image/svg+xml">'
        '<link rel="stylesheet" href="css/styles.css"><link rel="stylesheet" href="css/responsive.css">%s</head>'
        '<body data-page="%s">%s<main id="main">%s</main>%s%s</body></html>') % (
        title, desc, robots, canon, NAME, title, desc, canon, SITE, ldjson, data_page, header(active), body, FOOTER, sc)
    write(file, html)

def crumbs(*items):
    out = '<nav class="crumbs container" aria-label="Breadcrumb"><a href="index.html">Home</a>'
    for t, u in items:
        out += '<span aria-hidden="true">/</span>' + ('<a href="%s">%s</a>' % (u, t) if u else '<span aria-current="page">%s</span>' % t)
    return out + "</nav>"

SAMPLE = '<p id="sample-note" class="notice small container" hidden>Sample catalogue: products, prices and images are placeholders until the store owner adds real listings.</p>'
def head(h1, lead=""):
    return '<div class="container page-head"><h1>%s</h1>%s</div>' % (h1, ('<p class="muted">%s</p>' % lead) if lead else "")

# ---------- pages ----------
home = ('<section class="hero"><div class="container hero-in"><div><p class="eyebrow">Navya Fashion Store</p><h1>Style That Speaks.</h1>'
    '<p class="lead">Discover fashion that fits your style. Explore the collection and order directly through WhatsApp.</p>'
    '<div class="btn-row"><a class="btn" href="shop.html">Shop Collection</a><a class="btn btn-wa" href="#" data-wa-chat>Enquire on WhatsApp</a></div></div>'
    '<div class="hero-img"><img src="assets/images/hero-placeholder.svg" alt="Placeholder campaign image for the Navya Fashion Store collection" width="800" height="1000" fetchpriority="high"></div></div></section>'
    + SAMPLE +
    '<section class="section" aria-labelledby="h-col"><div class="container"><div class="section-head"><h2 id="h-col">Featured Collections</h2><a class="link" href="collections.html">All collections</a></div><div class="grid-3">'
    + "".join('<a class="card cat-card" href="shop.html?category=%s"><div class="card-media"><img src="assets/images/%s-1.svg" alt="" width="800" height="1000" loading="lazy"></div><div class="card-body"><h3>%s</h3><p class="muted small" data-count-cat="%s"></p></div></a>' % (i, im, n, i)
              for i, im, n in (("watches", "watch", "Watches"), ("sunglasses", "sunglasses", "Sunglasses"), ("bags", "bag", "Bags")))
    + '</div></div></section>'
    '<section class="section alt" aria-labelledby="h-feat"><div class="container"><div class="section-head"><h2 id="h-feat">Featured Products</h2><a class="link" href="shop.html">View all products</a></div><div class="grid" id="featured-grid"></div><noscript><p>Please enable JavaScript to see products, or <a href="shop.html">visit the shop</a>.</p></noscript></div></section>'
    '<section class="section" aria-labelledby="h-intro"><div class="container prose"><h2 id="h-intro">About Navya Fashion Store</h2><p>Navya Fashion Store shares its collection on Instagram and takes order requests directly. This website makes it easier to browse items and send an organised order message. ' + TODO("replace with your own brand introduction") + '</p><a class="link" href="about.html">Read more</a></div></section>'
    '<section class="section alt" aria-labelledby="h-why"><div class="container"><h2 id="h-why">Why Shop With Us</h2><div class="grid-3">'
    '<div class="card feature"><h3>Easy Ordering</h3><p class="muted">Pick your items and send the order request in one tap.</p></div>'
    '<div class="card feature"><h3>Personal Assistance</h3><p class="muted">Ask questions about any product directly on WhatsApp.</p></div>'
    '<div class="card feature"><h3>Simple Shopping</h3><p class="muted">Browse, filter and compare products without creating an account.</p></div></div></div></section>'
    '<section class="section" aria-labelledby="h-ig"><div class="container"><div class="ig"><h2 id="h-ig">Follow Us on Instagram</h2><p class="muted">See new arrivals and updates on our official profile.</p>'
    '<div class="ig-grid">' + "".join('<img src="assets/images/%s-%d.svg" alt="" width="800" height="1000" loading="lazy">' % x for x in (("watch", 2), ("sunglasses", 2), ("bag", 2))) +
    '</div><a class="btn" href="' + IG + '" target="_blank" rel="noopener noreferrer">@Navya_fashionstore on Instagram</a></div></div></section>'
    '<section class="section cta"><div class="container"><h2>Found Your Style?</h2><div class="btn-row" style="justify-content:center"><a class="btn" href="shop.html">Explore Collection</a><a class="btn btn-wa" href="#" data-wa-chat>Chat With Us</a></div></div></section>')
page("index.html", "Navya Fashion Store | Explore the Latest Fashion Collection",
     "Explore the Navya Fashion Store collection, discover your style, and enquire or order conveniently through WhatsApp.", home, "index.html", [ORG, website()])

shop = (crumbs(("Shop", None)) + head("Shop the Collection", "Search and filter the full range.") + SAMPLE +
    '<section class="section" style="padding-top:0"><div class="container"><button id="filter-toggle" class="btn btn-ghost btn-sm" type="button" aria-expanded="false" aria-controls="filters">Filters &amp; Sort</button>'
    '<div class="shop-layout"><aside id="filters" class="card filters" aria-label="Filters"><label class="f" for="f-search">Search by name</label><input id="f-search" type="search" maxlength="80" autocomplete="off">'
    '<label class="f" for="f-category">Category</label><select id="f-category"></select><label class="f" for="f-color">Colour</label><select id="f-color"></select>'
    '<label class="f" for="f-sort">Sort by</label><select id="f-sort"><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>'
    '<p style="margin-top:16px"><button id="f-clear" class="btn btn-ghost btn-sm" type="button">Clear filters</button></p></aside>'
    '<div><div class="result-bar"><span id="result-count" class="muted" aria-live="polite"></span></div><div class="grid" id="shop-grid" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))"></div>'
    '<div id="empty-state" class="empty" hidden><h2>No products found</h2><p class="muted">Try a different search or clear the filters.</p></div></div></div></div></section>')
page("shop.html", "Shop | Navya Fashion Store", "Browse the Navya Fashion Store collection. Search, filter and sort products, then order on WhatsApp.", shop, "shop.html",
     [crumb_ld([("Home", ""), ("Shop", "shop.html")])], scripts=("config", "products", "app", "cart", "whatsapp", "shop"))

prod = ('<div class="container">' + '<nav id="crumbs" class="crumbs" aria-label="Breadcrumb"></nav>' + '<div id="product-root" class="pd"><p class="muted">Loading product&hellip;</p></div>'
    '<noscript><p>JavaScript is required to view product details. <a href="shop.html">Back to the shop</a>.</p></noscript>'
    '<section class="section" aria-labelledby="h-ask" style="padding-top:20px"><h2 id="h-ask">Have a question?</h2><form class="card form-card" data-enquiry novalidate style="max-width:560px">' + "{FORM_FIELDS}" + '</form></section>'
    '<section class="section" aria-labelledby="h-rel" style="padding-top:20px"><h2 id="h-rel">You may also like</h2><div class="grid" id="related-grid"></div></section></div>')

def form_fields(prefix):
    f = lambda n, label, inp, extra="": '<div class="field"><label for="%s-%s">%s</label>%s<p class="err" data-err="%s" aria-live="polite"></p></div>' % (prefix, n, label, inp, n)
    types = "".join("<option>%s</option>" % t for t in ("Product Question", "Size &amp; Fit", "Availability", "Shipping", "Return &amp; Refund", "Bulk Order", "Other"))
    return (f("name", "Full name *", '<input id="%s-name" name="name" type="text" autocomplete="name" required>' % prefix) +
        f("phone", "Your WhatsApp number (optional)", '<input id="%s-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel">' % prefix) +
        f("type", "Enquiry type *", '<select id="%s-type" name="type" required><option value="">Select&hellip;</option>%s</select>' % (prefix, types)) +
        f("product", "Product name or link (optional)", '<input id="%s-product" name="product" type="text" maxlength="200">' % prefix) +
        f("message", "Message *", '<textarea id="%s-message" name="message" required maxlength="1000"></textarea>' % prefix) +
        '<div class="check"><input id="%s-consent" name="consent" type="checkbox"><label for="%s-consent">I have read the <a href="privacy-policy.html">Privacy Policy</a> and understand this form opens WhatsApp with my message. This website does not send or store my enquiry on a server.</label></div><p class="err" data-err="consent" aria-live="polite"></p>' % (prefix, prefix) +
        '<p class="warn" data-setup-warning hidden role="alert">Setup needed: add the store WhatsApp number in js/config.js.</p>'
        '<button class="btn btn-wa" type="submit">Continue to WhatsApp</button>')

page("product.html", "Product | Navya Fashion Store", "View product details at Navya Fashion Store and order or ask a question on WhatsApp.", prod.replace("{FORM_FIELDS}", form_fields("pq")), "shop.html",
     scripts=("config", "products", "app", "cart", "whatsapp", "product", "seo"), data_page="product")

cols = (crumbs(("Collections", None)) + head("Collections", "Browse by category.") + SAMPLE + '<div id="collection-products"></div>')
page("collections.html", "Collections | Navya Fashion Store", "Browse Navya Fashion Store collections by category and find your next favourite piece.", cols, "collections.html",
     [crumb_ld([("Home", ""), ("Collections", "collections.html")])])

about = (crumbs(("About", None)) + head("About Navya Fashion Store") + '<div class="container prose"><p>Navya Fashion Store is an India-based fashion seller that shares its collection on <a href="' + IG + '" target="_blank" rel="noopener noreferrer">Instagram</a> and handles order requests directly with customers.</p>'
    '<p>' + TODO("add your brand story, founding year and what makes your products special") + '</p><h2>How ordering works</h2><ol><li>Browse the shop and choose your items.</li><li>Send your order request on WhatsApp from a product page or the cart.</li><li>The store replies to confirm availability, delivery charges and the final total.</li></ol>'
    '<p>An order is only confirmed once the store confirms it to you.</p><a class="btn" href="shop.html">Shop the Collection</a></div>')
page("about.html", "About | Navya Fashion Store", "Learn about Navya Fashion Store and how ordering through WhatsApp works.", about, "about.html", [crumb_ld([("Home", ""), ("About", "about.html")])])

contact = (crumbs(("Contact", None)) + head("Contact Us", "Send an enquiry and continue the chat on WhatsApp.") +
    '<div class="container contact-grid" style="padding-bottom:60px"><div class="prose"><h2>Get in touch</h2><ul><li>WhatsApp: <a href="#" data-wa-chat>Start a chat</a></li><li>Instagram: <a href="' + IG + '" target="_blank" rel="noopener noreferrer">@Navya_fashionstore</a></li><li>Address: ' + TODO("add only if you want it public") + '</li><li>Business hours: ' + TODO("add hours") + '</li></ul></div>'
    '<form class="card form-card" data-enquiry novalidate aria-labelledby="h-form"><h2 id="h-form">WhatsApp Enquiry</h2>' + form_fields("ct") +
    '<p class="muted small" style="margin-top:12px">Submitting opens WhatsApp with your message prefilled. Nothing is sent or saved by this website; the chat is handled by WhatsApp.</p></form></div>')
page("contact.html", "Contact | Navya Fashion Store", "Contact Navya Fashion Store. Send an enquiry that opens a prefilled WhatsApp chat.", contact, "contact.html", [crumb_ld([("Home", ""), ("Contact", "contact.html")])])

faqs = [("How do I place an order?", "Choose a product, select your options and tap Order on WhatsApp, or add items to the cart and use Proceed to WhatsApp Order. The store then confirms your order on WhatsApp."),
    ("Is my order confirmed when WhatsApp opens?", "No. Opening WhatsApp only sends a request. The order is confirmed when the store replies and confirms it."),
    ("Can I pay on this website?", "No payment is taken on this website. Payment arrangements are agreed with the store. " + TODO("payment methods")),
    ("How long does delivery take?", "See the <a href=\"shipping-policy.html\">Shipping Policy</a>. " + TODO("delivery estimates")),
    ("Can I return or exchange an item?", "See the <a href=\"return-refund-policy.html\">Return &amp; Refund Policy</a>.")]
faq = (crumbs(("FAQ", None)) + head("Frequently Asked Questions") + '<div class="container prose" style="padding-bottom:60px">' + "".join("<details><summary>%s</summary><p>%s</p></details>" % f for f in faqs) + "</div>")
faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", a.replace("&amp;", "&"))}} for q, a in faqs[:3]]}
page("faq.html", "FAQ | Navya Fashion Store", "Answers to common questions about ordering, payment, delivery and returns at Navya Fashion Store.", faq, "", [faq_ld, crumb_ld([("Home", ""), ("FAQ", "faq.html")])])

def legal(file, title, desc, h1, sections):
    body = crumbs((h1, None)) + head(h1, "Last updated: " + TODO("date") + ". Draft template, to be reviewed and completed by the store owner before launch.") + '<div class="container prose" style="padding-bottom:60px">' + "".join("<h2>%s</h2>%s" % s for s in sections) + "</div>"
    page(file, title, desc, body, "", [crumb_ld([("Home", ""), (h1, file)])])

legal("privacy-policy.html", "Privacy Policy | Navya Fashion Store", "How the Navya Fashion Store website handles information entered in forms, local storage and WhatsApp.", "Privacy Policy", [
    ("Information you enter", "<p>The enquiry form asks for your name, an optional phone number, an enquiry type, an optional product reference and your message. This website has no server: it does not send, receive or store these details. They are placed into a WhatsApp message that you choose to send.</p>"),
    ("Local storage", "<p>Your cart (product, option and quantity only) is stored in your browser using localStorage so it persists between visits. It stays on your device and you can clear it from the cart page or your browser settings. No payment details are collected.</p>"),
    ("WhatsApp", "<p>When you continue to WhatsApp, your message is handled by WhatsApp under its own terms and privacy policy. Messages you send are then received by the store.</p>"),
    ("Analytics and tracking", "<p>This website does not include analytics or advertising trackers. " + TODO("update this if you add any analytics tool") + "</p>"),
    ("How the store uses your messages", "<p>" + TODO("explain how the store uses details you send on WhatsApp, such as for order fulfilment and delivery") + "</p>"),
    ("Retention and your rights", "<p>" + TODO("retention period and how customers can request correction or deletion of their details") + "</p>"),
    ("Contact", "<p>" + TODO("privacy contact details") + "</p>")])
legal("terms-and-conditions.html", "Terms and Conditions | Navya Fashion Store", "Terms for using the Navya Fashion Store website and placing order requests through WhatsApp.", "Terms and Conditions", [
    ("Website use", "<p>This website is provided to browse products and prepare order requests. Please use it lawfully.</p>"),
    ("Products, pricing and availability", "<p>Descriptions, images and prices are provided in good faith and may change or contain errors. Availability is confirmed by the store when you place a request.</p>"),
    ("Orders", "<p>Adding items to the cart or opening WhatsApp does not create a confirmed order. An order is confirmed only when the store confirms it to you, including the final total and delivery charges.</p>"),
    ("Payment", "<p>No payment is taken on this website. " + TODO("accepted payment methods and when payment is due") + "</p>"),
    ("Shipping, cancellation and returns", "<p>See the <a href=\"shipping-policy.html\">Shipping Policy</a> and <a href=\"return-refund-policy.html\">Return &amp; Refund Policy</a>. " + TODO("cancellation terms") + "</p>"),
    ("Intellectual property", "<p>Website content belongs to the store or its licensors. Third-party names and marks belong to their respective owners. " + TODO("confirm you have rights to all images and names used") + "</p>"),
    ("Limitation and contact", "<p>" + TODO("limitation of liability wording (consider legal advice) and contact details") + "</p>")])
legal("shipping-policy.html", "Shipping Policy | Navya Fashion Store", "Shipping and delivery information for Navya Fashion Store orders.", "Shipping Policy", [
    ("Delivery areas", "<p>" + TODO("areas you deliver to") + "</p>"), ("Dispatch time", "<p>" + TODO("estimated dispatch time") + "</p>"),
    ("Delivery estimate", "<p>" + TODO("estimated delivery time") + "</p>"), ("Shipping charges", "<p>" + TODO("charges, or how they are confirmed on WhatsApp") + "</p>"),
    ("Tracking", "<p>" + TODO("whether tracking is provided and how it is shared") + "</p>")])
legal("return-refund-policy.html", "Return & Refund Policy | Navya Fashion Store", "Returns, exchanges, cancellations and refunds at Navya Fashion Store.", "Return & Refund Policy", [
    ("Eligible returns and exchanges", "<p>" + TODO("what can be returned or exchanged and within how many days") + "</p>"), ("Damaged or incorrect items", "<p>" + TODO("process and evidence required") + "</p>"),
    ("Cancellations", "<p>" + TODO("when an order can be cancelled") + "</p>"), ("Refund processing", "<p>" + TODO("refund method and timeline") + "</p>"),
    ("How to contact us", "<p>Message the store on <a href=\"#\" data-wa-chat>WhatsApp</a> with your order details.</p>")])

page("cart.html", "Your Cart | Navya Fashion Store", "Review your cart and send your order request on WhatsApp.",
     crumbs(("Cart", None)) + head("Your Cart", "A shopping aid. The store confirms your final order and total on WhatsApp.") + '<div class="container" style="padding-bottom:60px"><div id="cart-root"></div></div>', noindex=True)
page("404.html", "Page Not Found | Navya Fashion Store", "The page you requested could not be found.",
     '<div class="container empty" style="padding:80px 16px"><h1>Page not found</h1><p class="muted">The page may have moved or the link is incorrect.</p><div class="btn-row" style="justify-content:center"><a class="btn" href="index.html">Go Home</a><a class="btn btn-ghost" href="shop.html">Browse the Shop</a></div></div>', noindex=True)

# ---------- sitemap + robots ----------
products = re.findall(r'id:\s*"([a-z0-9-]+)"', (ROOT / "js/products.js").read_text())
products = [p for p in products if p not in ("watches", "sunglasses", "bags")]
urls = [""] + ["shop.html", "collections.html", "about.html", "contact.html", "faq.html", "privacy-policy.html", "terms-and-conditions.html", "shipping-policy.html", "return-refund-policy.html"]
urls += ["product.html?id=" + p for p in products]
write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      "".join("  <url><loc>%s</loc></url>\n" % (SITE + "/" + u).replace("&", "&amp;") for u in urls) + "</urlset>\n")
write("robots.txt", ("User-agent: *\nDisallow: /\n" if STAGING else "User-agent: *\nAllow: /\nDisallow: /cart.html\n") + "\nSitemap: %s/sitemap.xml\n" % SITE)
print("Built for", SITE, "| products:", len(products), "| staging:", STAGING)
