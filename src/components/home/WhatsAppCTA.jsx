import Reveal from "@/components/storefront/Reveal";
import { STORE } from "@/lib/store";
import { useLanguage } from "@/lib/language";

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function WhatsAppCTA() {
  const { t } = useLanguage();
  return (
    <section className="py-20 lg:py-24">
      <div className="container-edge">
        <Reveal>
          <div className="relative overflow-hidden border border-foreground/15 bg-[hsl(72_74%_52%)] px-8 py-16 text-center lg:px-16 lg:py-20">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[24px] border-navy/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full border-[32px] border-navy/10"
            />
            <div className="relative">
              <span className="label-eyebrow flex items-center justify-center gap-2.5 text-navy/70">
                <span className="h-1 w-1 rounded-full bg-navy" />
                {t("Commande simplifiée")}
              </span>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight tracking-tight text-navy sm:text-4xl lg:text-5xl">
                {t("Commandez en 2 clics via WhatsApp")}
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-navy/75 sm:text-base">
                {t("Simple, rapide et sans création de compte. Contactez-nous directement et passez votre commande en quelques secondes.")}
              </p>
              <a
                href={`https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(t("Bonjour The Aviator, je souhaite passer une commande."))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-9 inline-flex items-center gap-3 bg-navy px-8 py-4 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.5)]"
              >
                <WhatsAppGlyph />
                {t("Commander par WhatsApp")}
                <span className="h-px w-6 bg-[hsl(72_74%_52%)] transition-all duration-300 group-hover:w-10" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}