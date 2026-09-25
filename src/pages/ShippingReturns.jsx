import { Truck, Package, RefreshCw, Banknote, MapPin, Clock } from "lucide-react";
import PageHeader from "@/components/storefront/PageHeader";
import { STORE } from "@/lib/store";
import { useLanguage } from "@/lib/language";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

export default function ShippingReturns() {
  const { t } = useLanguage();
  usePageMeta({ title: "Livraison & retours — The Aviator", description: "Livraison 24-48h partout au Maroc avec paiement à la livraison. Retours sous 7 jours : échanges et remboursements simples via WhatsApp." });
  useJsonLd(breadcrumbJsonLd([{ name: "Accueil", url: SITE_URL }, { name: "Livraison & retours", url: `${SITE_URL}/livraison-retours` }]));
  return (
    <>
      <PageHeader
        eyebrow={t("Informations")}
        title={t("Livraison & Retours")}
        subtitle={t("Tout ce qu'il faut savoir sur la livraison et les retours.")}
        image="/products/aviator-pack-duo.jpg"
      />

      <div className="container-edge py-12 lg:py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Delivery */}
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center bg-foreground/[0.04] text-ink"><Truck className="h-6 w-6" /></div>
              <h2 className="font-heading text-2xl font-bold">{t("Livraison")}</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>{t("Nous livrons partout au Maroc, dans toutes les villes du Royaume. Voici les informations essentielles :")}</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3"><Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">{t("Délai :")}</strong> {t("24 à 48h ouvrées après confirmation de la commande.")}</span></li>
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">{t("Zones :")}</strong> {t("Toutes les villes du Maroc sont desservies.")}</span></li>
                <li className="flex items-start gap-3"><Banknote className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">{t("Frais :")}</strong> {t("Calculés selon votre ville. Livraison gratuite dès")} {STORE.freeShippingThreshold} DH {t("d'achat.")}</span></li>
                <li className="flex items-start gap-3"><Package className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">{t("Suivi :")}</strong> {t("Vous recevez une confirmation et un appel avant la livraison.")}</span></li>
              </ul>
            </div>
          </section>

          {/* Process */}
          <section className="border border-border bg-secondary p-6 lg:p-8">
            <h3 className="font-heading text-xl font-bold">{t("Comment ça marche ?")}</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {[
                { n: "1", t: "Commande", d: "Vous validez votre commande en ligne ou via WhatsApp." },
                { n: "2", t: "Préparation", d: "Nous préparons et expédions votre colis sous 24h." },
                { n: "3", t: "Livraison", d: "Le livreur vous contacte et vous remet le colis. Vous payez à la réception." },
              ].map((step) => (
                <div key={step.n}>
                  <div className="flex h-10 w-10 items-center justify-center bg-navy font-heading text-lg text-white">{step.n}</div>
                  <h4 className="mt-3 text-sm font-bold">{t(step.t)}</h4>
                  <p className="mt-1 text-xs text-muted-foreground">{t(step.d)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Returns */}
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center bg-foreground/[0.04] text-ink"><RefreshCw className="h-6 w-6" /></div>
              <h2 className="font-heading text-2xl font-bold">{t("Retours & Échanges")}</h2>
            </div>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>{t("Votre satisfaction est notre priorité. Si un produit ne vous convient pas, voici notre politique de retour :")}</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3"><RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">{t("Délai de retour :")}</strong> {t("7 jours après réception du produit.")}</span></li>
                <li className="flex items-start gap-3"><Package className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">{t("Condition :")}</strong> {t("Le produit doit être intact, non porté et dans son emballage d'origine.")}</span></li>
                <li className="flex items-start gap-3"><RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">{t("Échange :")}</strong> {t("Échange possible pour une autre taille ou couleur, selon disponibilité.")}</span></li>
                <li className="flex items-start gap-3"><Banknote className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" /><span><strong className="text-foreground">{t("Remboursement :")}</strong> {t("Remboursement possible en cas de défaut produit.")}</span></li>
              </ul>
              <p className="mt-4 rounded border border-border bg-background p-4 text-xs">{t("Pour initier un retour, contactez-nous via WhatsApp en indiquant votre numéro de commande. Les frais de retour sont à la charge du client, sauf en cas de défaut produit.")}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}