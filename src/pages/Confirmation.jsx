import { Link, useLocation } from "react-router-dom";
import { CheckCircle, MessageCircle, Home } from "lucide-react";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import { formatPrice } from "@/lib/store";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import { usePageMeta } from "@/lib/seo";
import { useLanguage } from "@/lib/language";

export default function Confirmation() {
  const location = useLocation();
  const order = location.state?.order;
  const { t } = useLanguage();

  usePageMeta({ title: t("Commande confirmée — The Aviator"), description: "Merci pour votre commande The Aviator. Nous vous contacterons rapidement pour confirmer la livraison." });

  const reference = order?.order_number || order?.id?.slice(-8) || "";
  const waMessage = order
    ? `Bonjour The Aviator, je viens de passer la commande (ref: ${reference}). Total: ${formatPrice(order.total)}. Ville: ${order.city}.`
    : "Bonjour The Aviator,";

  return (
    <>
      <AnnouncementBar />
      <div className="container-edge py-16 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-lime/20">
            <CheckCircle className="h-10 w-10 text-accent-lime" strokeWidth={1.5} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {t("Merci pour votre commande !")}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            {t("Votre commande a bien été enregistrée. Nous vous contacterons rapidement pour confirmer la livraison.")}
          </p>
          {order && (
            <div className="mt-8 border border-border bg-background p-6 text-left">
              <p className="font-medium">{t("Référence commande :")} {reference}</p>
              <p className="mt-1">{t("Total à payer en espèces à la livraison :")} {formatPrice(order.total)}</p>
              <p>Ville : {order.city}</p>
              <div className="mt-4 flex space-x-4">
                <Link to="/" className="inline-flex items-center text-blue-600 hover:underline">
                  <Home className="mr-1" /> {t("Retour à l'accueil")}
                </Link>
                <a
                  href={whatsappOrderUrl(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-600 hover:underline"
                >
                  <MessageCircle className="mr-1" /> WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}