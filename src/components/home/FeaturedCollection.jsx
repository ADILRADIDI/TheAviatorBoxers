import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight, Check, ShieldCheck, Sparkles, Truck, Banknote, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import SectionHeading from "@/components/storefront/SectionHeading";
import Reveal from "@/components/storefront/Reveal";
import { useAsync } from "@/lib/useAsync";
import { fetchProducts, fetchColors, formatPrice, FALLBACK_COLORS } from "@/lib/store";
import { useLanguage } from "@/lib/language";

export default function FeaturedCollection() {
  const { data: products, loading, error } = useAsync(() => fetchProducts(), []);
  const { data: dynamicColors } = useAsync(() => fetchColors(), []);
  const colorSwatches = Array.isArray(dynamicColors) && dynamicColors.length > 0 ? dynamicColors : FALLBACK_COLORS;
  const { t } = useLanguage();

  return (
    <section className="bg-[#FAF9F5] py-20 lg:py-28 border-y border-border/40">
      <div className="container-edge">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow={t("La collection")}
            title={t("Découvrez nos packs")}
            sub={t("Une sélection pensée pour vous : confort absolu, matière stretch et coupe impeccable.")}
          />
          <Reveal delay={0.1} className="shrink-0">
            <Link
              to="/notre-boxer"
              className="btn-store btn-store--ghost group"
            >
              {t("Personnaliser mon pack")}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="aspect-[4/3] animate-pulse bg-foreground/5 rounded-none" />
            <div className="aspect-[4/3] animate-pulse bg-foreground/5 rounded-none" />
          </div>
        ) : error ? (
          <div className="mt-12 border border-destructive/30 bg-destructive/5 p-6 text-center text-sm text-destructive">
            {t("Impossible de charger les produits. Veuillez réessayer.")}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Spotlight Card 1: Pack de 2 Signature */}
            <Reveal delay={0.05} className="h-full">
              <div className="group relative flex flex-col justify-between h-full border border-border bg-white p-6 sm:p-8 transition-all duration-300 hover:border-navy hover:shadow-xl">
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#C7D400] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy">
                    <Sparkles className="h-3 w-3" />
                    {t("Meilleure Vente · Pack Signature")}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5">
                    -34% {t("de réduction")}
                  </span>
                </div>

                {/* Main Visual */}
                <Link to="/notre-boxer" className="mt-6 block relative aspect-[16/11] overflow-hidden bg-muted/30">
                  <Image
                    src="/products/aviator-navy.jpg"
                    alt="Pack de 2 Boxers The Aviator"
                    fittingType="fill"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-3 right-3 bg-navy text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    {t("Choisir mes 2 couleurs →")}
                  </span>
                </Link>

                {/* Details */}
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-navy">
                        {t("Pack de 2 Boxers THE AVIATOR")}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("Composez votre pack sur-mesure parmi 5 coloris intemporels")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2 justify-end">
                        <span className="text-xs text-muted-foreground line-through">150 DH</span>
                        <span className="font-heading text-2xl font-bold text-navy">99 DH</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("Le pack de 2")}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-navy">4.8/5</span>
                    <span className="text-muted-foreground">(120 {t("avis clients")})</span>
                  </div>

                  {/* Color dots preview */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("Coloris")}:</span>
                    <div className="flex items-center gap-1.5">
                      {colorSwatches.map((col) => (
                        <span
                          key={col.name}
                          title={col.name}
                          className="h-4 w-4 rounded-full border border-black/15 shadow-sm"
                          style={{ backgroundColor: col.hex }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground ml-1">({t("au choix")})</span>
                  </div>

                  {/* Checklist */}
                  <ul className="space-y-2 border-t border-border/60 pt-4 text-xs text-ink/80">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#C7D400] shrink-0" strokeWidth={2.5} />
                      <span>{t("95% Coton peigné premium & 5% Élasthanne stretch")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#C7D400] shrink-0" strokeWidth={2.5} />
                      <span>{t("Bande élastique signature : maintien sans serrer ni marquer")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#C7D400] shrink-0" strokeWidth={2.5} />
                      <span>{t("Coupe athlétique anti-remontée sur les cuisses")}</span>
                    </li>
                  </ul>

                  {/* CTA */}
                  <Link
                    to="/notre-boxer"
                    className="btn-store btn-store--navy btn-sheen mt-2 flex w-full items-center justify-center gap-2 text-center text-xs"
                  >
                    <span>{t("Composer mon pack (99 DH)")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Spotlight Card 2: Pack de 4 Grand Confort */}
            <Reveal delay={0.15} className="h-full">
              <div className="group relative flex flex-col justify-between h-full border border-border bg-white p-6 sm:p-8 transition-all duration-300 hover:border-navy hover:shadow-xl">
                {/* Top Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-navy text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="h-3 w-3 text-[#C7D400]" />
                    {t("Offre Économique · 4 Boxers")}
                  </span>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5">
                    {t("Économisez 61 DH")}
                  </span>
                </div>

                {/* Main Visual */}
                <Link to="/notre-boxer" className="mt-6 block relative aspect-[16/11] overflow-hidden bg-muted/30">
                  <Image
                    src="/products/aviator-pack-duo.jpg"
                    alt="Pack de 4 Boxers The Aviator"
                    fittingType="fill"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="absolute bottom-3 right-3 bg-navy text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    {t("Commander 2 packs →")}
                  </span>
                </Link>

                {/* Details */}
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-navy">
                        {t("Pack de 4 Boxers THE AVIATOR")}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("2x Packs duo au choix — Idéal pour renouveler votre vestiaire")}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2 justify-end">
                        <span className="text-xs text-muted-foreground line-through">250 DH</span>
                        <span className="font-heading text-2xl font-bold text-navy">189 DH</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("Le lot de 4")}</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-semibold text-navy">4.9/5</span>
                    <span className="text-muted-foreground">(84 {t("avis clients")})</span>
                  </div>

                  {/* Color dots preview */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("Sélection")}:</span>
                    <div className="flex items-center gap-1.5">
                      {colorSwatches.map((col) => (
                        <span
                          key={col.name}
                          title={col.name}
                          className="h-4 w-4 rounded-full border border-black/15 shadow-sm"
                          style={{ backgroundColor: col.hex }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold ml-1">✓ {t("Livraison Gratuite")}</span>
                  </div>

                  {/* Checklist */}
                  <ul className="space-y-2 border-t border-border/60 pt-4 text-xs text-ink/80">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#C7D400] shrink-0" strokeWidth={2.5} />
                      <span>{t("4 Boxers complets (2 packs personnalisables)")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#C7D400] shrink-0" strokeWidth={2.5} />
                      <span>{t("Coffret packaging premium The Aviator inclus")}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#C7D400] shrink-0" strokeWidth={2.5} />
                      <span>{t("Livraison rapide et offerte partout au Maroc")}</span>
                    </li>
                  </ul>

                  {/* CTA */}
                  <Link
                    to="/notre-boxer"
                    className="btn-store btn-store--navy btn-sheen mt-2 flex w-full items-center justify-center gap-2 text-center text-xs"
                  >
                    <span>{t("Commander 4 boxers (189 DH)")}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        )}

        {/* 3 Pillars Trust Bar Below Cards */}
        <Reveal delay={0.2} className="mt-10">
          <div className="grid grid-cols-1 divide-y border border-border bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0 shadow-sm">
            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-navy text-[#C7D400]">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy">{t("Livraison 24-48h")}</p>
                <p className="text-[11px] text-muted-foreground">{t("Gratuite sur Casablanca & dès 99 DH")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-navy text-[#C7D400]">
                <Banknote className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy">{t("Paiement à la livraison")}</p>
                <p className="text-[11px] text-muted-foreground">{t("100% sécurisé, payez à la réception")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 sm:p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-navy text-[#C7D400]">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy">{t("Confort Garanti")}</p>
                <p className="text-[11px] text-muted-foreground">{t("95% Coton peigné / 5% Élasthanne")}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}