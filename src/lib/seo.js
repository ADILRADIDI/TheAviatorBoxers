import { useEffect } from "react";

const SITE_URL = "https://theaviatorboxer.com";
const FALLBACK_TITLE = "THE AVIATOR — Boxers Premium pour Hommes | Livraison partout au Maroc";

export function usePageMeta({ title, description }) {
  useEffect(() => {
    const finalTitle = title || FALLBACK_TITLE;
    const finalDescription = description || "THE AVIATOR — Boxers premium pour hommes. 95% coton, 5% Lycra. Confort, maintien et style. Paiement à la livraison. Livraison 24-48h partout au Maroc.";
    function setMeta(selector, attr, value) {
      const element = document.querySelector(selector);
      if (element) element.setAttribute(attr, value);
    }
    document.title = finalTitle;
    setMeta('meta[name="description"]', "content", finalDescription);
    setMeta('meta[property="og:title"]', "content", finalTitle);
    setMeta('meta[property="og:description"]', "content", finalDescription);
    setMeta('meta[name="twitter:title"]', "content", finalTitle);
    setMeta('meta[name="twitter:description"]', "content", finalDescription);
    setMeta('link[rel="canonical"]', "href", window.location.origin + window.location.pathname);
  }, [title, description]);
}

// Injects a JSON-LD structured-data block (docs: https://schema.org).
export function useJsonLd(graph) {
  useEffect(() => {
    if (!graph) return undefined;
    const id = "aviator-jsonld";
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
    inLanguage: "fr-MA",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/collection?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
            offers: {
              "@type": "Offer",
              priceCurrency: "MAD",
              price: product.price,
              availability: (product.stock || 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              url,
            },
          }]
        : []),
    ],
  };
}