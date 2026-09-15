import { ShieldCheck, Award } from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import SectionHeading from "@/components/storefront/SectionHeading";
import { useLanguage } from "@/lib/language";

export default function Certifications() {
  const { t } = useLanguage();
  return (
    <section className="bg-[hsl(48_20%_93%)] py-20 lg:py-28">
      <div className="container-edge">
        <SectionHeading
          center
          eyebrow={t("Qualité certifiée")}
          title={t("Des standards internationaux pour un confort irréprochable")}
          className="max-w-3xl"
        />

        <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:grid-cols-2">
          {[
            { icon: ShieldCheck, name: "GRS", full: "Global Recycled Standard", desc: "Certification des matériaux recyclés et de la chaîne de production." },
            { icon: Award, name: "GOTS", full: "Global Organic Textile Standard", desc: "Label de référence pour les textiles biologiques et éthiques." },
          ].map((cert, i) => (
            <Reveal key={cert.name} delay={i * 0.1}>
              <div className="group relative flex h-full flex-col items-center border border-border bg-background p-10 text-center transition-all duration-300 hover:-translate-y-px hover:border-navy">
                <span className="absolute inset-x-0 top-0 h-px origin-center scale-x-0 bg-[hsl(72_74%_52%)] transition-transform duration-500 group-hover:scale-x-100" />
                <div className="flex h-16 w-16 items-center justify-center bg-foreground/[0.04] transition-colors duration-300 group-hover:bg-[hsl(72_74%_52%)]">
                  <cert.icon className="h-7 w-7 text-ink" strokeWidth={1.25} />
                </div>
                <p className="mt-5 font-display text-3xl">{cert.name}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{cert.full}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t(cert.desc)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mx-auto mt-12 flex max-w-2xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {[t("Tissu premium"), t("Confortable à porter"), t("Qualité contrôlée"), t("Normes internationales")].map((label, i) => (
              <span key={label} className="flex items-center gap-8">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink/50">{label}</span>
                {i < 3 && <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}