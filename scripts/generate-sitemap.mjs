// Generates public/sitemap.xml from static pages + live product catalog.
// Falls back to static-only sitemap if the API is unreachable (so builds never break).
// Run: pnpm run sitemap   (also runs automatically before `pnpm build` via prebuild)
import { writeFile } from "node:fs/promises";

const SITE = "https://theaviatorboxer.com";
const API = process.env.VITE_API_URL || "http://localhost:3001";
const JUNK_SLUG_RE = /^(okok|test|tt|zerba)[\w-]*$/i;

const corsa = [
  { loc: "/", priority: "1.0", freq: "daily" },
  { loc: "/collection", priority: "0.9", freq: "daily" },
  { loc: "/packs", priority: "0.9", freq: "weekly" },
  { loc: "/a-propos", priority: "0.5", freq: "monthly" },
  { loc: "/qualite", priority: "0.6", freq: "monthly" },
  { loc: "/avis", priority: "0.7", freq: "weekly" },
  { loc: "/contact", priority: "0.5", freq: "monthly" },
  { loc: "/livraison-retours", priority: "0.6", freq: "monthly" },
  { loc: "/paiement", priority: "0.6", freq: "monthly" },
  { loc: "/guide-des-tailles", priority: "0.6", freq: "monthly" },
  { loc: "/faq", priority: "0.6", freq: "monthly" },
  { loc: "/cgv", priority: "0.3", freq: "yearly" },
  { loc: "/confidentialite", priority: "0.3", freq: "yearly" },
];

let products = [];
try {
  const res = await fetch(`${API}/api/products?limit=200`, { signal: AbortSignal.timeout(8000) });
  if (res.ok) {
    const data = await res.json();
    products = (Array.isArray(data) ? data : data.data || []).filter(
      (p) => p && p.status === "active" && p.slug && !JUNK_SLUG_RE.test(p.slug)
    );
  }
} catch {
  console.warn("⚠ sitemap: API unreachable, generated static-only sitemap.");
}

const today = new Date().toISOString().slice(0, 10);
const urls = [...corsa, ...products.map((p) => ({
  loc: `/produit/${encodeURIComponent(p.slug)}`,
  priority: "0.8",
  freq: "weekly",
  lastmod: (p.updatedAt || p.createdAt || today).slice(0, 10),
}))];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE}${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

await writeFile("public/sitemap.xml", xml);
console.log(`sitemap.xml written: ${urls.length} URLs (${products.length} products, ${corsa.length} static).`);