import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { IMAGES } from "@/lib/assets";
import { STORE } from "@/lib/store";
import HeroSlider from "./HeroSlider";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/language";

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { t } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[600px] w-full overflow-hidden bg-navy">
      {/* Background */}
      <motion.div style={reduce ? undefined : { y, scale }} className="absolute inset-0">
        <HeroSlider
          images={IMAGES.heroSlider}
          alt="The Aviator — boxers premium pour hommes"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={reduce ? undefined : { opacity, y: textY }}
        className="relative z-10 flex h-full items-center"
      >
        <div className="container-edge">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Editorial typographic block */}
            <div className="max-w-2xl">
              <motion.span
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/60"
              >
                <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
                {t("Boxers Premium · Maroc")}
              </motion.span>

              <motion.h1
                initial={reduce ? undefined : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-5 font-display text-[clamp(3rem,9vw,6.75rem)] uppercase leading-[0.88] tracking-tight text-white"
              >
                The<span className="italic text-[hsl(72_74%_52%)]">/</span>
                Aviator
              </motion.h1>

              <motion.p
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-6 font-display text-xl italic text-white/90 sm:text-2xl"
              >
                {t("Le confort, avec une autre dimension.")}
              </motion.p>

              <motion.p
                initial={reduce ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.75 }}
                className="mt-4 max-w-md text-sm leading-relaxed text-white/60 sm:text-base"
              >
                {STORE.description}
              </motion.p>

              <motion.div
                initial={reduce ? undefined : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Link to="/collection" className="btn-store btn-store--lime btn-sheen">
                  {t("Découvrir la collection")}
                </Link>
                <Link to="/packs" className="btn-store btn-store--ghost">
                  {t("Composer mon pack")}
                </Link>
              </motion.div>
            </div>

            {/* Floating product visual */}
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden justify-center xl:flex"
            >
              <div className="floaty-slow relative w-[300px]">
                <div className="media-frame">
                  <div className="aspect-[3/4] overflow-hidden bg-navy/60">
                    <Image src={IMAGES.heroSlider[1] || IMAGES.heroSlider[0]} alt="" fittingType="fill" className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="absolute -left-8 -top-6 rotate-[-6deg] bg-[hsl(72_74%_52%)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-navy shadow-lg">
                  {t("Nouvelle collection")}
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/95 px-5 py-4 text-center shadow-xl">
                  <p className="font-display text-2xl leading-none text-navy">24h</p>
                  <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-ink/50">{t("Livraison")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">{t("Découvrir")}</span>
        <span className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}