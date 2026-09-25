import { useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart, lineKey } from "@/lib/cart-context";
import { formatPrice, STORE, fetchColors } from "@/lib/store";
import { useAsync } from "@/lib/useAsync";
import { useLanguage } from "@/lib/language";

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const { data: colors } = useAsync(() => (drawerOpen ? fetchColors() : Promise.resolve([])), [drawerOpen]);
  const colorHexMap = useMemo(() => new Map(colors?.map((c) => [String(c.name).toLowerCase(), c.hex])), [colors]);
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const location = useLocation();

  // Close drawer automatically on any page navigation
  useEffect(() => {
    if (drawerOpen) {
      closeDrawer();
    }
  }, [location.pathname]);

  const freeShipDiff = STORE.freeShippingThreshold - subtotal;
  const progress = Math.min(100, (subtotal / STORE.freeShippingThreshold) * 100);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.aside
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background"
            role="dialog"
            aria-label={t("Panier")}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-navy px-6 py-5 text-white">
              <div>
                <p className="label-eyebrow flex items-center gap-2 text-white/45">
                  <span className="h-1 w-1 rounded-full bg-[#C7D400]" />
                  {t("Votre sélection")}
                </p>
                <h2 className="mt-1 flex items-center gap-2 font-heading text-2xl">
                  {t("Panier")}
                  <span className="flex h-6 min-w-6 items-center justify-center bg-[#C7D400] px-1.5 text-[11px] font-bold text-navy">
                    {itemCount}
                  </span>
                </h2>
              </div>
              <button onClick={closeDrawer} className="p-1.5 text-white/70 hover:text-white" aria-label={t("Fermer le panier")}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-foreground/20">
                  <ShoppingBag className="h-8 w-8 text-foreground/25" strokeWidth={1} />
                </div>
                <div>
                  <p className="font-heading text-xl">{t("Votre panier est vide")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("Découvrez notre collection premium.")}</p>
                </div>
                <Link
                  to="/notre-boxer"
                  onClick={closeDrawer}
                  className="btn-store btn-store--navy btn-sheen mt-2"
                >
                  {t("Voir la collection")}
                </Link>
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                <div className="border-b px-6 py-3.5">
                  {freeShipDiff > 0 ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        {t("Plus que")}{" "}
                        <span className="font-bold tabular text-navy">{formatPrice(freeShipDiff)}</span>{" "}
                        {t("pour la livraison gratuite")}
                      </p>
                      <div className="mt-2 h-1 overflow-hidden bg-foreground/10">
                        <div
                          className="h-full bg-[#C7D400] transition-all duration-600"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-navy">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C7D400]" />
                      {t("Livraison gratuite débloquée")}
                    </p>
                  )}
                </div>

                {/* Items */}
                <div className="store-scroll flex-1 overflow-y-auto px-6 py-5">
                  <ul className="divide-y divide-border">
                    {items.map((item) => {
                      const key = lineKey(item);
                      return (
                        <li key={key} className="flex gap-4 py-4 first:pt-0">
                          <Link
                            to={item.slug ? `/produit/${item.slug}` : "/notre-boxer"}
                            onClick={closeDrawer}
                            className="shrink-0"
                          >
                            <div className="h-28 w-22 overflow-hidden bg-muted" style={{ width: "88px" }}>
                              {item.image && (
                                <Image src={item.image} alt={item.name} fittingType="fill" className="h-full w-full object-cover" />
                              )}
                            </div>
                          </Link>
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between gap-3">
                              <div>
                                <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em]">{item.name}</h3>
                                {item.packDetails ? (
                                  <div className="mt-1 space-y-0.5 text-[11px] text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-border" style={{ background: colorHexMap.get(String(item.packDetails.boxer1?.color).toLowerCase()) || "#07132B" }} />
                                      <span>Boxer 1 : {item.packDetails.boxer1?.color} ({item.packDetails.boxer1?.size})</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full border border-border" style={{ background: colorHexMap.get(String(item.packDetails.boxer2?.color).toLowerCase()) || "#FFFFFF" }} />
                                      <span>Boxer 2 : {item.packDetails.boxer2?.color} ({item.packDetails.boxer2?.size})</span>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="mt-1 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                                    {item.color && (
                                      <span className="inline-block h-3 w-3 shrink-0 rounded-full border border-border" style={{ background: colorHexMap.get(String(item.color).toLowerCase()) || "#1B2A4A" }} aria-hidden="true" />
                                    )}
                                    <span>{[t(item.color || ""), item.size].filter(Boolean).join(" · ") || "—"}</span>
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() => removeItem(key)}
                                className="h-7 w-7 shrink-0 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-destructive"
                                aria-label={t("Retirer")}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between">
                              <div className="flex items-center border border-border">
                                <button
                                  onClick={() => updateQuantity(key, item.quantity - 1)}
                                  className="flex h-8 w-8 items-center justify-center text-navy transition-colors hover:bg-foreground/5"
                                  aria-label={t("Diminuer")}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-9 text-center text-sm font-semibold tabular">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(key, item.quantity + 1)}
                                  className="flex h-8 w-8 items-center justify-center text-navy transition-colors hover:bg-foreground/5"
                                  aria-label={t("Augmenter")}
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="text-sm font-bold tabular">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Footer */}
                <div className="border-t px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{t("Sous-total")}</span>
                    <span className="font-heading text-2xl text-navy tabular">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t("Livraison calculée à l'étape suivante")}</p>
                  <Link
                    to="/checkout"
                    onClick={closeDrawer}
                    className="btn-store btn-store--navy btn-sheen mt-4 w-full"
                  >
                    {t("Commander")}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={closeDrawer}
                    className="group mt-2 flex w-full items-center justify-center gap-2 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-navy"
                  >
                    <span className="underline-anim">{t("Continuer mes achats")}</span>
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}