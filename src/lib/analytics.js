const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

// Marketing & analytics helpers (GA4 + Meta Pixel + TikTok Pixel).
// All functions are env-driven and fail silently — analytics never breaks UX.

const DEFAULT_TRACKERS = {
  google_analytics_id: "G-NST40JYCB7",
  google_stream_id: "15844671059",
};

function getTrackerId(envKey, settingKey) {
  const value = import.meta.env[envKey];
  if (typeof value === "string" && value.length > 0 && !value.includes("XXXXXXXXXX")) {
    return value.trim();
  }
  try {
    const siteRaw = localStorage.getItem("aviator_site_settings");
    if (siteRaw) {
      const parsed = JSON.parse(siteRaw);
      const val = parsed?.[settingKey];
      if (typeof val === "string" && val.length > 0 && !val.includes("XXXXXXXXXX")) {
        return val.trim();
      }
    }
    const adminRaw = localStorage.getItem("aviator_admin_clean_v4");
    if (adminRaw) {
      const parsed = JSON.parse(adminRaw);
      const val = parsed?.settings?.[settingKey];
      if (typeof val === "string" && val.length > 0 && !val.includes("XXXXXXXXXX")) {
        return val.trim();
      }
    }
  } catch {
    // Ignore
  }
  return DEFAULT_TRACKERS[settingKey] || "";
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

  const gaId = getTrackerId("VITE_GA_ID", "google_analytics_id");
  const gtmId = getTrackerId("VITE_GTM_ID", "google_tag_manager_id");
  const metaPixelId = getTrackerId("VITE_META_PIXEL_ID", "meta_pixel_id");
  const tiktokPixelId = getTrackerId("VITE_TIKTOK_PIXEL_ID", "tiktok_pixel_id");

  if (gaId) {
    injectScript("aviator-ga", "https://www.googletagmanager.com/gtag/js?id=" + gaId, (script) => {
      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() { window.dataLayer.push(arguments); };
        window.gtag("js", new Date());
        window.gtag("config", gaId, {
          send_page_view: true,
          cookie_flags: "SameSite=None;Secure"
        });
      };
    });
    // In case script was already loaded
    if (window.gtag) {
      window.gtag("config", gaId, {
        send_page_view: true,
        cookie_flags: "SameSite=None;Secure"
      });
    }
  }

  if (gtmId) {
    injectScript("aviator-gtm", `https://www.googletagmanager.com/gtm.js?id=${gtmId}`);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  }

  if (metaPixelId) {
    injectScript("aviator-meta-pixel", "https://connect.facebook.net/en_US/fbevents.js", (script) => {
      script.onload = () => {
        window.fbq = window.fbq || function () { (window.fbq.q = window.fbq.q || []).push(arguments); };
        window.fbq("init", metaPixelId);
        window.fbq("track", "PageView");
      };
    });
  }

  if (tiktokPixelId) {
    injectScript("aviator-tiktok-pixel", "https://analytics.tiktok.com/i18n/pixel/events.js", (script) => {
      script.onload = () => {
        window.ttq = window.ttq || [];
        window.ttq.load(tiktokPixelId);
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

if (typeof window !== "undefined") {
  window.addEventListener("aviator-settings-updated", () => {
    initAnalytics();
  });
}