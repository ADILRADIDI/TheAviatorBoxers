import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import { STORE } from "@/lib/store";
import { useLanguage } from "@/lib/language";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

const CGV = [
  { title: "Article 1 — Objet", text: "Les présentes conditions générales de vente régissent les relations entre The Aviator et tout client effectuant un achat sur notre site ou via WhatsApp. Toute commande implique l'acceptation des présentes conditions." },
  { title: "Article 2 — Produits", text: "Les produits proposés sont des sous-vêtements pour hommes, confectionnés en 95% coton et 5% Lycra. Les caractéristiques, prix et disponibilités sont indiqués sur chaque fiche produit." },
  { title: "Article 3 — Prix", text: "Les prix sont indiqués en dirhams marocains (MAD/DH), toutes taxes comprises. Les frais de livraison sont calculés selon la ville de destination et ajoutés au total de la commande." },
  { title: "Article 4 — Commande", text: "La commande peut être passée via le site web ou via WhatsApp. Elle est confirmée après validation des informations du client et de la disponibilité des produits." },
  { title: "Article 5 — Paiement", text: "Le paiement s'effectue à la livraison (COD) en espèces, directement au livreur. Le paiement en ligne sera disponible ultérieurement." },
  { title: "Article 6 — Livraison", text: "La livraison s'effectue sous 24 à 48h dans toutes les villes du Maroc. The Aviator ne saurait être tenu responsable des retards dus à des circonstances indépendantes de sa volonté." },
  { title: "Article 7 — Retours et échanges", text: "Le client dispose de 7 jours pour retourner un produit intact et non porté. Les frais de retour sont à la charge du client, sauf en cas de défaut produit." },
  { title: "Article 8 — Responsabilité", text: "The Aviator s'efforce de fournir des informations exactes. Cependant, notre responsabilité ne saurait être engagée en cas d'erreurs mineures ou de disponibilité non garantie." },
  { title: "Article 9 — Droit applicable", text: "Les présentes conditions sont régies par le droit marocain. Tout litige sera soumis aux tribunaux compétents du Royaume du Maroc." },
];

const PRIVACY = [
  { title: "Collecte des données", text: `The Aviator collecte les informations nécessaires au traitement de votre commande : nom, prénom, téléphone, email (optionnel), adresse de livraison. Ces données sont utilisées uniquement à des fins de livraison et de service client.` },
  { title: "Utilisation", text: "Vos données sont utilisées pour traiter et expédier vos commandes, vous contacter concernant votre commande, et améliorer nos services. Nous ne vendons ni ne louons vos données à des tiers." },
  { title: "Conservation", text: "Vos données sont conservées pour la durée nécessaire au traitement de vos commandes et obligations légales, puis supprimées ou anonymisées." },
  { title: "Sécurité", text: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès, modification ou divulgation non autorisé." },
  { title: "Vos droits", text: "Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous via WhatsApp ou par email." },
  { title: "Cookies", text: "Notre site peut utiliser des cookies pour améliorer l'expérience utilisateur et analyser le trafic. Vous pouvez désactiver les cookies dans les paramètres de votre navigateur." },
];

export default function Legal({ type = "cgv" }) {
  const isCGV = type === "cgv";
  const sections = isCGV ? CGV : PRIVACY;
  const { t } = useLanguage();
  const title = isCGV ? t("Conditions générales de vente") : t("Politique de confidentialité");
  const eyebrow = t("Legal");
  usePageMeta({
    title: `${isCGV ? "Conditions générales de vente" : "Politique de confidentialité"} — The Aviator`,
    description: isCGV ? "Conditions générales de vente de The Aviator : commande, prix en MAD, paiement à la livraison, livraison 24-48h et retours sous 7 jours au Maroc." : "Politique de confidentialité de The Aviator : quelles données nous collectons, comment nous les utilisons et vos droits."
  });
  useJsonLd(breadcrumbJsonLd([
    { name: "Accueil", url: SITE_URL },
    { name: isCGV ? "Conditions générales de vente" : "Politique de confidentialité", url: `${SITE_URL}/${isCGV ? "cgv" : "confidentialite"}` },
  ]));

  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow={eyebrow} title={title} subtitle={`${t("Dernière mise à jour :")} ${new Date().toLocaleDateString("fr-FR")}`} />

      <div className="container-edge py-12 lg:py-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-display text-lg font-bold">{t(s.title)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{t(s.text)}</p>
            </section>
          ))}

          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              {t("Pour toute question relative à ces")} {isCGV ? t("conditions") : t("politiques")}, {t("contactez-nous à")} {STORE.email} {t("ou via WhatsApp")}.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}