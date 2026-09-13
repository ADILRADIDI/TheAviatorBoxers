import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Reveal from "@/components/storefront/Reveal";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/assets";
import { ShieldCheck, Award, Leaf, Gauge, Layers, Wind } from "lucide-react";
import { useLanguage } from "@/lib/language";

const CERTS = [
  { icon: ShieldCheck, name: "GRS", full: "Global Recycled Standard", desc: "Certification garantissant l'utilisation de matériaux recyclés et le respect de normes sociales et environnementales tout au long de la chaîne de production." },
  { icon: Award, name: "GOTS", full: "Global Organic Textile Standard", desc: "Label international de référence pour les textiles biologiques, assurant un coton cultivé sans produits chimiques et des conditions de travail éthiques." },
];

const SPECS = [
  { icon: Leaf, title: "95% Coton", text: "Coton premium respirant, doux et hypoallergénique, certifié par des standards internationaux." },
  { icon: Wind, title: "5% Lycra", text: "Fibre élastique de qualité supérieure offrant un maintien parfait et une liberté de mouvement totale." },
  { icon: Layers, title: "Maille fine", text: "Tricotage précis pour un tissu résistant, léger et confortable en toutes saisons." },
  { icon: Gauge, title: "Contrôle qualité", text: "Chaque pièce est inspectée pour garantir une finition irréprochable et des coutures solides." },
];

export default function Quality() {
  const { t } = useLanguage();
  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow={t("Qualité")} title={t("Qualité certifiée")} subtitle={t("Des standards internationaux pour un confort premium et une qualité irréprochable.")} />

      <section className="py-16 lg:py-24">
        <div className="container-edge">
          <div className="grid gap-6 lg:grid-cols-2">
            {CERTS.map((cert, i) => (
              <Reveal key={cert.name} delay={i * 0.1}>
                <div className="flex h-full flex-col items-center border border-border bg-background p-8 text-center lg:p-10">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent-lime">
                    <cert.icon className="h-10 w-10 text-navy" strokeWidth={1.5} />
                  </div>
                  <p className="mt-5 font-display text-3xl font-bold">{cert.name}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{cert.full}</p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t(cert.desc)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 lg:py-24">
        <div className="container-edge grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <Image src={IMAGES.fabricMacro} alt="Détail du tissu premium" fittingType="fill" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <div>
            <span className="label-eyebrow">{t("Composition")}</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("L'ingénierie du tissu")}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("Notre tissu est le fruit d'une sélection rigoureuse : un mélange de 95% coton premium et 5% Lycra, pensé pour offrir l'équilibre parfait entre douceur, respirabilité et élasticité.")}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {SPECS.map((spec) => (
                <div key={spec.title} className="border border-border bg-background p-5">
                  <spec.icon className="h-6 w-6 text-navy" strokeWidth={1.5} />
                  <h3 className="mt-3 text-sm font-bold">{t(spec.title)}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t(spec.text)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-edge">
          <Reveal className="text-center">
            <span className="label-eyebrow">{t("Engagement")}</span>
            <h2 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {t("Notre promesse qualité")}
            </h2>
          </Reveal>
          <div className="mx-auto mt-10 max-w-3xl space-y-4">
            {[
              "Tissu premium certifié respectant les normes internationales.",
              "Contrôle qualité systématique sur chaque pièce produite.",
              "Coutures renforcées pour une durabilité maximale.",
              "Couleurs stables, résistantes au lavage répété.",
              "Bandes élastiques premium pour un maintien confortable toute la journée.",
            ].map((item, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-start gap-3 border-b border-border pb-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-lime" />
                  <p className="text-sm text-foreground sm:text-base">{t(item)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}