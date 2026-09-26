import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, Check, X, MessageSquare } from "lucide-react";
import ReviewForm from "@/components/storefront/ReviewForm";
import { useAsync } from "@/lib/useAsync";
import { fetchFeaturedReviews } from "@/lib/store";
import { useLanguage } from "@/lib/language";

// Fallback reviews shown when no API data is available
const FALLBACK_REVIEWS = [
  {
    id: "f1",
    author: "Yassine",
    city: "Casablanca",
    rating: 5,
    text: "Très confortable, je le porte tous les jours. La qualité est vraiment au rendez-vous.",
  },
  {
    id: "f2",
    author: "Amine",
    city: "Rabat",
    rating: 5,
    text: "La coupe est parfaite, il ne serre pas et reste bien en place toute la journée. Je recommande !",
  },
  {
    id: "f3",
    author: "Karim",
    city: "Marrakech",
    rating: 5,
    text: "Très bon rapport qualité-prix. Le tissu est doux et la bande est vraiment confortable.",
  },
];

function StarRow({ rating = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-[#C7D400] text-[#C7D400]" : "fill-black/10 text-black/10"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const { data: reviews, loading, error } = useAsync(() => fetchFeaturedReviews(3), []);
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const displayReviews = reviews && reviews.length > 0 ? reviews : FALLBACK_REVIEWS;

  return (
    <section className="bg-[#FAF9F6] py-16 lg:py-24 font-sans">
      <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-12">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#07132B]/60 block mb-2 font-sans">
              {t("AVIS CLIENTS")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#07132B] leading-tight">
              {t("Le confort, c'est vous qui")}{" "}
              <em className="not-italic font-serif italic text-[#C7D400]">
                {t("en parlez !")}
              </em>
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#07132B]/70 font-sans">
              {t("Des hommes qui ont fait le choix du confort au quotidien.")}
            </p>
          </div>

          {/* Rating badge */}
          <div className="flex items-center gap-6 shrink-0 font-sans">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-[#C7D400] text-[#C7D400]" />
                  ))}
                </div>
                <span className="font-sans text-xl font-bold text-[#07132B]">4,8/5</span>
              </div>
              <p className="mt-0.5 text-[11px] text-[#07132B]/60 font-sans">{t("+100 clients satisfaits")}</p>
            </div>

            <div className="h-9 w-px bg-black/10 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#07132B]/40">
                <Check className="h-4 w-4 text-[#07132B]" strokeWidth={2.5} />
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-[#07132B] leading-tight font-sans">
                <p>{t("AVIS")}</p>
                <p>{t("VÉRIFIÉS")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Review cards */}
        {loading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-52 animate-pulse bg-black/5" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 font-sans">
            {displayReviews.slice(0, 3).map((r) => (
              <div
                key={r.id}
                className="bg-white border border-black/5 p-6 flex flex-col justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)] relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <StarRow rating={r.rating ?? 5} />
                    <span className="font-serif text-3xl text-black/10 leading-none">”</span>
                  </div>
                  <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#07132B]/85 font-sans font-normal">
                    "{r.text || r.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5">
                  <div className="h-[2px] w-6 bg-[#C7D400] mb-3" />
                  <p className="text-xs font-bold text-[#07132B] font-sans">{r.author || r.name}, {r.city}</p>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#C7D400] font-medium font-sans">
                    <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#C7D400] text-white">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                    <span>{t("Achat vérifié")}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA banner */}
        <div className="mt-10 relative overflow-hidden bg-white border border-black/10 rounded-xs shadow-xs min-h-[340px] sm:min-h-[380px] lg:min-h-[400px] flex items-center">
          {/* Full Background Image: seamless white-to-photo blend with right-top anchor to keep quote intact */}
          <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
            <img
              src="/images/review-cta-banner.jpg"
              alt="The Aviator - Boxers & Packaging"
              className="h-full w-full object-cover"
              style={{ objectPosition: "right 0%" }}
            />
          </div>

          {/* Subtle mobile overlay for readability on small screens */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none sm:hidden" />

          {/* Left content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-md sm:max-w-lg font-sans">
            <div className="flex items-start gap-3.5 sm:gap-4 mb-4">
              {/* Message icon box with lime sparks */}
              <div className="relative shrink-0 mt-0.5">
                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border-2 border-[#07132B] bg-white text-[#07132B]">
                  <MessageSquare className="h-4 sm:h-5 w-4 sm:w-5 stroke-[2.2]" />
                </div>
                {/* Lime sparks */}
                <div className="absolute -top-1.5 -right-1 h-2 w-0.5 bg-[#C7D400] rotate-45" />
                <div className="absolute -top-2.5 right-1 h-2 w-0.5 bg-[#C7D400]" />
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#07132B] font-normal leading-[1.15]">
                  {t("Vous avez testé THE AVIATOR ?")}
                </h3>
                <p className="font-serif italic text-2xl sm:text-3xl text-[#C7D400] font-normal leading-[1.15] mt-0.5">
                  {t("Partagez votre expérience.")}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#07132B]/75 leading-relaxed font-sans mb-6 max-w-sm sm:max-w-md">
              {t("Vos avis nous aident à nous améliorer et à offrir toujours plus de confort à notre communauté.")}
            </p>

            <div>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center gap-2.5 bg-[#07132B] text-white px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider hover:bg-black transition-colors font-sans shadow-xs"
              >
                <span>{t("LAISSER UN AVIS")}</span>
                <span className="flex h-4 w-4 items-center justify-center rounded-xs bg-[#2563EB]/40 text-white text-[10px]">↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom watermark line */}
        <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-[9px] uppercase tracking-[0.25em] text-[#07132B]/40 font-sans">
          <span>CONFORT / QUALITÉ / AU QUOTIDIEN</span>
        </div>
      </div>

      {/* Review modal */}
      {open && (
        <div onClick={() => setOpen(false)} role="presentation" className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs font-sans">
          <div className="flex min-h-full items-start justify-center p-4 sm:p-8">
            <div
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-2xl bg-white p-6 pt-10 sm:p-8 sm:pt-12"
            >
              <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 grid h-9 w-9 place-items-center text-black/60 hover:text-black">
                <X className="h-5 w-5" />
              </button>
              <ReviewForm onSubmitted={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}