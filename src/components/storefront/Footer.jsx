import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { fetchSiteSettings } from "@/lib/store";
import { useLanguage } from "@/lib/language";

const TRUST_TICKER = [
  "Livraison 24-48h partout au Maroc",
  "Paiement à la livraison",
  "95% coton · 5% Lycra",
  "Qualité contrôlée",
  "Conçu avec soin",
];

export default function Footer() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    let active = true;
    fetchSiteSettings().then((data) => {
      if (active) setSettings(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const s = settings || {
    email: "contact@theaviatorboxer.com",
    phone: "06 91 57 31 92",
    whatsapp_number: "212691573192",
    address: "Casablanca, Maroc",
    instagram: "https://instagram.com/theaviatorboxer",
    facebook: "https://facebook.com/theaviatorboxer",
    tiktok: "",
    description: "Boxers premium pour hommes, conçus pour offrir confort, maintien et style au quotidien.",
    store_name: "THE AVIATOR",
    trust_items: [
      { title: "Tissus premium", subtitle: "95% coton / 5% Lycra" },
      { title: "Livraison 24-48h", subtitle: "Partout au Maroc" },
      { title: "Paiement à la livraison", subtitle: "Payez à réception" },
      { title: "Qualité contrôlée", subtitle: "Normes internationales" },
    ],
    footer_columns: [
      { title: "Boutique", links: [{ label: "Collection", to: "/collection" }, { label: "Composer un pack", to: "/packs" }, { label: "Guide des tailles", to: "/guide-des-tailles" }, { label: "Avis clients", to: "/avis" }] },
      { title: "Informations", links: [{ label: "À propos", to: "/a-propos" }, { label: "Qualité & certifications", to: "/qualite" }, { label: "Livraison & retours", to: "/livraison-retours" }, { label: "Paiement", to: "/paiement" }] },
      { title: "Aide", links: [{ label: "FAQ", to: "/faq" }, { label: "Contact", to: "/contact" }, { label: "Conditions générales", to: "/cgv" }, { label: "Confidentialité", to: "/confidentialite" }] },
    ],
  };

  const socials = [
    { key: "instagram", url: s.instagram, icon: Instagram, label: "Instagram" },
    { key: "facebook", url: s.facebook, icon: Facebook, label: "Facebook" },
    { key: "tiktok", url: s.tiktok, icon: null, label: "TikTok" },
    { key: "youtube", url: s.youtube, icon: null, label: "YouTube" },
  ].filter((item) => item.url);

  return (
    <footer className="relative overflow-hidden bg-[hsl(216_75%_9%)] text-white">
      {/* Scrolling trust ticker */}
      <div className="relative z-10 border-y border-white/10 bg-[hsl(216_72%_7%)]">
        <div className="marquee-track items-center gap-0 py-3">
          {[...TRUST_TICKER, ...TRUST_TICKER].map((item, i) => (
            <span key={i} className="flex shrink-0 items-center gap-5 px-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
              <span className="h-1 w-1 rounded-full bg-[hsl(72_74%_52%)]" />
              {t(item)}
            </span>
          ))}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-edge relative z-10 grid grid-cols-2 gap-x-8 gap-y-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <img
            src="/logo.png"
            alt="The Aviator"
            className="h-28 w-auto object-contain lg:h-36 lg:-ml-6"
          />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            {t(s.description)}
          </p>
          <div className="mt-6 space-y-2.5">
            <a href={`mailto:${s.email}`} className="group flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-accent-lime">
              <span className="flex h-8 w-8 items-center justify-center border border-white/15 transition-colors group-hover:border-accent-lime">
                <Mail className="h-3.5 w-3.5" />
              </span>
              {s.email}
            </a>
            <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="group flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-accent-lime">
              <span className="flex h-8 w-8 items-center justify-center border border-white/15 transition-colors group-hover:border-accent-lime">
                <Phone className="h-3.5 w-3.5" />
              </span>
              {s.phone}
            </a>
            <p className="flex items-center gap-3 text-sm text-white/70">
              <span className="flex h-8 w-8 items-center justify-center border border-white/15">
                <MapPin className="h-3.5 w-3.5" />
              </span>
              {t(s.address)}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2.5">
            {socials.map((item) => (
              <a
                key={item.key}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center border border-white/15 text-white/70 transition-all duration-300 hover:translate-y-px hover:border-accent-lime hover:bg-accent-lime hover:text-navy"
                aria-label={item.label}
              >
                {item.icon ? <item.icon className="h-4 w-4" /> : <span className="text-[10px] font-bold">{item.label.charAt(0)}</span>}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {s.footer_columns.map((col) => (
          <div key={col.title}>
            <h4 className="label-eyebrow text-white/40">{t(col.title)}</h4>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1.5 text-sm uppercase tracking-wide text-white/70 transition-colors hover:text-white"
                  >
                    <span className="underline-anim">{t(link.label)}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-accent-lime opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Ghost wordmark */}
      <div aria-hidden="true" className="relative select-none overflow-hidden whitespace-nowrap px-6 pb-6 pt-2">
        <div className="marquee-track items-center gap-[3vw] text-[13.5vw] font-display-strong uppercase leading-[0.78] tracking-tight text-transparent">
          {[0, 1].map((n) => (
            <span key={n} className="shrink-0" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.06)" }}>
              The Aviator<span className="text-[hsl(72_74%_52%)]" style={{ WebkitTextStroke: "0" }}> · </span>The Aviator
              <span className="text-[hsl(72_74%_52%)]" style={{ WebkitTextStroke: "0" }}> · </span>The Aviator
              <span className="text-[hsl(72_74%_52%)]" style={{ WebkitTextStroke: "0" }}> · </span>The Aviator
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10">
        <div className="container-edge flex flex-col items-center justify-between gap-3 py-6 md:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {s.store_name}. {t("Tous droits réservés")}.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <span className="h-1 w-1 rounded-full bg-accent-lime" />
            <span>{t("Conçu au Maroc")}, on s’en occupe.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}