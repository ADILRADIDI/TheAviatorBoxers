import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin, Phone } from "lucide-react";
import { fetchSiteSettings } from "@/lib/store";
import { useLanguage } from "@/lib/language";

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
    <footer className="bg-navy text-white">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="container-edge grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {s.trust_items.map((item) => (
            <div key={item.title} className="text-center md:text-left">
              <p className="text-sm font-semibold">{t(item.title)}</p>
              <p className="mt-0.5 text-xs text-white/60">{t(item.subtitle)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container-edge grid grid-cols-2 gap-8 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <img
            src="/logo.png"
            alt="The Aviator"
            className="h-32 w-auto object-contain lg:h-40"
          />
          <p className="mt-5 max-w-xs text-sm text-white/60">
            {t(s.description)}
          </p>
          <div className="mt-5 space-y-2">
            <a href={`mailto:${s.email}`} className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent-lime">
              <Mail className="h-4 w-4" />
              {s.email}
            </a>
            <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-accent-lime">
              <Phone className="h-4 w-4" />
              {s.phone}
            </a>
            <p className="flex items-center gap-2 text-sm text-white/70">
              <MapPin className="h-4 w-4" />
              {t(s.address)}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-3">
            {socials.map((item) => (
              <a key={item.key} href={item.url} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-accent-lime hover:text-accent-lime" aria-label={item.label}>
                {item.icon ? <item.icon className="h-4 w-4" /> : <span className="text-[10px] font-bold">{item.label.charAt(0)}</span>}
              </a>
            ))}
          </div>
        </div>

        {s.footer_columns.map((col) => (
          <div key={col.title}>
            <h4 className="label-eyebrow text-white/50">{t(col.title)}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/70 transition-colors hover:text-accent-lime">
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-edge flex flex-col items-center justify-between gap-3 py-6 md:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {s.store_name}. {t("Tous droits réservés")}.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <MapPin className="h-3 w-3" />
            <span>{t("Conçu au Maroc")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}