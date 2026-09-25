import { useStoreImages } from "@/lib/storefront-images";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ShoppingCart, ArrowUpRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { STORE } from "@/lib/store";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language";

const NAV_PATHS = ["/notre-boxer", "/pourquoi-nous", "/avis", "/contact"];

// Scrolling ticker of brand pillars — rendered above the nav row.
// Transitions between exact height values (not max-height) for smooth, jank-free collapse.
function HeaderTicker({ hidden }) {
  const ITEMS = [
    "LIVRAISON GRATUITE SUR CASABLANCA",
    "PAIEMENT À LA LIVRAISON",
    "95% COTON - 5% ÉLASTHANNE",
    "CONÇU AU MAROC",
  ];
  const track = [...ITEMS, ...ITEMS];
  return (
    <div
      aria-hidden="true"
      style={{
        height: hidden ? "0" : "2.25rem",
        transition: "height 500ms cubic-bezier(0.16,1,0.3,1)",
        willChange: "height",
      }}
      className="relative overflow-hidden border-b border-white/10 bg-[hsl(216_72%_10%)]"
    >
      <div
        style={{
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)",
          willChange: "transform",
        }}
      >
        <div className="marquee-track items-center gap-0 py-2">
          {track.map((label, i) => (
            <span key={i} className="flex shrink-0 items-center gap-5 px-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
              <span className="h-1 w-1 rounded-full bg-[#C7D400]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const { images: storeImages } = useStoreImages();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { language, setLanguage, t } = useLanguage();

  const labels = language === "darija"
    ? ["بوكسراتنا", "علاش نحنا", "آراء", "اتصل بنا"]
    : ["Notre Boxer", "Pourquoi nous", "Avis", "Contact"];
  const navLinks = NAV_PATHS.map((to, index) => ({ to, label: labels[index] }));

  useEffect(() => {
    const HIDE_AT = 60;   // px — scroll down past this to hide ticker
    const SHOW_AT = 20;   // px — scroll back up below this to show ticker
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(prev => {
        if (!prev && y > HIDE_AT) return true;   // hide
        if (prev && y < SHOW_AT) return false;   // show
        return prev;                              // no change → no re-render
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full bg-navy text-white transition-[background-color,box-shadow,border-color] duration-500",
          scrolled
            ? "shadow-[0_18px_48px_-24px_rgba(0,0,0,0.55)]"
            : "border-b border-transparent",
        )}
      >
        <HeaderTicker hidden={scrolled} />

        <nav className="container-edge flex h-[72px] items-center justify-between gap-4 lg:h-[84px]">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(true)}
            className="-ml-2 p-2 lg:hidden"
            aria-label={t("Ouvrir le menu")}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="shrink-0" aria-label="The Aviator — Accueil">
            <img src={storeImages.logo} alt="The Aviator" width="167" height="56" className="h-11 w-auto object-contain sm:h-13 lg:h-14" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex lg:items-center lg:gap-9">
            {navLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "group relative py-2 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors",
                    active ? "text-white" : "text-white/60 hover:text-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent-lime transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate("/notre-boxer?q=")}
              className="hidden p-2 text-white/70 transition-colors hover:text-white sm:flex"
              aria-label={t("Rechercher")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onClick={openDrawer}
              className="relative p-2 text-white/70 transition-colors hover:text-white"
              aria-label={`${t("Panier")} (${itemCount})`}
            >
              <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-lime px-1 text-[9px] font-bold text-navy">
                  {itemCount}
                </span>
              )}
            </button>
            <div className="ml-2 hidden items-center border border-white/20 text-[10px] font-bold uppercase tracking-wider sm:flex" aria-label={t("Choisir la langue")}>
              <button
                onClick={() => setLanguage("fr")}
                className={cn("px-2.5 py-1.5 transition-colors", language === "fr" ? "bg-accent-lime text-navy" : "text-white/60 hover:text-white")}
              >
                FR
              </button>
              <button
                onClick={() => setLanguage("darija")}
                className={cn("px-2.5 py-1.5 transition-colors", language === "darija" ? "bg-accent-lime text-navy" : "text-white/60 hover:text-white")}
              >
                عربية
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "circle(0% at 92% 6%)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "circle(140% at 92% 6%)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "circle(0% at 92% 6%)" }}
            transition={{ duration: reduce ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-navy text-white lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t("Menu")}
          >
            <div className="absolute inset-0 grain-dark opacity-60 pointer-events-none" />
            <div className="relative flex h-[72px] items-center justify-between container-edge">
              <img src={storeImages.logo} alt="The Aviator" className="h-16 w-auto object-contain" />
              <button onClick={() => setOpen(false)} className="p-2 text-white/80" aria-label={t("Fermer le menu")}>
                <X className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>

            <div className="relative flex flex-1 flex-col justify-center px-8 pt-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={reduce ? undefined : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: reduce ? 0 : 0.12 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/10"
                >
                  <Link
                    to={link.to}
                    className={cn(
                      "group flex items-baseline justify-between py-5",
                      location.pathname === link.to && "text-accent-lime",
                    )}
                  >
                    <span className="font-heading text-[2rem] leading-none tracking-tight">
                      {link.label}
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                      0{i + 1}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={reduce ? undefined : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-auto pb-10"
              >
                <div className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                  <button
                    onClick={() => setLanguage("fr")}
                    className={cn("px-3 py-2", language === "fr" ? "bg-accent-lime text-navy" : "border border-white/20 text-white/60")}
                  >
                    Français
                  </button>
                  <button
                    onClick={() => setLanguage("darija")}
                    className={cn("px-3 py-2", language === "darija" ? "bg-accent-lime text-navy" : "border border-white/20 text-white/60")}
                  >
                    دارجة
                  </button>
                </div>
                <a
                  href={whatsappContactUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-store btn-store--lime btn-sheen w-full"
                >
                  {t("Commander via WhatsApp")}
                </a>
                <p className="mt-4 text-center text-xs text-white/40">
                  {t("Livraison gratuite sur Casablanca · Paiement à la livraison")}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}