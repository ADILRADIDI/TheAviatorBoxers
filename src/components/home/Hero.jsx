import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { IMAGES } from "@/lib/assets";
import { STORE } from "@/lib/store";
import HeroSlider from "./HeroSlider";

export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef(null);

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
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/50" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={reduce ? undefined : { opacity, y: textY }}
        className="relative z-10 flex h-full items-center"
      >
        <div className="container-edge">
          <div className="max-w-2xl">
            <motion.span
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block border-l-2 border-accent-lime pl-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70"
            >
              Boxers Premium · Maroc
            </motion.span>

            <motion.h1
              initial={reduce ? undefined : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-display text-[clamp(2.75rem,9vw,6.5rem)] font-bold uppercase leading-[0.9] tracking-tight text-white"
            >
              The<br />Aviator
            </motion.h1>

            <motion.p
              initial={reduce ? undefined : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-5 max-w-md font-display text-xl italic text-white/90 sm:text-2xl"
            >
              Le confort, avec une autre dimension.
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
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                to="/collection"
                className="btn-shine inline-flex items-center justify-center bg-accent-lime px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-navy transition-colors hover:bg-white"
              >
                Découvrir la collection
              </Link>
              <Link
                to="/packs"
                className="inline-flex items-center justify-center border border-white/30 px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-white hover:bg-white/10"
              >
                Composer mon pack
              </Link>
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
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Découvrir</span>
        <span className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}