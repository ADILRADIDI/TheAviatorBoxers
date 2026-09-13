import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAsync } from "@/lib/useAsync";
import { fetchProducts, formatPrice, SIZES, validateCoupon } from "@/lib/store";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/cart-context";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import PageHeader from "@/components/storefront/PageHeader";
import { useLanguage } from "@/lib/language";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

const PACK_SIZE = 2;
const PACK_DISCOUNT = 0.10;

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

export default function Packs() {
  const { data: products, loading } = useAsync(() => fetchProducts({ category: "boxer" }), []);
  const { addItem, applyCoupon, closeDrawer } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();
  usePageMeta({ title: "Packs & offres — The Aviator", description: "Profitez de nos packs et de -10% sur les lots de boxers premium. Paiement à la livraison, livraison 24-48h partout au Maroc." });
  useJsonLd(breadcrumbJsonLd([{ name: "Accueil", url: SITE_URL }, { name: "Packs & offres", url: `${SITE_URL}/packs` }]));

  const [selections, setSelections] = useState(Array(PACK_SIZE).fill(null));
  const [picking, setPicking] = useState(Array(PACK_SIZE).fill(false));

  const available = useMemo(() => (products?.length ? products.filter((p) => p.stock > 0) : []), [products]);

  const filledCount = selections.filter(Boolean).length;
  const subtotal = selections.reduce((sum, s) => sum + (s ? s.product.price : 0), 0);
  const discount = Math.round(subtotal * PACK_DISCOUNT);
  const total = subtotal - discount;
  const allComplete = filledCount === PACK_SIZE && selections.every((s) => s?.size);

  const selectProduct = (index, product) => {
    if (!product) return;
    const next = [...selections];
    next[index] = { product, size: null };
    setSelections(next);
  };

  const startPick = (index) => setPicking((current) => current.map((value, i) => (i === index ? true : value)));
  const chooseProduct = (index, product) => {
    selectProduct(index, product);
    setPicking((current) => current.map((value, i) => (i === index ? false : value)));
  };

  const updateSize = (index, size) => {
    const next = [...selections];
    if (next[index]) {
      next[index].size = size;
      setSelections(next);
    }
  };

  const handleAddToCart = async () => {
    if (!allComplete) return;
    const packItems = selections.map(({ product, size }) => ({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images?.[0],
      price: product.price,
      color: product.color_name,
      category: product.category,
      quantity: 1,
      size,
    }));
    try {
      const result = await validateCoupon("PACK10", subtotal, packItems);
      if (!result.valid) throw new Error(result.message);
      packItems.forEach((item) => {
        addItem({ ...item, stock: item.stock ?? 999 });
      });
      applyCoupon(result.coupon);
      closeDrawer();
      navigate("/checkout");
    } catch {
      packItems.forEach((item) => {
        addItem({ ...item, stock: item.stock ?? 999 });
      });
      closeDrawer();
      navigate("/checkout");
    }
  };

  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow={t("Le pack signature")} title={t("Composez votre pack")} subtitle={t("Choisissez vos couleurs, vos tailles, et profitez d'un tarif avantageux.")} />

      <div className="relative overflow-hidden">
        <motion.div className="pointer-events-none absolute left-[-120px] top-24 h-72 w-72 rounded-full bg-accent-lime/10 blur-3xl" {...fadeUp} transition={{ duration: 1 }} />
        <motion.div className="pointer-events-none absolute right-[-140px] top-1/2 h-80 w-80 rounded-full bg-navy/10 blur-3xl" {...fadeUp} transition={{ duration: 1, delay: 0.15 }} />
      </div>

      <div className="container-edge py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-6 sm:grid-cols-2">
            {selections.map((sel, idx) => (
              <motion.div
                key={idx}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: 0.08 * idx }}
                className="border border-border bg-background p-6"
              >
                <div className="flex items-center justify-between">
                  <p className="label-eyebrow">{t("Pièce")} {idx + 1}</p>
                  {sel?.product && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-navy"
                    >
                      <Check className="h-3.5 w-3.5 text-accent-lime" /> {t("Sélectionnée")}
                    </motion.span>
                  )}
                </div>

                {!sel?.product || picking[idx] ? (
                  <motion.div key="picker" {...fadeUp} className="mt-4">
                    <p className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {sel?.product ? t("Changer de produit") : t("Choisir un produit")}
                    </p>
                    {loading ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">{t("Chargement...")}</p>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {available.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => chooseProduct(idx, product)}
                            className="group overflow-hidden rounded-lg border border-border bg-background text-left transition-all hover:border-navy hover:shadow-md"
                            aria-label={`${product.name} — ${formatPrice(product.price)}`}
                          >
                            <div className="relative aspect-square overflow-hidden bg-muted">
                              {product.images?.[0] ? (
                                <Image src={product.images[0]} alt={product.name} fittingType="fill" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              ) : (
                                <span className="absolute inset-0 block" style={{ background: product.color_hex || "hsl(205 100% 18%)" }} />
                              )}
                              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-accent-lime py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-navy opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <Check className="h-3 w-3" /> {t("Choisir")}
                              </span>
                            </div>
                            <div className="space-y-0.5 p-2.5">
                              <p className="truncate text-xs font-semibold">{product.name}</p>
                              <p className="text-[11px] text-muted-foreground">{formatPrice(product.price)}</p>
                            </div>
                          </button>
                        ))}
                        {!available.length && <p className="col-span-2 py-8 text-center text-sm text-muted-foreground">{t("Aucun produit disponible.")}</p>}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div key={sel.product.id} {...fadeUp} className="mt-4 space-y-4">
                    <div className="flex w-full items-center gap-3 overflow-hidden rounded-lg border border-border bg-background">
                      <div className="aspect-square w-20 shrink-0 overflow-hidden bg-muted">
                        {sel.product.images?.[0] ? (
                          <Image src={sel.product.images[0]} alt={sel.product.name} fittingType="fill" className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full items-center justify-center" style={{ background: sel.product.color_hex || "hsl(205 100% 18%)" }} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="truncate text-sm font-bold text-navy">{sel.product.name}</p>
                        <p className="text-xs text-muted-foreground">{formatPrice(sel.product.price)} · {sel.product.color_name}</p>
                      </div>
                      <button onClick={() => startPick(idx)} className="mr-3 shrink-0 rounded border border-border px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white">{t("Modifier")}</button>
                    </div>
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("Taille")}</p>
                      <div className="flex flex-wrap gap-2">
                        {SIZES.map((size) => (
                          <motion.button
                            key={size}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => updateSize(idx, size)}
                            className={`h-9 w-9 border text-xs font-medium transition-all ${sel.size === size ? "border-navy bg-navy text-white shadow-md" : "border-border hover:border-navy hover:bg-navy/5"}`}
                          >
                            {size}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.aside
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="border border-border bg-background p-6">
              <h2 className="font-display text-lg font-bold">{t("Récapitulatif")}</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("Sous-total")}</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={subtotal}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      {formatPrice(subtotal)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="flex justify-between text-accent-lime">
                  <span>{t("Réduction")} (10%)</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={discount}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      -{formatPrice(discount)}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
                  <span>{t("Total")}</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={total}
                      initial={{ opacity: 0, y: 8, color: "#C7D400" }}
                      animate={{ opacity: 1, y: 0, color: "inherit" }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-navy"
                    >
                      {formatPrice(total)}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
              <button
                className="btn-shine mt-5 flex w-full items-center justify-center gap-2 bg-navy py-4 text-xs font-bold uppercase tracking-[0.18em] text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!allComplete}
                onClick={handleAddToCart}
              >
                {t("Commander")} <ArrowRight className="h-4 w-4" />
              </button>
              <Link to="/collection" className="mt-4 block text-center text-xs font-medium uppercase tracking-wider text-muted-foreground underline underline-offset-4 hover:text-navy">{t("Continuer mes achats")}</Link>
            </div>
          </motion.aside>
        </div>
      </div>
    </>
  );
}