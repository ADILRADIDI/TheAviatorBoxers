import { Link } from "react-router-dom";
import { ArrowRight, Diamond, Leaf, Headphones } from "lucide-react";

// Satisfaction section — 3 photo cards matching reference design
export default function SatisfactionSection() {
  const cards = [
    {
      image: "/images/satisfaction-finitions.jpg",
      tag: "DES FINITIONS\nQUI FONT\nLA DIFFÉRENCE",
      Icon: Diamond,
      title: "Qualité soignée",
      desc: "Chaque détail du boxer est travaillé avec attention, de la coupe aux finitions, pour un rendu net et durable.",
    },
    {
      image: "/images/satisfaction-confort.jpg",
      tag: "UNE MATIÈRE\nAGRÉABLE\nÀ PORTER",
      Icon: Leaf,
      title: "Confort au quotidien",
      desc: "95% coton et 5% élasthanne, une coupe travaillée et des détails pensés pour accompagner vos mouvements.",
    },
    {
      image: "/images/satisfaction-support.jpg",
      tag: "UNE ÉQUIPE\nÀ VOTRE\nÉCOUTE",
      Icon: Headphones,
      title: "Besoin d'aide ?",
      desc: "Une question sur votre taille, votre pack ou votre commande ? Notre équipe est disponible pour vous accompagner.",
      cta: true,
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-24 border-b border-gray-100 font-sans">
      <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="inline-flex flex-col items-center mb-2">
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.25em] text-[#07132B]/60">
              SATISFACTION
            </span>
            <div className="mt-1.5 h-[2px] w-8 bg-[#C7D400]" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#07132B] mt-2">
            Pensé pour votre{" "}
            <span className="text-[#C7D400] font-serif">satisfaction</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto font-sans font-light">
            Notre priorité : vous offrir un boxer de qualité, confortable et un service à votre écoute.
          </p>
        </div>

        {/* 3 photo cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={i}
              className="group flex flex-col rounded-sm overflow-hidden border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Photo + Overlay Label */}
              <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Subtle top vignette for crystal clear contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/20 to-transparent pointer-events-none" />

                {/* Top-left frosted badge */}
                <div className="absolute top-3.5 left-3.5 z-10 rounded-xs bg-[#07132B]/85 backdrop-blur-md border border-white/20 px-3 py-2 shadow-md">
                  <div className="h-[2px] w-5 bg-[#C7D400] mb-1.5" />
                  <p className="text-[9px] font-sans font-semibold uppercase tracking-[0.2em] text-white leading-tight whitespace-pre-line">
                    {card.tag}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="relative flex flex-col flex-1 p-6 pt-9 text-center items-center bg-white font-sans">
                {/* Floating circular icon badge */}
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex h-14 w-14 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md text-[#C7D400] group-hover:scale-110 group-hover:shadow-lg transition-transform duration-300">
                  <card.Icon className="h-6 w-6 text-[#C7D400]" strokeWidth={2} />
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#0A1128] mt-1">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-sm sm:text-[15px] lg:text-[16px] leading-relaxed text-[#07132B]/80 max-w-sm font-sans font-normal">
                  {card.desc}
                </p>

                {card.cta && (
                  <Link
                    to="/contact"
                    className="mt-6 w-full max-w-[200px] inline-flex items-center justify-center gap-2 bg-[#C7D400] hover:bg-[#a8b400] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#07132B] transition-colors rounded-sm shadow-xs font-sans"
                  >
                    NOUS CONTACTER
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Section bottom watermark line */}
        <div className="mt-14 flex items-center justify-between border-t border-gray-200/80 pt-4 text-[9px] uppercase tracking-[0.25em] text-gray-400 font-sans">
          <span>THE AVIATOR BOXERS</span>
          <span className="hidden sm:inline">MADE BY US &nbsp; IN MOROCCO</span>
          <span>CONFORT &nbsp;·&nbsp; STYLE &nbsp;·&nbsp; AU QUOTIDIEN</span>
        </div>
      </div>
    </section>
  );
}