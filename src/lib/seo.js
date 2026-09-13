import { useEffect } from "react";

export const SITE_URL = "https://theaviatorboxer.com";

export const FALLBACK_TITLE = "THE AVIATOR — Boxers Premium pour Hommes | Paiement à la livraison au Maroc";
export const FALLBACK_DESCRIPTION =
  "THE AVIATOR — Boxers premium pour hommes au Maroc. 95% coton, 5% Lycra, confort et maintien. Paiement à la livraison, livraison 24-48h partout au Maroc.";
export const FALLBACK_OG_IMAGE = `${SITE_URL}/og-default.png`;

const LOCALE_MAP = {
  "fr-MA": "fr_MA",
  "ar-MA": "ar_MA",
};

function ensureTag(tagName, attributes) {
  const key = attributes.name ? `name` : attributes.property ? `property` : attributes.rel ? `rel` : null;
  const value = key ? attributes[key] : null;
  let element = key && value ? document.querySelector(`${tagName}[${key}="${value}"]`) : document.querySelector(tagName);
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([attr, v]) => {
    if (v !== undefined && v !== null && v !== "") element.setAttribute(attr, v);
    else element.removeAttribute(attr);
  });
  return element;
}

function currentLocale() {
  const lang = document.documentElement.lang || "fr-MA";
  return LOCALE_MAP[lang] || "fr_MA";
}

/**
 * Central per-page SEO manager.
 * Sets title, description, canonical, robots, OpenGraph, Twitter and image tags.
 * Safe to call on every route; tags are created if missing (works after client-side nav).
 */
export function usePageMeta({
  title,
  description,
  image = FALLBACK_OG_IMAGE,
  type = "website",
  noindex = false,
  keywords,
}) {
  useEffect(() => {
    const finalTitle = title || FALLBACK_TITLE;
    const finalDescription = description || FALLBACK_DESCRIPTION;
    const finalImage = image || FALLBACK_OG_IMAGE;
    const url = window.location.origin + window.location.pathname;
    const locale = currentLocale();

    document.title = finalTitle;

    const tags = [
      ["meta", { name: "description", content: finalDescription }],
      ["meta", { name: "robots", content: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large" }],
      ["meta", { name: "keywords", content: keywords }],
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:title", content: finalTitle }],
      ["meta", { property: "og:description", content: finalDescription }],
      ["meta", { property: "og:image", content: finalImage }],
      ["meta", { property: "og:image:width", content: "1200" }],
      ["meta", { property: "og:image:height", content: "630" }],
      ["meta", { property: "og:type", content: type }],
      ["meta", { property: "og:url", content: url }],
      ["meta", { property: "og:site_name", content: "The Aviator" }],
      ["meta", { property: "og:locale", content: locale }],
      ["meta", { property: "og:locale:alternate", content: locale === "fr_MA" ? "ar_MA" : "fr_MA" }],
      ["meta", { name: "twitter:card", content: "summary_large_image" }],
      ["meta", { name: "twitter:title", content: finalTitle }],
      ["meta", { name: "twitter:description", content: finalDescription }],
      ["meta", { name: "twitter:image", content: finalImage }],
      ["meta", { name: "twitter:url", content: url }],
    ];

    tags.forEach(([tagName, attrs]) => ensureTag(tagName, attrs));
  }, [title, description, image, type, noindex, keywords]);
}

// Injects a JSON-LD structured-data block (docs: https://schema.org).
export function useJsonLd(graph) {
  useEffect(() => {
    if (!graph) return undefined;
    const id = "aviator-jsonld-app";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify(graph);
    document.head.appendChild(script);
    return () => { document.getElementById(id)?.remove(); };
  }, [graph]);
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "The Aviator",
    url: SITE_URL,
    description: "Boxers premium pour hommes au Maroc — coton et Lycra. Paiement à la livraison partout au Maroc.",
    inLanguage: ["fr-MA", "ar-MA"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/collection?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(steps) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: steps.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: step.url,
    })),
  };
}

export function productJsonLd(product) {
  const url = product ? `${SITE_URL}/produit/${product.slug}` : SITE_URL;
  const image = product?.images?.[0];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Collection", item: `${SITE_URL}/collection` },
          ...(product ? [{ "@type": "ListItem", position: 3, name: product.name, item: url }] : []),
        ],
      },
      ...(product
        ? [{
            "@type": "Product",
            name: product.name,
            description: product.description || product.short_description || undefined,
            image: image || undefined,
            url,
            sku: product.slug?.toUpperCase(),
            brand: { "@type": "Brand", name: "The Aviator" },
            ...(product.rating > 0
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: product.rating > 5 ? 5 : product.rating,
                    bestRating: 5,
                    ratingCount: product.review_count || 0,
                  },
                }
              : {}),
            offers: {
              "@type": "Offer",
              priceCurrency: "MAD",
              price: Number(product.price) || 0,
              priceValidUntil: new Date(Date.now() + 86400000 * 120).toISOString().slice(0, 10),
              availability: (product.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url,
              acceptedPaymentMethod: ["https://schema.org/Cash"],
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: { "@type": "MonetaryAmount", currency: "MAD", value: 35 },
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "MA" },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
                  transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
                },
              },
            },
          }]
        : []),
    ],
  };
}