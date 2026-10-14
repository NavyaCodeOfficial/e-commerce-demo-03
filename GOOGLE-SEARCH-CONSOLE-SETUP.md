# Google Search Console setup (manual steps for the site owner)

These steps need your Google account. Nothing in this project has been verified, submitted or indexed, and no ranking is guaranteed.

1. **Deploy** the site to its final HTTPS domain (built with that domain in `SITE_URL`).
2. **Add a property** in Google Search Console. A Domain property covers all subdomains and protocols.
3. **Verify ownership** with the DNS TXT record Google gives you (add it at your domain registrar). Alternatively use the HTML-tag or file method that Google offers. Do not copy tokens from anywhere else.
4. **Submit the sitemap**: Sitemaps > enter `sitemap.xml` (full URL: `https://your-domain/sitemap.xml`).
5. **Inspect URLs**: use URL Inspection on the homepage, a collection page and a few product URLs (`product.html?id=...`), then request indexing if needed.
6. **Review reports**: Pages (indexing), Sitemaps, Core Web Vitals, and any structured-data / enhancement reports. Fix errors and re-validate.
7. **Monitor** Performance (queries, clicks) regularly, and rebuild the sitemap whenever you add products.

Notes: product pages share `product.html` and are told apart by `?id=`; each sets a self-referencing canonical to its own URL. If you later want cleaner URLs, generate one static HTML file per product.
