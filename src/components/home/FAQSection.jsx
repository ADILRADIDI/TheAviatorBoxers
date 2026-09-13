import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/storefront/Reveal";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language";

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
    <section className="bg-secondary py-20 lg:py-28">
      <div className="container-edge max-w-3xl">
        <Reveal className="text-center">
          <span className="label-eyebrow">{t("Questions fréquentes")}</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("Tout ce que vous devez savoir")}
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="text-sm font-semibold sm:text-base">{t(faq.q)}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{t(faq.a)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-8 text-center">
          <Link to="/faq" className="text-sm font-semibold uppercase tracking-[0.12em] text-navy underline underline-offset-4 hover:text-accent-lime">
            {t("Voir toutes les questions")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}