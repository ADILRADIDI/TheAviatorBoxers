import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Minus, Plus, ShoppingBag, MessageCircle, Check, Truck, RefreshCw, ChevronDown } from "lucide-react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import StarRating from "@/components/storefront/StarRating";
import ProductCard from "@/components/storefront/ProductCard";
import { useAsync } from "@/lib/useAsync";
import { fetchProductBySlug, fetchProducts, fetchReviews, formatPrice, discountPercent, SIZES } from "@/lib/store";
import { useCart } from "@/lib/cart-context";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const TABS = ["Description", "Composition & entretien", "Livraison & retours"];

export default function ProductDetail() {
  const { slug } = useParams();
  const { data: product, loading, error } = useAsync(() => fetchProductBySlug(slug), [slug]);
  const { data: allProducts } = useAsync(() => fetchProducts(), []);
  const { data: reviews } = useAsync(() => (product ? fetchReviews(product.id) : Promise.resolve([])), [product?.id]);
  const { addItem, openDrawer } = useCart();

  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [activePoint, setActivePoint] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <div className="container-edge py-24 text-center text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar />
        <div className="container-edge py-24 text-center">
          <h1 className="font-display text-2xl font-bold text-navy">Produit introuvable</h1>
          <Link to="/collection" className="mt-4 inline-block text-sm underline">Voir la collection</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const currentImage = images[activeImg] || images[0];
  const productSizes = product.sizes?.length ? product.sizes : SIZES;
  const percentage = discountPercent(product.price, product.compare_at_price);
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
      <AnnouncementBar />
      <main className="container-edge py-8 md:py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="flex gap-3">
            <div className="flex w-20 shrink-0 flex-col gap-3">
              {images.map((image, index) => (
                <button key={image} onClick={() => setActiveImg(index)} className={cn("aspect-[3/4] overflow-hidden border", activeImg === index ? "border-navy" : "border-transparent")}>
                  <Image src={image} alt="" fittingType="fill" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="aspect-[3/4] flex-1 overflow-hidden bg-muted">
              {currentImage ? <Image src={currentImage} alt={product.name} fittingType="fill" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-muted-foreground">Aucune image</div>}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="label-eyebrow">{product.category}</p>
            <h1 className="mt-3 font-display text-3xl font-bold text-navy md:text-4xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3">
              <StarRating value={product.rating || 0} count={product.review_count} />
              <span className="text-sm text-muted-foreground">{product.review_count || 0} avis</span>
            </div>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.compare_at_price > product.price && <><span className="text-sm text-muted-foreground line-through">{formatPrice(product.compare_at_price)}</span><span className="bg-accent-lime px-2 py-1 text-xs font-bold">-{percentage}%</span></>}
            </div>
            <p className="mt-6 leading-relaxed text-muted-foreground">{product.description || product.short_description}</p>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold">Taille</span><Link to="/guide-des-tailles" className="text-xs underline">Guide des tailles</Link></div>
              <div className="flex flex-wrap gap-2">{productSizes.map((itemSize) => <button key={itemSize} onClick={() => setSize(itemSize)} className={cn("min-w-12 border px-4 py-2 text-sm", (size || productSizes[0]) === itemSize ? "border-navy bg-navy text-white" : "border-border")}>{itemSize}</button>)}</div>
            </div>

            <div className="mt-6 flex gap-3">
              <div className="flex items-center border border-border"><button aria-label="Diminuer la quantité" onClick={() => setQty(Math.max(1, qty - 1))} className="p-3"><Minus className="h-4 w-4" /></button><span className="w-8 text-center text-sm">{qty}</span><button aria-label="Augmenter la quantité" onClick={() => setQty(Math.min(product.stock || 1, qty + 1))} className="p-3"><Plus className="h-4 w-4" /></button></div>
              <button onClick={addToCart} disabled={!product.stock} className="flex flex-1 items-center justify-center gap-2 bg-navy px-5 py-3 text-sm font-semibold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-50"><ShoppingBag className="h-4 w-4" />{product.stock ? "Ajouter au panier" : "Rupture de stock"}</button>
            </div>
            <a href={whatsappContactUrl(`Bonjour, je suis intéressé par ${product.name}`)} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-2 border border-navy px-5 py-3 text-sm font-semibold text-navy"><MessageCircle className="h-4 w-4" />Commander via WhatsApp</a>
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border pt-5 text-center text-xs text-muted-foreground"><span><Truck className="mx-auto mb-2 h-4 w-4" />Livraison 24-48h</span><span><Check className="mx-auto mb-2 h-4 w-4" />Qualité premium</span><span><RefreshCw className="mx-auto mb-2 h-4 w-4" />Retours faciles</span></div>
          </div>
        </div>

        <section className="mt-16 border-y border-border py-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <span className="label-eyebrow">Détails du produit</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">Pensé dans chaque détail.</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">Une coupe confortable, des matières choisies et des finitions conçues pour accompagner vos journées.</p>
            </div>
            <div className="divide-y divide-border border-y border-border">
              {[
                ["01", "Maintien précis", "Une ceinture souple qui reste en place sans comprimer, pour un maintien confortable du matin au soir."],
                ["02", "Tissu respirant", "Le mélange coton et Lycra accompagne les mouvements et laisse la peau respirer au quotidien."],
                ["03", "Coupe pensée pour bouger", "Des coutures positionnées pour limiter les frottements et garder une liberté de mouvement naturelle."],
                ["04", "Finitions durables", "Des assemblages contrôlés et des détails propres pour conserver la forme et le confort lavage après lavage."],
              ].map(([number, title, detail], index) => (
                <div key={number}>
                  <button onClick={() => setActivePoint(activePoint === index ? -1 : index)} className="flex w-full items-center gap-4 py-5 text-left" aria-expanded={activePoint === index}>
                    <span className="font-mono text-xs text-muted-foreground">{number}</span>
                    <span className="flex-1 font-semibold text-navy">{title}</span>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", activePoint === index && "rotate-180")} />
                  </button>
                  {activePoint === index && <p className="pb-5 pl-10 pr-8 text-sm leading-relaxed text-muted-foreground">{detail}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-16 border-t border-border pt-8">
          <div className="flex gap-6 border-b border-border">{TABS.map((label, index) => <button key={label} onClick={() => setTab(index)} className={cn("pb-3 text-sm", tab === index ? "border-b-2 border-navy font-semibold text-navy" : "text-muted-foreground")}>{label}</button>)}</div>
          <p className="max-w-3xl py-6 leading-relaxed text-muted-foreground">{tab === 0 ? product.description || product.short_description : tab === 1 ? "Confection soigneuse avec des matières sélectionnées pour un confort quotidien et une tenue durable." : "Livraison partout au Maroc en 24 à 48 heures. Paiement à la livraison disponible."}</p>
          {reviews?.length > 0 && <div className="border-t border-border pt-6"><h2 className="font-display text-xl font-bold text-navy">Avis clients</h2><div className="mt-4 grid gap-4 md:grid-cols-2">{reviews.slice(0, 4).map((review) => <div key={review.id} className="border border-border p-4"><StarRating value={review.rating} /><p className="mt-2 text-sm text-muted-foreground">{review.comment}</p></div>)}</div></div>}
        </div>

        {allProducts?.length > 0 && <section className="mt-16"><h2 className="font-display text-2xl font-bold text-navy">Vous aimerez aussi</h2><div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">{allProducts.filter((item) => item.id !== product.id).slice(0, 4).map((item, index) => <ProductCard key={item.id} product={item} index={index} />)}</div></section>}
      </main>
    </div>
  );
}