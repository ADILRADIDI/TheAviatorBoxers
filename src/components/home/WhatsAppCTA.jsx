import { STORE } from "@/lib/store";
import { useLanguage } from "@/lib/language";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { Mail } from "lucide-react";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function WhatsAppCTA() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#0A192F] font-sans">
      {/* Background product image */}
      <div className="absolute inset-0">
        <img
          src="/images/story-workshop.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-right opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/85 to-transparent" />
      </div>

      {/* Left vertical text */}
      <div className="pointer-events-none absolute left-6 bottom-16 hidden xl:block z-10">
        <div className="w-6 h-[2px] bg-[#C7D400] mb-3" />
        <p className="text-[9px] font-sans font-medium uppercase tracking-[0.25em] text-white/50 leading-relaxed">
          PLUS<br />
          QU'UN BOXER,<br />
          UN QUOTIDIEN<br />
          MEILLEUR.
        </p>
      </div>

      {/* "THE AVIATOR" background watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-4 overflow-hidden select-none z-0"
      >
        <p
          className="text-[14vw] font-serif font-light uppercase leading-none tracking-widest text-transparent whitespace-nowrap"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.06)" }}
        >
          THE AVIATOR
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-10 container-edge max-w-4xl mx-auto py-16 lg:py-24 text-center px-4 sm:px-6">
        {/* Section Header */}
        <div className="inline-flex flex-col items-center mb-4">
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.3em] text-white/70">
            CONTACT
          </span>
          <div className="mt-2 h-[2px] w-8 bg-[#C7D400]" />
        </div>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight tracking-tight">
          {t("Une question ?")}{" "}
          <span className="text-[#C7D400] font-serif">{t("On est là.")}</span>
        </h2>

        {/* Subtitles */}
        <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm leading-relaxed text-white/80 font-sans font-light">
          {t("Besoin d'aide pour choisir votre taille, composer votre pack ou suivre votre commande ? Notre équipe vous répond.")}
        </p>
        <p className="mt-1 text-[11px] sm:text-xs text-white/50 font-sans font-light">
          {t("Nous vous répondons dans les meilleurs délais.")}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-sans">
          <a
            href={whatsappContactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#C7D400] hover:brightness-95 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#07132B] transition-all rounded-sm shadow-xs hover:shadow-md hover:scale-[1.01]"
          >
            <WhatsAppIcon />
            {t("NOUS ÉCRIRE SUR WHATSAPP")}
          </a>
          <a
            href={`mailto:${STORE.email}`}
            className="inline-flex items-center gap-2.5 border border-white/40 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:border-white hover:bg-white/5 transition-colors rounded-sm"
          >
            <Mail className="h-4 w-4" />
            {t("NOUS ENVOYER UN E-MAIL")}
          </a>
        </div>

        {/* Service pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-12 font-sans">
          <div className="flex flex-col items-center gap-2 text-white/70">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v10M7 12h10" />
            </svg>
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-white/70">
              TAILLES
            </span>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <div className="flex flex-col items-center gap-2 text-white/70">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-white/70">
              COMMANDES
            </span>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <div className="flex flex-col items-center gap-2 text-white/70">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-white/70">
              LIVRAISON
            </span>
          </div>

          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <div className="flex flex-col items-center gap-2 text-white/70">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-white/70">
              CONSEILS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}