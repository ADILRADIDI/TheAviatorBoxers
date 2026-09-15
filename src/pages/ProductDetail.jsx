import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Minus, Plus, ShoppingBag, MessageCircle, Check, Truck, RefreshCw, ChevronDown } from "lucide-react";
import StarRating from "@/components/storefront/StarRating";
import ProductCard from "@/components/storefront/ProductCard";
import Reveal from "@/components/storefront/Reveal";
import { useAsync } from "@/lib/useAsync";
import { fetchProductBySlug, fetchProducts, fetchReviews, formatPrice, discountPercent, SIZES } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { usePageMeta, useJsonLd, productJsonLd } from "@/lib/seo";
import { useLanguage } from "@/lib/language";

const TABS = ["Description", "Composition & entretien", "Livraison & retours"];

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, loading, error } = useAsync(() => fetchProductBySlug(slug), [slug]);
  const { data: allProducts } = useAsync(() => fetchProducts(), []);
  const { data: reviews } = useAsync(() => (product ? fetchReviews(product.id) : Promise.resolve([])), [product?.id]);
  const { addItem } = useCart();
  const { t } = useLanguage();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [activePoint, setActivePoint] = useState(0);

  usePageMeta({
    title: product ? `${product.name} — The Aviator` : undefined,
    description: product ? `${product.name} · ${product.price} DH · ${product.short_description || product.description || "Boxer premium The Aviator"}` : undefined,
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
            <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
            {t("Erreur")}
          </span>
          <h1 className="mt-4 font-display text-4xl text-navy">{t("Produit introuvable")}</h1>
          <Link to="/collection" className="btn-store btn-store--navy btn-sheen mx-auto mt-8">
            {t("Voir la collection")}
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const currentImage = images[activeImg] || images[0];
  const productSizes = product.sizes?.length ? product.sizes : SIZES;
  const pct = discountPercent(product.price, product.compare_at_price);
  const defaultDesc = t("Conçu pour offrir une aisance irréprochable au quotidien, ce boxer The Aviator allie maintien optimal, douceur durable et finitions de précision adaptées au climat marocain.");
  const tabContent = tab === 0
    ? product.description || product.short_description || defaultDesc || t("Description")
    : tab === 1
      ? t("95% Coton peigné haute qualité, 5% Élasthanne Lycra. Lavage en machine à 30°C. Ne pas javelliser. Séchage à l'air libre conseillé.")
      : t("Livraison rapide partout au Maroc en 24 à 48 heures. Paiement en espèces à la livraison. Possibilité d'échange de taille sous 7 jours.");
  const addToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: currentImage,
      price: product.price,
      color: product.color_name,
      size: size || productSizes[0],
      quantity: qty,
      stock: product.stock,
      category: product.category,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: product.name, image: product.images || [], offers: { "@type": "Offer", priceCurrency: "MAD", price: product.price, availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock" } }) }} />
      <main className="container-edge py-8 md:py-14">
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
                    activeImg === index ? "border-[hsl(72_74%_52%)]" : "border-foreground/10 hover:border-foreground/30",
                  )}
                >
                  <Image src={image} alt="" fittingType="fill" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative aspect-[3/4] flex-1 self-start overflow-hidden bg-muted">
              {currentImage ? (
                <>
                  <Image src={currentImage} alt={product.name} fittingType="fill" priority className="h-full w-full object-cover" />
                  {pct > 0 && (
                    <span className="absolute left-4 top-4 bg-[hsl(72_74%_52%)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-navy">
                      -{pct}%
                    </span>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">{t("Aucune image")}</div>
              )}
            </div>
          </div>

          {/* Purchase panel */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="label-eyebrow inline-flex items-center gap-2.5">
                <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
                {t(product.category || "Boxers")}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl leading-[0.95] tracking-tight text-navy md:text-5xl">
              {product.name}
            </h1>
            <div className="mt-5 flex items-center gap-3">
              <StarRating value={product.rating || 0} count={product.review_count} />
              <span className="text-sm text-muted-foreground">{product.review_count || 0} {t("avis")}</span>
            </div>
            <div className="mt-7 flex items-baseline gap-3">
              <span className="font-display text-3xl tabular text-ink">{formatPrice(product.price)}</span>
              {pct > 0 && (
                <>
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span>
                  <span className="bg-[hsl(72_74%_52%)] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-navy">
                    -{pct}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
              {t(product.description || product.short_description || defaultDesc)}
            </p>

            {/* Sizes */}
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/80">{t("Taille")}</span>
                <Link to="/guide-des-tailles" className="group flex items-center gap-2 text-xs underline underline-offset-4 text-muted-foreground hover:text-navy">
                  {t("Guide des tailles")}
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {productSizes.map((itemSize) => (
                  <button
                    key={itemSize}
                    onClick={() => setSize(itemSize)}
                    className={cn(
                      "chip min-w-[3rem] justify-center px-0",
                      (size || productSizes[0]) === itemSize && "is-on",
                    )}
                  >
                    {itemSize}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center border border-foreground/20">
                <button aria-label={t("Diminuer")} onClick={() => setQty(Math.max(1, qty - 1))} className="flex h-full items-center px-3.5 text-ink/60 transition-colors hover:bg-foreground/5 hover:text-ink">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-9 text-center text-sm font-semibold tabular">{qty}</span>
                <button aria-label={t("Augmenter")} onClick={() => setQty(Math.min(product.stock || 1, qty + 1))} className="flex h-full items-center px-3.5 text-ink/60 transition-colors hover:bg-foreground/5 hover:text-ink">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={addToCart}
                disabled={!product.stock}
                className="btn-store btn-store--navy btn-sheen flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.stock ? t("Ajouter au panier") : t("Rupture de stock")}
              </button>
            </div>
            <a
              href={whatsappContactUrl(`Bonjour, je suis intéressé par ${product.name}`)}
              target="_blank"
              rel="noreferrer"
              className="btn-store btn-store--ghost mt-3"
            >
              <MessageCircle className="h-4 w-4" />
              {t("Commander via WhatsApp")}
            </a>

            {/* Trust row */}
            <div className="mt-9 grid grid-cols-3 gap-3 border-t border-border pt-6 text-center">
              {[
                [Truck, t("Livraison 24-48h")],
                [Check, t("Qualité premium")],
                [RefreshCw, t("Retours faciles")],
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

        {/* Details accordion */}
        <section className="mt-16 border-y border-border py-10 lg:mt-24 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <span className="label-eyebrow flex items-center gap-2.5">
                <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
                {t("Détails du produit")}
              </span>
              <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
                {t("Pensé dans chaque détail.")}
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("Une coupe confortable, des matières choisies et des finitions conçues pour accompagner vos journées.")}
              </p>
            </div>
            <div className="border-t border-border">
              {[
                ["01", "Maintien précis", "Une ceinture souple qui reste en place sans comprimer, pour un maintien confortable du matin au soir."],
                ["02", "Tissu respirant", "Le mélange coton et Lycra accompagne les mouvements et laisse la peau respirer au quotidien."],
                ["03", "Coupe pensée pour bouger", "Des coutures positionnées pour limiter les frottements et garder une liberté de mouvement naturelle."],
                ["04", "Finitions durables", "Des assemblages contrôlés et des détails propres pour conserver la forme et le confort lavage après lavage."],
              ].map(([number, title, detail], index) => (
                <div key={number} className="border-b border-border">
                  <button
                    onClick={() => setActivePoint(activePoint === index ? -1 : index)}
                    className="flex w-full items-center gap-5 py-5 text-left"
                    aria-expanded={activePoint === index}
                  >
                    <span className="text-[11px] font-bold tabular text-ink/30">{number}</span>
                    <span className="flex-1 font-display text-lg text-ink/90">{t(title)}</span>
                    <ChevronDown
                      className={cn("h-4 w-4 text-ink/40 transition-transform duration-300", activePoint === index && "rotate-180 text-ink")}
                    />
                  </button>
                  {activePoint === index && (
                    <p className="pb-6 pl-12 pr-6 text-sm leading-relaxed text-muted-foreground">{t(detail)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-8 overflow-x-auto border-b border-border">
            {TABS.map((label, index) => (
              <button
                key={label}
                onClick={() => setTab(index)}
                className={cn(
                  "whitespace-nowrap pb-4 text-[12px] font-bold uppercase tracking-[0.15em] transition-colors",
                  tab === index ? "border-b-2 border-[hsl(72_74%_52%)] text-ink" : "border-b-2 border-transparent text-muted-foreground hover:text-ink",
                )}
              >
                {t(label)}
              </button>
            ))}
          </div>
          <p className="max-w-3xl py-7 leading-relaxed text-muted-foreground">{tabContent}</p>

          {reviews?.length > 0 && (
            <div className="border-t border-border pt-8">
              <h2 className="flex items-center gap-3 font-display text-2xl">
                {t("Avis clients")}
                <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
              </h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2">
                {reviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="border border-border bg-paper p-6">
                    <div className="flex items-center justify-between">
                      <StarRating value={review.rating} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{review.name}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related */}
        {allProducts?.length > 0 && (
          <section className="mt-20">
            <Reveal className="mb-8 flex items-baseline justify-between">
              <h2 className="flex items-center gap-3 font-display text-2xl sm:text-3xl">
                {t("Vous aimerez aussi")}
                <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
              </h2>
              <Link to="/collection" className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground underline underline-offset-4 hover:text-navy">
                {t("Tout voir")}
              </Link>
            </Reveal>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
              {allProducts.filter((item) => item.id !== product.id).slice(0, 4).map((item, index) => <ProductCard key={item.id} product={item} index={index} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}