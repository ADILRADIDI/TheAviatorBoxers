import { useState } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/storefront/Reveal";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "Quels sont les délais de livraison ?", a: "La livraison s'effectue sous 24 à 48h dans toutes les villes du Maroc. Vous recevrez une confirmation dès l'expédition de votre commande." },
  { q: "Comment fonctionne le paiement à la livraison ?", a: "Vous payez en espèces directement au livreur lors de la réception de votre commande. Aucun paiement en ligne n'est requis." },
  { q: "Puis-je composer mon propre pack ?", a: "Oui ! Notre pack builder vous permet de choisir vos couleurs et tailles pour composer un pack de 2 pièces à prix avantageux." },
  { q: "Quelle est la composition du tissu ?", a: "Nos boxers sont confectionnés en 95% coton et 5% Lycra, pour allier douceur, respirabilité et élasticité." },
  { q: "Comment choisir ma taille ?", a: "Consultez notre guide des tailles avec les mesures de tour de taille et de hanches. En cas de doute, choisissez la taille supérieure." },
];

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  const { t } = useLanguage();
  return (
    <section className="bg-[hsl(48_20%_93%)] py-20 lg:py-28">
      <div className="container-edge max-w-3xl">
        <Reveal className="text-center">
          <span className="label-eyebrow flex items-center justify-center gap-2.5">
            <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
            {t("Questions fréquentes")}
          </span>
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            {t("Tout ce que vous devez savoir")}
          </h2>
        </Reveal>

        <div className="mt-12 border-t border-border">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={cn("border-b border-border transition-colors", isOpen && "bg-background")}>
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="group flex w-full items-center gap-5 px-2 py-6 text-left sm:px-4"
                  aria-expanded={isOpen}
                >
                  <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center text-[11px] font-bold transition-colors duration-300",
                    isOpen ? "bg-[hsl(72_74%_52%)] text-navy" : "bg-foreground/5 text-ink/40 group-hover:bg-navy group-hover:text-white")}>
                    0{i + 1}
                  </span>
                  <span className={cn("flex-1 font-display text-lg sm:text-xl", isOpen ? "text-ink" : "text-ink/80")}>
                    {t(faq.q)}
                  </span>
                  <Plus
                    className={cn("h-5 w-5 shrink-0 text-ink/40 transition-transform duration-300 group-hover:text-ink", isOpen && "rotate-45 text-ink")}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-2 pb-6 pl-[3.25rem] pr-4 text-sm leading-relaxed text-muted-foreground sm:px-4 sm:pl-[4.25rem]">
                        {t(faq.a)}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-10 text-center">
          <Link to="/faq" className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-navy">
            <span className="underline-anim">{t("Voir toutes les questions")}</span>
            <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}