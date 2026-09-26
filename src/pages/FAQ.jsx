import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  Leaf,
  Ruler,
  Palette,
  Coins,
  Truck,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/language";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

const FAQ_ITEMS = [
  {
    icon: Leaf,
    q: "Quelle est la composition du boxer ?",
    a: "Nos boxers sont composés de 95 % coton et 5 % élasthanne, pour associer confort, douceur et souplesse. Un tissu respirant, agréable à porter au quotidien.",
  },
  {
    icon: Ruler,
    q: "Comment choisir ma taille ?",
    a: "Consultez notre guide des tailles pour trouver la taille qui vous convient. Si vous hésitez entre deux tailles, n'hésitez pas à nous contacter, nous serons ravis de vous conseiller.",
  },
  {
    icon: Palette,
    q: "Puis-je choisir les couleurs de mon pack ?",
    a: "Oui, vous êtes totalement libre de choisir les couleurs de votre pack : 2 boxers de la même couleur ou 2 couleurs différentes parmi toutes nos teintes disponibles (Noir, Bleu marine, Bleu royal, Blanc et Gris chiné). Vous pouvez également choisir une taille différente pour chaque boxer.",
  },
  {
    icon: Coins,
    q: "Quel est le prix du pack ?",
    a: "Le pack de 2 boxers premium THE AVIATOR est à 99 DH.",
  },
  {
    icon: Truck,
    q: "Quels sont les délais de livraison ?",
    a: "Nous livrons partout au Maroc. La livraison est gratuite à Casablanca. Les délais varient généralement entre 24h et 72h selon votre ville.",
  },
  {
    icon: CreditCard,
    q: "Comment puis-je payer ma commande ?",
    a: "Le paiement se fait à la livraison (paiement en espèces).",
  },
  {
    icon: Truck,
    q: "Puis-je retourner ou échanger mes boxers après réception ?",
    a: "Pour des raisons d'hygiène et de protection de la santé (sous-vêtements), aucun retour ni échange n'est accepté une fois le colis réceptionné et payé auprès du livreur. Vous pouvez vérifier votre colis directement avec le livreur au moment de la livraison.",
  },
  {
    icon: MessageCircle,
    q: "J'ai besoin d'aide avant de commander, comment vous contacter ?",
    a: "Notre équipe est disponible sur WhatsApp pour répondre à toutes vos questions (conseil taille, couleurs, commande...).",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const { t } = useLanguage();

  usePageMeta({
    title: "FAQ — The Aviator",
    description:
      "Réponses aux questions fréquentes : composition 95% coton, choix de la taille, livraison 24-48h partout au Maroc et paiement à la livraison.",
  });
  useJsonLd(
    breadcrumbJsonLd([
      { name: "Accueil", url: SITE_URL },
      { name: "FAQ", url: `${SITE_URL}/faq` },
    ])
  );

  return (
    <div className="bg-[#FAF9F5] text-[#0A1128] min-h-screen py-16 lg:py-24">
      <div className="container-edge max-w-4xl">
        {/* Header (Image 15.png) */}
        <div className="text-center mb-14">
          <span className="text-[11px] font-bold tracking-[0.24em] text-[#0A1128]/50 uppercase block mb-1">
            F A Q
          </span>
          <div className="w-8 h-0.5 bg-[#C7D400] mx-auto mb-3" />
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A1128]">
            Questions <span className="text-[#C7D400]">fréquentes</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 font-light">
            Tout ce que vous devez savoir avant de commander.
          </p>
        </div>

        {/* Accordion List (Image 15.png) */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = open === idx;
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-200/90 rounded-sm overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-[#0A1128] flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-heading text-base sm:text-lg font-bold text-[#0A1128]">
                      {item.q}
                    </span>
                  </div>

                  <div className="text-gray-400 shrink-0">
                    {isOpen ? (
                      <Minus className="h-5 w-5 text-[#0A1128]" />
                    ) : (
                      <Plus className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 text-sm sm:text-base text-gray-600 pl-20 leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Watermark bar */}
        <div className="mt-20 pt-8 border-t border-gray-200 text-center flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-gray-400">
          <span>THE AVIATOR BOXERS</span>
          <span className="text-[#07132B] font-bold">CONFORT • STYLE • AU QUOTIDIEN</span>
        </div>
      </div>
    </div>
  );
}