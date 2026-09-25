// ============================================================================
// IMAGE ASSETS
// ============================================================================

export const IMAGES = {
  heroSlider: [
    "/products/aviator-navy.jpg",
    "/products/aviator-black.jpg",
    "/products/aviator-pack-duo.jpg",
  ],
  brandStory: "/images/story-workshop.jpg",
  packFive: "/images/boxer-stack.jpg",
  fabricMacro: "/images/fabric-macro.jpg",
  product3d: "/products/aviator-navy.jpg",
  packDuo: "/products/aviator-pack-duo.jpg",
  waistband: "/images/diff-waistband.jpg",
  flatlock: "/images/diff-flatlock.jpg",
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