import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { ArrowRight } from "lucide-react";
import { IMAGES } from "@/lib/assets";
import SectionHeading from "@/components/storefront/SectionHeading";
import { useLanguage } from "@/lib/language";

export default function PackPreview() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-white lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grain-dark opacity-50" />
      <div className="container-edge relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Editorial copy */}
        <SectionHeading
          dark
          eyebrow={t("Le pack signature")}
          title={t("Composez votre pack")}
          sub={`${t("Choisissez vos couleurs, vos tailles, et profitez d'un tarif avantageux.")} ${t("Deux pièces The Aviator, à votre image.")}`}
        >
          <ul className="mt-6 space-y-3.5">
            {["2 couleurs au choix", "Tailles personnalisables", "Prix pack avantageux", "Livraison 24-48h offerte dès 2 pièces"].map((label, i) => (
              <li key={label} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-4 w-4 items-center justify-center">
                  <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
                </span>
                {i < 3 ? t(label) : label}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/packs" className="btn-store btn-store--lime btn-sheen">
              {t("Composer mon pack")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/collection" className="btn-store btn-store--ghost">
              {t("Voir la collection")}
            </Link>
          </div>
        </SectionHeading>

        {/* Visual */}
        <motion.div
          initial={reduce ? undefined : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="media-frame">
            <div className="aspect-[4/3] overflow-hidden bg-[hsl(216_50%_22%)]">
              <Image src={IMAGES.packFive} alt="Pack de boxers The Aviator" fittingType="fill" className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="absolute -bottom-5 right-4 rotate-1 bg-[hsl(72_74%_52%)] px-6 py-4 text-navy shadow-[0_20px_40px_-16px_rgba(0,0,0,0.6)] sm:-right-3">
            <p className="font-display text-3xl leading-none">{t("2 pièces")}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]">{t("au choix")}</p>
          </div>
          <div className="absolute -left-4 -top-4 hidden border border-white/25 bg-navy/80 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:block">
            {t("Promo pack")} · −{t("jusqu'à 30%")}
          </div>
        </motion.div>
      </div>
    </section>
  );
}