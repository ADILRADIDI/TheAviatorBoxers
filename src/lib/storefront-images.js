import { useEffect, useState } from "react";
import { IMAGES } from "@/lib/assets";
import { fetchSiteSettings } from "@/lib/store";

const SOURCE = "storefront_images";

let settingsCache = null;
let settingsPromise = null;

export const IMAGE_SLOTS = [
  { key: "heroSlider", label: "Slider d'accueil (grande image)", multiple: true },
  { key: "logo", label: "Logo", multiple: false },
  { key: "brandStory", label: "Histoire de la marque", multiple: false },
  { key: "packFive", label: "Pack 5 boxers", multiple: false },
  { key: "fabricMacro", label: "Tissu premium (macro)", multiple: false },
  { key: "product3d", label: "Vue 3D produit", multiple: false },
];

function arrayOf(value) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

export function resolveStoreImages(settings) {
  const overrides = (settings && settings[SOURCE]) || {};
  const logo = overrides.logo || "/logo.png";
  return {
    ...IMAGES,
    logo,
    brandStory: overrides.brandStory || IMAGES.brandStory,
    packFive: overrides.packFive || IMAGES.packFive,
    fabricMacro: overrides.fabricMacro || IMAGES.fabricMacro,
    product3d: overrides.product3d || IMAGES.product3d,
    heroSlider:
      arrayOf(overrides.heroSlider).length >= 2
        ? arrayOf(overrides.heroSlider)
        : IMAGES.heroSlider,
  };
}

function loadSettings() {
  if (settingsPromise) return settingsPromise;
  settingsPromise = fetchSiteSettings()
    .then((data) => {
      settingsCache = data || {};
      return settingsCache;
    })
    .catch(() => {
      settingsCache = {};
      return settingsCache;
    });
  return settingsPromise;
}

export function useStoreImages() {
  const [images, setImages] = useState(() =>
    settingsCache ? resolveStoreImages(settingsCache) : resolveStoreImages(null)
  );
  const [loading, setLoading] = useState(!settingsCache);

  useEffect(() => {
    let active = true;
    loadSettings().then((settings) => {
      if (!active) return;
      setImages(resolveStoreImages(settings));
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { images, loading };
}

export function invalidateStoreImagesCache() {
  settingsPromise = null;
  settingsCache = null;
}

export async function loadStoreImagesOnce() {
  const settings = await loadSettings();
  return resolveStoreImages(settings);
}
