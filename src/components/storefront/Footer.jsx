import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, MapPin } from "lucide-react";
import Logo from "./Logo";
import { STORE } from "@/lib/store";

const COLS = [
  {
    title: "Boutique",
    links: [
      { label: "Collection", to: "/collection" },
      { label: "Composer un pack", to: "/packs" },
      { label: "Guide des tailles", to: "/guide-des-tailles" },
      { label: "Avis clients", to: "/avis" },
    ],
  },
  {
    title: "Informations",
    links: [
      { label: "À propos", to: "/a-propos" },
      { label: "Qualité & certifications", to: "/qualite" },
      { label: "Livraison & retours", to: "/livraison-retours" },
      { label: "Paiement", to: "/paiement" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "/contact" },
      { label: "Conditions générales", to: "/cgv" },
      { label: "Confidentialité", to: "/confidentialite" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="container-edge grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            { t: "Tissus premium", s: "95% coton / 5% Lycra" },
            { t: "Livraison 24-48h", s: "Partout au Maroc" },
            { t: "Paiement à la livraison", s: "Payez à réception" },
            { t: "Qualité contrôlée", s: "Normes internationales" },
          ].map((item) => (
            <div key={item.t} className="text-center md:text-left">
              <p className="text-sm font-semibold">{item.t}</p>
              <p className="mt-0.5 text-xs text-white/60">{item.s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container-edge grid grid-cols-2 gap-8 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-2">
          <Logo variant="light" />
          <p className="mt-5 max-w-xs text-sm text-white/60">
            {STORE.description}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a href={STORE.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-accent-lime hover:text-accent-lime" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={STORE.facebook} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-accent-lime hover:text-accent-lime" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href={`mailto:${STORE.email}`} className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-accent-lime hover:text-accent-lime" aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="label-eyebrow text-white/50">{col.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-white/70 transition-colors hover:text-accent-lime">
                    {link.label}
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
            © {new Date().getFullYear()} {STORE.name}. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <MapPin className="h-3 w-3" />
            <span>Conçu au Maroc</span>
          </div>
        </div>
      </div>
    </footer>
  );
}