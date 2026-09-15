import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { formatPrice, discountPercent } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import StarRating from "./StarRating";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, index = 0 }) {
  const reduce = useReducedMotion();
  const { addItem, openDrawer } = useCart();
  const { t } = useLanguage();

  const mainImage = product.images?.[0];
  const hoverImage = product.images?.[1] || product.images?.[0];
  const pct = discountPercent(product.price, product.compare_at_price);
  const defaultSize = product.sizes?.[1] || product.sizes?.[0] || "M";
  const soldOut = product.stock === 0;

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: mainImage,
      price: product.price,
      color: product.color_name,
      size: defaultSize,
      quantity: 1,
      stock: product.stock,
      category: product.category,
    });
    openDrawer();
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="group block">
        <Link to={product.category === "pack" ? `/packs` : `/produit/${product.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            {mainImage ? (
              <>
                <Image
                  src={mainImage}
                  alt={product.name}
                  fittingType="fill"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                {hoverImage !== mainImage && (
                  <Image
                    src={hoverImage}
                    alt=""
                    fittingType="fill"
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-xs uppercase tracking-wide text-muted-foreground">
                {t("Aucune image")}
              </div>
            )}

            {/* Badges */}
            {!soldOut && pct > 0 ? (
              <span className="absolute left-3 top-3 bg-[hsl(72_74%_52%)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-navy">
                -{pct}%
              </span>
            ) : null}
            {product.badge && (
              <span
                className={cn(
                  "absolute left-3 top-3 bg-navy px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white",
                  !soldOut && pct > 0 && "top-11",
                )}
              >
                {product.badge}
              </span>
            )}
            {soldOut && (
              <span className="absolute left-3 top-3 bg-ink/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                {t("Rupture")}
              </span>
            )}

            {/* Quick add */}
            <button
              onClick={quickAdd}
              disabled={soldOut}
              aria-label={soldOut ? `${product.name} ${t("indisponible")}` : `${t("Ajouter")} ${product.name} ${t("au panier")}`}
              className={cn(
                "absolute inset-x-3 bottom-3 z-10 flex translate-y-3 items-center justify-center gap-2 bg-white/95 py-3 text-[11px] font-bold uppercase tracking-[0.16em] text-navy opacity-0 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all duration-400 hover:bg-[hsl(72_74%_52%)] group-hover:translate-y-0 group-hover:opacity-100",
                soldOut && "pointer-events-none opacity-0",
              )}
            >
              {soldOut ? (
                t("Rupture de stock")
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {t("Ajout rapide")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-foreground">
                {product.name}
              </h3>
              {product.color_hex && (
                <span className="mt-0.5 flex shrink-0 items-center gap-2">
                  {product.color_name && (
                    <span className="hidden text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:inline">
                      {t(product.color_name)}
                    </span>
                  )}
                  <span
                    className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10"
                    style={{ backgroundColor: product.color_hex }}
                  />
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              {product.rating > 0 ? (
                <StarRating value={product.rating} size={12} showValue count={product.review_count} />
              ) : (
                <span />
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-foreground">{formatPrice(product.price)}</span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}