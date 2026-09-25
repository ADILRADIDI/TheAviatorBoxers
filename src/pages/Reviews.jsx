import { useEffect, useRef, useState } from "react";
import RatingCircles from "@/components/storefront/RatingCircles";
import Reveal from "@/components/storefront/Reveal";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewForm, { CRITERIA } from "@/components/storefront/ReviewForm";
import { useAsync } from "@/lib/useAsync";
import { fetchFeaturedReviews } from "@/lib/store";
import { useLanguage } from "@/lib/language";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

const FALLBACK = [
  { name: "Youssef E.", city: "Casablanca", rating: 5, comment: "La qualité est incroyable, le confort aussi. Je ne porte que Aviator maintenant.", tissu: 5, service: 5, livraison: 5, qualite: 5 },
  { name: "Amine B.", city: "Rabat", rating: 5, comment: "Tissus premium et livraison très rapide. Le meilleur rapport qualité/prix au Maroc.", tissu: 5, service: 5, livraison: 5, qualite: 5 },
  { name: "Mehdi K.", city: "Marrakech", rating: 5, comment: "Enfin des sous-vêtements élégants et confortables. Bravo Aviator !", tissu: 5, service: 5, livraison: 4, qualite: 5 },
  { name: "Karim T.", city: "Tanger", rating: 5, comment: "Le tissu est super doux et la coupe parfaite. Je recommande vivement.", tissu: 5, service: 5, livraison: 5, qualite: 5 },
  { name: "Omar L.", city: "Agadir", rating: 5, comment: "Livraison rapide et produit de très bonne qualité. Je referai une commande bientôt.", tissu: 5, service: 5, livraison: 5, qualite: 5 },
  { name: "Hamza R.", city: "Fès", rating: 5, comment: "Excellent maintien et confort toute la journée. Le pack de 2 est une super idée.", tissu: 4, service: 5, livraison: 4, qualite: 5 },
];

function useCountUp(target) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    const destination = inView ? target : 0;
    if (reduceMotion) {
      setValue(destination);
      prev.current = destination;
      return;
    }
    const controls = animate(prev.current, destination, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: setValue,
    });
    return () => {
      controls.stop();
      prev.current = destination;
    };
  }, [inView, target, reduceMotion]);

  return { value, ref };
}

export default function Reviews() {
  const { data: reviews, loading, error, refetch } = useAsync(() => fetchFeaturedReviews(6), []);
  const [filterKey, setFilterKey] = useState("all");
  const list = reviews && reviews.length > 0 ? reviews : FALLBACK;
  const filtered = filterKey === "all" ? list : list.filter((r) => Number(r[filterKey]) === 5);
  const emptyFilter = filterKey !== "all" && filtered.length === 0;
  const globalScore = list.length ? list.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / list.length : 5;
  const avgOf = (key) => {
    const values = list.map((r) => Number(r[key])).filter((v) => Number.isFinite(v) && v > 0);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : globalScore;
  };
  const { value: animatedScore, ref: scoreRef } = useCountUp(globalScore);
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const title = t("Avis clients");
  const words = title.split(" ");
  const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } };
  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };
  const wordStagger = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
  usePageMeta({ title: "Avis clients — The Aviator", description: "Plus de 5 000 hommes au Maroc nous font confiance. Découvrez les avis de nos clients sur le confort, la qualité et la livraison de nos boxers premium." });
  useJsonLd(breadcrumbJsonLd([{ name: "Accueil", url: SITE_URL }, { name: "Avis clients", url: `${SITE_URL}/avis` }]));
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Boxer The Aviator",
    review: (reviews && reviews.length > 0 ? reviews : FALLBACK).slice(0, 6).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name || "Client vérifié" },
      reviewRating: { "@type": "Rating", ratingValue: r.rating || 5, bestRating: 5 },
      reviewBody: r.comment,
    })),
  });

  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[36rem] -translate-x-1/2 rounded-full bg-white/[0.04] blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 left-1/2 h-[24rem] w-[30rem] -translate-x-1/2 rounded-full bg-accent-lime/10 blur-3xl" />

        <motion.div
          initial={reduce ? undefined : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
          className="container-edge relative py-20 text-center lg:py-28"
        >
          <motion.p variants={fadeUp} className="label-eyebrow label-eyebrow--pip label-eyebrow--lime justify-center">
            {t("Témoignages")}
          </motion.p>
          <motion.h1
            aria-label={title}
            variants={wordStagger}
            className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-normal tracking-tight sm:text-5xl lg:text-6xl"
          >
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                aria-hidden="true"
                variants={fadeUp}
                className={i < words.length - 1 ? "mr-3 inline-block whitespace-nowrap" : "gradient-text inline-block whitespace-nowrap"}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            {t("La confiance de nos clients est notre plus belle récompense.")}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#reviews-form" className="btn-store btn-store--lime btn-sheen">{t("Laisser un avis")}</a>
          </motion.div>
        </motion.div>
      </section>

      <div className="container-edge py-12 lg:py-16">
        {/* Rating summary */}
        <Reveal as="section" variant="mask" className="mx-auto mb-12 max-w-4xl">
          <div ref={scoreRef} className="flex flex-col items-stretch gap-8 border border-border bg-secondary p-8 lg:flex-row lg:items-center lg:gap-12">
            <Reveal variant="scale" className="flex flex-col items-center gap-2 self-center">
              <span className="font-heading text-6xl font-bold leading-none tabular-nums">{animatedScore.toFixed(1)}</span>
              <span aria-hidden className="h-px w-16 bg-accent" />
              <RatingCircles value={globalScore} size={32} />
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t("Note globale")}</p>
              <p className="text-xs text-muted-foreground">{list.length} {t("avis")}</p>
            </Reveal>
            <div className="hidden h-32 w-px bg-border lg:block" aria-hidden="true" />
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              {CRITERIA.map((c, i) => {
                const score = avgOf(c.key);
                return (
                  <Reveal key={c.key} variant="fade" delay={i * 0.06} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold">{t(c.label)}</span>
                    <RatingCircles value={score} size={20} />
                    <span className="w-8 text-right text-sm font-bold tabular-nums">{score.toFixed(1)}</span>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </Reveal>

        {!loading && (
          <div role="group" aria-label="Filtrer les avis" className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterKey("all")}
              aria-pressed={filterKey === "all"}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                filterKey === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {t("Tous")}
            </button>
            {CRITERIA.map((c) => {
              const active = filterKey === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setFilterKey(c.key)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {t(c.label)}
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <div role="alert" className="mb-8 border border-dashed border-border p-8 text-center">
            <h2 className="font-heading text-xl font-bold">{t("Impossible de charger les avis.")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("Vérifiez votre connexion puis réessayez.")}</p>
            <button type="button" onClick={refetch} className="btn-store btn-store--navy btn-sheen mt-6">
              {t("Réessayer")}
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-56 animate-pulse bg-muted" />)}
          </div>
        ) : emptyFilter ? (
          <div className="grid place-items-center border border-dashed border-border p-8 text-center md:col-span-2 lg:col-span-3">
            <h2 className="font-heading text-2xl">{t("Aucun avis 5★ sur ce critère")}</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("Essayez un autre critère ou partagez votre expérience.")}</p>
            <a href="#reviews-form" className="btn-store btn-store--navy btn-sheen mt-7 inline-block">{t("Laisser un avis")}</a>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r, i) => (
              <Reveal key={r.id || i} variant="fade" delay={(i % 3) * 0.12}>
                <ReviewCard review={r} />
              </Reveal>
            ))}
          </div>
        )}

        <section id="reviews-form" className="mt-14 scroll-mt-20">
          <Reveal as="section" className="mx-auto max-w-2xl border border-border bg-secondary p-6 sm:p-8">
            <ReviewForm />
          </Reveal>
        </section>
      </div>
    </>
  );
}