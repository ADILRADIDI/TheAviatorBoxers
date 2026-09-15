import { motion, useReducedMotion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";
import { useLanguage } from "@/lib/language";

export default function BrandStory() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden">
      <div className="container-edge grid items-stretch lg:grid-cols-2">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative min-h-[380px] lg:min-h-[640px]"
        >
          <Image src={IMAGES.brandStory} alt="L'univers The Aviator" fittingType="fill" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent lg:bg-gradient-to-r" />
          <span className="absolute left-6 top-6 border border-white/30 bg-navy/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
            {t("Depuis le Maroc")}
          </span>
        </motion.div>

        <div className="relative bg-navy px-8 py-16 text-white lg:px-16 lg:py-24">
          <span className="label-eyebrow flex items-center gap-2.5 text-white/45">
            <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
            {t("Notre histoire")}
          </span>
          <h2 className="mt-5 font-display text-3xl leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl">
            {t("La précision")}
            <br />
            <em className="italic text-[hsl(72_74%_52%)]">{t("au service du confort")}</em>
          </h2>
          <div className="mt-7 space-y-4 text-sm leading-relaxed text-white/65 sm:text-base">
            <p>
              {t("The Aviator est né d'une conviction simple : le confort mérite la même exigence que le style. Inspirée par l'élégance technique de l'aéronautique, notre marque marocaine réunit des tissus premium et un savoir-faire rigoureux.")}
            </p>
            <p>
              {t("Chaque pièce est conçue pour offrir maintien, liberté de mouvement et confort durable — le tout dans un style affirmé, pensé pour l'homme moderne.")}
            </p>
          </div>
          <div className="mt-10 flex items-center gap-8 border-t border-white/10 pt-8">
            <div>
              <p className="font-display text-4xl text-[hsl(72_74%_52%)]">95%</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-white/45">{t("Coton premium")}</p>
            </div>
            <span className="h-12 w-px bg-white/10" />
            <div>
              <p className="font-display text-4xl text-[hsl(72_74%_52%)]">5%</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-white/45">{t("Lycra élastique")}</p>
            </div>
            <span className="h-12 w-px bg-white/10" />
            <div>
              <p className="font-display text-4xl text-[hsl(72_74%_52%)]">100%</p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-white/45">{t("Conçu au Maroc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}