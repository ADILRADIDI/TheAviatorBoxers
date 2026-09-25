import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";
import { useCart, lineKey } from "@/lib/cart-context";
import { formatPrice, STORE, validateCoupon, computeDiscount, fetchColors } from "@/lib/store";
import { useAsync } from "@/lib/useAsync";
import { useLanguage } from "@/lib/language";
import { usePageMeta } from "@/lib/seo";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, coupon, applyCoupon, removeCoupon } = useCart();
  const { data: colors } = useAsync(() => fetchColors(), []);
  const colorHexMap = useMemo(() => new Map(colors?.map((c) => [String(c.name).toLowerCase(), c.hex])), [colors]);
  const navigate = useNavigate();
  const { t } = useLanguage();
  usePageMeta({ title: "Panier — The Aviator", description: "Votre panier The Aviator : choisissez vos boxers premium. Paiement à la livraison partout au Maroc.", noindex: true });

  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [checking, setChecking] = useState(false);

  const discountInfo = computeDiscount(coupon, subtotal, 0);
  const discount = discountInfo.amount;
  const freeShipDiff = STORE.freeShippingThreshold - (subtotal - discount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setChecking(true);
    setCouponMsg("");
    try {
      const result = await validateCoupon(code, subtotal, items);
      if (result.valid) {
        applyCoupon(result.coupon);
        setCouponMsg(t("Code promo appliqué !"));
        setCode("");
      } else {
        setCouponMsg(result.message);
      }
    } catch {
      setCouponMsg(t("Erreur de validation. Réessayez."));
    }
    setChecking(false);
  };

  if (items.length === 0) {
    return (
      <>
        <div className="container-edge flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-foreground/20">
            <ShoppingBag className="h-9 w-9 text-foreground/25" strokeWidth={1} />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-bold">{t("Votre panier est vide")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("Découvrez notre collection premium.")}</p>
          <Link to="/notre-boxer" className="btn-store btn-store--navy btn-sheen mt-7">
            {t("Voir la collection")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="border-b border-border bg-secondary">
        <div className="container-edge py-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">{t("Mon panier")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} {items.length > 1 ? t("articles") : t("article")}</p>
        </div>
      </div>

      <div className="container-edge py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div>
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => {
                const key = lineKey(item);
                return (
                  <li key={key} className="flex gap-4 py-5">
                    <Link to={`/produit/${item.slug}`} className="shrink-0">
                      <div className="h-28 w-24 overflow-hidden bg-muted">
                        {item.image && <Image src={item.image} alt={item.name} fittingType="fill" className="h-full w-full object-cover" />}
                      </div>
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div>
                          <Link to={`/produit/${item.slug}`} className="text-sm font-semibold hover:text-navy">{item.name}</Link>
                          {item.packDetails ? (
                            <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
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
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                              {item.color && (
                                <span className="inline-block h-3 w-3 shrink-0 rounded-full border border-border" style={{ background: colorHexMap.get(String(item.color).toLowerCase()) || "#1B2A4A" }} aria-hidden="true" />
                              )}
                              <span>{[item.color, item.size].filter(Boolean).join(" · ")}</span>
                            </p>
                          )}
                        </div>
                        <button onClick={() => removeItem(key)} className="text-muted-foreground hover:text-destructive" aria-label={t("Retirer")}><X className="h-4 w-4" /></button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border">
                          <button onClick={() => updateQuantity(key, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center hover:bg-muted" aria-label={t("Diminuer")}><Minus className="h-3 w-3" /></button>
                          <span className="w-9 text-center text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(key, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center hover:bg-muted" aria-label={t("Augmenter")}><Plus className="h-3 w-3" /></button>
                        </div>
                        <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Free shipping bar */}
            {freeShipDiff > 0 && (
              <div className="mt-6 flex items-center gap-3 border border-border bg-secondary p-4">
                <Truck className="h-5 w-5 shrink-0 text-navy" />
                <p className="text-xs text-muted-foreground">
                  {t("Plus que")} <span className="font-semibold text-navy">{formatPrice(freeShipDiff)}</span> {t("pour la livraison gratuite")}
                </p>
              </div>
            )}

            <Link to="/notre-boxer" className="mt-6 inline-block text-xs font-medium uppercase tracking-wider text-muted-foreground underline underline-offset-4 hover:text-navy">
              {t("← Continuer mes achats")}
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-background p-6">
              <h2 className="font-heading text-lg font-bold">{t("Récapitulatif")}</h2>

              {/* Coupon */}
              <form onSubmit={handleApplyCoupon} className="mt-4">
                <label htmlFor="coupon-code" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("Code promo")}</label>
                {coupon ? (
                  <div className="mt-2 flex items-center justify-between border border-accent-lime bg-accent-lime/10 px-3 py-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-navy"><Tag className="h-3.5 w-3.5" /> {coupon.code}</span>
                    <button type="button" onClick={removeCoupon} className="text-xs text-muted-foreground hover:text-destructive">{t("Retirer")}</button>
                  </div>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <input
                      id="coupon-code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder={t("Votre code")}
                      className="flex-1 border border-border px-3 py-2.5 text-sm uppercase focus:border-navy focus:outline-none"
                      aria-invalid={Boolean(couponMsg && !coupon)}
                      aria-describedby={couponMsg && !coupon ? "coupon-error" : undefined}
                    />
                    <button type="submit" disabled={checking} className="bg-navy px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white disabled:opacity-50">
                      {checking ? "..." : t("Appliquer")}
                    </button>
                  </div>
                )}
                {couponMsg && !coupon && <p id="coupon-error" role="alert" className="mt-1.5 text-xs text-destructive">{couponMsg}</p>}
                {coupon && <p className="mt-1.5 text-xs text-accent-lime">{couponMsg}</p>}
              </form>

              {/* Totals */}
              <div className="mt-5 space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">{t("Sous-total")}</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-accent-lime"><span>{t("Réduction")} ({coupon?.code})</span><span>-{formatPrice(discount)}</span></div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{t("Livraison")}</span>
                  <span>{freeShipDiff <= 0 ? t("Gratuite") : t("Calculée à l'étape suivante")}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-lg font-bold">
                  <span>{t("Total")}</span><span>{formatPrice(subtotal - discount)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="btn-store btn-store--navy btn-sheen mt-5 w-full"
              >
                {t("Commander")} <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">{t("Paiement à la livraison disponible")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}