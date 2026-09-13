import { motion, useReducedMotion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";
import { useLanguage } from "@/lib/language";

export default function BrandStory() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container-edge grid items-center gap-0 lg:grid-cols-2">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/3] lg:aspect-auto lg:h-[640px]"
        >
          <Image src={IMAGES.brandStory} alt="L'univers The Aviator" fittingType="fill" className="h-full w-full object-cover" />
        </motion.div>

        <div className="bg-navy px-8 py-16 text-white lg:px-16 lg:py-24">
          <span className="label-eyebrow text-white/50">{t("Notre histoire")}</span>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {t("La précision")}
            <br />
            {t("au service du confort")}
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/70 sm:text-base">
            <p>
              {t("The Aviator est né d'une conviction simple : le confort mérite la même exigence que le style. Inspirée par l'élégance technique de l'aéronautique, notre marque marocaine réunit des tissus premium et un savoir-faire rigoureux.")}
            </p>
            <p>
              {t("Chaque pièce est conçue pour offrir maintien, liberté de mouvement et confort durable — le tout dans un style affirmé, pensé pour l'homme moderne.")}
            </p>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <div>
              <p className="font-display text-3xl font-bold text-accent-lime">95%</p>
              <p className="text-xs text-white/50">{t("Coton premium")}</p>
            </div>
            <span className="h-10 w-px bg-white/15" />
            <div>
              <p className="font-display text-3xl font-bold text-accent-lime">5%</p>
              <p className="text-xs text-white/50">{t("Lycra élastique")}</p>
            </div>
            <span className="h-10 w-px bg-white/15" />
            <div>
              <p className="font-display text-3xl font-bold text-accent-lime">100%</p>
              <p className="text-xs text-white/50">{t("Conçu au Maroc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}