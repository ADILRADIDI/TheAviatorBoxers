import { getTrafficSource } from "./tracking";

const API_URL = import.meta.env.VITE_API_URL || "";

let cachedSettings = null;
let settingsFetchPromise = null;
let apiHealthy = null;
let lastApiCheck = 0;

async function api(path, options = {}) {
  const now = Date.now();
  // Circuit breaker: if backend failed within the last 15s, fail fast in 0ms
  if (apiHealthy === false && now - lastApiCheck < 15000) {
    throw new Error("Backend offline");
  }

  const { timeout = 250, headers, ...rest } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...headers },
      signal: controller.signal,
      ...rest,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`API request failed: ${response.status}`);
    apiHealthy = true;
    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    apiHealthy = false;
    lastApiCheck = Date.now();
    throw err;
  }
}

// ============================================================================
// BRAND CONFIGURATION
// ============================================================================

export const STORE = {
  name: "THE AVIATOR",
  tagline: "Le confort, avec une autre dimension.",
  description:
    "Boxers premium pour hommes, conçus pour offrir confort, maintien et style au quotidien.",
  whatsappNumber: "212669318641",
  whatsappDefaultMessage: "Bonjour The Aviator, je souhaite commander un pack / avoir des informations :",
  currency: "MAD",
  currencySymbol: "DH",
  freeShippingThreshold: 600,
  material: "95% Coton / 5% Élasthanne",
  email: "social@theaviatorboxer.com",
  instagram: "https://www.instagram.com/the_aviator_boxers/",
  facebook: "https://web.facebook.com/profile.php?id=61592505372934",
};

export const SIZES = ["M", "L", "XL", "XXL"];

export const SIZE_GUIDE = [
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
  email: "social@theaviatorboxer.com",
  phone: "06 91 57 31 92",
  whatsapp_number: "212669318641",
  whatsapp_default_message: "Bonjour The Aviator, je souhaite commander un pack / avoir des informations :",
  address: "Casablanca, Maroc",
  instagram: "https://www.instagram.com/the_aviator_boxers/",
  facebook: "https://web.facebook.com/profile.php?id=61592505372934",
  tiktok: "",
  youtube: "",
  google_analytics_id: "G-NST40JYCB7",
  google_stream_id: "15844671059",
  google_tag_manager_id: "",
  meta_pixel_id: "",
  tiktok_pixel_id: "",
  trust_items: [
    { title: "Tissus premium", subtitle: "95% coton / 5% Élasthanne" },
    { title: "Livraison gratuite", subtitle: "Sur Casablanca" },
    { title: "Paiement à la livraison", subtitle: "Payez à réception" },
    { title: "Qualité contrôlée", subtitle: "Normes internationales" },
  ],
  footer_columns: [
    { title: "Boutique", links: [{ label: "Notre Boxer", to: "/notre-boxer" }, { label: "Guide des tailles", to: "/guide-des-tailles" }, { label: "Avis clients", to: "/avis" }] },
    { title: "Informations", links: [{ label: "Pourquoi nous", to: "/pourquoi-nous" }, { label: "Livraison & retours", to: "/livraison-retours" }, { label: "Paiement", to: "/paiement" }] },
    { title: "Aide", links: [{ label: "FAQ", to: "/faq" }, { label: "Contact", to: "/contact" }, { label: "Conditions générales", to: "/cgv" }, { label: "Confidentialité", to: "/confidentialite" }] },
  ],
};

export async function fetchSiteSettings() {
  if (cachedSettings) return cachedSettings;
  if (settingsFetchPromise) return settingsFetchPromise;

  settingsFetchPromise = (async () => {
    try {
      const data = await api("/api/settings", { timeout: 800 });
      cachedSettings = { ...DEFAULT_SITE_SETTINGS, ...data };
      return cachedSettings;
    } catch {
      try {
        const siteRaw = localStorage.getItem("aviator_site_settings");
        if (siteRaw) {
          cachedSettings = { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(siteRaw) };
          return cachedSettings;
        }
        const adminRaw = localStorage.getItem("aviator_admin_clean_v4");
        if (adminRaw) {
          const parsed = JSON.parse(adminRaw);
          if (parsed?.settings) {
            cachedSettings = { ...DEFAULT_SITE_SETTINGS, ...parsed.settings };
            return cachedSettings;
          }
        }
      } catch {}
      cachedSettings = DEFAULT_SITE_SETTINGS;
      return cachedSettings;
    } finally {
      settingsFetchPromise = null;
    }
  })();

  return settingsFetchPromise;
}

if (typeof window !== "undefined") {
  window.addEventListener("aviator-settings-updated", (event) => {
    cachedSettings = { ...DEFAULT_SITE_SETTINGS, ...(event.detail || {}) };
  });
}

export const DEFAULT_SHIPPING = { fee: 35, delivery_time: "24-48h" };

// ============================================================================
// DATA ACCESS
// ============================================================================

export const FALLBACK_PRODUCTS = [
  {
    id: "the-aviator-boxer",
    slug: "the-aviator-boxer",
    name: "THE AVIATOR BOXER — Pack de 2",
    price: 99,
    compare_at_price: 150,
    images: [
      "/products/aviator-navy.jpg",
      "/products/aviator-black.jpg",
      "/products/aviator-white.jpg",
      "/products/aviator-pack-duo.jpg",
      "/products/aviator-navy-contrast.jpg",
    ],
    rating: 4.8,
    review_count: 120,
    color_name: "Bleu marine",
    category: "Boxers",
    stock: 100,
    description: "Pack de 2 Boxers The Aviator. 95% Coton compact, 5% Élasthanne pour un confort et un maintien inégalés.",
  },
  {
    id: "aviator-pack-4",
    slug: "aviator-essential-navy",
    name: "THE AVIATOR BOXER — Pack de 4",
    price: 189,
    compare_at_price: 250,
    images: [
      "/products/aviator-pack-duo.jpg",
      "/products/aviator-navy.jpg",
      "/products/aviator-black.jpg",
    ],
    rating: 4.9,
    review_count: 84,
    color_name: "Noir / Bleu",
    category: "Boxers",
    stock: 100,
    description: "Pack de 4 Boxers The Aviator. Le choix idéal pour renouveler son vestiaire.",
  },
];

export async function fetchProducts(filters = {}) {
  try {
    const items = await api("/api/products");
    if (Array.isArray(items) && items.length > 0) {
      return items.filter((product) => Object.entries(filters).every(([key, value]) => product[key] === value));
    }
  } catch (err) {
    // API endpoint unreachable, use fallback
  }
  return FALLBACK_PRODUCTS;
}

export async function fetchProductBySlug(slug) {
  try {
    return await api(`/api/products/${encodeURIComponent(slug)}`);
  } catch {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug) || FALLBACK_PRODUCTS[0];
  }
}

export const FALLBACK_COLORS = [
  { name: "Noir", displayName: "Noir Pilot", hex: "#111111" },
  { name: "Bleu marine", displayName: "Marine Aviateur", hex: "#07132B" },
  { name: "Bleu royal", displayName: "Bleu Altitude", hex: "#1b4d89" },
  { name: "Blanc", displayName: "Blanc Cumulus", hex: "#FFFFFF", border: true },
  { name: "Gris chiné", displayName: "Gris Titanium", hex: "#8e9297" },
  { name: "Bleu marine / bande blanche", displayName: "Bleu marine / bande blanche", hex: "#07132B", hex2: "#FFFFFF", bicolor: true },
];

export const FALLBACK_REVIEWS = [
  {
    id: "rev-1",
    author: "Mehdi B.",
    city: "Casablanca",
    rating: 5,
    comment: "Tissu très doux, maintien parfait toute la journée. La qualité est incomparable.",
    created_at: "2026-02-15",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Karim T.",
    city: "Rabat",
    rating: 5,
    comment: "Livraison rapide en 24h, emballage soigné. La taille correspond exactement.",
    created_at: "2026-02-18",
    verified: true,
  },
  {
    id: "rev-3",
    author: "Yassine M.",
    city: "Marrakech",
    rating: 5,
    comment: "La bande élastique ne roule pas. Très agréable pour le quotidien.",
    created_at: "2026-02-22",
    verified: true,
  },
];

export async function fetchColors() {
  try {
    const res = await api("/api/colors", { timeout: 600 });
    if (Array.isArray(res) && res.length > 0) {
      return res.filter((c) => c.active !== false);
    }
  } catch {}

  // Check cached colors or active admin mock database
  try {
    const cacheStr = localStorage.getItem("aviator_colors_cache");
    if (cacheStr) {
      const parsed = JSON.parse(cacheStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((c) => c.active !== false);
      }
    }
    const mockStr = localStorage.getItem("aviator_admin_clean_v4");
    if (mockStr) {
      const mockDb = JSON.parse(mockStr);
      if (Array.isArray(mockDb.colors) && mockDb.colors.length > 0) {
        return mockDb.colors.filter((c) => c.active !== false);
      }
    }
  } catch {}

  return FALLBACK_COLORS;
}

if (typeof window !== "undefined") {
  window.addEventListener("aviator-colors-updated", (event) => {
    if (event.detail && Array.isArray(event.detail)) {
      try {
        localStorage.setItem("aviator_colors_cache", JSON.stringify(event.detail));
      } catch {}
    }
  });
}

export async function fetchReviews(productId) {
  try {
    const res = await api(`/api/reviews?product_id=${encodeURIComponent(productId)}`, { timeout: 600 });
    return Array.isArray(res) && res.length > 0 ? res : FALLBACK_REVIEWS;
  } catch {
    return FALLBACK_REVIEWS;
  }
}

export async function fetchShippingZone(city) {
  if (!city) return null;
  try {
    const items = await api(`/api/shipping-zones?city=${encodeURIComponent(city)}`, { timeout: 600 });
    return items[0] || null;
  } catch {
    return null;
  }
}

export async function fetchFeaturedReviews(limit = 6) {
  try {
    const items = await api("/api/reviews", { timeout: 600 });
    return (Array.isArray(items) && items.length > 0 ? items : FALLBACK_REVIEWS).slice(0, limit);
  } catch {
    return FALLBACK_REVIEWS.slice(0, limit);
  }
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
  const traffic = getTrafficSource();
  const enrichedOrder = {
    traffic_source: order.traffic_source || traffic.source || "DIRECT",
    utm_source: order.utm_source || traffic.utm_source || "",
    utm_medium: order.utm_medium || traffic.utm_medium || "",
    utm_campaign: order.utm_campaign || traffic.utm_campaign || "",
    utm_term: order.utm_term || traffic.utm_term || "",
    utm_content: order.utm_content || traffic.utm_content || "",
    referrer: order.referrer || traffic.referrer || "",
    landing_page: order.landing_page || traffic.landing_page || "",
    ...order,
  };

  try {
    return await api("/api/orders", { method: "POST", body: JSON.stringify(enrichedOrder) });
  } catch (err) {
    // If backend is not available, create local mock order for admin
    const id = "ord-" + Date.now();
    const orderNumber = "AV-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
    const mockOrder = {
      id,
      orderNumber,
      order_number: orderNumber,
      customerName: `${enrichedOrder.first_name || ""} ${enrichedOrder.last_name || ""}`.trim() || "Client",
      firstName: enrichedOrder.first_name || "",
      lastName: enrichedOrder.last_name || "",
      phone: enrichedOrder.phone || "",
      email: enrichedOrder.email || "",
      city: enrichedOrder.city || "",
      address: enrichedOrder.address || "",
      notes: enrichedOrder.notes || "",
      status: enrichedOrder.status || "nouvelle",
      itemsCount: (enrichedOrder.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0),
      total: Math.round((enrichedOrder.total || 0) * 100),
      subtotal: enrichedOrder.subtotal,
      shippingFee: enrichedOrder.shipping_fee,
      discount: enrichedOrder.discount,
      paymentMethod: enrichedOrder.payment_method || "cod",
      coupon_code: enrichedOrder.coupon_code || "",
      source: enrichedOrder.source || "checkout",
      traffic_source: enrichedOrder.traffic_source,
      trafficSource: enrichedOrder.traffic_source,
      utm_source: enrichedOrder.utm_source,
      utm_medium: enrichedOrder.utm_medium,
      utm_campaign: enrichedOrder.utm_campaign,
      utm_term: enrichedOrder.utm_term,
      utm_content: enrichedOrder.utm_content,
      referrer: enrichedOrder.referrer,
      landing_page: enrichedOrder.landing_page,
      createdAt: new Date().toISOString(),
      items: enrichedOrder.items || [],
    };

    try {
      const rawDb = localStorage.getItem("aviator_admin_mock_db_v4");
      if (rawDb) {
        const db = JSON.parse(rawDb);
        if (Array.isArray(db.orders)) {
          db.orders.unshift(mockOrder);
          localStorage.setItem("aviator_admin_mock_db_v4", JSON.stringify(db));
        }
      }
    } catch {}

    return mockOrder;
  }
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