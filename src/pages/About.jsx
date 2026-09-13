import { motion, useReducedMotion } from "framer-motion";
import { Image } from "@/components/ui/image";
import PageHeader from "@/components/storefront/PageHeader";
import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Reveal from "@/components/storefront/Reveal";
import { IMAGES } from "@/lib/assets";
import { Target, Eye, Heart, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

const VALUES = [
  { icon: Target, title: "Exigence", text: "Des standards élevés à chaque étape, du tissu à la finition." },
  { icon: Eye, title: "Précision", text: "Une attention au détail inspirée de l'aéronautique." },
  { icon: Heart, title: "Confort", text: "Le bien-être de l'homme au quotidien comme priorité absolue." },
  { icon: ShieldCheck, title: "Confiance", text: "Des matériaux certifiés et un service transparent." },
];

export default function About() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  usePageMeta({ title: "À propos — The Aviator", description: "L'histoire de The Aviator : des boxers premium pour hommes, inspirés par l'exigence de l'aéronautique. 95% coton, 5% Lycra. Fabriqué avec soin." });
  useJsonLd(breadcrumbJsonLd([{ name: "Accueil", url: SITE_URL }, { name: "À propos", url: `${SITE_URL}/a-propos` }]));
  return (
    <>
      <AnnouncementBar />
      <PageHeader eyebrow={t("Notre histoire")} title={t("À propos")} subtitle={t("Une marque marocaine née de la passion du confort et du style.")} />

      <section className="py-16 lg:py-24">
        <div className="container-edge grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={reduce ? undefined : { opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <Image src={IMAGES.brandStory} alt="L'univers The Aviator" fittingType="fill" className="h-full w-full object-cover" />
            </div>
          </motion.div>
          <div>
            <span className="label-eyebrow">{t("La marque")}</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("La précision au service du confort")}</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              <p>{t("The Aviator est une marque marocaine de sous-vêtements premium pour hommes.")}</p>
              <p>{t("Née de la conviction que le confort mérite la même exigence que le style, nous réunissons des tissus haut de gamme et un savoir-faire rigoureux.")}</p>
              <p>{t("Inspirés par l'élégance technique de l'aéronautique, nous concevons chaque pièce comme un équipement de précision : maintien parfait, liberté de mouvement et confort durable, dans un style affirmé.")}</p>
              <p>{t("Notre mission est simple : offrir à l'homme marocain moderne des sous-vêtements qu'il soit fier de porter, et qui le accompagnent dans toutes les situations de la journée.")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-16 lg:py-24">
        <div className="container-edge">
          <Reveal className="text-center">
            <span className="label-eyebrow">{t("Nos valeurs")}</span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{t("Ce qui nous guide")}</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="h-full border border-border bg-background p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-accent-lime">
                    <v.icon className="h-7 w-7 text-navy" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{t(v.title)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(v.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy py-16 text-white lg:py-20">
        <div className="container-edge grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {[
            { n: "95%", l: "Coton premium" },
            { n: "24-48h", l: "Livraison Maroc" },
            { n: "100%", l: "Conçu au Maroc" },
            { n: "2", l: "Certifications" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="font-display text-4xl font-bold text-accent-lime lg:text-5xl">{s.n}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/60">{t(s.l)}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}