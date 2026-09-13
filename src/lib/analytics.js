const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

// Marketing & analytics helpers (GA4 + Meta Pixel + TikTok Pixel).
// All functions are env-driven and fail silently — analytics never breaks UX.

function hasId(key) {
  const value = import.meta.env[key];
  return typeof value === "string" && value.length > 0;
}

function injectScript(id, src, customSetup) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  if (customSetup) customSetup(script);
  document.head.appendChild(script);
}

export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (hasId("VITE_GA_ID")) {
    injectScript("aviator-ga", "https://www.googletagmanager.com/gtag/js?id=" + import.meta.env.VITE_GA_ID, (script) => {
      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() { window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", import.meta.env.VITE_GA_ID);
      };
    });
  }
  if (hasId("VITE_META_PIXEL_ID")) {
    injectScript("aviator-meta-pixel", "https://connect.facebook.net/en_US/fbevents.js", (script) => {
      script.onload = () => {
        window.fbq = window.fbq || function () { (window.fbq.q = window.fbq.q || []).push(arguments); };
        window.fbq("init", import.meta.env.VITE_META_PIXEL_ID);
        window.fbq("track", "PageView");
      };
    });
  }
  if (hasId("VITE_TIKTOK_PIXEL_ID")) {
    injectScript("aviator-tiktok-pixel", "https://analytics.tiktok.com/i18n/pixel/events.js", (script) => {
      script.onload = () => {
        window.ttq = window.ttq || [];
        window.ttq.load(import.meta.env.VITE_TIKTOK_PIXEL_ID);
        window.ttq.page();
      };
    });
  }
}

function forwardToPixels(event, properties = {}) {
  try {
    if (typeof window === "undefined") return;
    if (window.gtag) window.gtag("event", event, properties);
    if (window.fbq) {
      if (event === "purchase" && properties.value) {
        window.fbq("track", "Purchase", { value: properties.value, currency: properties.currency || "MAD", content_type: "product", num_items: properties.quantity });
      } else if (event === "add_to_cart" || event === "view_content" || event === "begin_checkout") {
        window.fbq("track", mapMetaEvent[event] || event, { content_ids: properties.content_ids, content_type: "product", value: properties.value, currency: properties.currency || "MAD" });
      } else {
        window.fbq("track", "PageView");
      }
    }
    if (window.ttq) window.ttq.track(mapTikTokEvent[event] || event, properties);
  } catch {
    // Ignore
  }
}

const mapMetaEvent = { add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", view_content: "ViewContent", purchase: "Purchase" };
const mapTikTokEvent = { page_view: "Pageview", add_to_cart: "AddToCart", begin_checkout: "InitiateCheckout", view_content: "ViewContent", purchase: "CompletePayment" };

export function track(event, properties = {}) {
  try {
    db.analytics.track({ eventName: event, properties });
  } catch {
    // Silently ignore — analytics should never break the UX
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("aviator-analytics", { detail: { event, properties } }));
    forwardToPixels(event, properties);
  }
}

export const Events = {
  PAGE_VIEW: "page_view",
  VIEW_CONTENT: "view_content",
  SEARCH: "search",
  ADD_TO_CART: "add_to_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
  LEAD: "lead",
  WHATSAPP_CLICK: "whatsapp_click",
};