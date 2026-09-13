import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { ShoppingBag } from "lucide-react";
import { formatPrice, discountPercent } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import StarRating from "./StarRating";
import { useLanguage } from "@/lib/language";

export default function ProductCard({ product, index = 0 }) {
  const reduce = useReducedMotion();
  const { addItem, openDrawer } = useCart();
  const { t } = useLanguage();

  const mainImage = product.images?.[0];
  const hoverImage = product.images?.[1] || product.images?.[0];
  const pct = discountPercent(product.price, product.compare_at_price);
  const defaultSize = product.sizes?.[1] || product.sizes?.[0] || "M";

  const quickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
  };

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
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
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
              />
              <Image
                src={hoverImage}
                alt=""
                fittingType="fill"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">{t("Aucune image")}</div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {pct > 0 && (
              <span className="bg-accent-lime px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
                -{pct}%
              </span>
            )}
            {product.badge && (
              <span className="bg-navy px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                {product.badge}
              </span>
            )}
          </div>

        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">{product.name}</h3>
            {product.color_hex && (
              <span
                className="h-3.5 w-3.5 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: product.color_hex }}
              />
            )}
          </div>
          {product.rating > 0 && (
            <StarRating value={product.rating} size={12} showValue count={product.review_count} />
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
        </Link>
        <button
          onClick={quickAdd}
          disabled={product.stock === 0}
          aria-label={product.stock === 0 ? `${product.name} ${t("indisponible")}` : `${t("Ajouter")} ${product.name} ${t("au panier")}`}
          className="btn-shine relative z-10 -mt-12 ml-3 mr-3 flex w-[calc(100%-1.5rem)] items-center justify-center gap-2 bg-white/95 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-navy opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-navy hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          {product.stock === 0 ? t("Rupture de stock") : t("Ajout rapide")}
        </button>
      </div>
    </motion.div>
  );
}