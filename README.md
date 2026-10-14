# KHK Fashion Store (static storefront)

Plain HTML, CSS and vanilla JavaScript. No backend, no payments. Orders and enquiries open a prefilled WhatsApp chat; the store confirms every order itself.

## Before launch (required)
1. `js/config.js`: set `whatsappNumber` (digits only with country code, e.g. `919058699070`) and `siteUrl` (your final HTTPS domain).
2. `js/products.js`: replace the **sample** products with real, verified items, prices and photos. Then set `sampleCatalogue: false` in `config.js` (this also enables Product/Offer structured data).
3. Replace placeholder images in `assets/images/` with photos you own or are authorised to use. Use WebP/AVIF, resized (about 800x1000), with descriptive file names.
4. Do not use third-party brand names or logos in product names or images unless you are an authorised seller of those brands.
5. Fill every yellow `[TO BE CONFIRMED BY STORE OWNER]` item in the policy, FAQ, About and Contact pages (edit `build.py`, then rebuild). Have the legal pages reviewed.
6. Rebuild so canonical URLs, sitemap and robots use your domain:

```
SITE_URL=https://your-domain.com python3 build.py
```
For a staging site use `STAGING=1 SITE_URL=... python3 build.py` (adds noindex and `Disallow: /`). Never deploy that to production.

## Local preview
```
python3 -m http.server 8000
```
Open http://localhost:8000. (Opening files directly also works, but a server mirrors production.)

## Adding or editing products
Edit the `PRODUCTS` array in `js/products.js` (id/slug must be lowercase letters, numbers and hyphens). Add `sizes: ["S","M"]` for sized items; size selection then becomes required. Rebuild afterwards so `sitemap.xml` lists the new product URLs.

## Structure
`build.py` generates the pages (shared header/footer, SEO tags, JSON-LD, sitemap, robots). Edit content there and re-run. See `DEPLOYMENT.md` and `GOOGLE-SEARCH-CONSOLE-SETUP.md`.
