import { Truck, Banknote, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import { useLanguage } from "@/lib/language";

const ITEMS = [
  { icon: Sparkles, title: "Tissus Premium", text: "95% coton / 5% Lycra" },
  { icon: Truck, title: "Livraison 24-48h", text: "Partout au Maroc" },
  { icon: Banknote, title: "Paiement à la livraison", text: "Payez à réception" },
  { icon: ShieldCheck, title: "Qualité contrôlée", text: "Normes internationales" },
];

export default function TrustBar() {
  const { t } = useLanguage();
  return (
    <section className="border-b border-border bg-background">
      <div className="container-edge grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
        {ITEMS.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08} className="flex flex-col items-center gap-2 py-8 text-center md:px-6">
            <item.icon className="h-6 w-6 text-navy" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-bold text-navy">{t(item.title)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t(item.text)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}