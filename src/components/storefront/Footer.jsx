import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import { fetchSiteSettings } from "@/lib/store";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { useLanguage } from "@/lib/language";

/* ── Social icons ─────────────────────────────────────────── */
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.1 8.1 0 004.83 1.57V7.12a4.85 4.85 0 01-1.07-.43z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ── Trust badge icons ────────────────────────────────────── */
function MoroccoIcon() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8 shrink-0 text-white/85"
      aria-hidden="true"
    >
      <path d="M95.33,7.39 L93.69,6.9 L92.06,4.93 L89.49,5.17 L88.08,1.97 L86.21,2.46 L84.81,4.43 L79.91,4.19 L76.87,4.93 L74.07,3.45 L71.73,0.0 L68.22,0.74 L65.65,8.13 L62.15,14.29 L60.05,16.01 L53.97,18.23 L52.1,21.67 L49.07,24.38 L48.6,27.83 L46.03,30.79 L45.33,33.0 L45.56,36.21 L44.63,38.42 L46.5,40.89 L46.03,43.1 L40.19,50.25 L31.78,56.4 L28.27,55.91 L26.17,57.39 L23.36,64.78 L17.76,68.23 L14.72,76.85 L8.18,82.02 L8.41,83.74 L5.61,88.92 L2.8,90.39 L0.0,97.04 L0.0,99.51 L2.1,100.0 L3.74,97.29 L25.23,97.29 L25.93,87.68 L27.34,86.45 L32.71,85.96 L33.41,85.22 L33.64,71.18 L52.34,71.18 L53.04,70.2 L53.5,52.96 L61.21,48.03 L63.79,48.52 L66.59,47.54 L72.2,48.28 L75.7,43.84 L83.41,39.16 L84.81,36.7 L84.81,35.71 L83.18,34.24 L84.35,32.27 L88.32,31.77 L89.25,29.56 L93.93,28.82 L99.3,29.31 L100.0,24.88 L97.9,22.91 L96.26,17.49 L96.73,13.79 Z" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 shrink-0 text-white/80" aria-hidden="true">
      <rect x="3" y="7" width="26" height="18" rx="2" />
      <path d="M3 13h26" />
      <path d="M8 18h4" />
      <path d="M8 21h6" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 shrink-0 text-white/80" aria-hidden="true">
      <rect x="2" y="7" width="18" height="14" rx="1.5" />
      <path d="M20 11h6l4 5v5H20V11z" />
      <circle cx="8" cy="24" r="2.5" />
      <circle cx="24" cy="24" r="2.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 shrink-0 text-white/80" aria-hidden="true">
      <path d="M16 3L4 8.5v8c0 7 5.2 13.1 12 14.5 6.8-1.4 12-7.5 12-14.5v-8L16 3z" />
      <path d="M11 16l3.5 3.5L21 12" strokeWidth="1.8" />
    </svg>
  );
}

/* ── Nav columns ──────────────────────────────────────────── */
const FOOTER_COLUMNS = [
  {
    title: "BOUTIQUE",
    links: [
      { label: "Nos boxers", to: "/notre-boxer" },
      { label: "Composer mon pack", to: "/notre-boxer" },
      { label: "Guide des tailles", to: "/guide-des-tailles" },
      { label: "Avis clients", to: "/avis" },
    ],
  },
  {
    title: "INFORMATIONS",
    links: [
      { label: "À propos", to: "/pourquoi-nous" },
      { label: "Livraison & retours", to: "/livraison-retours" },
      { label: "Paiement à la livraison", to: "/paiement" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "AIDE & LÉGAL",
    links: [
      { label: "Conditions générales", to: "/cgv" },
      { label: "Politique de confidentialité", to: "/confidentialite" },
      { label: "Politique de retour", to: "/livraison-retours" },
    ],
  },
];

/* ── Component ────────────────────────────────────────────── */
export default function Footer() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let active = true;
    fetchSiteSettings().then((data) => {
      if (active) setSettings(data);
    });
    return () => { active = false; };
  }, []);

  const s = settings || {
    email: "social@theaviatorboxer.com",
    whatsapp_number: "212669318641",
    address: "Casablanca, Maroc",
    instagram: "https://www.instagram.com/the_aviator_boxers/",
    facebook: "https://web.facebook.com/profile.php?id=61592505372934",
    tiktok: "https://www.tiktok.com/@theaviatorboxers",
    description: "Boxers premium pour hommes,\nconçus pour offrir confort, maintien\net style au quotidien.",
    store_name: "THE AVIATOR",
  };

  const socials = [
    { key: "instagram", url: s.instagram, Icon: Instagram, label: "Instagram" },
    { key: "facebook", url: s.facebook, Icon: Facebook, label: "Facebook" },
    { key: "tiktok", url: s.tiktok || "https://www.tiktok.com/@theaviatorboxers", Icon: TikTokIcon, label: "TikTok" },
    { key: "whatsapp", url: whatsappContactUrl(s.whatsapp_default_message || "", s.whatsapp_number), Icon: WhatsAppIcon, label: "WhatsApp" },
  ].filter((item) => item.url);

  return (
    <footer className="relative overflow-hidden bg-[#061226] text-white">

      {/* ── MAIN GRID ──────────────────────────────────────── */}
      <div className="container-edge relative z-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.2fr_1fr_1fr] gap-10 lg:gap-0 lg:divide-x lg:divide-white/10">

          {/* ── Col 1: Brand ─────────────────────────────── */}
          <div className="lg:pr-10">
            <Link to="/" className="inline-block">
              <img
                src="/logo.png"
                alt="The Aviator"
                width="220"
                height="90"
                loading="lazy"
                decoding="async"
                className="h-16 sm:h-[72px] w-auto object-contain -ml-2 brightness-110"
              />
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/65 whitespace-pre-line max-w-[240px]">
              {t("Boxers premium pour hommes,\nconçus pour offrir confort, maintien\net style au quotidien.")}
            </p>

            {/* Location */}
            <div className="mt-5 flex items-center gap-2 text-sm text-white/75">
              <span className="text-[#C7D400]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </span>
              <span>{t("Casablanca, Maroc")}</span>
            </div>

            {/* Yellow divider */}
            <div className="w-8 h-[2px] bg-[#C7D400] mt-5" />

            {/* Social icons */}
            <div className="mt-4 flex items-center gap-2">
              {socials.map((item) => (
                <a
                  key={item.key}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center border border-white/20 text-white/75 transition-all duration-300 hover:border-[#C7D400] hover:bg-[#C7D400] hover:text-[#061226]"
                >
                  <item.Icon />
                </a>
              ))}
            </div>

            {/* Tagline */}
            <div className="mt-5 flex items-center gap-2.5">
              <span className="h-[2px] w-6 bg-[#C7D400]" />
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                WEAR A BETTER EVERYDAY
              </p>
            </div>
          </div>

          {/* ── Col 2: BOUTIQUE ──────────────────────────── */}
          <div className="lg:px-8">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-white/90 mb-2">
              {t("BOUTIQUE")}
            </h4>
            <div className="h-[2px] w-6 bg-[#C7D400] mb-5" />
            <ul className="space-y-3.5">
              {FOOTER_COLUMNS[0].links.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: INFORMATIONS ──────────────────────── */}
          <div className="lg:px-8">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-white/90 mb-2">
              {t("INFORMATIONS")}
            </h4>
            <div className="h-[2px] w-6 bg-[#C7D400] mb-5" />
            <ul className="space-y-3.5">
              {FOOTER_COLUMNS[1].links.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: AIDE & LÉGAL ──────────────────────── */}
          <div className="lg:px-8">
            <h4 className="text-xs sm:text-sm font-bold uppercase tracking-[0.22em] text-white/90 mb-2">
              {t("AIDE & LÉGAL")}
            </h4>
            <div className="h-[2px] w-6 bg-[#C7D400] mb-5" />
            <ul className="space-y-3.5">
              {FOOTER_COLUMNS[2].links.map((link) => (
                <li key={link.to + link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 5: Script quote ───────────────────────── */}
          <div className="lg:pl-8 flex flex-col justify-start">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/45 leading-loose">
              CONFORT<br />STYLE<br />AU QUOTIDIEN
            </p>
            <div className="h-[2px] w-6 bg-[#C7D400] my-4" />
            <div>
              <p className="font-script text-[2.4rem] leading-[1.15] text-[#C7D400]">
                More than<br />just<br />boxers
              </p>
              {/* Handwritten underline */}
              <svg viewBox="0 0 110 12" className="mt-1 h-3 w-28 text-[#C7D400]" fill="none">
                <path d="M3 9 C30 3, 75 4, 107 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ─────────────────────────────────────── */}
      <div className="border-t border-white/10 bg-[#050f20]">
        <div className="container-edge py-4">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Left: Copyright + Created by */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/55 shrink-0">
              <span>© 2026 THE AVIATOR. Tous droits réservés.</span>
              <span className="text-white/20 hidden sm:inline">•</span>
              <span className="hidden sm:inline">
                Created by{" "}
                <a
                  href="http://adilradidi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#C7D400] underline transition-colors"
                >
                  adilradidi.com
                </a>
              </span>
            </div>

            {/* Right: 4 Trust Badges */}
            <div className="flex flex-wrap items-center gap-0 divide-x divide-white/10">

              {/* Badge 1: Conçu au Maroc */}
              <div className="flex items-center gap-2.5 pr-5">
                <MoroccoIcon />
                <div>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white leading-tight">CONÇU AU MAROC</p>
                  <p className="text-[10px] sm:text-[11px] text-white/50 mt-0.5">Fabrication locale</p>
                </div>
              </div>

              {/* Badge 2: Paiement à la livraison */}
              <div className="flex items-center gap-2.5 px-5">
                <PaymentIcon />
                <div>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white leading-tight">PAIEMENT</p>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white leading-tight">À LA LIVRAISON</p>
                  <p className="text-[10px] sm:text-[11px] text-white/50 mt-0.5">Simple et sécurisé</p>
                </div>
              </div>

              {/* Badge 3: Livraison gratuite */}
              <div className="flex items-center gap-2.5 px-5">
                <TruckIcon />
                <div>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white leading-tight">LIVRAISON GRATUITE</p>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white leading-tight">À CASABLANCA</p>
                  <p className="text-[10px] sm:text-[11px] text-white/50 mt-0.5">Partout au Maroc</p>
                </div>
              </div>

              {/* Badge 4: Qualité garantie */}
              <div className="flex items-center gap-2.5 pl-5">
                <ShieldIcon />
                <div>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white leading-tight">QUALITÉ</p>
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white leading-tight">GARANTIE</p>
                  <p className="text-[10px] sm:text-[11px] text-white/50 mt-0.5">Confort au quotidien</p>
                </div>
              </div>

            </div>
          </div>

          {/* Created by on mobile */}
          <p className="sm:hidden mt-3 text-xs text-white/50">
            Created by{" "}
            <a
              href="http://adilradidi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-[#C7D400] underline transition-colors"
            >
              adilradidi.com
            </a>
          </p>
        </div>
      </div>

      {/* ── GIANT OUTLINE WORDMARK ─────────────────────────── */}
      <div
        aria-hidden="true"
        className="relative select-none overflow-hidden whitespace-nowrap bg-[#040c1a] border-t border-white/5 flex items-center py-1"
      >
        <div className="flex items-center gap-5 pl-4">
          <span className="h-5 w-5 sm:h-7 sm:w-7 rounded-full bg-[#C7D400] shadow-[0_0_18px_#C7D400] shrink-0" />
          <p
            className="text-[13vw] font-heading font-extrabold uppercase leading-[0.85] tracking-wider text-transparent whitespace-nowrap select-none"
            style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.10)" }}
          >
            THE AVIATOR
          </p>
        </div>
      </div>

    </footer>
  );
}