import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart, lineKey } from "@/lib/cart-context";
import { formatPrice, STORE } from "@/lib/store";
import { useLanguage } from "@/lib/language";

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const reduce = useReducedMotion();
  const { t } = useLanguage();

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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <motion.aside
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background"
            role="dialog"
            aria-label={t("Panier")}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-navy" />
                <h2 className="text-sm font-bold uppercase tracking-[0.15em]">{t("Panier")}</h2>
                {itemCount > 0 && <span className="text-xs text-muted-foreground">({itemCount})</span>}
              </div>
              <button onClick={closeDrawer} className="p-1.5 text-navy" aria-label={t("Fermer le panier")}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-display text-lg">{t("Votre panier est vide")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t("Découvrez notre collection premium.")}</p>
                </div>
                <Link
                  to="/collection"
                  onClick={closeDrawer}
                  className="mt-2 bg-navy px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-white"
                >
                  {t("Voir la collection")}
                </Link>
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                {freeShipDiff > 0 ? (
                  <div className="border-b px-5 py-3">
                    <p className="text-xs text-muted-foreground">
                      {t("Plus que")} <span className="font-semibold text-navy">{formatPrice(freeShipDiff)}</span> {t("pour la livraison gratuite")}
                    </p>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-accent-lime transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="border-b px-5 py-3">
                    <p className="text-xs font-semibold text-accent-lime">{t("✓ Livraison gratuite débloquée")}</p>
                  </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-4">
                    {items.map((item) => {
                      const key = lineKey(item);
                      return (
                        <li key={key} className="flex gap-3">
                          <Link to={item.slug ? `/produit/${item.slug}` : "/collection"} onClick={closeDrawer} className="shrink-0">
                            <div className="h-24 w-20 overflow-hidden bg-muted">
                              {item.image && (
                                <Image src={item.image} alt={item.name} fittingType="fill" className="h-full w-full object-cover" />
                              )}
                            </div>
                          </Link>
                          <div className="flex flex-1 flex-col">
                            <div className="flex justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-semibold">{item.name}</h3>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {[item.color, item.size].filter(Boolean).join(" · ")}
                                </p>
                              </div>
                              <button onClick={() => removeItem(key)} className="text-muted-foreground hover:text-destructive" aria-label={t("Retirer")}>
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <div className="flex items-center border">
                                <button onClick={() => updateQuantity(key, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center text-navy hover:bg-muted" aria-label={t("Diminuer")}>
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <button onClick={() => updateQuantity(key, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center text-navy hover:bg-muted" aria-label={t("Augmenter")}>
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                              <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Footer */}
                <div className="border-t px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t("Sous-total")}</span>
                    <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{t("Livraison calculée à l'étape suivante")}</p>
                  <Link
                    to="/checkout"
                    onClick={closeDrawer}
                    className="btn-shine mt-4 flex w-full items-center justify-center gap-2 bg-navy py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-white"
                  >
                    {t("Commander")} <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={closeDrawer}
                    className="mt-2 w-full py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground hover:text-navy"
                  >
                    {t("Continuer mes achats")}
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