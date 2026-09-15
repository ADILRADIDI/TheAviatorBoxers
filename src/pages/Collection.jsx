import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/storefront/ProductCard";
import { useAsync } from "@/lib/useAsync";
import { fetchProducts } from "@/lib/store";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "featured", label: "En vedette" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "name", label: "Nom (A-Z)" },
];

const COLOR_FILTERS = [
  { name: "Navy", hex: "#1a237e" },
  { name: "Noir", hex: "#1a1a1a" },
  { name: "Blanc", hex: "#f5f5f5" },
  { name: "Gris", hex: "#9ca3af" },
  { name: "Bleu", hex: "#1d4ed8" },
];

const SIZE_FILTERS = ["S", "M", "L", "XL", "XXL"];

export default function Collection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("featured");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [mobileFilters, setMobileFilters] = useState(false);
  const { t } = useLanguage();

  const { data: products, loading, error } = useAsync(() => fetchProducts(), []);
  const maxAvailable = products?.length ? Math.max(...products.map((p) => Number(p.price) || 0)) : 0;

  useEffect(() => {
    const q = searchParams.get("q");
    if (q !== null) setSearch(q);
  }, [searchParams]);

  usePageMeta({
    title: "Collection — The Aviator",
    description: t("Découvrez tous nos boxers premium pour hommes : coton et Lycra, confort et maintien. Paiement à la livraison partout au Maroc."),
  });
  useJsonLd(breadcrumbJsonLd([{ name: "Accueil", url: SITE_URL }, { name: "Collection", url: `${SITE_URL}/collection` }]));

  const toggle = (value, list, setter) => {
    setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(q) || p.short_description?.toLowerCase().includes(q));
    }
    if (colors.length) result = result.filter((p) => colors.includes(p.color_name));
    if (sizes.length) result = result.filter((p) => p.sizes?.some((s) => sizes.includes(s)));
    if (maxPrice !== Infinity) result = result.filter((p) => (Number(p.price) || 0) <= maxPrice);

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || a.sort_order - b.sort_order);
    }
    return result;
  }, [products, search, colors, sizes, maxPrice, sortBy]);

  const FilterContent = () => (
    <div className="space-y-9">
      <div>
        <h3 className="label-eyebrow mb-4">{t("Couleur")}</h3>
        <div className="flex flex-wrap gap-2">
          {COLOR_FILTERS.map((c) => (
            <button
              key={c.name}
              onClick={() => toggle(c.name, colors, setColors)}
              className={cn(
                "chip",
                colors.includes(c.name) && "is-on",
              )}
            >
              <span
                className="h-3.5 w-3.5 rounded-full border border-black/10"
                style={{ backgroundColor: c.hex }}
              />
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="label-eyebrow mb-4">{t("Taille")}</h3>
        <div className="flex flex-wrap gap-2">
          {SIZE_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => toggle(s, sizes, setSizes)}
              className={cn(
                "chip min-w-11 justify-center px-0",
                sizes.includes(s) && "is-on",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="label-eyebrow mb-4">{t("Prix")}</h3>
        {maxAvailable > 0 && (
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={maxAvailable}
              value={maxPrice === Infinity ? maxAvailable : maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value) >= maxAvailable ? Infinity : Number(e.target.value))}
              className="w-full accent-[hsl(72_74%_52%)]"
              aria-label={t("Prix maximum")}
            />
            <p className="text-xs text-muted-foreground">
              {maxPrice === Infinity ? t("Tous les prix") : `${t("Jusqu'à")} ${maxPrice} DH`}
            </p>
          </div>
        )}
      </div>
      {(colors.length > 0 || sizes.length > 0 || maxPrice !== Infinity) && (
        <button
          onClick={() => { setColors([]); setSizes([]); setMaxPrice(Infinity); }}
          className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground underline underline-offset-4 hover:text-navy"
        >
          {t("Réinitialiser les filtres")}
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Editorial header */}
      <section className="relative overflow-hidden bg-navy py-16 text-white lg:py-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grain-dark opacity-50" />
        <div className="container-edge relative">
          <span className="label-eyebrow flex items-center gap-2.5 text-white/45">
            <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
            {t("La collection")}
          </span>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            {t("Tous nos produits")}
          </h1>
          <p className="mt-4 max-w-md text-sm text-white/60 sm:text-base">
            {t("Boxers premium conçus pour le confort, le maintien et le style au quotidien.")}
          </p>
        </div>
      </section>

      <div className="container-edge py-10 lg:py-14">
        {/* Toolbar */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <button
            onClick={() => setMobileFilters(true)}
            className="flex items-center gap-2 border border-foreground/20 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-ink transition-colors hover:border-navy lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> {t("Filtres")}
          </button>
          <div className="relative hidden flex-1 max-w-xs sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Rechercher...")}
              className="w-full border-b border-foreground/20 bg-transparent py-2.5 pl-10 pr-4 text-sm focus:border-navy focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="hidden text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground sm:block">{t("Trier:")}</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer appearance-none border border-foreground/20 bg-transparent py-2.5 pl-4 pr-9 text-xs font-medium uppercase tracking-[0.1em] focus:border-navy focus:outline-none"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Desktop sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <h2 className="mb-7 flex items-center gap-2.5 font-display text-xl">
              {t("Filtres")}
              <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
            </h2>
            <FilterContent />
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[3/4] animate-pulse bg-foreground/5" />
                    <div className="mt-3 h-4 w-3/4 animate-pulse bg-foreground/5" />
                    <div className="mt-2 h-4 w-1/2 animate-pulse bg-foreground/5" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded border border-destructive/30 bg-destructive/5 p-10 text-center text-sm text-destructive">
                {t("Erreur de chargement. Veuillez réessayer.")}
              </div>
            ) : filtered.length > 0 ? (
              <>
                <p className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
                  {filtered.length} {filtered.length > 1 ? t("produits") : t("produit")}
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
                  {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <span className="flex h-16 w-16 items-center justify-center border border-dashed border-foreground/20">
                  <Search className="h-6 w-6 text-foreground/30" strokeWidth={1} />
                </span>
                <p className="mt-5 font-display text-xl">{t("Aucun produit trouvé")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("Essayez de modifier vos filtres.")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {mobileFilters && (
          <>
            <div className="fixed inset-0 z-50 bg-navy/50 backdrop-blur-sm lg:hidden" onClick={() => setMobileFilters(false)} />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-background lg:hidden"
            >
              <div className="flex items-center justify-between bg-navy px-6 py-5 text-white">
                <h2 className="font-display text-xl">{t("Filtres")}</h2>
                <button onClick={() => setMobileFilters(false)} className="p-1 text-white/70" aria-label={t("Fermer")}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="store-scroll flex-1 overflow-y-auto px-6 py-7">
                <FilterContent />
              </div>
              <div className="border-t px-6 py-5">
                <button
                  onClick={() => setMobileFilters(false)}
                  className="btn-store btn-store--navy btn-sheen w-full"
                >
                  {t("Voir")} {filtered.length} {filtered.length > 1 ? t("produits") : t("produit")}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}