import { Link } from "react-router-dom";
import { Quote } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import StarRating from "@/components/storefront/StarRating";
import { useAsync } from "@/lib/useAsync";
import { fetchFeaturedReviews } from "@/lib/store";

export default function ReviewsSection() {
  const { data: reviews, loading } = useAsync(() => fetchFeaturedReviews(3), []);

  return (
    <section className="py-20 lg:py-28">
      <div className="container-edge">
        <Reveal className="text-center">
          <span className="label-eyebrow">Ils nous font confiance</span>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            La parole à nos clients
          </h2>
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
                <figure className="flex h-full flex-col border border-border p-8">
                  <Quote className="h-7 w-7 text-accent-lime" fill="currentColor" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                    "{r.comment}"
                  </blockquote>
                  <StarRating value={r.rating} size={14} className="mt-4" />
                  <figcaption className="mt-3 border-t border-border pt-3">
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {FALLBACK.map((r, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <figure className="flex h-full flex-col border border-border p-8">
                  <Quote className="h-7 w-7 text-accent-lime" fill="currentColor" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">"{r.comment}"</blockquote>
                  <StarRating value={5} size={14} className="mt-4" />
                  <figcaption className="mt-3 border-t border-border pt-3">
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={0.3} className="mt-10 text-center">
          <Link to="/avis" className="text-sm font-semibold uppercase tracking-[0.12em] text-navy underline underline-offset-4 hover:text-accent-lime">
            Voir tous les avis
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

const FALLBACK = [
  { name: "Youssef E.", city: "Casablanca", comment: "La qualité est incroyable, le confort aussi. Je ne porte que Aviator maintenant." },
  { name: "Amine B.", city: "Rabat", comment: "Tissus premium et livraison très rapide. Le meilleur rapport qualité/prix au Maroc." },
  { name: "Mehdi K.", city: "Marrakech", comment: "Enfin des sous-vêtements élégants et confortables. Bravo Aviator !" },
];