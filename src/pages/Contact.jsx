import { Link } from "react-router-dom";
import {
  MessageCircle,
  Mail,
  Clock,
  Truck,
  ArrowUpRight,
  ArrowRight,
  PackageCheck,
  Ruler,
  RefreshCw,
} from "lucide-react";
import { STORE } from "@/lib/store";
import { useLanguage } from "@/lib/language";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";

export default function Contact() {
  const { t } = useLanguage();
  usePageMeta({
    title: "Contact — The Aviator",
    description:
      "Contactez The Aviator : WhatsApp, email et service client disponible 24h/24 et 7j/7. Livraison partout au Maroc, paiement à la livraison.",
  });
  useJsonLd(
    breadcrumbJsonLd([
      { name: "Accueil", url: SITE_URL },
      { name: "Contact", url: `${SITE_URL}/contact` },
    ])
  );

  return (
    <div className="bg-[#FAF9F5] text-[#0A1128] min-h-screen">
      {/* 1. TOP HEADER & CHANNELS */}
      <section className="pt-16 pb-12 text-center container-edge">
        <span className="text-[11px] font-bold tracking-[0.24em] text-[#0A1128]/50 uppercase">
          CONTACT
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#0A1128] mt-2">
          Nous sommes là <span className="text-[#C7D400]">pour vous.</span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-xl mx-auto font-light">
          Une question, une demande ou un conseil ? Notre équipe vous répond.
        </p>

        {/* 4 CHANNEL CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12 text-left">
          {/* Card 1: WhatsApp */}
          <a
            href={whatsappContactUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200/80 p-6 rounded-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0A1128] group-hover:bg-[#07132B] group-hover:text-white transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-[#0A1128] transition-colors" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A1128] block mb-1">
                WHATSAPP
              </span>
              <p className="text-xs text-gray-500 mb-3">Besoin d'une réponse rapide ?</p>
            </div>
            <span className="text-xs font-bold text-[#0A1128] flex items-center gap-1.5 border-b-2 border-[#C7D400] pb-0.5 self-start group-hover:text-[#07132B]">
              Écrivez-nous <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </a>

          {/* Card 2: E-Mail */}
          <a
            href={`mailto:${STORE.email}`}
            className="bg-white border border-gray-200/80 p-6 rounded-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0A1128] group-hover:bg-[#07132B] group-hover:text-white transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-[#0A1128] transition-colors" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A1128] block mb-1">
                E-MAIL
              </span>
              <p className="text-xs text-gray-500 mb-3">Questions & suivi de commande</p>
            </div>
            <span className="text-xs font-bold text-[#0A1128] truncate block">
              {STORE.email}
            </span>
          </a>

          {/* Card 3: Service Client */}
          <div className="bg-white border border-gray-200/80 p-6 rounded-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0A1128]">
                  <Clock className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A1128] block mb-1">
                SERVICE CLIENT
              </span>
              <p className="text-xs font-semibold text-[#0A1128] mb-1">
                24h / 24 · 7j / 7
              </p>
            </div>
            <p className="text-xs text-gray-500">
              Disponible 24h/24 et 7j/7 pour vous assister.
            </p>
          </div>

          {/* Card 4: Livraison */}
          <div className="bg-white border border-gray-200/80 p-6 rounded-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-center text-[#0A1128]">
                  <Truck className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A1128] block mb-1">
                LIVRAISON
              </span>
              <p className="text-xs text-gray-600 mb-1">Partout au Maroc</p>
              <p className="text-xs font-bold text-[#0A1128] flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#C7D400]" /> Gratuite à Casablanca
              </p>
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              Paiement à la livraison • 24–48h
            </p>
          </div>
        </div>
      </section>

      {/* 2. BOTTOM SECTION: 2 COLUMNS */}
      <section className="py-12 lg:py-20 container-edge">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Comment pouvons-nous vous aider ? */}
          <div className="lg:col-span-6">
            <span className="text-[11px] font-bold tracking-[0.24em] text-[#0A1128]/50 uppercase">
              SERVICE CLIENT
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0A1128] mt-2">
              Comment pouvons-nous vous aider ?
            </h2>
            <p className="text-sm text-gray-600 mt-2 mb-8 leading-relaxed">
              Retrouvez ici les sujets les plus fréquents. Si vous ne trouvez pas votre réponse,
              contactez notre équipe, nous serons ravis de vous aider.
            </p>

            <div className="space-y-4">
              {/* Item 1 */}
              <Link
                to="/faq"
                className="bg-white border-l-4 border-l-[#C7D400] border border-gray-200 p-5 rounded-sm flex items-center gap-4 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-sm bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 text-[#07132B] group-hover:bg-[#07132B] group-hover:text-white transition-colors">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-[#07132B]">
                    Suivi de commande
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Une question sur votre commande ou votre livraison ? Nous sommes là pour vous aider.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#07132B] group-hover:translate-x-1 transition-all shrink-0" />
              </Link>

              {/* Item 2 */}
              <Link
                to="/guide-des-tailles"
                className="bg-white border-l-4 border-l-[#C7D400] border border-gray-200 p-5 rounded-sm flex items-center gap-4 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-sm bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 text-[#07132B] group-hover:bg-[#07132B] group-hover:text-white transition-colors">
                  <Ruler className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-[#07132B]">
                    Taille & choix du pack
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Un doute sur votre taille ou vos couleurs ? Nous vous aidons à faire le bon choix.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#07132B] group-hover:translate-x-1 transition-all shrink-0" />
              </Link>

              {/* Item 3 */}
              <Link
                to="/livraison-retours"
                className="bg-white border-l-4 border-l-[#C7D400] border border-gray-200 p-5 rounded-sm flex items-center gap-4 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-sm bg-gray-50 flex items-center justify-center shrink-0 border border-gray-200 text-[#07132B] group-hover:bg-[#07132B] group-hover:text-white transition-colors">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-[#0A1128] group-hover:text-[#07132B]">
                    Livraison & politique d'hygiène
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Des questions sur la réception de votre commande ou notre politique ? Contactez notre équipe.
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#07132B] group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </div>
          </div>

          {/* Right Column: Navy Direct Contact Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#07132B] text-white p-7 sm:p-9 lg:p-10 rounded-sm relative overflow-hidden shadow-2xl min-h-[460px] flex flex-col justify-between">
              {/* Background Boxer Waistband image overlay fading cleanly */}
              <div className="absolute right-0 top-0 bottom-0 w-full sm:w-3/5 pointer-events-none overflow-hidden opacity-20 sm:opacity-30 mix-blend-luminosity">
                <img
                  src="/images/diff-waistband.jpg"
                  alt="The Aviator waistband"
                  className="h-full w-full object-cover object-center filter blur-[0.5px] scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#07132B] via-[#07132B]/85 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07132B] via-transparent to-[#07132B]/60" />
              </div>

              {/* Cursive handwritten accent in top-right clear area */}
              <div className="absolute right-6 sm:right-8 top-6 sm:top-8 z-20 pointer-events-none text-right select-none">
                <span className="font-script text-xl sm:text-2xl lg:text-3xl text-white/90 block leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  Toujours
                </span>
                <span className="font-script text-xl sm:text-2xl lg:text-3xl text-[#C7D400] block leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  à votre écoute !
                </span>
                <svg viewBox="0 0 100 12" className="w-16 sm:w-20 h-2 ml-auto text-[#C7D400] mt-1 opacity-80" fill="none">
                  <path d="M2 9 C30 2, 70 4, 98 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>

              <div className="relative z-20">
                <div className="inline-flex flex-col mb-3">
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.24em] text-white/60 uppercase block">
                    CONTACTEZ-NOUS DIRECTEMENT
                  </span>
                  <div className="mt-1 h-[2px] w-6 bg-[#C7D400]" />
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold mt-1">
                  Une question ? <br />
                  <span className="text-[#C7D400]">On vous répond.</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/75 mt-2.5 font-light leading-relaxed max-w-xs sm:max-w-sm">
                  Notre équipe est là pour vous accompagner dans votre expérience THE AVIATOR.
                </p>

                {/* Action Buttons */}
                <div className="mt-7 space-y-3 max-w-sm">
                  <a
                    href={whatsappContactUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#C7D400] hover:bg-[#b0bd00] text-[#0A1128] font-bold py-3.5 px-5 rounded-sm flex items-center justify-center gap-2 transition-all uppercase tracking-wider text-xs shadow-md group"
                  >
                    <MessageCircle className="h-4 w-4 fill-current" /> NOUS ÉCRIRE SUR WHATSAPP{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href={`mailto:${STORE.email}`}
                    className="w-full bg-[#050e1f]/80 backdrop-blur-sm border border-white/20 hover:border-white/50 text-white font-bold py-3.5 px-5 rounded-sm flex items-center justify-center gap-2 transition-all uppercase tracking-wider text-xs group"
                  >
                    <Mail className="h-4 w-4" /> NOUS ENVOYER UN E-MAIL <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Service Badges */}
              <div className="relative z-20 mt-8 pt-5 border-t border-white/10 flex flex-wrap items-center gap-2.5 sm:gap-3 text-[10px] font-bold tracking-widest text-white/50 uppercase">
                <span>TAILLES</span>
                <span>•</span>
                <span>COMMANDES</span>
                <span>•</span>
                <span>LIVRAISON</span>
                <span>•</span>
                <span>CONSEILS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Watermark Bar */}
        <div className="mt-20 pt-8 border-t border-gray-200 text-center flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-gray-400">
          <span>THE AVIATOR</span>
          <span className="text-[#07132B] font-bold">CONFORT • STYLE • AU QUOTIDIEN</span>
        </div>
      </section>
    </div>
  );
}