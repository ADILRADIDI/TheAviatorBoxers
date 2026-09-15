import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, MessageCircle, Quote } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import SectionHeading from "@/components/storefront/SectionHeading";
import StarRating from "@/components/storefront/StarRating";
import { useAsync } from "@/lib/useAsync";
import { fetchFeaturedReviews } from "@/lib/store";
import { useLanguage } from "@/lib/language";

export default function ReviewsSection() {
  const { data: reviews, loading } = useAsync(() => fetchFeaturedReviews(3), []);
  const { t } = useLanguage();

  return (
    <section className="py-20 lg:py-28">
      <div className="container-edge">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow={t("Avis publiés")}
            title={t("Le confort, raconté par ceux qui le portent.")}
            className="max-w-2xl"
          />
          <Reveal delay={0.1} className="shrink-0">
            <Link to="/avis" className="btn-store btn-store--ghost group">
              {t("Tous les avis")}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {loading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-foreground/5" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.1}>
                <figure className="group flex h-full flex-col border border-border bg-paper p-8 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.25)]">
                  <span className="absolute -left-px top-0 h-px w-0 bg-[hsl(72_74%_52%)] transition-all duration-500 group-hover:w-full" />
                  <span className="absolute -top-px left-0 h-0 w-px bg-[hsl(72_74%_52%)] transition-all duration-500 group-hover:h-full" />
                  <div className="relative flex items-start justify-between gap-4">
                    <Quote className="h-8 w-8 text-[hsl(72_74%_52%)]" fill="currentColor" />
                    {r.verified && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                        <BadgeCheck className="h-3.5 w-3.5 text-[hsl(72_74%_52%)]" />
                        {t("Achat vérifié")}
                      </span>
                    )}
                  </div>
                  <blockquote className="mt-7 flex-1 font-display text-xl italic leading-snug text-ink/90">“{r.comment}”</blockquote>
                  <StarRating value={r.rating} size={14} className="mt-7" />
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <span className="flex h-9 w-9 items-center justify-center bg-navy text-xs font-bold text-white">{r.name?.slice(0, 2).toUpperCase()}</span>
                    <span>
                      <strong className="block text-sm">{r.name}</strong>
                      <span className="text-xs text-muted-foreground">{r.city || "Maroc"}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-foreground/20 px-6 py-14 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-ink/30" strokeWidth={1.25} />
            <h3 className="mt-4 font-display text-2xl text-ink/90">{t("Votre expérience peut être la prochaine.")}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("Les avis publiés apparaissent ici après validation. Partagez votre retour sur la coupe, le tissu et la livraison.")}
            </p>
            <Link to="/avis" className="btn-store btn-store--navy btn-sheen mt-7 mx-auto">
              {t("Laisser un avis")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}