import { useState } from "react";
import Reveal from "@/components/storefront/Reveal";
import ProductViewer3D from "@/components/home/ProductViewer3D";
import { IMAGES } from "@/lib/assets";
import { useLanguage } from "@/lib/language";

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
    <section className="py-20 lg:py-28">
      <div className="container-edge">
        <Reveal className="max-w-2xl">
          <span className="label-eyebrow">{t("Conçu pour le confort")}</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("L'ingénierie du confort")}
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            {t("Chaque boxer The Aviator est pensé comme une pièce de précision : un tissu premium, une coupe étudiée, et une attention au détail qui fait la différence au quotidien.")}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
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
            <p className="mt-3 text-center text-xs uppercase tracking-wider text-muted-foreground">
              {t("Cliquez sur un point pour découvrir chaque détail")}
            </p>
          </Reveal>

          <ol className="m-0 grid gap-4 self-center p-0 list-none">
            {ENGINEERING_POINTS.map((point, index) => (
              <Reveal key={point.number} delay={index * 0.05}>
                <li>
                  <button
                    type="button"
                    onClick={() => setActive(active === index ? -1 : index)}
                    onMouseEnter={() => setActive(index)}
                    onMouseLeave={() => setActive(-1)}
                    aria-pressed={active === index}
                    className={`group flex w-full items-start gap-3 border border-border p-4 text-left transition-colors hover:border-navy ${active === index ? "border-navy bg-secondary" : ""}`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-sm font-extrabold transition-colors ${
                        active === index
                          ? "bg-accent-lime text-navy"
                          : "bg-navy text-white"
                      }`}
                    >
                      {point.number}
                    </span>
                    <span>
                      <span className="block text-lg font-bold">{t(point.title)}</span>
                      <span className="mt-1.5 block text-sm text-muted-foreground">{t(point.text)}</span>
                    </span>
                  </button>
                </li>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border pt-5 text-sm">
                <span className="font-semibold uppercase tracking-wider text-navy">
                  {t("Certifié GRS & GOTS")}
                </span>
                <span className="text-muted-foreground">
                  {t("Des standards internationaux pour un confort irréprochable")}
                </span>
              </div>
            </Reveal>
          </ol>
        </div>
      </div>
    </section>
  );
}