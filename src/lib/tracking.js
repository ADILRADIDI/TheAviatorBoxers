/**
 * Traffic Source & Attribution Tracking for The Aviator
 * Tracks UTM parameters, Referrers (TikTok, Facebook, Instagram, YouTube, Google, etc.),
 * and persists first-touch attribution into localStorage ('aviator_traffic_source').
 */

const STORAGE_KEY = "aviator_traffic_source";

/**
 * Detect traffic source from referrer URL
 */
function detectReferrerSource(referrer) {
  if (!referrer) return "DIRECT";

  try {
    const url = new URL(referrer);
    const host = url.hostname.toLowerCase();

    // Check if internal navigation from same host
    if (typeof window !== "undefined" && url.hostname === window.location.hostname) {
      return "DIRECT";
    }

    if (host.includes("tiktok.com") || host.includes("byteoversea.com") || host.includes("bytedance.com")) {
      return "TIKTOK";
    }
    if (host.includes("instagram.com")) {
      return "INSTAGRAM";
    }
    if (host.includes("facebook.com") || host.includes("fb.com") || host.includes("m.facebook.com") || host.includes("l.facebook.com") || host.includes("lm.facebook.com")) {
      return "FACEBOOK";
    }
    if (host.includes("youtube.com") || host.includes("youtu.be")) {
      return "YOUTUBE";
    }
    if (host.includes("google.") || host.includes("google.com") || host.includes("google.co.ma") || host.includes("google.fr")) {
      return "GOOGLE";
    }
    if (host.includes("snapchat.com")) {
      return "SNAPCHAT";
    }
    if (host.includes("twitter.com") || host.includes("x.com") || host.includes("t.co")) {
      return "TWITTER";
    }
    if (host.includes("pinterest.com")) {
      return "PINTEREST";
    }
    if (host.includes("linkedin.com") || host.includes("lnkd.in")) {
      return "LINKEDIN";
    }
    if (host.includes("whatsapp.com") || host.includes("wa.me")) {
      return "WHATSAPP";
    }

    return host.replace(/^www\./, "").toUpperCase();
  } catch {
    return "REFERRAL";
  }
}

/**
 * Normalize source names into standard tags (TIKTOK, FACEBOOK, INSTAGRAM, YOUTUBE, GOOGLE, DIRECT, etc.)
 */
export function normalizeSourceTag(source) {
  if (!source) return "DIRECT";
  const s = String(source).trim().toUpperCase();

  if (s.includes("TIKTOK") || s.includes("TT")) return "TIKTOK";
  if (s.includes("INSTA") || s.includes("IG")) return "INSTAGRAM";
  if (s.includes("FACEBOOK") || s.includes("FB") || s.includes("META")) return "FACEBOOK";
  if (s.includes("YOUTUBE") || s.includes("YT")) return "YOUTUBE";
  if (s.includes("GOOGLE") || s.includes("ADWORDS") || s.includes("GADS")) return "GOOGLE";
  if (s.includes("SNAPCHAT") || s.includes("SNAP")) return "SNAPCHAT";
  if (s.includes("TWITTER") || s === "X") return "TWITTER";
  if (s.includes("DIRECT") || s === "NONE") return "DIRECT";
  if (s.includes("WHATSAPP") || s === "WA") return "WHATSAPP";

  return s;
}

/**
 * Initialize and record traffic source
 * Parses query params & referrer, prioritizing UTM params, and persists first-touch attribution.
 */
export function initTrafficTracking() {
  if (typeof window === "undefined") return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const utmCampaign = urlParams.get("utm_campaign");
    const utmTerm = urlParams.get("utm_term");
    const utmContent = urlParams.get("utm_content");
    const fbclid = urlParams.get("fbclid");
    const ttclid = urlParams.get("ttclid");
    const gclid = urlParams.get("gclid");

    const referrer = document.referrer || "";

    // Determine current visit's source
    let detectedSource = "";
    let detectedMedium = utmMedium || "";

    if (utmSource) {
      detectedSource = normalizeSourceTag(utmSource);
    } else if (ttclid) {
      detectedSource = "TIKTOK";
      detectedMedium = detectedMedium || "cpc";
    } else if (fbclid) {
      detectedSource = "FACEBOOK";
      detectedMedium = detectedMedium || "cpc";
    } else if (gclid) {
      detectedSource = "GOOGLE";
      detectedMedium = detectedMedium || "cpc";
    } else if (referrer) {
      detectedSource = detectReferrerSource(referrer);
    } else {
      detectedSource = "DIRECT";
    }

    const currentData = {
      source: detectedSource,
      utm_source: utmSource || (detectedSource !== "DIRECT" ? detectedSource.toLowerCase() : ""),
      utm_medium: detectedMedium,
      utm_campaign: utmCampaign || "",
      utm_term: utmTerm || "",
      utm_content: utmContent || "",
      referrer: referrer,
      landing_page: window.location.pathname + window.location.search,
      timestamp: new Date().toISOString(),
    };

    // Check existing stored first-touch attribution
    const existingRaw = localStorage.getItem(STORAGE_KEY);
    if (existingRaw) {
      try {
        const existing = JSON.parse(existingRaw);
        // If current visit has a strong marketing source (UTM or paid click) and existing was only DIRECT, upgrade attribution
        const hasStrongCampaign = Boolean(utmSource || ttclid || fbclid || gclid);
        if (hasStrongCampaign && existing.source === "DIRECT") {
          const updated = {
            ...currentData,
            first_touch_timestamp: existing.first_touch_timestamp || existing.timestamp,
            last_touch_timestamp: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        }
        return existing;
      } catch {}
    }

    // First touch
    currentData.first_touch_timestamp = currentData.timestamp;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
    return currentData;
  } catch (e) {
    console.warn("[Tracking] Error initializing traffic source:", e);
    return null;
  }
}

/**
 * Get the current traffic source data
 */
export function getTrafficSource() {
  if (typeof window === "undefined") {
    return {
      source: "DIRECT",
      utm_source: "",
      utm_medium: "",
      utm_campaign: "",
      referrer: "",
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        source: normalizeSourceTag(parsed.source || "DIRECT"),
        utm_source: parsed.utm_source || "",
        utm_medium: parsed.utm_medium || "",
        utm_campaign: parsed.utm_campaign || "",
        utm_term: parsed.utm_term || "",
        utm_content: parsed.utm_content || "",
        referrer: parsed.referrer || "",
        landing_page: parsed.landing_page || "/",
        timestamp: parsed.timestamp || "",
      };
    }
  } catch {}

  return {
    source: "DIRECT",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    referrer: "",
  };
}

/**
 * Get simple formatted source tag for WhatsApp or Order badges (e.g. "TIKTOK", "FACEBOOK", "INSTAGRAM", "DIRECT")
 */
export function getSourceTag() {
  const data = getTrafficSource();
  return normalizeSourceTag(data.source || "DIRECT");
}
