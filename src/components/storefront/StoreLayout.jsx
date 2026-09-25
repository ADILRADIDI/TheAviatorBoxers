import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import WhatsAppFloat from "./WhatsAppFloat";
import LanguagePopup from "./LanguagePopup";

// Thin reading progress bar pinned to the top of the viewport.
function ScrollProgress() {
  const reduce = useReducedMotion();
  const { pathname } = useLocation();

  useEffect(() => {
    if (reduce) return;
    const bar = document.getElementById("store-scroll-progress");
    if (!bar) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
        bar.style.transform = `scaleX(${p / 100})`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduce, pathname]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent">
      <div
        id="store-scroll-progress"
        className="h-full origin-left bg-accent-lime"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export default function StoreLayout() {
  const location = useLocation();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="storefront-app flex min-h-screen flex-col bg-background antialiased">
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
      <LanguagePopup />
    </div>
  );
}