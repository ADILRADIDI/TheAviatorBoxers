import { Sparkles, Truck, Banknote, ShieldCheck } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import { useLanguage } from "@/lib/language";

const ITEMS = [
  { index: "01", icon: Sparkles, title: "Tissus Premium", text: "95% coton / 5% Lycra" },
  { index: "02", icon: Truck, title: "Livraison 24-48h", text: "Partout au Maroc" },
  { index: "03", icon: Banknote, title: "Paiement à la livraison", text: "Payez à réception" },
  { index: "04", icon: ShieldCheck, title: "Qualité contrôlée", text: "Normes internationales" },
];

export default function TrustBar() {
  const { t } = useLanguage();
  return (
    <section className="border-b border-border bg-background">
      <div className="container-edge grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
        {ITEMS.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08} className="group relative flex flex-col gap-3 px-5 py-9 md:px-6 lg:px-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/30">{item.index}</span>
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-ink transition-colors duration-300 group-hover:text-[hsl(72_74%_52%)]" strokeWidth={1.5} />
              <h3 className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink">{t(item.title)}</h3>
            </div>
            <p className="text-xs text-muted-foreground">{t(item.text)}</p>
            <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[hsl(72_74%_52%)] transition-transform duration-500 group-hover:scale-x-100" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}