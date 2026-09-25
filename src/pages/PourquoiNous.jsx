import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Cloud,
  MoveHorizontal,
  MapPin,
  Sparkles,
  Scissors,
  ShieldCheck,
  Check,
  Layers,
  Leaf,
  Shield,
  Star,
  Settings,
  Package,
  Truck,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import Reveal from "@/components/storefront/Reveal";
import { Image } from "@/components/ui/image";
import { useLanguage } from "@/lib/language";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

function CottonBollIcon({ className = "h-5 w-5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 21a6 6 0 0 0 6-6c0-1.8-1.2-3.3-2.8-3.8A4.5 4.5 0 0 0 6.8 11.2C5.2 11.7 4 13.2 4 15a6 6 0 0 0 6 6" />
      <path d="M12 11.5V21" />
      <path d="M9.5 17.5l2.5-3 2.5 3" />
    </svg>
  );
}

function UnderwearIcon({ className = "h-5 w-5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 6h16v5l-4 7h-8L4 11V6z" />
      <path d="M4 9h16" />
      <path d="M12 9v9" />
    </svg>
  );
}

function SeamStitchIcon({ className = "h-5 w-5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="5" y1="19" x2="19" y2="5" strokeDasharray="3 3" />
    </svg>
  );
}

function CogIcon({ className = "h-5 w-5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function StarOutlineIcon({ className = "h-5 w-5", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function MoroccoRibbonIcon({ className = "h-4 w-4", ...props }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M95.33,7.39 L93.69,6.9 L92.06,4.93 L89.49,5.17 L88.08,1.97 L86.21,2.46 L84.81,4.43 L79.91,4.19 L76.87,4.93 L74.07,3.45 L71.73,0.0 L68.22,0.74 L65.65,8.13 L62.15,14.29 L60.05,16.01 L53.97,18.23 L52.1,21.67 L49.07,24.38 L48.6,27.83 L46.03,30.79 L45.33,33.0 L45.56,36.21 L44.63,38.42 L46.5,40.89 L46.03,43.1 L40.19,50.25 L31.78,56.4 L28.27,55.91 L26.17,57.39 L23.36,64.78 L17.76,68.23 L14.72,76.85 L8.18,82.02 L8.41,83.74 L5.61,88.92 L2.8,90.39 L0.0,97.04 L0.0,99.51 L2.1,100.0 L3.74,97.29 L25.23,97.29 L25.93,87.68 L27.34,86.45 L32.71,85.96 L33.41,85.22 L33.64,71.18 L52.34,71.18 L53.04,70.2 L53.5,52.96 L61.21,48.03 L63.79,48.52 L66.59,47.54 L72.2,48.28 L75.7,43.84 L83.41,39.16 L84.81,36.7 L84.81,35.71 L83.18,34.24 L84.35,32.27 L88.32,31.77 L89.25,29.56 L93.93,28.82 L99.3,29.31 L100.0,24.88 L97.9,22.91 L96.26,17.49 L96.73,13.79 Z" />
    </svg>
  );
}

function WovenRibbonIcon({ className = "h-4 w-4", ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 3v18" />
      <path d="M17 3v18" />
      <path d="M3 7h18" />
      <path d="M3 17h18" />
    </svg>
  );
}

function ElasticIcon({ className = "h-4 w-4", ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 8h13" />
      <path d="M14 5l3 3-3 3" />
      <path d="M20 16H7" />
      <path d="M10 13l-3 3 3 3" />
    </svg>
  );
}

const RIBBON_ITEMS = [
  { icon: Cloud, label: "95% COTON" },
  { icon: ElasticIcon, label: "5% ÉLASTHANNE" },
  { icon: MoroccoRibbonIcon, label: "CONÇU AU MAROC" },
  { icon: WovenRibbonIcon, label: "BANDE TISSÉE" },
  { icon: Scissors, label: "COUPE ÉTUDIÉE" },
  { icon: ShieldCheck, label: "FINITIONS SOIGNÉES" },
];

const PROMISES = [
  {
    num: "01",
    icon: CottonBollIcon,
    title: "Un tissu pensé pour le confort",
    desc: "95% coton et 5% élasthanne pour associer douceur et liberté de mouvement.",
  },
  {
    num: "02",
    icon: UnderwearIcon,
    title: "Une coupe travaillée",
    desc: "Une coupe pensée pour accompagner les mouvements et rester confortable au quotidien.",
  },
  {
    num: "03",
    icon: SeamStitchIcon,
    title: "Des détails qui font la différence",
    desc: "Bande tissée, coutures soignées et pièce supplémentaire à l'entrejambe : chaque élément a sa raison d'être.",
  },
  {
    num: "04",
    icon: CogIcon,
    title: "Une fabrication soignée",
    desc: "De la coupe aux finitions, chaque étape reçoit une attention particulière.",
  },
  {
    num: "05",
    icon: StarOutlineIcon,
    title: "Un boxer pensé pour être porté chaque jour",
    desc: "Parce qu'avant de vous le proposer, nous voulions créer un boxer que nous aurions nous-mêmes envie de porter.",
  },
];

const DETAILS_5 = [
  {
    num: "01",
    title: "Bande tissée",
    tag: "CONFORT & MAINTIEN",
    desc: "Une bande élastique tissée, résistante et confortable, pensée pour bien tenir à la taille tout en restant agréable à porter.",
    img: "/images/promesse-qualite-pack.jpg",
  },
  {
    num: "02",
    title: "Double tissu à l'avant",
    tag: "CONFORT RENFORCÉ",
    desc: "Une construction travaillée à l'avant pour offrir plus de confort, de maintien et une meilleure durabilité.",
    img: "/images/diff-front-pouch.jpg",
  },
  {
    num: "03",
    title: "Pièce supplémentaire",
    tag: "LIBERTÉ DE MOUVEMENT",
    desc: "Une pièce ajoutée à l'entrejambe pour accompagner vos mouvements et améliorer le confort tout au long de la journée.",
    img: "/images/fabric-macro-close.jpg",
  },
  {
    num: "04",
    title: "Coutures & finitions",
    tag: "PENSÉES DANS LE DÉTAIL",
    desc: "Des coutures renforcées et des finitions soignées pour un rendu net, durable et agréable à porter, même après de nombreux lavages.",
    img: "/images/diff-flatlock.jpg",
  },
  {
    num: "05",
    title: "Étiquette tissée",
    tag: "PLUS AGRÉABLE À PORTER",
    desc: "Une étiquette douce et discrète à l'arrière, pensée pour limiter les irritations et vous offrir un maximum de confort.",
    img: "/images/diff-label.jpg",
  },
];

const STEPS_TIMELINE = [
  {
    num: "01",
    title: "PRÉPARATION DU TISSU",
    desc: "Le tissu est sélectionné et préparé avec soin avant de passer à la confection.",
    img: "/images/timeline-1.jpg",
  },
  {
    num: "02",
    title: "DÉCOUPE",
    desc: "Chaque pièce est découpée avec précision selon la coupe THE AVIATOR.",
    img: "/images/timeline-2.jpg",
  },
  {
    num: "03",
    title: "ASSEMBLAGE & COUTURE",
    desc: "Les différentes pièces sont assemblées avec attention, de la poche avant à la pièce supplémentaire à l'entrejambe.",
    img: "/images/timeline-3.jpg",
  },
  {
    num: "04",
    title: "BANDE & FINITIONS",
    desc: "La bande tissée THE AVIATOR est soigneusement posée et les dernières finitions sont réalisées pour un rendu propre et durable.",
    img: "/images/timeline-4.jpg",
  },
  {
    num: "05",
    title: "VÉRIFICATION & PRÉPARATION",
    desc: "Chaque boxer est contrôlé dans le détail avant d'être plié et préparé pour son emballage.",
    img: "/images/timeline-5.jpg",
  },
];

export default function PourquoiNous() {
  const { t } = useLanguage();

  usePageMeta({
    title: "Pourquoi nous — The Aviator",
    description:
      "Ce qui rend The Aviator différent : tissu premium 95% coton, finitions soignées, coupe anatomique et une garantie satisfaction sur chaque boxer.",
  });
  useJsonLd(
    breadcrumbJsonLd([
      { name: "Accueil", url: SITE_URL },
      { name: "Pourquoi nous", url: `${SITE_URL}/pourquoi-nous` },
    ])
  );

  return (
    <div className="bg-[#FAF9F5] text-[#0A1128] overflow-hidden font-sans">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-[#07132B] text-white pt-14 pb-0 lg:pt-16 font-sans">
        {/* Subtle Waistband Background Photo */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-luminosity overflow-hidden flex items-center justify-center">
          <img
            src="/images/diff-waistband.jpg"
            alt="The Aviator Waistband"
            className="w-full h-full object-cover object-center filter blur-[1px] brightness-75 scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07132B] via-[#07132B]/80 to-[#07132B]/90" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07132B]/60 via-transparent to-[#07132B]" />
        </div>

        <div className="container-edge relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex flex-col mb-3">
                <span className="text-xs sm:text-sm font-bold tracking-[0.25em] text-white/70 uppercase font-sans">
                  NOTRE ADN
                </span>
                <div className="mt-1.5 h-[2px] w-8 bg-[#C7D400]" />
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.08]">
                Pourquoi <br />
                THE AVIATOR <span className="text-[#C7D400]">?</span>
              </h1>
              <p className="mt-3.5 text-base sm:text-lg text-white/75 font-sans font-light max-w-xl">
                Parce que le confort se joue dans les détails.
              </p>
            </div>

            <div className="lg:col-span-5 relative flex flex-col items-end justify-center font-sans">
              <div className="text-right">
                <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-white/60 uppercase font-sans leading-tight">
                  CONFORT<br />
                  STYLE<br />
                  AU QUOTIDIEN
                </p>
                <div className="w-8 h-[2px] bg-[#C7D400] ml-auto mt-2 mb-2" />
                <p className="font-script text-3xl lg:text-4xl text-[#C7D400] leading-tight">
                  More<br />
                  than just<br />
                  boxers
                </p>
                <svg viewBox="0 0 100 12" className="w-20 h-2.5 ml-auto text-[#C7D400] mt-0.5" fill="none">
                  <path d="M2 9 C30 2, 70 4, 98 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Ribbon */}
        <div className="relative z-10 border-t border-white/10 bg-[#050e1f] py-4 font-sans">
          <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white/90 font-sans">
              {RIBBON_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <item.icon className="h-5 w-5 text-[#C7D400]" />
                  <span>{item.label}</span>
                  {idx < RIBBON_ITEMS.length - 1 && (
                    <span className="hidden md:inline-block text-[#C7D400] font-bold ml-3 mr-1">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOTRE PROMESSE QUALITÉ */}
      <section className="py-16 lg:py-24 bg-[#FAF9F5] border-b border-gray-100 font-sans relative overflow-hidden">
        <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Section Header */}
          <div className="text-left mb-12">
            <div className="inline-flex flex-col mb-2">
              <span className="text-xs font-bold tracking-[0.25em] text-[#0A1128]/70 uppercase font-sans">
                ENGAGEMENT
              </span>
              <div className="mt-1.5 h-[2px] w-8 bg-[#C7D400]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-normal text-[#0A1128] tracking-tight mt-2 leading-[1.1]">
              Notre promesse qualité
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2.5 font-sans font-light max-w-2xl leading-relaxed">
              Chaque détail a été pensé avec une seule priorité :<br />
              votre confort au quotidien.
            </p>
          </div>

          <div className="grid items-center gap-8 lg:gap-10 lg:grid-cols-12 relative">
            {/* Left Visual: Quality Promise Collage (Enlarged) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-200/90 shadow-xl max-w-[580px] lg:max-w-none w-full transition-transform duration-300 hover:scale-[1.01]">
                <img
                  src="/images/review-experience.jpg"
                  alt="Notre promesse qualité - Boxers The Aviator"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Right List: 5 Promises */}
            <div className="lg:col-span-6 space-y-3.5 pl-0 lg:pl-4">
              {PROMISES.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 sm:gap-5 pb-4 pt-1 border-b border-gray-200/60 last:border-0"
                >
                  <span className="font-sans text-2xl sm:text-3xl font-light text-slate-400/80 w-8 shrink-0 leading-none pt-1 select-none">
                    {item.num}
                  </span>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#07132B]/5 border border-gray-200/70 flex items-center justify-center shrink-0 text-[#07132B]">
                    <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#07132B]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#0A1128] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-500 mt-1 leading-relaxed font-sans font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vertical watermarks on right edge */}
            <div className="hidden xl:block absolute -right-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-[10px] uppercase tracking-[0.3em] text-gray-400 font-semibold select-none pointer-events-none">
              THE AVIATOR
            </div>
            <div className="hidden xl:block absolute -right-6 bottom-0 text-[9px] uppercase tracking-[0.2em] text-gray-400 font-bold select-none pointer-events-none text-right">
              CONFORT<br />AU QUOTIDIEN
            </div>
          </div>
        </div>
      </section>

      {/* 3. COMPOSITION / LE CONFORT COMMENCE PAR LE TISSU */}
      <section className="bg-[#07132B] text-white py-16 lg:py-24 relative overflow-hidden font-sans">
        <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Left Fabric Macro */}
            <div className="lg:col-span-6 relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-[4/3] bg-[#050e1f] border border-white/10">
                <Image
                  src="/images/fabric-macro-white-pouch.jpg"
                  alt="Détails du tissu THE AVIATOR - 95% Coton 5% Élasthanne"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Text & Progress Bars */}
            <div className="lg:col-span-6">
              <div className="inline-flex flex-col mb-2">
                <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-white/70 uppercase font-sans">
                  COMPOSITION
                </span>
                <div className="mt-1.5 h-[2px] w-8 bg-[#C7D400]" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal mt-2 leading-tight">
                Le confort commence <br />
                <span className="text-[#C7D400] font-serif">par le tissu.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/80 font-sans font-light leading-relaxed">
                Un mélange de 95% coton et 5% élasthanne, pensé pour offrir l'équilibre parfait
                entre douceur, respirabilité et liberté de mouvement au quotidien.
              </p>

              {/* Progress Bars */}
              <div className="mt-8 space-y-5 font-sans">
                <div>
                  <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-[#C7D400]" /> 95% COTON
                    </span>
                    <span className="text-[#C7D400] font-sans font-bold text-sm">95%</span>
                  </div>
                  <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C7D400] rounded-full w-[95%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold uppercase tracking-wider mb-2">
                    <span className="flex items-center gap-2">
                      <ElasticIcon className="h-5 w-5 text-[#C7D400]" /> 5% ÉLASTHANNE
                    </span>
                    <span className="text-[#C7D400] font-sans font-bold text-sm">5%</span>
                  </div>
                  <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C7D400] rounded-full w-[5%]" />
                  </div>
                </div>
              </div>

              {/* 3 Spec Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                <div className="bg-white/[0.04] border border-white/10 p-4 rounded-sm">
                  <Leaf className="h-5 w-5 text-[#C7D400] mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-sans">
                    DOUX AU TOUCHER
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-1.5 leading-relaxed font-sans font-light">
                    Une matière agréable à porter au quotidien.
                  </p>
                </div>
                <div className="bg-white/[0.04] border border-white/10 p-4 rounded-sm">
                  <ElasticIcon className="h-5 w-5 text-[#C7D400] mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-sans">
                    SOUPLE & EXTENSIBLE
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-1.5 leading-relaxed font-sans font-light">
                    Le tissu accompagne naturellement les mouvements.
                  </p>
                </div>
                <div className="bg-white/[0.04] border border-white/10 p-4 rounded-sm">
                  <Shield className="h-5 w-5 text-[#C7D400] mb-2" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-sans">
                    PENSÉ POUR LE QUOTIDIEN
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-1.5 leading-relaxed font-sans font-light">
                    Un équilibre entre confort, maintien et liberté de mouvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Bottom Watermark */}
        <div className="mt-16 pt-6 border-t border-white/10 flex items-center justify-between container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs uppercase tracking-[0.25em] text-white/50 font-sans">
          <span>THE AVIATOR BOXERS</span>
          <span className="text-white/70">CONFORT • STYLE • AU QUOTIDIEN</span>
        </div>
      </section>

      {/* 4. CE QUI FAIT LA DIFFÉRENCE */}
      <section className="py-16 lg:py-24 bg-white border-b border-gray-100 font-sans">
        <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex flex-col items-center mb-2">
              <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#0A1128]/70 uppercase font-sans">
                QUALITÉ & DÉTAILS
              </span>
              <div className="mt-1.5 h-[2px] w-8 bg-[#C7D400]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0A1128] mt-2">
              Ce qui fait la <span className="text-[#C7D400] font-serif">différence</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-3 font-sans font-light">
              Chaque détail a été pensé pour un confort au quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {DETAILS_5.map((d, idx) => (
              <div
                key={idx}
                className="bg-[#FAF9F5] border border-gray-200/90 rounded-md overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={d.img}
                    alt={d.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col font-sans">
                  <span className="inline-block w-8 h-8 rounded-full border-2 border-[#C7D400] text-[#07132B] font-bold text-sm flex items-center justify-center mb-2.5 font-sans shadow-xs shrink-0">
                    {d.num}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#0A1128] leading-snug">
                    {d.title}
                  </h3>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0A1128]/50 mt-1.5 font-sans">
                    {d.tag}
                  </span>
                  <p className="text-sm sm:text-[15px] text-gray-700 mt-3 leading-relaxed font-sans font-normal">
                    {d.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-gray-200 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-gray-400 font-sans">
            <span>THE AVIATOR BOXERS</span>
            <span className="text-[#07132B] font-medium">CONFORT • STYLE • AU QUOTIDIEN</span>
          </div>
        </div>
      </section>

      {/* 5. TIMELINE: DU TISSU AU BOXER */}
      <section className="pt-20 lg:pt-28 pb-0 bg-[#FAF9F5] font-sans">
        <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 lg:mb-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex flex-col items-center mb-2">
              <span className="text-sm font-semibold tracking-[0.25em] text-[#0A1128]/70 uppercase font-sans">
                NOTRE SAVOIR-FAIRE
              </span>
              <div className="mt-1.5 h-[2px] w-10 bg-[#C7D400]" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-[#0A1128] mt-3">
              Du tissu au <span className="text-[#C7D400] font-serif">boxer</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mt-4 font-sans font-light max-w-2xl mx-auto leading-relaxed">
              Chaque étape compte. De la préparation du tissu aux dernières finitions, chaque détail
              est travaillé avec soin.
            </p>
          </div>

          {/* Connected Steps Cards */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-7 lg:gap-8">
              {STEPS_TIMELINE.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center font-sans bg-white/70 sm:bg-transparent p-4 sm:p-0 rounded-lg sm:rounded-none border border-gray-200/60 sm:border-0 shadow-xs sm:shadow-none hover:-translate-y-1 transition-transform duration-300">
                  <div className="aspect-[4/3] w-full rounded-md overflow-hidden bg-gray-200 mb-5 shadow-md border border-gray-200/80 group">
                    <Image
                      src={step.img}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#C7D400] bg-white text-[#07132B] font-bold text-sm flex items-center justify-center mb-3.5 shadow-sm font-sans shrink-0">
                    {step.num}
                  </span>
                  <h3 className="font-sans text-sm sm:text-base font-bold uppercase tracking-wider text-[#0A1128] min-h-[40px] flex items-center justify-center">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-gray-600 mt-2.5 leading-relaxed font-sans font-light">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navy Bottom Ribbon */}
        <div className="bg-[#07132B] text-white py-5 border-t border-b border-white/10 font-sans">
          <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs sm:text-sm uppercase tracking-[0.25em] text-white/75">
            <span>THE AVIATOR BOXERS</span>
            <span className="text-white font-semibold">MADE BY US IN MOROCCO</span>
            <span>CONFORT • STYLE • AU QUOTIDIEN</span>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM HERO CTA */}
      <section className="bg-[#07132B] text-white py-16 lg:py-20 relative overflow-hidden font-sans">
        <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight">
                Votre confort <br />
                <span className="text-[#C7D400] font-serif">commence ici.</span>
              </h2>
              <p className="mt-4 text-base sm:text-lg text-white/80 font-sans font-light max-w-lg">
                Composez votre pack de 2 boxers et choisissez vos couleurs.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="border border-white/20 bg-white/5 px-6 py-3.5 rounded-sm">
                  <span className="text-xs font-semibold uppercase tracking-widest text-white/60 block font-sans">
                    PACK DE 2 À
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-normal text-[#C7D400]">99 DH</span>
                </div>
                <Link
                  to="/notre-boxer"
                  className="bg-[#C7D400] hover:bg-[#6d8d00] text-[#07132B] font-bold px-8 py-4 rounded-sm flex items-center gap-2.5 transition-colors uppercase tracking-wider text-sm font-sans shadow-md hover:shadow-lg"
                >
                  COMPOSER MON PACK <ArrowRight className="h-5 w-5 stroke-[2.5]" />
                </Link>
              </div>

              {/* Delivery badges */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs sm:text-sm text-white/80 font-sans">
                <span className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#C7D400]" /> Livraison partout au Maroc
                </span>
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#C7D400]" /> Livraison gratuite à Casablanca
                </span>
                <span className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#C7D400]" /> Paiement à la livraison
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative overflow-hidden rounded-sm aspect-[4/3] bg-white shadow-2xl border border-white/10">
                <Image
                  src="/images/bottom-cta-pack.jpg"
                  alt="Pack de 2 Boxers THE AVIATOR"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}