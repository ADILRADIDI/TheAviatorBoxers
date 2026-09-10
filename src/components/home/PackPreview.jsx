import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/assets";

export default function PackPreview() {
  const reduce = useReducedMotion();
  return (
    <section className="bg-navy py-20 text-white lg:py-28">
      <div className="container-edge grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 lg:order-1"
        >
          <div className="aspect-[4/3] overflow-hidden bg-sidebar-accent">
            <Image src={IMAGES.packFive} alt="Pack de boxers The Aviator" fittingType="fill" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-4 -right-4 hidden bg-accent-lime px-6 py-4 text-navy sm:block">
            <p className="text-2xl font-bold">2 pièces</p>
            <p className="text-xs font-medium uppercase tracking-wider">au choix</p>
          </div>
        </motion.div>

        <div className="order-1 lg:order-2">
          <span className="label-eyebrow text-white/50">Le pack signature</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Composez votre pack
          </h2>
          <p className="mt-5 max-w-md text-white/70">
            Choisissez vos couleurs, vos tailles, et profitez d'un tarif avantageux.
            Deux pièces The Aviator, à votre image.
          </p>
          <ul className="mt-6 space-y-3">
            {["2 couleurs au choix", "Tailles personnalisables", "Prix pack avantageux"].map((t) => (
              <li key={t} className="flex items-center gap-3 text-sm text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-lime" />
                {t}
              </li>
            ))}
          </ul>
          <Link
            to="/packs"
            className="btn-shine mt-8 inline-flex items-center gap-2 bg-accent-lime px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-navy transition-colors hover:bg-white"
          >
            Composer mon pack <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}