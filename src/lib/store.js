const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };


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
export const DEFAULT_SHIPPING = { fee: 35, delivery_time: "24-48h" };

// ============================================================================
// DATA ACCESS
// ============================================================================

export async function fetchProducts(filters = {}) {
  const query = { status: "active", ...filters };
  const items = await db.entities.Product.filter(query, "sort_order");
  return items;
}

export async function fetchProductBySlug(slug) {
  const items = await db.entities.Product.filter({ slug, status: "active" });
  return items[0] || null;
}

export async function fetchReviews(productId) {
  const items = await db.entities.Review.filter({
    product_id: productId,
    status: "approved",
  }, "-created_date");
  return items;
}

export async function fetchFeaturedReviews(limit = 6) {
  const items = await db.entities.Review.filter(
    { status: "approved" },
    "-created_date",
    limit,
  );
  return items;
}

export async function validateCoupon(code, cartSubtotal) {
  const items = await db.entities.Coupon.filter({
    code: (code || "").toUpperCase().trim(),
    active: true,
  });
  const coupon = items[0];
  if (!coupon) return { valid: false, message: "Code promo invalide." };
  if (coupon.min_cart && cartSubtotal < coupon.min_cart) {
    return {
      valid: false,
      message: `Minimum d'achat: ${coupon.min_cart} ${STORE.currencySymbol}.`,
    };
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, message: "Ce code promo a expiré." };
  }
  return { valid: true, coupon };
}

export function computeDiscount(coupon, subtotal, shippingFee) {
  if (!coupon) return { amount: 0, freeShipping: false };
  if (coupon.discount_type === "percentage") {
    return { amount: Math.round((subtotal * coupon.value) / 100), freeShipping: false };
  }
  if (coupon.discount_type === "fixed") {
    return { amount: Math.min(coupon.value, subtotal), freeShipping: false };
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
  const n = Number(value || 0);
  return `${n.toLocaleString("fr-FR")} ${STORE.currencySymbol}`;
}

export function discountPercent(price, compareAt) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}