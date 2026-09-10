import { Wind, Layers, Gauge, Leaf } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";

const BENEFITS = [
  { icon: Leaf, title: "95% Coton", text: "Coton premium respirant, doux sur la peau." },
  { icon: Wind, title: "5% Lycra", text: "Élasticité et maintien parfait toute la journée." },
  { icon: Layers, title: "Confort total", text: "Coupe ergonomique pensée pour le mouvement." },
  { icon: Gauge, title: "Qualité durable", text: "Tissu résistant, couleurs qui durent au lavage." },
];

export default function Benefits() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-edge grid gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <span className="label-eyebrow">Conçu pour le confort</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            L'ingénierie du confort
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">
            Chaque boxer The Aviator est pensé comme une pièce de précision :
            un tissu premium, une coupe étudiée, et une attention au détail
            qui fait la différence au quotidien.
          </p>
          <div className="mt-8 aspect-[16/10] overflow-hidden bg-muted">
            <Image src={IMAGES.fabricMacro} alt="Détail du tissu The Aviator" fittingType="fill" className="h-full w-full object-cover" />
          </div>
        </Reveal>

        <div className="grid gap-px sm:grid-cols-2">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="h-full border border-border p-8 transition-colors hover:border-navy">
                <b.icon className="h-7 w-7 text-navy" strokeWidth={1.5} />
                <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}