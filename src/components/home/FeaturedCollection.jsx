import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/storefront/ProductCard";
import Reveal from "@/components/storefront/Reveal";
import { useAsync } from "@/lib/useAsync";
import { fetchProducts } from "@/lib/store";

export default function FeaturedCollection() {
  const { data: products, loading, error } = useAsync(() => fetchProducts({ featured: true }), []);

  return (
    <section className="py-20 lg:py-28">
      <div className="container-edge">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <Reveal>
            <span className="label-eyebrow">La collection</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Découvrez nos produits
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/collection" className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-navy">
              Voir tout
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] animate-pulse bg-muted" />
                <div className="mt-3 h-4 w-3/4 animate-pulse bg-muted" />
                <div className="mt-2 h-4 w-1/2 animate-pulse bg-muted" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 rounded border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
            Impossible de charger les produits. Veuillez réessayer.
          </div>
        ) : products && products.length > 0 ? (
          <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {products.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">Aucun produit disponible pour le moment.</p>
        )}
      </div>
    </section>
  );
}