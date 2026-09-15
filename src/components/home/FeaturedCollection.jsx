import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import ProductCard from "@/components/storefront/ProductCard";
import SectionHeading from "@/components/storefront/SectionHeading";
import Reveal from "@/components/storefront/Reveal";
import { useAsync } from "@/lib/useAsync";
import { fetchProducts } from "@/lib/store";
import { useLanguage } from "@/lib/language";

export default function FeaturedCollection() {
  const { data: products, loading, error } = useAsync(() => fetchProducts(), []);
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28">
      <div className="container-edge">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow={t("La collection")}
            title={t("Découvrez nos produits")}
            sub={t("Une sélection pensée pour vous, matière douce et coupe impeccable.")}
          />
          <Reveal delay={0.1} className="shrink-0">
            <Link
              to="/collection"
              className="btn-store btn-store--ghost group"
            >
              {t("Voir tout")}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] animate-pulse bg-foreground/5" />
                <div className="mt-3 h-4 w-3/4 animate-pulse bg-foreground/5" />
                <div className="mt-2 h-4 w-1/2 animate-pulse bg-foreground/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-12 border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
            {t("Impossible de charger les produits. Veuillez réessayer.")}
          </div>
        ) : products && products.length > 0 ? (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {products.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-center text-sm text-muted-foreground">{t("Aucun produit disponible pour le moment.")}</p>
        )}

        <Reveal className="mt-14">
          <Link
            to="/collection"
            className="group flex items-center justify-between border-t border-border pt-5"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-ink/40 transition-colors group-hover:text-ink">
              {t("Explorer le catalogue complet")}
            </span>
            <ArrowRight className="h-5 w-5 text-ink/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[hsl(72_74%_52%)]" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}