import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/language";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

const FAQS = [
  { cat: "Commande", q: "Comment passer une commande ?", a: "Choisissez votre produit, sélectionnez la taille, ajoutez au panier puis finalisez la commande. Vous pouvez aussi commander directement via WhatsApp." },
  { cat: "Commande", q: "Puis-je commander sans créer de compte ?", a: "Oui ! Aucun compte n'est requis. Il suffit de remplir vos coordonnées et votre adresse de livraison lors du checkout." },
  { cat: "Commande", q: "Comment fonctionne la commande via WhatsApp ?", a: "Cliquez sur le bouton WhatsApp, un message pré-rempli avec votre commande s'ouvre. Envoyez-le et notre équipe vous confirme la commande." },
  { cat: "Livraison", q: "Quels sont les délais de livraison ?", a: "La livraison s'effectue sous 24 à 48h dans toutes les villes du Maroc. Vous serez contacté(e) avant la livraison." },
  { cat: "Livraison", q: "Livrez-vous partout au Maroc ?", a: "Oui, nous livrons dans toutes les villes du Royaume. Les frais varient selon votre zone de livraison." },
  { cat: "Paiement", q: "Comment fonctionne le paiement à la livraison ?", a: "Vous payez en espèces directement au livreur à la réception de votre commande. Aucun paiement anticipé n'est nécessaire." },
  { cat: "Paiement", q: "Le paiement en ligne est-il disponible ?", a: "Le paiement en ligne n'est pas proposé. Le paiement à la livraison reste disponible partout au Maroc." },
  { cat: "Produits", q: "Quelle est la composition du tissu ?", a: "Nos boxers sont en 95% coton premium et 5% Lycra, pour allier douceur, respirabilité et élasticité." },
  { cat: "Produits", q: "Comment choisir ma taille ?", a: "Consultez notre guide des tailles avec les mesures de tour de taille et de hanches. En cas de doute, choisissez la taille supérieure." },
  { cat: "Produits", q: "Les couleurs sont-elles fidèles aux photos ?", a: "Nous nous efforçons de représenter les couleurs le plus fidèlement possible. De légères variations peuvent survenir selon votre écran." },
  { cat: "Retours", q: "Puis-je retourner un produit ?", a: "Oui, vous disposez de 7 jours pour retourner un produit intact et non porté. Contactez-nous via WhatsApp pour initier un retour." },
  { cat: "Retours", q: "Comment obtenir un remboursement ?", a: "En cas de retour valide, nous vous proposons un échange ou un remboursement. Contactez notre service client pour plus de détails." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const { t } = useLanguage();
  usePageMeta({ title: "FAQ — The Aviator", description: "Réponses aux questions fréquentes : commande, livraison 24-48h, paiement à la livraison, composition 95% coton 5% Lycra, tailles et retours au Maroc." });
  useJsonLd(breadcrumbJsonLd([{ name: "Accueil", url: SITE_URL }, { name: "FAQ", url: `${SITE_URL}/faq` }]));
  useJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  });
  const categories = ["Tous", ...new Set(FAQS.map((f) => f.cat))];
  const [filter, setFilter] = useState("Tous");
  const list = filter === "Tous" ? FAQS : FAQS.filter((f) => f.cat === filter);

  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow={t("Aide")} title={t("Questions fréquentes")} subtitle={t("Tout ce que vous devez savoir sur nos produits et services.")} />

      <div className="container-edge py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Category filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setOpen(0); }}
                className={`border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors ${filter === cat ? "border-navy bg-navy text-white" : "border-border hover:border-navy"}`}
              >
                {t(cat)}
              </button>
            ))}
          </div>

          <div className="divide-y divide-border border-y border-border">
            {list.map((faq, i) => (
              <div key={i}>
                <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-5 text-left" aria-expanded={open === i}>
                  <span className="text-sm font-semibold sm:text-base">{t(faq.q)}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{t(faq.a)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="mt-10 border border-border bg-secondary p-8 text-center">
            <h3 className="font-display text-xl font-bold">{t("Vous ne trouvez pas votre réponse ?")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("Notre équipe est à votre disposition.")}</p>
            <Link to="/contact" className="mt-5 inline-block bg-navy px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">{t("Nous contacter")}</Link>
          </div>
        </div>
      </div>
    </>
  );
}