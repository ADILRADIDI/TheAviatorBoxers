import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/language";

// Exact vector SVG icons matching the reference image bottom bar
function CottonIcon(props) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 24 C10 24 7 21 7 17 C7 12 11 9 15 10 C17 6 22 5 26 8 C29 5 35 7 35 12 C37 14 38 17 36 21 C35 24 31 24 29 24" />
      <path d="M20 18 C18 23 17 28 20 33" />
      <path d="M20 33 C23 28 25 23 20 18" />
      <path d="M17 27 C13 26 11 29 13 31 C15 33 18 32 19 31" />
      <path d="M23 27 C27 26 29 29 27 31 C25 33 22 32 21 31" />
    </svg>
  );
}

function FeatherIcon(props) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M33 7 C22 10 14 19 10 32 M10 32 L7 35" />
      <path d="M33 7 C31 15 27 23 10 32 C12 27 15 25 18 25 C16 22 18 19 21 19 C21 15 23 12 28 10 C30 8 32 7 33 7 Z" />
    </svg>
  );
}

function ShieldCheckIcon(props) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 L32 10 C32 22 26 30 20 34 C14 30 8 22 8 10 L20 6 Z" />
      <polyline points="15 20 18 23 25 16" />
    </svg>
  );
}

function MoroccoIcon(props) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 xl:h-8 xl:w-8 text-white/90"
      {...props}
    >
      <path d="M95.33,7.39 L93.69,6.9 L92.06,4.93 L89.49,5.17 L88.08,1.97 L86.21,2.46 L84.81,4.43 L79.91,4.19 L76.87,4.93 L74.07,3.45 L71.73,0.0 L68.22,0.74 L65.65,8.13 L62.15,14.29 L60.05,16.01 L53.97,18.23 L52.1,21.67 L49.07,24.38 L48.6,27.83 L46.03,30.79 L45.33,33.0 L45.56,36.21 L44.63,38.42 L46.5,40.89 L46.03,43.1 L40.19,50.25 L31.78,56.4 L28.27,55.91 L26.17,57.39 L23.36,64.78 L17.76,68.23 L14.72,76.85 L8.18,82.02 L8.41,83.74 L5.61,88.92 L2.8,90.39 L0.0,97.04 L0.0,99.51 L2.1,100.0 L3.74,97.29 L25.23,97.29 L25.93,87.68 L27.34,86.45 L32.71,85.96 L33.41,85.22 L33.64,71.18 L52.34,71.18 L53.04,70.2 L53.5,52.96 L61.21,48.03 L63.79,48.52 L66.59,47.54 L72.2,48.28 L75.7,43.84 L83.41,39.16 L84.81,36.7 L84.81,35.71 L83.18,34.24 L84.35,32.27 L88.32,31.77 L89.25,29.56 L93.93,28.82 L99.3,29.31 L100.0,24.88 L97.9,22.91 L96.26,17.49 L96.73,13.79 Z" />
    </svg>
  );
}

// 4 Callout Cards with exact pixel alignment from hero-reference.jpeg (1600x900)
const CALLOUTS = [
  {
    id: "fabric",
    title: "TISSU PREMIUM",
    subtitle: "95% coton - 5% élasthanne",
    desc: "Doux, respirant et confortable toute la journée.",
    image: "/hero-callouts/tissu-premium.jpg",
    cardStyle: { left: "28.25%", top: "17.3%" },
    frameClass: "w-[155px] h-[100px] xl:w-[178px] xl:h-[116px]",
    linePath: "M 630 197 L 686 197 L 773 530",
    targetX: 773,
    targetY: 530,
  },
  {
    id: "finishing",
    title: "FINITIONS SOIGNÉES",
    subtitle: null,
    desc: "Coutures propres et résistantes pour un meilleur maintien.",
    image: "/hero-callouts/finitions-soignees.jpg",
    cardStyle: { left: "26.1%", top: "54.4%" },
    frameClass: "w-[145px] h-[98px] xl:w-[166px] xl:h-[112px]",
    linePath: "M 584 550 L 635 550 L 673 690",
    targetX: 673,
    targetY: 690,
  },
  {
    id: "waistband",
    title: "BANDE TISSÉE",
    subtitle: null,
    desc: "Logo tissé avec précision pour un style unique et un confort optimal.",
    image: "/hero-callouts/bande-tissee.jpg",
    cardStyle: { left: "77.25%", top: "16.2%" },
    frameClass: "w-[185px] h-[100px] xl:w-[214px] xl:h-[116px]",
    linePath: "M 1236 200 L 1148 200 L 946 290",
    targetX: 946,
    targetY: 290,
  },
  {
    id: "pouch",
    title: "COUPE CONFORTABLE",
    subtitle: null,
    desc: "Une coupe étudiée pour un maintien parfait et une grande liberté de mouvement.",
    image: "/hero-callouts/coupe-confortable.jpg",
    cardStyle: { left: "71.25%", top: "43%" },
    frameClass: "w-[165px] h-[105px] xl:w-[188px] xl:h-[120px]",
    linePath: "M 1140 428 L 1020 428 L 929 483",
    targetX: 929,
    targetY: 483,
  },
];

const TRUST_ITEMS = [
  {
    icon: CottonIcon,
    line1: "95% COTON",
    line2: "5% ÉLASTHANNE",
  },
  {
    icon: FeatherIcon,
    line1: "CONFORT",
    line2: "AU QUOTIDIEN",
  },
  {
    icon: ShieldCheckIcon,
    line1: "QUALITÉ",
    line2: "DURABLE",
  },
  {
    icon: MoroccoIcon,
    line1: "CONÇU",
    line2: "AU MAROC",
  },
];

export default function Hero() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden bg-[#071324] text-white">
      {/* =========================================================================
          DESKTOP & LARGE SCREENS: 100% Exact Viewport-Fitting Canvas
          ========================================================================= */}
      <div className="relative mx-auto hidden w-full max-w-[1920px] lg:block">
        <div className="relative w-full h-[calc(100vh-108px)] max-h-[792px] min-h-[620px] overflow-hidden">
          {/* 1. Base studio background image */}
          <img
            src="/hero-origin.jpeg"
            alt="The Aviator — Boxer premium"
            width="1600"
            height="900"
            fetchpriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          {/* 2. Interactive SVG connecting lines & glowing target dots */}
          <svg
            viewBox="0 0 1600 900"
            className="pointer-events-none absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
          >
            {CALLOUTS.map((c) => (
              <g key={c.id}>
                {/* Neon connecting line with 45° bend */}
                <path
                  d={c.linePath}
                  fill="none"
                  stroke="#C7D400"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Outer pulsing ring */}
                <circle
                  cx={c.targetX}
                  cy={c.targetY}
                  r="9"
                  fill="none"
                  stroke="#C7D400"
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="animate-pulse"
                />

                {/* Solid center dot */}
                <circle
                  cx={c.targetX}
                  cy={c.targetY}
                  r="4.5"
                  fill="#C7D400"
                />
              </g>
            ))}
          </svg>

          {/* 5. Left Editorial Typography Block */}
          <div
            className="absolute left-[3.5%] top-[50%] z-20 max-w-[24%]"
            style={{ transform: "translateY(-50%)" }}
          >
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-heading text-[clamp(1.75rem,2.8vw,3.15rem)] uppercase leading-[0.94] tracking-tight text-white drop-shadow-md">
                <span className="block whitespace-nowrap">PENSÉ DANS</span>
                <span className="mt-1 block whitespace-nowrap font-heading text-[#C7D400]">
                  CHAQUE DÉTAIL
                </span>
              </h1>

              {/* Lime accent bar */}
              <div className="mt-4 h-1 w-14 bg-[#C7D400] shadow-[0_0_12px_rgba(204,255,0,0.5)]" />

              {/* Editorial narrative */}
              <div className="mt-5 space-y-2.5 font-sans text-[clamp(0.78rem,0.85vw,0.9rem)] leading-relaxed text-white/80 max-w-[320px]">
                <p>{t("Du tissu aux finitions, rien n’a été laissé au hasard.")}</p>
                <p>
                  {t(
                    "Un boxer conçu pour votre confort au quotidien, avec une attention particulière à chaque élément."
                  )}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  to="/notre-boxer"
                  className="group inline-flex items-center gap-3 bg-[#C7D400] px-6 py-3 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#071324] shadow-[0_6px_20px_-3px_rgba(204,255,0,0.45)] transition-all duration-300 hover:bg-[#d9ff33] hover:shadow-[0_10px_24px_-3px_rgba(204,255,0,0.6)] hover:scale-[1.02]"
                >
                  <span>{t("DÉCOUVRIR NOS DÉTAILS")}</span>
                  <ChevronRight className="h-4 w-4 stroke-[3] transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* 6. Four Detail Callout Cards */}
          {CALLOUTS.map((c, index) => (
            <motion.div
              key={c.id}
              initial={reduce ? undefined : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group absolute z-20 pointer-events-auto"
              style={c.cardStyle}
            >
              <div className="flex flex-col">
                {/* Thumbnail container completely filled by photo */}
                <div
                  className={`relative overflow-hidden rounded-[13px] border-[1.5px] border-[#C7D400] bg-[#071324] shadow-[0_8px_20px_-6px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-[1.03] ${c.frameClass}`}
                >
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Text below thumbnail */}
                <div className="mt-2 text-left">
                  <h3 className="text-[11.5px] font-bold uppercase tracking-wider text-white">
                    {t(c.title)}
                  </h3>
                  {c.subtitle && (
                    <p className="mt-0.5 text-[10px] text-white/75 font-medium">
                      {t(c.subtitle)}
                    </p>
                  )}
                  <p className="mt-0.5 -mx-1 max-w-[190px] rounded-[3px] bg-[#071324]/60 px-1 text-[10px] leading-snug text-[#C7D400]">
                    {t(c.desc)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* 7. Handwritten script quote on the stone slab */}
          <div
            className="pointer-events-none absolute right-[5%] bottom-[13%] z-20 select-none text-left -rotate-[3deg]"
            style={{ maxWidth: "340px" }}
          >
            <motion.div
              initial={reduce ? undefined : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
            >
              <p className="font-script text-[clamp(1.5rem,2.1vw,2.25rem)] leading-none text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                Plus qu’un boxer,
              </p>
              <p className="font-script text-[clamp(1.5rem,2.1vw,2.25rem)] leading-none text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] mt-1.5">
                une attention à chaque détail.
              </p>
              {/* Neon lime curved brush underline */}
              <svg
                viewBox="0 0 140 12"
                className="mt-1 h-3 w-32 text-[#C7D400]"
                fill="none"
              >
                <path
                  d="M4 9 C35 3, 85 4, 136 7"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          </div>

          {/* 8. Integrated Bottom Trust / Features Bar */}
          <div className="absolute inset-x-0 bottom-0 z-30 h-[76px] flex items-center border-t border-white/10 bg-gradient-to-r from-[#071324]/95 via-[#071324]/90 via-50% to-[#071324]/40">
            <div className="w-full px-8 xl:px-14">
              <div className="grid grid-cols-4 items-center">
                {TRUST_ITEMS.map((item, i) => (
                  <div
                    key={item.line1}
                    className={`flex items-center gap-3.5 px-4 ${
                      i > 0 ? "border-l border-white/15" : ""
                    }`}
                  >
                    <div className="shrink-0 text-white/95">
                      <item.icon className="h-7 w-7 xl:h-8 xl:w-8" />
                    </div>
                    <div className="flex flex-col text-[11px] font-bold uppercase tracking-[0.14em] text-white leading-tight">
                      <span>{t(item.line1)}</span>
                      <span className="text-white/80 font-semibold">{t(item.line2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MOBILE & TABLET ADAPTIVE LAYOUT
          ========================================================================= */}
      <div className="relative block lg:hidden">
        {/* Background Image Container */}
        <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9]">
          <img
            src="/hero-origin.jpeg"
            alt="The Aviator — Boxer premium"
            width="800"
            height="600"
            fetchpriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[center_68%] scale-105"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 px-6 pt-4 pb-8">
          <h1 className="font-heading text-3xl sm:text-4xl uppercase leading-[0.95] tracking-tight text-white">
            PENSÉ DANS
            <span className="mt-1 block font-heading text-[#C7D400]">
              CHAQUE DÉTAIL
            </span>
          </h1>

          <div className="mt-3.5 h-1 w-12 bg-[#C7D400]" />

          <div className="mt-4 space-y-2 text-sm leading-relaxed text-white/80">
            <p>{t("Du tissu aux finitions, rien n’a été laissé au hasard.")}</p>
            <p>
              {t(
                "Un boxer conçu pour votre confort au quotidien, avec une attention particulière à chaque élément."
              )}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/notre-boxer"
              className="inline-flex w-full items-center justify-center gap-3 bg-[#C7D400] px-6 py-3.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#071324] shadow-lg shadow-[#C7D400]/30"
            >
              <span>{t("DÉCOUVRIR NOS DÉTAILS")}</span>
              <ChevronRight className="h-4 w-4 stroke-[3]" />
            </Link>
          </div>

          {/* 4 Detail Callout Cards in grid */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {CALLOUTS.map((c) => (
              <div key={c.id} className="flex flex-col">
                <div className="overflow-hidden rounded-xl border-[1.5px] border-[#C7D400] bg-[#071324]">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="h-20 w-full object-cover"
                  />
                </div>
                <h3 className="mt-2 text-[11px] font-bold uppercase tracking-wider text-white">
                  {t(c.title)}
                </h3>
                {c.subtitle && (
                  <p className="text-[10px] text-white/70">{t(c.subtitle)}</p>
                )}
                <p className="mt-0.5 -mx-1 rounded-[3px] bg-[#071324]/60 px-1 text-[10px] leading-tight text-[#C7D400]">
                  {t(c.desc)}
                </p>
              </div>
            ))}
          </div>

          {/* Handwritten script on mobile */}
          <div className="mt-8 text-center">
            <p className="font-script text-2xl leading-none text-white/90">
              Plus qu’un boxer, une attention à chaque détail.
            </p>
            <div className="mx-auto mt-1 h-0.5 w-24 bg-[#C7D400]" />
          </div>
        </div>

        {/* Mobile Trust Bar */}
        <div className="border-t border-white/10 bg-[#071324] px-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {TRUST_ITEMS.map((item) => (
              <div key={item.line1} className="flex items-center gap-2.5">
                <item.icon className="h-6 w-6 shrink-0 text-white" />
                <div className="text-[10px] font-bold uppercase tracking-wider text-white leading-tight">
                  <p>{t(item.line1)}</p>
                  <p className="text-white/70">{t(item.line2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}