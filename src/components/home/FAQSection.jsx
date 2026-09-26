import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/language";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "Quel est le prix du pack ?",
    a: "Le pack signature contient <strong>2 boxers premium à 99 DH.</strong> Vous composez vous-même votre pack en choisissant librement la couleur et la taille de chaque boxer.",
  },
  {
    q: "Puis-je choisir les couleurs de mon pack ?",
    a: "Oui ! Vous pouvez choisir 2 fois la même couleur ou combiner 2 couleurs différentes parmi toutes nos teintes disponibles (Noir, Bleu marine, Bleu royal, Blanc et Gris chiné).",
  },
  {
    q: "Comment choisir ma taille ?",
    a: "Consultez notre guide des tailles avec les mesures de tour de taille et de bassin. Si vous hésitez entre deux tailles, nous vous conseillons de choisir la taille au-dessus pour un confort optimal.",
  },
  {
    q: "Quelle est la composition du boxer ?",
    a: "Nos boxers sont confectionnés en <strong>95% coton compact premium et 5% élasthanne</strong>, pour garantir douceur au contact de la peau, respirabilité et liberté de mouvement sans déformation.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    a: "La livraison est assurée sous 24h à 48h partout au Maroc. Vous recevrez une confirmation et un appel du livreur avant son passage.",
  },
  {
    q: "La livraison est-elle gratuite ?",
    a: "La livraison est 100% gratuite sur Casablanca. Pour les autres villes du Royaume, le tarif d'expédition est calculé lors de votre commande.",
  },
  {
    q: "Comment fonctionne le paiement ?",
    a: "Le paiement s'effectue en espèces directement au livreur à la réception de votre commande. Vous ne payez rien en ligne.",
  },
  {
    q: "Puis-je échanger ou retourner mes boxers après la livraison ?",
    a: "Pour des raisons d'hygiène et de protection de la santé (sous-vêtements), aucun retour ni échange n'est possible une fois le colis réceptionné et réglé. Vous pouvez vérifier le contenu avec le livreur au moment de la livraison avant le règlement.",
  },
  {
    q: "Comment entretenir mon boxer ?",
    a: "Lavez en machine à 30°C maximum, de préférence sur l'envers. Évitez le sèche-linge pour préserver durablement la douceur du coton et l'élasticité de la ceinture.",
  },
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  const { t } = useLanguage();

  return (
    <section className="bg-[#FAF9F6] py-16 lg:py-24 font-sans">
      <div className="container-edge max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex flex-col items-center mb-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-[#07132B]/60 font-sans">
              {t("QUESTIONS FRÉQUENTES")}
            </span>
            <div className="mt-2 h-[2px] w-8 bg-[#C7D400]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#07132B] leading-tight">
            {t("Une question ?")}{" "}
            <span className="text-[#C7D400] font-serif">{t("On vous répond.")}</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-[#07132B]/60 font-sans">
            {t("Tout ce que vous devez savoir sur THE AVIATOR BOXERS.")}
          </p>
        </div>

        {/* FAQ list */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="bg-white border border-black/5 rounded-sm overflow-hidden transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-sans"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center text-[11px] font-bold rounded-[2px] transition-colors font-sans",
                        isOpen
                          ? "bg-[#C7D400] text-[#07132B]"
                          : "bg-[#07132B]/5 text-[#07132B]/70"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-sm sm:text-[15px] font-bold text-[#07132B]">
                      {t(faq.q)}
                    </span>
                  </div>
                  {isOpen ? (
                    <Minus className="h-4 w-4 shrink-0 text-[#07132B]" strokeWidth={2.5} />
                  ) : (
                    <Plus className="h-4 w-4 shrink-0 text-[#07132B]" strokeWidth={2.5} />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-5 pb-5 pl-16 text-xs sm:text-sm leading-relaxed text-[#07132B]/70 font-sans"
                        dangerouslySetInnerHTML={{ __html: t(faq.a) }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* WhatsApp CTA bottom panel */}
        <div className="mt-8 bg-white border border-black/5 rounded-sm overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-xs">
          {/* Left icon + text */}
          <div className="p-6 sm:p-8 flex items-center gap-4 z-10 flex-1 font-sans">
            <div className="shrink-0 h-12 w-12 rounded-full bg-[#C7D400] flex items-center justify-center text-white">
              <WhatsAppIcon />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#07132B]/60 mb-1 font-sans">
                {t("VOUS N'AVEZ PAS TROUVÉ VOTRE RÉPONSE ?")}
              </p>
              <p className="text-xl sm:text-2xl font-serif text-[#07132B]">
                {t("Contactez-nous sur")}{" "}
                <a
                  href={whatsappContactUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C7D400] hover:underline inline-flex items-center gap-1 font-serif"
                >
                  WhatsApp →
                </a>
              </p>
              <p className="mt-1 text-xs text-[#07132B]/60 font-sans">
                {t("Notre équipe est là pour vous aider.")}
              </p>
            </div>
          </div>

          {/* Right product image */}
          <div className="relative w-full md:w-80 h-36 md:h-full self-stretch overflow-hidden bg-gray-50 flex items-center justify-end">
            <img
              src="/Contactwhatsapp.jpeg"
              alt="The Aviator Pack"
              className="h-full w-full object-cover object-[center_28%] scale-115"
            />
          </div>
        </div>
      </div>
    </section>
  );
}