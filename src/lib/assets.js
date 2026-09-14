// ============================================================================
// IMAGE ASSETS
// ============================================================================

export const IMAGES = {
  heroSlider: [
    "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1920&q=80",
  ],
  brandStory:
    "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=80",
  packFive:
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
  fabricMacro:
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80",
  product3d: "/products/product1.jpeg",
};

// ============================================================================
// APP PARAM UTILITIES
// ============================================================================

export const isNode = typeof window === "undefined";

const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = isNode
  ? {
      getItem: (key) => windowObj.localStorage.get(key),
      setItem: (key, value) => windowObj.localStorage.set(key, value),
    }
  : window.localStorage;

const toSnakeCase = (str) => str.replace(/([A-Z])/g, "_$1").toLowerCase();

/**
 * Retrieves a parameter value from the URL or storage.
 */
export function getAppParamValue(
  paramName,
  { defaultValue = undefined, removeFromUrl = false } = {}
) {
  if (isNode) {
    return defaultValue;
  }

  const storageKey = `base44_${toSnakeCase(paramName)}`;
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get(paramName);

  if (removeFromUrl) {
    urlParams.delete(paramName);
    const newUrl = `${window.location.pathname}${
      urlParams.toString() ? `?${urlParams.toString()}` : ""
    }${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  if (searchParam) {
    storage.setItem(storageKey, searchParam);
    return searchParam;
  }

  if (defaultValue !== undefined) {
    storage.setItem(storageKey, defaultValue);
    return defaultValue;
  }

  const storedValue = storage.getItem(storageKey);
  return storedValue;
}