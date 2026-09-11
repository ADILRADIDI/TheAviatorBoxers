import { useState } from "react";
import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import StarRating from "@/components/storefront/StarRating";
import Reveal from "@/components/storefront/Reveal";
import { useAsync } from "@/lib/useAsync";
import { fetchFeaturedReviews } from "@/lib/store";
import { Quote } from "lucide-react";

async function createReview(payload) {
  const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("review failed");
  return response.json();
}

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
  const [form, setForm] = useState({ name: "", city: "", rating: 5, comment: "" });
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitReview = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await createReview({ ...form, rating: Number(form.rating) });
      setForm({ name: "", city: "", rating: 5, comment: "" });
      setMessage("Merci ! Votre avis sera publié après validation.");
    } catch {
      setMessage("Impossible d'envoyer votre avis pour le moment.");
    } finally {
      setSubmitting(false);
    }
  };

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

        <section className="mx-auto mt-14 max-w-2xl border border-border bg-secondary p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Partager votre expérience</h2>
          <p className="mt-2 text-sm text-muted-foreground">Votre avis sera vérifié avant publication.</p>
          <form onSubmit={submitReview} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="border border-border bg-background px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="Votre nom" aria-label="Votre nom" />
              <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="border border-border bg-background px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="Votre ville" aria-label="Votre ville" />
            </div>
            <select value={form.rating} onChange={(event) => setForm({ ...form, rating: event.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-navy focus:outline-none" aria-label="Note">
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} étoile{value > 1 ? "s" : ""}</option>)}
            </select>
            <textarea required minLength={10} rows={4} value={form.comment} onChange={(event) => setForm({ ...form, comment: event.target.value })} className="w-full border border-border bg-background px-4 py-3 text-sm focus:border-navy focus:outline-none" placeholder="Votre avis" aria-label="Votre avis" />
            {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
            <button disabled={submitting} className="w-full bg-navy py-3.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">{submitting ? "Envoi..." : "Envoyer mon avis"}</button>
          </form>
        </section>
      </div>
    </>
  );
}