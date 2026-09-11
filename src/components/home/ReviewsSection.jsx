import { Link } from "react-router-dom";
import { ArrowUpRight, BadgeCheck, MessageCircle, Quote } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import StarRating from "@/components/storefront/StarRating";
import { useAsync } from "@/lib/useAsync";
import { fetchFeaturedReviews } from "@/lib/store";

export default function ReviewsSection() {
  const { data: reviews, loading } = useAsync(() => fetchFeaturedReviews(3), []);

  return (
    <section className="py-20 lg:py-28">
      <div className="container-edge">
        <Reveal className="flex flex-col justify-between gap-6 border-b border-border pb-8 md:flex-row md:items-end">
          <div>
            <span className="label-eyebrow">Avis publiés</span>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Le confort, raconté par ceux qui le portent.
            </h2>
          </div>
          <Link to="/avis" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-navy underline underline-offset-4 hover:text-accent-lime">
            Tous les avis <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {loading ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse bg-muted" />
            ))}
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.1}>
                <figure className="group flex h-full flex-col border border-border bg-secondary p-7 transition-colors hover:border-navy">
                  <div className="flex items-start justify-between gap-4">
                    <Quote className="h-8 w-8 text-accent-lime" fill="currentColor" />
                    {r.verified && <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"><BadgeCheck className="h-3.5 w-3.5 text-accent-lime" /> Achat vérifié</span>}
                  </div>
                  <blockquote className="mt-7 flex-1 font-display text-xl leading-snug text-navy">“{r.comment}”</blockquote>
                  <StarRating value={r.rating} size={14} className="mt-7" />
                  <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">{r.name?.slice(0, 2).toUpperCase()}</span>
                    <span><strong className="block text-sm">{r.name}</strong><span className="text-xs text-muted-foreground">{r.city || "Maroc"}</span></span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-border bg-secondary px-6 py-12 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-navy" />
            <h3 className="mt-4 font-display text-2xl font-bold text-navy">Votre expérience peut être la prochaine.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">Les avis publiés apparaissent ici après validation. Partagez votre retour sur la coupe, le tissu et la livraison.</p>
            <Link to="/avis" className="mt-6 inline-flex bg-navy px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">Laisser un avis</Link>
          </div>
        )}
      </div>
    </section>
  );
}
