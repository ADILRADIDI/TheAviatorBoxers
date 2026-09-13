const API_URL = import.meta.env.VITE_API_URL || "";

async function api(path, options) {
  const response = await fetch(`${API_URL}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

// ============================================================================
// BRAND CONFIGURATION
// ============================================================================

export const STORE = {
  name: "THE AVIATOR",
  tagline: "Le confort, avec une autre dimension.",
  description:
    "Boxers premium pour hommes, conçus pour offrir confort, maintien et style au quotidien.",
  whatsappNumber: "212691573192",
  currency: "MAD",
  currencySymbol: "DH",
  freeShippingThreshold: 600,
  material: "95% Coton / 5% Lycra",
  email: "contact@theaviatorboxer.com",
  instagram: "https://instagram.com/theaviatorboxer",
  facebook: "https://facebook.com/theaviatorboxer",
};

export const SIZES = ["S", "M", "L", "XL", "XXL"];

export const SIZE_GUIDE = [
  { size: "S", waist: "74-80", hips: "88-94" },
  { size: "M", waist: "81-87", hips: "95-101" },
  { size: "L", waist: "88-94", hips: "102-108" },
  { size: "XL", waist: "95-101", hips: "109-115" },
  { size: "XXL", waist: "102-108", hips: "116-122" },
];

export const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Agadir", "Tanger", "Fès",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Safi", "Mohammedia",
  "Khouribga", "El Jadida", "Béni Mellal", "Nador", "Taza", "Settat",
  "Berrechid", "Khemisset", "Larache", "Guelmim", "Errachidia", "Essaouira",
];

// Default shipping used as fallback if no zone matches
export const DEFAULT_SITE_SETTINGS = {
  store_name: "THE AVIATOR",
  tagline: "Le confort, avec une autre dimension.",
  description:
    "Boxers premium pour hommes, conçus pour offrir confort, maintien et style au quotidien.",
  email: "contact@theaviatorboxer.com",
  phone: "06 91 57 31 92",
  whatsapp_number: "212691573192",
  address: "Casablanca, Maroc",
  instagram: "https://instagram.com/theaviatorboxer",
  facebook: "https://facebook.com/theaviatorboxer",
  tiktok: "",
  youtube: "",
  trust_items: [
    { title: "Tissus premium", subtitle: "95% coton / 5% Lycra" },
    { title: "Livraison 24-48h", subtitle: "Partout au Maroc" },
    { title: "Paiement à la livraison", subtitle: "Payez à réception" },
    { title: "Qualité contrôlée", subtitle: "Normes internationales" },
  ],
  footer_columns: [
    { title: "Boutique", links: [{ label: "Collection", to: "/collection" }, { label: "Composer un pack", to: "/packs" }, { label: "Guide des tailles", to: "/guide-des-tailles" }, { label: "Avis clients", to: "/avis" }] },
    { title: "Informations", links: [{ label: "À propos", to: "/a-propos" }, { label: "Qualité & certifications", to: "/qualite" }, { label: "Livraison & retours", to: "/livraison-retours" }, { label: "Paiement", to: "/paiement" }] },
    { title: "Aide", links: [{ label: "FAQ", to: "/faq" }, { label: "Contact", to: "/contact" }, { label: "Conditions générales", to: "/cgv" }, { label: "Confidentialité", to: "/confidentialite" }] },
  ],
};

export async function fetchSiteSettings() {
  try {
    return { ...DEFAULT_SITE_SETTINGS, ...(await api("/api/settings")) };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export const DEFAULT_SHIPPING = { fee: 35, delivery_time: "24-48h" };

// ============================================================================
// DATA ACCESS
// ============================================================================

export async function fetchProducts(filters = {}) {
  const items = await api("/api/products");
  return items.filter((product) => Object.entries(filters).every(([key, value]) => product[key] === value));
}

export async function fetchProductBySlug(slug) {
  return api(`/api/products/${encodeURIComponent(slug)}`);
}

export async function fetchReviews(productId) {
  return api(`/api/reviews?product_id=${encodeURIComponent(productId)}`);
}

export async function fetchShippingZone(city) {
  if (!city) return null;
  const items = await api(`/api/shipping-zones?city=${encodeURIComponent(city)}`);
  return items[0] || null;
}

export async function fetchActivePromotion() {
  return api("/api/promotions/active");
}

export async function fetchFeaturedReviews(limit = 6) {
  const items = await api("/api/reviews");
  return items.slice(0, limit);
}

export async function validateCoupon(code, cartSubtotal, items = []) {
  const hasPack = items.some((item) => item.category === "pack" || item.slug?.includes("pack") || item.name?.toLowerCase().includes("pack"));
  const productIds = items.map((item) => item.productId).filter(Boolean).join(",");
  const result = await api(`/api/coupons/${encodeURIComponent((code || "").toUpperCase().trim())}?has_pack=${hasPack}&product_ids=${encodeURIComponent(productIds)}`);
  if (!result.valid) return { valid: false, message: result.message || "Code promo invalide." };
  const resolvedCoupon = result.coupon;
  if (resolvedCoupon.min_cart && cartSubtotal < resolvedCoupon.min_cart) {
    return {
      valid: false,
      message: `Minimum d'achat: ${resolvedCoupon.min_cart} ${STORE.currencySymbol}.`,
    };
  }
  return { valid: true, coupon: resolvedCoupon };
}

export async function createOrder(order) {
  return api("/api/orders", { method: "POST", body: JSON.stringify(order) });
}

export function computeDiscount(coupon, subtotal, shippingFee) {
  if (!coupon) return { amount: 0, freeShipping: false };
  if (coupon.discount_type === "percentage") {
    const amount = Math.round((subtotal * coupon.value) / 100);
    return { amount: coupon.max_discount ? Math.min(amount, coupon.max_discount) : amount, freeShipping: false };
  }
  if (coupon.discount_type === "fixed") {
    const amount = Math.min(coupon.value, subtotal);
    return { amount: coupon.max_discount ? Math.min(amount, coupon.max_discount) : amount, freeShipping: false };
  }
  if (coupon.discount_type === "free_shipping") {
    return { amount: 0, freeShipping: true };
  }
  return { amount: 0, freeShipping: false };
}

// ============================================================================
// FORMATTING
// ============================================================================

export function formatPrice(value) {
  return `${formatNumber(value)} ${STORE.currencySymbol}`;
}

export function formatNumber(value) {
  const n = typeof value === "number" && Number.isFinite(value) ? value : Number(value || 0);
  return n.toLocaleString("fr-FR");
}

export function discountPercent(price, compareAt) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}