import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ShoppingBag, Search } from "lucide-react";
import { LogoLockup } from "./Logo";
import { useCart } from "@/lib/cart-context";
import { STORE } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";

const NAV_LINKS = {
  fr: ["Collection", "Packs", "Qualité", "À propos", "Contact"],
  darija: ["المنتوجات", "الباكات", "الجودة", "علينا", "تواصل معنا"],
};
const NAV_PATHS = ["/collection", "/packs", "/qualite", "/a-propos", "/contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const location = useLocation();
  const reduce = useReducedMotion();
  const { language, setLanguage } = useLanguage();
  const navLinks = NAV_PATHS.map((to, index) => ({ to, label: NAV_LINKS[language][index] }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled ? "border-border bg-background/95 backdrop-blur-md" : "border-transparent bg-background",
        )}
      >
        <nav className="container-edge flex h-16 items-center justify-between gap-4 lg:h-[68px]">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden -ml-2 p-2 text-navy"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="shrink-0" aria-label="The Aviator — Accueil">
            <LogoLockup />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex lg:items-center lg:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "relative text-[13px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-navy",
                  location.pathname === link.to ? "text-navy" : "text-muted-foreground",
                )}
              >
                {link.label}
                {location.pathname === link.to && (
                  <span className="absolute -bottom-1.5 left-0 h-px w-full bg-accent-lime" />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <div className="hidden items-center border border-border text-[10px] font-bold uppercase tracking-wider sm:flex" aria-label="Choisir la langue">
              <button onClick={() => setLanguage("fr")} className={cn("px-2 py-1.5", language === "fr" ? "bg-navy text-white" : "text-muted-foreground")}>FR</button>
              <button onClick={() => setLanguage("darija")} className={cn("px-2 py-1.5", language === "darija" ? "bg-navy text-white" : "text-muted-foreground")}>دارجة</button>
            </div>
            <button
              onClick={() => {
                window.location.href = "/collection?q=";
              }}
              className="hidden sm:flex p-2 text-navy transition-colors hover:text-muted-foreground"
              aria-label="Rechercher"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <button
              onClick={openDrawer}
              className="relative p-2 text-navy transition-colors hover:text-muted-foreground"
              aria-label={`Panier (${itemCount} articles)`}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-lime px-1 text-[9px] font-bold text-navy">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={reduce ? undefined : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 top-0 z-50 flex h-full w-[82%] max-w-sm flex-col bg-background lg:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b px-5">
                <LogoLockup />
                <button onClick={() => setMobileOpen(false)} className="p-2 text-navy" aria-label="Fermer le menu">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col py-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="border-b px-5 py-4 font-display text-lg text-navy"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-auto p-5">
                <a
                  href={`https://wa.me/${STORE.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 bg-navy py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-white"
                >
                  Commander via WhatsApp
                </a>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Livraison 24-48h · Paiement à la livraison
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}