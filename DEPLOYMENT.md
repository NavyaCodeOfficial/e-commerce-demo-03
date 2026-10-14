# Deployment and caching

The site is static: upload the whole folder to Netlify, Vercel, GitHub Pages or any static host.

## Steps
1. Complete the checklist in `README.md` and rebuild with your real `SITE_URL`.
2. Deploy. Force HTTPS and one hostname (redirect `www` to non-www or the reverse) in your host settings.
3. Confirm `https://your-domain/404.html` is served for unknown URLs (Netlify and Vercel do this automatically; on GitHub Pages `404.html` is used by default).

## Caching (set via HTTP headers, not JavaScript)
Caching is controlled by your host's headers. A ready `_headers` file for **Netlify / Cloudflare Pages** is included. For Vercel, add the equivalent to `vercel.json` `headers`.

- HTML, `sitemap.xml`, `robots.txt`: `Cache-Control: public, max-age=0, must-revalidate` (always revalidate).
- CSS, JS, images: this project uses plain file names, so use a **short** cache (the `_headers` file sets 1 day with revalidation). Only switch to `max-age=31536000, immutable` after you add content hashes to file names (e.g. `styles.3f2a1c.css`) so a changed file gets a new name.

## Minification and images
For production, minify CSS/JS (for example `npx esbuild js/app.js --minify`, or your host's build step) and compress images (WebP/AVIF). Keep the originals readable in your repository.

## Checks after deploy
Open every page on a phone, test the cart and both WhatsApp flows with your real number, validate JSON-LD in Google's Rich Results Test, and open `/sitemap.xml` and `/robots.txt`.
