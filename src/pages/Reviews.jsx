import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import StarRating from "@/components/storefront/StarRating";
import Reveal from "@/components/storefront/Reveal";
import { useAsync } from "@/lib/useAsync";
import { fetchFeaturedReviews } from "@/lib/store";
import { Quote } from "lucide-react";

const FALLBACK = [
  { name: "Youssef E.", city: "Casablanca", rating: 5, comment: "La qualité est incroyable, le confort aussi. Je ne porte que Aviator maintenant." },
  { name: "Amine B.", city: "Rabat", rating: 5, comment: "Tissus premium et livraison très rapide. Le meilleur rapport qualité/prix au Maroc." },
  { name: "Mehdi K.", city: "Marrakech", rating: 5, comment: "Enfin des sous-vêtements élégants et confortables. Bravo Aviator !" },
  { name: "Karim T.", city: "Tanger", rating: 5, comment: "Le tissu est super doux et la coupe parfaite. Je recommande vivement." },
  { name: "Omar L.", city: "Agadir", rating: 5, comment: "Livraison rapide et produit de très bonne qualité. Je referai une commande soon." },
  { name: "Hamza R.", city: "Fès", rating: 5, comment: "Excellent maintien et confort toute la journée. Le pack de 2 est une super idée." },
];

export default function Reviews() {
  const { data: reviews, loading } = useAsync(() => fetchFeaturedReviews(12), []);
  const list = reviews && reviews.length > 0 ? reviews : FALLBACK;

  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow="Témoignages" title="Avis clients" subtitle="La confiance de nos clients est notre plus belle récompense." />

      <div className="container-edge py-12 lg:py-16">
        {/* Rating summary */}
        <div className="mx-auto mb-12 flex max-w-md flex-col items-center border border-border bg-secondary p-8 text-center">
          <p className="font-display text-5xl font-bold">4.9</p>
          <StarRating value={5} size={20} className="mt-2" />
          <p className="mt-2 text-sm text-muted-foreground">Basé sur les avis de nos clients</p>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 animate-pulse bg-muted" />)}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((r, i) => (
              <Reveal key={r.id || i} delay={(i % 3) * 0.08}>
                <figure className="flex h-full flex-col border border-border p-6">
                  <Quote className="h-6 w-6 text-accent-lime" fill="currentColor" />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed">"{r.comment}"</blockquote>
                  <StarRating value={r.rating} size={14} className="mt-4" />
                  <figcaption className="mt-3 border-t border-border pt-3">
                    <p className="text-sm font-bold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}