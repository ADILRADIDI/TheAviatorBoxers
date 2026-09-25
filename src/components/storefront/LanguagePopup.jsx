import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/language";

const STORAGE_KEY = "aviator_language";

export default function LanguagePopup() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === null) setOpen(true);
  }, []);

  const choose = (lang) => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy/70 p-4 backdrop-blur-sm"
          dir="rtl"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="language-popup-title"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-sm border border-white/15 bg-navy p-8 text-center text-white"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute left-3 top-3 p-1.5 text-white/70 transition-colors hover:text-white"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>

            <h2 id="language-popup-title" className="font-heading text-2xl">
              اختر لغتك
            </h2>
            <p className="mt-1.5 text-sm text-white/60">أي لغة تفضلها؟</p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => choose("darija")}
                className="w-full bg-accent-lime py-3 font-heading text-base font-semibold tracking-wide text-navy transition-colors hover:bg-[#6d8d00]"
              >
                🇲🇦 الدارجة
              </button>
              <button
                onClick={() => choose("fr")}
                className="w-full border border-white/15 py-3 font-heading text-base font-semibold tracking-wide text-white/70 transition-colors hover:border-white/40 hover:text-white"
              >
                🇫🇷 Français
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}