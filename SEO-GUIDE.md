# SEO Guide — theaviatorboxer.com

Operational checklist to grow organic traffic every day. The code side of these items
is already implemented — the remaining steps require accounts/consoles that only the
site owner can access.

## 1. Verification (Google Search Console + Bing)

Uncomment and fill the placeholders in `index.html`:

```html
<meta name="google-site-verification" content="YOUR_TOKEN" />
<meta name="msvalidate.01" content="YOUR_BING_TOKEN" />
```

Then:
- Google Search Console → add property **theaviatorboxer.com** → recommended DNS or HTML meta tag.
- Bing Webmaster Tools → import from GSC (fastest path).

## 2. Submit the sitemap

- GSC → Sitemaps → submit `https://theaviatorboxer.com/sitemap.xml`
- Bing → Sitemaps → same URL.
- The sitemap is regenerated on every build (`prebuild` runs `node scripts/generate-sitemap.mjs`)
  and now includes **every product** (`/produit/<slug>`) with `lastmod`, on top of the static pages.

## 3. Request indexing
- After deploy, GSC → URL inspection → request indexing for: `/`, `/collection`, `/packs`, each product.

## 4. Analytics / pixels (already wired, needs IDs)
All trackers are env-driven and fail silently. Fill them (do NOT commit secrets):

```bash
# .env.local
VITE_GA_ID=G-XXXXXXX          # Google Analytics 4
VITE_META_PIXEL_ID=XXXXX      # Meta (Facebook/Instagram) pixel
VITE_TIKTOK_PIXEL_ID=XXXX     # TikTok pixel
```

`src/lib/analytics.js` fires `initAnalytics()` from `main.jsx` and tracks events
(purchase, add_to_cart, etc.) — verify events appear under GA4 → Reports → **Realtime**.

## 5. Google Business Profile (local SEO — biggest quick win)
- Create a free GMB profile for your store/city → category "Clothing store".
- Add: phone, WhatsApp, photos, product links, delivery area "Casablanca" + "tout le Maroc".
- Local searches ("boxer homme casablanca", "sous-vêtement homme maroc") feed on this.

## 6. Social profiles + sameAs
The Organization schema already references the site; add your Instagram/Facebook/TikTok
URLs to `index.html` Organization JSON-LD (`sameAs`, `contactPoint`). Consistent NAP
(name/phone) across GMB, Instagram bio, WhatsApp and the footer builds trust signals.

## 7. Content / traffic levers
- Keep product descriptions unique (fill `description` per product in admin — empty
  descriptions weaken rankings).
- FAQ page is already FAQPage-schema'd — add one Q&A per real customer question
  ("livraison agadir", "taille M ou L", "échange comment", "paiement à la livraison").
- Link every product to a related product (internal links).
- GET MORE REVIEWS → `aggregateRating` already injected; ratings/rich stars in SERPs
  lift CTR substantially.

## 8. Cleanup (today)
- The `okok` product exists in the DB and is excluded from the sitemap by
  `scripts/generate-sitemap.mjs`. **Delete it in admin** so Google never indexes
  `/produit/okok`.

## 9. Monitoring cadence
- Weekly: GSC → Performance (impressions/clicks), Coverage (errors → fix), Core Web Vitals.
- Re-run `pnpm run test:e2e` (20 tests) after any change.
- After each deploy, re-request indexing of changed URLs.

## 10. Optional (later, bigger wins)
- **Prerendering/SSR** for full SPA crawlability (this is a client-rendered Vite SPA;
  meta/JSON-LD work client-side, but a prerender keeps LCP + crawl cost optimal).
- Blog/guides targeting long-tail queries ("comment choisir la taille d'un boxer",
  "boxer en coton meilleur maroc").
- Cloudflare/Brotli at the edge (nginx already gzip's).