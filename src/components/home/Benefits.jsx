import { useLanguage } from "@/lib/language";

// SVG icons
function CottonIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M11 19 C8 19 6 17 6 14 C6 10 9 8 12 9 C14 5 18 4 21 7 C24 4 29 6 29 11 C30 13 31 15 29 18 C28 20 25 20 23 20" />
      <path d="M16 15 C15 19 14 23 16 27" />
      <path d="M16 27 C18 23 20 19 16 15" />
      <path d="M14 22 C11 21 9 23 10 25 C12 27 15 26 15 25" />
      <path d="M18 22 C21 21 23 23 22 25 C20 27 17 26 17 25" />
    </svg>
  );
}
function StretchIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M4 16 H28 M4 16 L8 12 M4 16 L8 20 M28 16 L24 12 M28 16 L24 20" />
    </svg>
  );
}
function BoxerIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="6" y="8" width="20" height="4" rx="1" />
      <path d="M6 12 L9 26 H16 L16 18 H16 L16 26 H23 L26 12" />
    </svg>
  );
}
function PriceTagIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M4 4 L4 15 L18 29 C19 30 21 30 22 29 L29 22 C30 21 30 19 29 18 L15 4 Z" />
      <circle cx="10" cy="10" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function PaletteIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <circle cx="16" cy="14" r="10" />
      <circle cx="12" cy="11" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="20" cy="11" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="22" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="17" r="1.5" fill="currentColor" stroke="none" />
      <path d="M16 24 C18 24 20 23 21 22 C22 20 22 18 20 18 C18 18 16 20 16 24 Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <rect x="2" y="8" width="18" height="14" rx="1" />
      <path d="M20 12 H26 L30 16 V22 H20 Z" />
      <circle cx="8" cy="24" r="2.5" />
      <circle cx="24" cy="24" r="2.5" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M16 3 C11 3 7 7 7 12 C7 19 16 29 16 29 C16 29 25 19 25 12 C25 7 21 3 16 3 Z" />
      <circle cx="16" cy="12" r="3.5" />
    </svg>
  );
}

const TOP_STATS = [
  { Icon: CottonIcon, value: "95%", label: "COTON PREMIUM" },
  { Icon: StretchIcon, value: "5%", label: "ÉLASTHANNE" },
  { Icon: BoxerIcon, value: "2", label: "BOXERS PAR PACK" },
  { Icon: PriceTagIcon, value: "99 DH", label: "LE PACK", lime: true },
];

const BOTTOM_ITEMS = [
  { Icon: PaletteIcon, label: "5 COULEURS DISPONIBLES" },
  { Icon: TruckIcon, label: "LIVRAISON PARTOUT AU MAROC" },
  { Icon: PinIcon, label: "LIVRAISON GRATUITE À CASABLANCA" },
];

export default function Benefits() {
  const { t } = useLanguage();

  return (
    <section className="bg-navy text-white">
      {/* Top row: 4 key stats with icons */}
      <div className="container-edge border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {TOP_STATS.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 py-7 px-6 ${
                i > 0 ? "border-l border-white/10" : ""
              }`}
            >
              <span className="shrink-0 text-white/60">
                <item.Icon />
              </span>
              <div>
                <p
                  className={`font-heading text-3xl leading-none ${
                    item.lime ? "text-[#C7D400]" : "text-white"
                  }`}
                >
                  {t(item.value)}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  {t(item.label)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row: 3 service items */}
      <div className="container-edge">
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {BOTTOM_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 py-5 px-6 ${
                i > 0 ? "sm:border-l border-white/10" : ""
              } ${i > 0 ? "border-t sm:border-t-0 border-white/10" : ""}`}
            >
              <span className="shrink-0 text-[#C7D400]">
                <item.Icon />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
                {t(item.label)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}