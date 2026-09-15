import { useState } from "react";
import Reveal from "@/components/storefront/Reveal";
import SectionHeading from "@/components/storefront/SectionHeading";
import ProductViewer3D from "@/components/home/ProductViewer3D";
import { IMAGES } from "@/lib/assets";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";

const ENGINEERING_POINTS = [
  {
    number: 1,
    x: 50,
    y: 20,
    x3: 0,
    y3: 0.85,
    z3: 1.2,
    title: "Bande élastique premium",
    text: "Ceinture à maintien souple, sans compression, pensé pour ne jamais glisser, jour après jour.",
  },
  {
    number: 2,
    x: 30,
    y: 52,
    x3: 0.72,
    y3: 0.3,
    z3: 0.6,
    title: "Tissu 95% coton / 5% lycra",
    text: "Respirant, doux au toucher et élastique dans les deux sens pour une liberté de mouvement totale.",
  },
  {
    number: 3,
    x: 74,
    y: 46,
    x3: 0.72,
    y3: -0.28,
    z3: 0.28,
    title: "Coutures plates & renforcées",
    text: "Des coutures plates qui ne frottent pas contre la peau, et une durabilité au lavage répété.",
  },
  {
    number: 4,
    x: 53,
    y: 90,
    x3: 0.1,
    y3: -0.82,
    z3: 1.0,
    title: "Coupe anatomique",
    text: "Une coupe qui épouse les mouvements du corps, avec un ourlet qui reste parfaitement en place.",
  },
];

export default function Benefits() {
  const { t } = useLanguage();
  const [active, setActive] = useState(-1);

  return (
    <section className="bg-paper py-20 lg:py-28">
      <div className="container-edge">
        <SectionHeading
          eyebrow={t("Conçu pour le confort")}
          title={t("L'ingénierie du confort")}
          sub={t("Chaque boxer The Aviator est pensé comme une pièce de précision : un tissu premium, une coupe étudiée, et une attention au détail qui fait la différence au quotidien.")}
          className="max-w-2xl"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="lg:sticky lg:top-36 lg:self-start">
            <div className="media-frame">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <ProductViewer3D
                  src={IMAGES.product3d}
                  alt="Boxer The Aviator"
                  className="h-full w-full"
                  hotspots={ENGINEERING_POINTS.map((p) => ({ x: p.x, y: p.y, x3: p.x3, y3: p.y3, z3: p.z3, number: p.number, title: t(p.title) }))}
                  activeIndex={active}
                  onSelect={setActive}
                />
              </div>
            </div>
            <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-ink/40">
              {t("Cliquez sur un point pour découvrir chaque détail")}
            </p>
          </Reveal>

          <div className="flex flex-col">
            {ENGINEERING_POINTS.map((point, index) => (
              <Reveal key={point.number} delay={index * 0.05}>
                <button
                  type="button"
                  onClick={() => setActive(active === index ? -1 : index)}
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(-1)}
                  aria-pressed={active === index}
                  className={cn(
                    "group flex w-full items-start gap-5 border-t border-border py-7 text-left transition-colors last:border-b",
                    active === index && "bg-foreground/[0.03]",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center font-display text-base transition-colors duration-300",
                      active === index ? "bg-[hsl(72_74%_52%)] text-navy" : "bg-navy text-white group-hover:bg-ink",
                    )}
                  >
                    {point.number}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-xl leading-tight">{t(point.title)}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{t(point.text)}</span>
                  </span>
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(72_74%_52%)] opacity-0 transition-opacity duration-300" style={{ opacity: active === index ? 1 : 0 }} />
                </button>
              </Reveal>
            ))}

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                <span className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-navy">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(72_74%_52%)]" />
                  {t("Certifié GRS & GOTS")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {t("Des standards internationaux pour un confort irréprochable")}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}