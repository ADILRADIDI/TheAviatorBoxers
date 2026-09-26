import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { ShoppingBag, MessageCircle, Check, Truck, ShieldCheck } from "lucide-react";
import StarRating from "@/components/storefront/StarRating";
import PackBuilder from "@/components/storefront/PackBuilder";
import { useAsync } from "@/lib/useAsync";
import { fetchProductBySlug, fetchColors, formatPrice, discountPercent, SIZES } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { usePageMeta, useJsonLd, productJsonLd } from "@/lib/seo";
import { useLanguage } from "@/lib/language";

// ponytail: flagship slug hardcoded as "Notre Boxer" — site sells one boxer, variant table holds the colors/stock
const FLAGSHIP_SLUG = "aviator-essential-navy";
const TABS = ["Description", "Composition & entretien", "Livraison & retours"];
const PACKS = [2, 4, 6];
const LIME = "#C7D400";

export default function Collection() {
  const { data: product, loading, error } = useAsync(() => fetchProductBySlug(FLAGSHIP_SLUG), []);
  const [swatchColors, setSwatchColors] = useState(FALLBACK_COLORS);

  useEffect(() => {
    const update = () => {
      fetchColors()
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) setSwatchColors(res);
        })
        .catch(() => {});
    };
    update();
    window.addEventListener("aviator-colors-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("aviator-colors-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const { addItem } = useCart();
  const { t } = useLanguage();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(2);
  const [tab, setTab] = useState(0);
  const [pieces, setPieces] = useState(() => Array.from({ length: Math.max(1, qty) }, () => ({})));

  const useVariants = Array.isArray(product?.variants) && product.variants.length > 0;
  const variantNames = useVariants ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))] : [];
  const pool = [...(swatchColors || []), ...(product?.colors || [])];
  const swatches = useVariants
    ? variantNames.map((name) => pool.find((c) => c.name === name) || { name, hex: null })
    : swatchColors?.length
      ? swatchColors
      : product?.colors?.length
        ? product.colors
        : [];

  const effectiveColor = color || swatches[0]?.name || product?.color_name || "";
  const colorVariants = useVariants ? product.variants.filter((v) => v.color === effectiveColor) : [];
  const availableSizes = useVariants
    ? [...new Set(colorVariants.map((v) => v.size))]
    : product?.sizes?.length
      ? product.sizes
      : SIZES;
  const selectedSize = size || availableSizes[0];
  const selectedVariant = colorVariants.find((v) => v.size === selectedSize);
  const availableStock = selectedVariant ? selectedVariant.stock : useVariants ? 0 : (product?.stock || 0);
  const maxQty = Math.max(1, availableStock || 1);

  useEffect(() => {
    setQty((q) => Math.min(Math.max(1, maxQty), q));
  }, [maxQty]);

  usePageMeta({
    title: "Notre Boxer — The Aviator",
    description: product ? `${formatPrice(product.price)} DH · ${product.description || "Boxer premium The Aviator"}` : undefined,
  });
  useJsonLd(product ? productJsonLd(product) : null);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-edge py-24 text-center">
          <span className="inline-block h-10 w-10 animate-spin rounded-full border-2 border-foreground/10 border-t-navy" />
          <p className="mt-4 text-sm text-muted-foreground">{t("Chargement...")}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-edge py-24 text-center">
          <span className="label-eyebrow flex items-center justify-center gap-2.5 text-ink/40">
            <span className="h-1 w-1 rounded-full bg-[#C7D400]" />
            {t("Erreur")}
          </span>
          <h1 className="mt-4 font-heading text-4xl text-navy">{t("Produit introuvable")}</h1>
          <Link to="/produit/aviator-essential-navy" className="btn-store btn-store--navy btn-sheen mx-auto mt-8">
            {t("Voir la fiche produit")}
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const currentImage = images[activeImg] || images[0];
  const pct = discountPercent(product.price, product.compare_at_price);
  const soldOut = useVariants ? !selectedVariant || selectedVariant.stock <= 0 : !product.stock;
  const displayPrice = useVariants && selectedVariant?.price ? selectedVariant.price : product.price;
  const tabContent = tab === 0
    ? product.description || t("Conçu pour offrir une aisance irréprochable au quotidien, ce boxer The Aviator allie maintien optimal, douceur durable et finitions de précision adaptées au climat marocain.")
    : tab === 1
      ? t("95% Coton compact haute qualité, 5% Élasthanne. Lavage en machine à 30°C. Ne pas javelliser. Séchage à l'air libre conseillé.")
      : t("Livraison rapide partout au Maroc en 24 à 48 heures. Paiement en espèces à la livraison. Vérification possible auprès du livreur à la réception.");

  const addToCart = () => {
    if (qty > 1) {
      addItem({
        productId: product.id,
        slug: product.slug,
        name: "Notre Boxer",
        image: currentImage,
        price: displayPrice,
        quantity: qty,
        stock: availableStock,
        category: product.category,
        pieces,
        colorOptions: swatches,
        sizeOptions: availableSizes,
      });
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: "Notre Boxer",
      image: currentImage,
      price: displayPrice,
      color: effectiveColor,
      size: selectedSize,
      quantity: qty,
      stock: availableStock,
      category: product.category,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container-edge py-8 md:py-14">
        {/* Editorial header */}
        <section className="mb-10 lg:mb-14">
          <span className="label-eyebrow flex items-center gap-2.5">
            <span className="h-1 w-1 rounded-full bg-[#C7D400]" />
            {t("La collection")}
          </span>
          <h1 className="mt-3 font-heading text-4xl leading-[0.95] tracking-tight text-navy sm:text-5xl lg:text-6xl">
            {t("Notre Boxer")}
          </h1>
          <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            {t("Boxer premium en coton et Élasthanne, conçu pour le confort et le maintien au quotidien.")}
          </p>
        </section>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex gap-3">
            <div className="flex w-20 shrink-0 flex-col gap-3">
              {images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImg(index)}
                  className={cn(
                    "aspect-[3/4] overflow-hidden border transition-colors",
                    activeImg === index ? "border-[#C7D400]" : "border-foreground/10 hover:border-foreground/30",
                  )}
                >
                  <Image src={image} alt="" fittingType="fill" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative aspect-[3/4] flex-1 self-start overflow-hidden bg-muted">
              {currentImage ? (
                <Image src={currentImage} alt="Notre Boxer" fittingType="fill" priority className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">{t("Aucune image")}</div>
              )}
              {pct > 0 && (
                <span className="absolute left-4 top-4 bg-[#C7D400] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-navy">
                  -{pct}%
                </span>
              )}
            </div>
          </div>

          {/* Purchase panel */}
          <div className="flex flex-col justify-center">
            <h2 className="font-heading text-3xl leading-[0.95] tracking-tight text-navy md:text-4xl">
              {t("Notre Boxer")}
            </h2>
            <div className="mt-5 flex items-center gap-3">
              <StarRating value={product.rating || 0} count={product.review_count} />
              <span className="text-sm text-muted-foreground">{product.review_count || 0} {t("avis")}</span>
            </div>
            <div className="mt-7 flex items-baseline gap-3">
              <span className="font-heading text-3xl tabular text-ink">{formatPrice(displayPrice)}</span>
              {pct > 0 && (
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span>
              )}
            </div>
            <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
              {t(product.description || "Conçu pour offrir une aisance irréprochable au quotidien, ce boxer The Aviator allie maintien optimal, douceur durable et finitions de précision.")}
            </p>

            {/* Colours */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/80">{t("Couleur")}</span>
                {effectiveColor && <span className="text-xs text-muted-foreground">{effectiveColor}</span>}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {swatches.map((c) => {
                  const active = effectiveColor === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      aria-label={c.name}
                      onClick={() => { setColor(c.name); setSize(""); }}
                      className={cn(
                        "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                        active ? "border-[#C7D400] ring-2 ring-[#C7D400]/30" : "border-foreground/15 hover:border-foreground/40",
                      )}
                    >
                      <span
                        className="h-7 w-7 rounded-full"
                        style={c.bicolor || c.hex2
                          ? { background: `linear-gradient(135deg, ${c.hex} 50%, ${c.hex2 || '#FFFFFF'} 50%)` }
                          : c.hex ? { backgroundColor: c.hex } : undefined
                        }
                      >
                        {!c.hex && !c.hex2 && <span className="block h-7 w-7 rounded-full bg-foreground/10" />}
                      </span>
                      {active && <Check className="absolute h-4 w-4 text-navy drop-shadow" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/80">{t("Taille")}</span>
                <Link to="/guide-des-tailles" className="group flex items-center gap-2 text-xs underline underline-offset-4 text-muted-foreground hover:text-navy">
                  {t("Guide des tailles")}
                </Link>
              </div>
              {qty > 1 ? (
                <PackBuilder
                  key={qty}
                  pieces={pieces}
                  colorOptions={swatches}
                  sizeOptions={availableSizes}
                  onChange={setPieces}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((itemSize) => (
                    <button
                      key={itemSize}
                      onClick={() => setSize(itemSize)}
                      className={cn(
                        "chip min-w-[3rem] justify-center px-0",
                        selectedSize === itemSize && "is-on",
                      )}
                    >
                      {itemSize}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pack / quantity */}
            <div className="mt-8">
              <div className="mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/80">{t("Pack")}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PACKS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setQty(p)}
                    disabled={p > maxQty}
                    className={cn(
                      "chip min-w-[3.5rem] justify-center px-3 py-2.5",
                      qty === p && "is-on",
                      p > maxQty && "cursor-not-allowed opacity-40",
                    )}
                  >
                    ×{p}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{t("Commandez par 2, 4 ou 6 pièces")}</p>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={addToCart}
                disabled={soldOut}
                className="btn-store btn-store--lime btn-sheen flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                {soldOut ? t("Rupture de stock") : t("Ajouter au panier")}
              </button>
            </div>
            <a
              href={whatsappContactUrl("Bonjour, je suis intéressé par Notre Boxer")}
              target="_blank"
              rel="noreferrer"
              className="btn-store btn-store--ghost mt-3"
            >
              <MessageCircle className="h-4 w-4" />
              {t("Commander via WhatsApp")}
            </a>

            {/* Guarantee */}
            <div className="mt-6 flex items-center gap-2 border-l-2 border-[#C7D400] pl-4">
              <span className="text-xs leading-relaxed text-muted-foreground">
                {t("Garantie qualité 5% Élasthanne, grande liberté de mouvement dès la première douche.")}
              </span>
            </div>

            {/* Trust row */}
            <div className="mt-9 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
              {[
                [Truck, t("Livraison gratuite sur Casablanca")],
                [Check, t("Qualité premium")],
                [ShieldCheck, t("Paiement à la livraison")],
              ].map(([Icon, label]) => (
                <span key={label} className="flex flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  <span className="flex h-9 w-9 items-center justify-center bg-foreground/[0.04]">
                    <Icon className="h-4 w-4 text-ink" strokeWidth={1.5} />
                  </span>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-8 overflow-x-auto border-b border-border">
            {TABS.map((label, index) => (
              <button
                key={label}
                onClick={() => setTab(index)}
                className={cn(
                  "whitespace-nowrap pb-4 text-[12px] font-bold uppercase tracking-[0.15em] transition-colors",
                  tab === index ? "border-b-2 border-[#C7D400] text-ink" : "border-b-2 border-transparent text-muted-foreground hover:text-ink",
                )}
              >
                {t(label)}
              </button>
            ))}
          </div>
          <p className="max-w-3xl py-7 leading-relaxed text-muted-foreground">{tabContent}</p>
        </div>
      </main>
    </div>
  );
}