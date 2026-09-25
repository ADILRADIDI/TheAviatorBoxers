import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/lib/language";

export default function BrandStory() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#0A192F] text-white">
      <div className="container-edge grid items-stretch lg:grid-cols-2">
        {/* Left — Photo */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 1.02 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[350px] sm:min-h-[440px] lg:min-h-[620px] w-full"
        >
          <img
            src="/images/story-workshop.jpg"
            alt="Notre histoire — l'atelier The Aviator"
            width="980"
            height="640"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:via-90% lg:to-[#0A192F]/25 pointer-events-none" />

          {/* "MADE BY US IN MOROCCO" badge */}
          <div className="absolute left-6 top-6 border border-white/30 bg-[#0A192F]/40 px-3.5 py-2 backdrop-blur-sm">
            <span className="block text-[9px] sm:text-[10px] font-medium tracking-[0.25em] text-white leading-tight uppercase font-sans">
              MADE BY US<br />IN MOROCCO
            </span>
          </div>

          {/* Bottom-left label with vertical bar */}
          <div className="absolute bottom-6 left-6 z-10 flex items-start gap-3">
            <div className="w-[2px] h-10 bg-[#C7D400] mt-0.5" />
            <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.22em] text-white/90 leading-relaxed font-sans">
              {t("DES DÉTAILS")}
              <br />{t("DERRIÈRE")}
              <br />{t("VOTRE CONFORT")}
            </p>
          </div>
        </motion.div>

        {/* Right — Story text */}
        <div className="relative flex flex-col justify-between px-6 sm:px-10 py-12 sm:py-16 text-white lg:px-16 lg:py-20">
          <div>
            {/* Header tag with horizontal accent line */}
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-[0.3em] text-white/70 font-sans">
                {t("NOTRE HISTOIRE")}
              </span>
              <div className="mt-2.5 h-[2px] w-8 bg-[#C7D400]" />
            </div>

            {/* Editorial Serif Headline */}
            <h2 className="mt-7 font-serif text-3xl sm:text-4xl lg:text-[2.9rem] font-normal leading-[1.18] tracking-tight text-white">
              <span>{t("Tout est parti d'un")}</span><br />
              <span className="italic text-[#C7D400]">{t("besoin simple :")}</span><br />
              <span className="italic text-[#C7D400]">{t("être vraiment à l'aise.")}</span>
            </h2>

            {/* Body paragraphs */}
            <div className="mt-8 space-y-4 text-[13px] sm:text-[14px] font-sans font-light leading-relaxed text-white/80 max-w-xl">
              <p>
                {t("THE AVIATOR est né d'un besoin que l'on connaît tous : porter un boxer confortable, du matin au soir.")}
              </p>
              <p>
                {t("Alors, au lieu de simplement créer un boxer de plus, nous avons pris le temps de penser chaque détail : le tissu, la coupe, la bande, les coutures et les finitions.")}
              </p>
              <p>
                {t("Notre objectif est simple : créer le boxer que nous voulions nous-mêmes porter au quotidien.")}
              </p>
            </div>

            {/* Stats row with thin vertical dividers */}
            <div className="mt-10 sm:mt-12 grid grid-cols-3 items-start border-t border-white/15 pt-8">
              <div>
                <p className="font-sans text-3xl sm:text-4xl font-normal text-[#C7D400] leading-none">95%</p>
                <p className="mt-2.5 text-[9px] sm:text-[10px] font-normal uppercase tracking-[0.2em] text-white/60 leading-tight font-sans">
                  {t("COTON")}
                  <br />{t("PREMIUM")}
                </p>
              </div>

              <div className="border-l border-white/15 pl-4 sm:pl-8">
                <p className="font-sans text-3xl sm:text-4xl font-normal text-[#C7D400] leading-none">5%</p>
                <p className="mt-2.5 text-[9px] sm:text-[10px] font-normal uppercase tracking-[0.2em] text-white/60 leading-tight font-sans">
                  {t("ÉLASTHANNE")}
                  <br />{t("ÉLASTIQUE")}
                </p>
              </div>

              <div className="border-l border-white/15 pl-4 sm:pl-8">
                <p className="font-sans text-3xl sm:text-4xl font-normal text-[#C7D400] leading-none">100%</p>
                <p className="mt-2.5 text-[9px] sm:text-[10px] font-normal uppercase tracking-[0.2em] text-white/60 leading-tight font-sans">
                  {t("CONÇU AU")}
                  <br />{t("MAROC")}
                </p>
              </div>
            </div>
          </div>

          {/* Centered bottom tagline */}
          <div className="mt-12 pt-6 border-t border-white/15 text-center sm:text-left">
            <span className="text-[10px] font-light uppercase tracking-[0.28em] text-white/50 font-sans">
              CONFORT &nbsp;·&nbsp; STYLE &nbsp;·&nbsp; AU QUOTIDIEN
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}