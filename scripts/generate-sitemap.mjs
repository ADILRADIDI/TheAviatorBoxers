// Generates public/sitemap.xml with full SEO specifications and Google Image Extensions
// Run: node scripts/generate-sitemap.mjs (also runs automatically before build via prebuild)
import { writeFile } from "node:fs/promises";

const SITE = "https://theaviatorboxer.com";
const API = process.env.VITE_API_URL || "http://localhost:3001";
const JUNK_SLUG_RE = /^(okok|test|tt|zerba)[\w-]*$/i;

const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  {
    loc: "/",
    priority: "1.0",
    freq: "daily",
    lastmod: today,
    images: [
      {
        loc: `${SITE}/images/hero-desktop.jpg`,
        title: "THE AVIATOR — Boxers Homme Premium au Maroc",
        caption: "Boxer premium pour homme en coton peigné stretch 95/5",
      },
      {
        loc: `${SITE}/images/pack-step-1.jpg`,
        title: "Pack 2 Boxers THE AVIATOR Noir et Bleu Marine",
      },
    ],
  },
  {
    loc: "/notre-boxer",
    priority: "0.9",
    freq: "daily",
    lastmod: today,
    images: [
      {
        loc: `${SITE}/products/aviator-pack-duo.jpg`,
        title: "Pack 2 Boxers THE AVIATOR — 99 DH",
        caption: "Pack de 2 boxers signature THE AVIATOR",
      },
      {
        loc: `${SITE}/products/aviator-navy.jpg`,
        title: "Boxer THE AVIATOR Bleu Marine",
      },
      {
        loc: `${SITE}/products/aviator-black.jpg`,
        title: "Boxer THE AVIATOR Noir Profond",
      },
    ],
  },
  {
    loc: "/pourquoi-nous",
    priority: "0.8",
    freq: "weekly",
    lastmod: today,
  },
  {
    loc: "/avis",
    priority: "0.8",
    freq: "daily",
    lastmod: today,
  },
  {
    loc: "/guide-des-tailles",
    priority: "0.7",
    freq: "monthly",
    lastmod: today,
  },
  {
    loc: "/contact",
    priority: "0.6",
    freq: "monthly",
    lastmod: today,
  },
  {
    loc: "/livraison-retours",
    priority: "0.6",
    freq: "monthly",
    lastmod: today,
  },
  {
    loc: "/paiement",
    priority: "0.6",
    freq: "monthly",
    lastmod: today,
  },
  {
    loc: "/faq",
    priority: "0.6",
    freq: "monthly",
    lastmod: today,
  },
  {
    loc: "/cgv",
    priority: "0.3",
    freq: "yearly",
    lastmod: today,
  },
  {
    loc: "/confidentialite",
    priority: "0.3",
    freq: "yearly",
    lastmod: today,
  },
];

// Fallback official products when API is not running
const fallbackProducts = [
  {
    slug: "aviator-essential-navy",
    name: "Pack 2 Boxers THE AVIATOR — Signature 99 DH",
    images: [
      `${SITE}/products/aviator-pack-duo.jpg`,
      `${SITE}/products/aviator-navy.jpg`,
      `${SITE}/products/aviator-black.jpg`,
    ],
    updatedAt: today,
  },
];

let products = [];
try {
  const res = await fetch(`${API}/api/products?limit=200`, { signal: AbortSignal.timeout(4000) });
  if (res.ok) {
    const data = await res.json();
    const fetched = (Array.isArray(data) ? data : data.data || []).filter(
      (p) => p && p.status === "active" && p.slug && !JUNK_SLUG_RE.test(p.slug)
    );
    if (fetched.length > 0) {
      products = fetched;
    } else {
      products = fallbackProducts;
    }
  } else {
    products = fallbackProducts;
  }
} catch {
  products = fallbackProducts;
}

const productPages = products.map((p) => ({
  loc: `/produit/${encodeURIComponent(p.slug)}`,
  priority: "0.9",
  freq: "weekly",
  lastmod: (p.updatedAt || p.createdAt || today).slice(0, 10),
  images: Array.isArray(p.images)
    ? p.images.map((img) => ({
        loc: img.startsWith("http") ? img : `${SITE}${img.startsWith("/") ? "" : "/"}${img}`,
        title: p.name,
      }))
    : [],
}));

const allUrls = [...staticPages, ...productPages];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
  .map((u) => {
    let entry = `  <url>\n    <loc>${SITE}${u.loc}</loc>`;
    if (u.lastmod) entry += `\n    <lastmod>${u.lastmod}</lastmod>`;
    entry += `\n    <changefreq>${u.freq}</changefreq>`;
    entry += `\n    <priority>${u.priority}</priority>`;
    if (u.images && u.images.length > 0) {
      u.images.forEach((img) => {
        entry += `\n    <image:image>`;
        entry += `\n      <image:loc>${img.loc}</image:loc>`;
        if (img.title) entry += `\n      <image:title>${escapeXml(img.title)}</image:title>`;
        if (img.caption) entry += `\n      <image:caption>${escapeXml(img.caption)}</image:caption>`;
        entry += `\n    </image:image>`;
      });
    }
    entry += `\n  </url>`;
    return entry;
  })
  .join("\n")}
</urlset>
`;

function escapeXml(unsafe) {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

await writeFile("public/sitemap.xml", xml);
console.log(`✓ sitemap.xml generated successfully: ${allUrls.length} URLs (${productPages.length} products, ${staticPages.length} static pages).`);