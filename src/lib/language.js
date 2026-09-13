import { useEffect, useState } from "react";
import { AR } from "./translations";

const STORAGE_KEY = "aviator_language";

export const LANGUAGES = ["fr", "darija"];

export function useLanguage() {
  const [language, setLanguageState] = useState(() => {
    const stored = typeof window === "undefined" ? "fr" : localStorage.getItem(STORAGE_KEY);
    return stored === "darija" ? "darija" : "fr";
  });

  const setLanguage = (nextLanguage) => {
    const next = nextLanguage === "darija" ? "darija" : "fr";
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "darija" ? "ar-MA" : "fr-MA";
    document.documentElement.dir = next === "darija" ? "rtl" : "ltr";
    setLanguageState(next);
    window.dispatchEvent(new CustomEvent("aviator-language-change", { detail: next }));
  };

  useEffect(() => {
    document.documentElement.lang = language === "darija" ? "ar-MA" : "fr-MA";
    document.documentElement.dir = language === "darija" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const onLanguageChange = (event) => setLanguageState(event.detail === "darija" ? "darija" : "fr");
    window.addEventListener("aviator-language-change", onLanguageChange);
    return () => window.removeEventListener("aviator-language-change", onLanguageChange);
  }, []);

  const t = (key) => {
    if (typeof key !== "string" || !key) return key;
    if (language !== "darija") return key;
    return AR[key] || key;
  };

  return { language, setLanguage, t };
}