import { useEffect, useState } from "react";
import { Truck, Banknote, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const MESSAGES = [
  { icon: Truck, text: "Livraison partout au Maroc — 24-48h" },
  { icon: Banknote, text: "Paiement à la livraison (COD)" },
  { icon: ShieldCheck, text: "Tissu premium 95% coton / 5% Lycra" },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const current = MESSAGES[index];
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