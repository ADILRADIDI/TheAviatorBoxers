import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { Check, Plus, X, ShoppingBag } from "lucide-react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import { useAsync } from "@/lib/useAsync";
import { fetchProducts, formatPrice, SIZES } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const PACK_SIZE = 2;
const PACK_DISCOUNT = 0.10; // 10% off when completing a pack

export default function Packs() {
  const { data: products, loading } = useAsync(() => fetchProducts({ category: "boxer" }), []);
  const { addItem, applyCoupon } = useCart();
  const navigate = useNavigate();

  // selections: array of { product, size } with length PACK_SIZE
  const [selections, setSelections] = useState(Array(PACK_SIZE).fill(null));

  const filledCount = selections.filter(Boolean).length;
  const subtotal = selections.reduce((sum, s) => sum + (s ? s.product.price : 0), 0);
  const discount = Math.round(subtotal * PACK_DISCOUNT);
  const total = subtotal - discount;
  const allComplete = filledCount === PACK_SIZE && selections.every((s) => s?.size);

  const selectProduct = (product) => {
    const emptyIdx = selections.findIndex((s) => !s);
    if (emptyIdx === -1) return;
    const next = [...selections];
    next[emptyIdx] = { product, size: "" };
    setSelections(next);
  };

  const setSize = (idx, size) => {
    const next = [...selections];
    if (next[idx]) next[idx] = { ...next[idx], size };
    setSelections(next);
  };

  const removeSlot = (idx) => {
    const next = [...selections];
    next[idx] = null;
    setSelections(next);
  };

  const handleAddPack = () => {
    if (!allComplete) return;
    selections.forEach((s) => {
      addItem({
        productId: s.product.id,
        slug: s.product.slug,
        name: s.product.name,
        image: s.product.images?.[0],
        price: s.product.price,
        color: s.product.color_name,
        size: s.size,
        quantity: 1,
        stock: s.product.stock,
        category: "boxer",
      });
    });
    applyCoupon({ code: "PACK10", discount_type: "percentage", value: 10, description: "Pack 2 pièces" });
    navigate("/panier");
  };

  return (
    <>
      <AnnouncementBar />
      <div className="border-b border-border bg-navy text-white">
        <div className="container-edge py-12 text-center lg:py-16">
          <span className="label-eyebrow text-white/50">Pack signature</span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Composez votre pack
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
            Choisissez {PACK_SIZE} couleurs et tailles. Profitez de -10% sur votre pack.
          </p>
        </div>
      </div>

      <div className="container-edge py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          {/* Product selection */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Choisissez vos boxers</h2>
              <span className="text-sm text-muted-foreground">{filledCount}/{PACK_SIZE} sélectionnés</span>
            </div>

            {/* Progress */}
            <div className="mb-8 flex gap-2">
              {Array.from({ length: PACK_SIZE }).map((_, i) => (
                <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full transition-all duration-500", selections[i] ? "bg-accent-lime w-full" : "bg-transparent w-0")} />
                </div>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse bg-muted" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {products?.map((p) => {
                  const selected = selections.some((s) => s?.product?.id === p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectProduct(p)}
                      disabled={selected || filledCount >= PACK_SIZE || p.stock === 0}
                      className={cn(
                        "group relative aspect-[3/4] overflow-hidden border-2 bg-muted transition-all",
                        selected ? "border-accent-lime opacity-50" : "border-transparent hover:border-navy",
                        filledCount >= PACK_SIZE && !selected && "opacity-40",
                        p.stock === 0 && "cursor-not-allowed opacity-50",
                      )}
                    >
                      {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fittingType="fill" className="h-full w-full object-cover" />}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-3">
                        <p className="text-xs font-semibold text-white">{p.name}</p>
                        <p className="text-xs text-white/70">{formatPrice(p.price)}</p>
                      </div>
                      {selected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-accent-lime/20">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-lime text-navy">
                            <Check className="h-5 w-5" />
                          </span>
                        </div>
                      )}
                      {!selected && filledCount < PACK_SIZE && p.stock > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-navy/0 opacity-0 transition-all group-hover:bg-navy/20 group-hover:opacity-100">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy">
                            <Plus className="h-5 w-5" />
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-background">
              <div className="border-b border-border p-5">
                <h2 className="font-display text-lg font-bold">Mon pack ({PACK_SIZE} pièces)</h2>
              </div>

              <div className="p-5">
                <div className="space-y-4">
                  {selections.map((s, i) => (
                    <div key={i}>
                      {s ? (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-border p-3">
                          <div className="flex gap-3">
                            <div className="h-20 w-16 shrink-0 overflow-hidden bg-muted">
                              {s.product.images?.[0] && <Image src={s.product.images[0]} alt="" fittingType="fill" className="h-full w-full object-cover" />}
                            </div>
                            <div className="flex flex-1 flex-col">
                              <div className="flex justify-between">
                                <p className="text-sm font-semibold">{s.product.name}</p>
                                <button onClick={() => removeSlot(i)} className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
                              </div>
                              <p className="text-xs text-muted-foreground">{formatPrice(s.product.price)}</p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {SIZES.map((sz) => (
                                  <button
                                    key={sz}
                                    onClick={() => setSize(i, sz)}
                                    className={cn("h-7 w-7 border text-[11px] font-medium transition-colors", s.size === sz ? "border-navy bg-navy text-white" : "border-border hover:border-navy")}
                                  >
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex items-center justify-center border border-dashed border-border p-6 text-center">
                          <div>
                            <Plus className="mx-auto h-5 w-5 text-muted-foreground" />
                            <p className="mt-1 text-xs text-muted-foreground">Emplacement {i + 1}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-5 space-y-2 border-t border-border pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-accent-lime">
                      <span>Pack -10%</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleAddPack}
                  disabled={!allComplete}
                  className="btn-shine mt-5 flex w-full items-center justify-center gap-2 bg-navy py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShoppingBag className="h-4 w-4" /> Ajouter le pack au panier
                </button>
                {!allComplete && (
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    {filledCount < PACK_SIZE ? `Sélectionnez ${PACK_SIZE - filledCount} produit(s) de plus` : "Choisissez la taille pour chaque produit"}
                  </p>
                )}
                <Link to="/collection" className="mt-3 block text-center text-xs font-medium uppercase tracking-wider text-muted-foreground underline underline-offset-4 hover:text-navy">
                  Voir la collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}