import { Link, useLocation } from "react-router-dom";
import {
  Check,
  MessageCircle,
  ArrowRight,
  Package,
  Shirt,
  Palette,
  CreditCard,
  Banknote,
  MapPin,
  Truck,
  Gift,
} from "lucide-react";
import { formatPrice } from "@/lib/store";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import { usePageMeta } from "@/lib/seo";
import { useLanguage } from "@/lib/language";

export default function Confirmation() {
  const location = useLocation();
  const order = location.state?.order;
  const { t } = useLanguage();

  usePageMeta({
    title: "Commande confirmée — The Aviator",
    description: "Merci pour votre commande The Aviator.",
    noindex: true,
  });

  const reference = order?.order_number || order?.id?.slice(-8) || "AVT-MU7V190U";
  const city = order?.city || "Casablanca";
  const total = order?.total || 99;
  const firstItem = order?.items?.[0];
  const size = firstItem?.packDetails
    ? firstItem.packDetails.boxer1?.size === firstItem.packDetails.boxer2?.size
      ? firstItem.packDetails.boxer1?.size
      : `${firstItem.packDetails.boxer1?.size} / ${firstItem.packDetails.boxer2?.size}`
    : firstItem?.size || order?.size || "XL";
  const colors = firstItem?.packDetails
    ? `${firstItem.packDetails.boxer1?.color || "Bleu marine"} + ${firstItem.packDetails.boxer2?.color || "Blanc"}`
    : firstItem?.color || order?.colors || "Bleu marine + Blanc";

  const waMessage = `Bonjour The Aviator, je viens de passer ma commande (ref: ${reference}). Total: ${formatPrice(
    total
  )}. Ville: ${city}.`;

  return (
    <div className="bg-[#07132B] text-white min-h-screen py-10 lg:py-16 flex flex-col justify-between font-sans">
      <div className="container-edge max-w-3xl mx-auto w-full px-4 sm:px-6">
        {/* Top Header Logo */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-12">
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg font-bold tracking-wider text-white">THE AVIATOR</span>
          </div>
          <span className="text-[10px] font-sans font-medium tracking-[0.25em] text-white/50 uppercase">
            CONFORT &nbsp;·&nbsp; STYLE &nbsp;·&nbsp; AU QUOTIDIEN
          </span>
        </div>

        {/* Center Success Badge */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#C7D400] flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-[#C7D400]" strokeWidth={2.5} />
          </div>

          <span className="text-[11px] font-sans font-medium tracking-[0.28em] text-white/50 uppercase block mb-3">
            COMMANDE CONFIRMÉE
          </span>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-[2.75rem] font-normal tracking-tight text-white leading-tight">
            Merci <span className="text-[#C7D400]">pour votre commande !</span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-white/70 max-w-md mx-auto font-sans font-light leading-relaxed">
            Votre commande a bien été enregistrée.<br />
            Notre équipe vous contactera bientôt pour confirmer votre commande et organiser la livraison.
          </p>
        </div>

        {/* Order Summary Table */}
        <div className="mt-10 bg-[#0A1A3C]/70 border border-white/10 rounded-sm p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-white/50">
            <span>RÉCAPITULATIF DE LA COMMANDE</span>
            <span className="text-white/80 font-mono tracking-normal">{reference}</span>
          </div>

          <div className="divide-y divide-white/5 text-xs sm:text-sm font-sans">
            {/* Row 1: Pack */}
            <div className="py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-3 text-white/60 font-light">
                <Package className="h-4 w-4 text-white/40" /> Pack
              </span>
              <span className="font-medium text-white">2 boxers</span>
            </div>

            {/* Row 2: Taille */}
            <div className="py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-3 text-white/60 font-light">
                <Shirt className="h-4 w-4 text-white/40" /> Taille
              </span>
              <span className="font-medium text-white">{size}</span>
            </div>

            {/* Row 3: Couleurs */}
            <div className="py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-3 text-white/60 font-light">
                <Palette className="h-4 w-4 text-white/40" /> Couleurs
              </span>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#07132B] border border-white/30" />
                <span className="w-3 h-3 rounded-full bg-white border border-gray-300" />
                <span className="font-medium text-white">{colors}</span>
              </div>
            </div>

            {/* Row 4: Total */}
            <div className="py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-3 text-white/60 font-light">
                <CreditCard className="h-4 w-4 text-white/40" /> Total
              </span>
              <span className="font-sans text-base sm:text-lg font-bold text-[#C7D400]">{total} DH</span>
            </div>

            {/* Row 5: Paiement */}
            <div className="py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-3 text-white/60 font-light">
                <Banknote className="h-4 w-4 text-white/40" /> Paiement
              </span>
              <span className="font-medium text-white">À la livraison</span>
            </div>

            {/* Row 6: Ville */}
            <div className="py-3.5 flex items-center justify-between">
              <span className="flex items-center gap-3 text-white/60 font-light">
                <MapPin className="h-4 w-4 text-white/40" /> Ville
              </span>
              <span className="font-medium text-white">{city}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 font-sans">
          <a
            href={whatsappOrderUrl(waMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-[#C7D400] hover:bg-[#6d8d00] text-[#0A1128] font-bold py-4 px-6 rounded-sm flex items-center justify-center gap-2.5 transition-colors uppercase tracking-wider text-[11px] font-sans"
          >
            <MessageCircle className="h-4 w-4" /> SUIVRE MA COMMANDE SUR WHATSAPP{" "}
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </a>
          <Link
            to="/"
            className="sm:w-auto border border-white/20 hover:border-white/50 text-white font-bold py-4 px-8 rounded-sm flex items-center justify-center transition-colors uppercase tracking-wider text-[11px] font-sans"
          >
            RETOUR À L'ACCUEIL
          </Link>
        </div>

        {/* 3 Trust Badges below */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans text-white/60 text-center">
          <div className="flex items-center justify-center gap-2">
            <Truck className="h-4 w-4 text-white/40" />
            <span className="font-light">Livraison partout au Maroc</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Gift className="h-4 w-4 text-white/40" />
            <span className="font-light">Livraison gratuite à Casablanca</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CreditCard className="h-4 w-4 text-white/40" />
            <span className="font-light">Paiement à la livraison</span>
          </div>
        </div>

        {/* Bottom Watermark */}
        <div className="mt-12 text-center text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-white/30">
          <div className="w-8 h-[2px] bg-[#C7D400] mx-auto mb-2" />
          <span>THE AVIATOR BOXERS</span>
        </div>
      </div>
    </div>
  );
}