import { ShieldCheck, Award } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import { useLanguage } from "@/lib/language";

export default function Certifications() {
  const { t } = useLanguage();
  return (
    <section className="bg-secondary py-20 lg:py-28">
      <div className="container-edge text-center">
        <Reveal>
          <span className="label-eyebrow">{t("Qualité certifiée")}</span>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("Des standards internationaux pour un confort irréprochable")}
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          {[
            { icon: ShieldCheck, name: "GRS", full: "Global Recycled Standard", desc: "Certification des matériaux recyclés et de la chaîne de production." },
            { icon: Award, name: "GOTS", full: "Global Organic Textile Standard", desc: "Label de référence pour les textiles biologiques et éthiques." },
          ].map((cert, i) => (
            <Reveal key={cert.name} delay={i * 0.1}>
              <div className="flex h-full flex-col items-center border border-border bg-background p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent-lime">
                  <cert.icon className="h-8 w-8 text-navy" strokeWidth={1.5} />
                </div>
                <p className="mt-4 font-display text-2xl font-bold">{cert.name}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{cert.full}</p>
                <p className="mt-3 text-sm text-muted-foreground">{t(cert.desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            <span>{t("Tissu premium")}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{t("Confortable à porter")}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{t("Qualité contrôlée")}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{t("Normes internationales")}</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}