import { useEffect, useState } from "react";
import { Truck, Banknote, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/language";

const MESSAGES = {
  fr: [
    { icon: Truck, text: "Livraison partout au Maroc — 24-48h" },
    { icon: Banknote, text: "Paiement à la livraison (COD)" },
    { icon: ShieldCheck, text: "Tissu premium 95% coton / 5% Lycra" },
  ],
  darija: [
    { icon: Truck, text: "التوصيل فالمغرب كامل — 24 حتى 48 ساعة" },
    { icon: Banknote, text: "خلص ملي يوصلك الطلب" },
    { icon: ShieldCheck, text: "ثوب بريميوم 95% قطن / 5% ليكرا" },
  ],
};

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.fr.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const current = (MESSAGES[language] || MESSAGES.fr)[index] || MESSAGES.fr[0];
  const Icon = current.icon;

  return (
    <div className="bg-navy text-white">
      <div className="container-edge flex h-9 items-center justify-center overflow-hidden">
        <div key={index} className="flex items-center gap-2 transition-opacity duration-500">
          <Icon className="h-3.5 w-3.5 text-accent-lime" />
          <span className="text-[11px] font-medium uppercase tracking-[0.15em]">
            {current.text}
          </span>
        </div>
      </div>
    </div>
  );
}