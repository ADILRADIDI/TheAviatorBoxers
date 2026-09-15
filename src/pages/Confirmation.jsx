import { Link, useLocation } from "react-router-dom";
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/store";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import { usePageMeta } from "@/lib/seo";
import { useLanguage } from "@/lib/language";
import Reveal from "@/components/storefront/Reveal";

export default function Confirmation() {
  const location = useLocation();
  const order = location.state?.order;
  const { t } = useLanguage();

  usePageMeta({ title: t("Commande confirmée — The Aviator"), description: "Merci pour votre commande The Aviator. Nous vous contacterons rapidement pour confirmer la livraison.", noindex: true });

  const reference = order?.order_number || order?.id?.slice(-8) || "";
  const waMessage = order
    ? `Bonjour The Aviator, je viens de passer la commande (ref: ${reference}). Total: ${formatPrice(order.total)}. Ville: ${order.city}.`
    : "Bonjour The Aviator,";

  return (
    <div className="relative overflow-hidden bg-navy py-16 text-white lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grain-dark opacity-50" />
      <div className="container-edge relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="mx-auto flex h-20 w-20 items-center justify-center border border-white/15 bg-[hsl(72_74%_52%)]">
              <CheckCircle className="h-10 w-10 text-navy" strokeWidth={1.25} />
            </span>
            <span className="label-eyebrow mt-8 flex items-center justify-center gap-2.5 text-white/45">
              <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
              {t("Commande confirmée")}
            </span>
            <h1 className="mt-4 font-display text-4xl leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
              {t("Merci pour votre commande !")}
            </h1>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              {t("Votre commande a bien été enregistrée. Nous vous contacterons rapidement pour confirmer la livraison.")}
            </p>
          </Reveal>

          {order && (
            <Reveal delay={0.15}>
              <div className="mt-10 border border-white/15 bg-white/[0.04] p-7 text-left backdrop-blur-sm">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{t("Référence commande")}</span>
                    <span className="font-display text-lg tabular">{reference}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{t("Total à payer à la livraison")}</span>
                    <span className="font-display text-2xl tabular text-[hsl(72_74%_52%)]">{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">{t("Ville")}</span>
                    <span className="text-sm text-white/80">{order.city}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {order && (
            <Reveal delay={0.25}>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/" className="btn-store btn-store--lime btn-sheen">
                  {t("Retour à l'accueil")}
                </Link>
                <a
                  href={whatsappOrderUrl(waMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-store btn-store--ghost"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("Confirmer via WhatsApp")}
                  <ArrowRight className="btn-arrow-ic h-4 w-4" />
                </a>
              </div>
              <p className="mt-8 text-xs text-white/40">
                {t("Livraison 24-48h · Paiement en espèces à réception")}
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}