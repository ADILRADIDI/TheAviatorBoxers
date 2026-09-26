import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, CreditCard, Cloud, ShieldCheck, Ruler, Star, Check } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { fetchColors, FALLBACK_COLORS, SIZES } from "@/lib/store";
import { useAsync } from "@/lib/useAsync";

export default function PackBuilderSection() {
  const { t } = useLanguage();
  const [colors, setColors] = useState(FALLBACK_COLORS);

  useEffect(() => {
    const update = () => {
      fetchColors()
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) setColors(res);
        })
        .catch(() => {});
    };
    update();
    window.addEventListener("aviator-colors-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("aviator-colors-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const allColors = colors && colors.length > 0 ? colors : FALLBACK_COLORS;

  const [selectedColor, setSelectedColor] = useState(allColors[0]?.name || "Noir");
  const [selectedSize, setSelectedSize] = useState("L");

  // Keep active color valid when DB colors load
  useEffect(() => {
    if (allColors.length > 0 && !allColors.some((c) => c.name === selectedColor)) {
      setSelectedColor(allColors[0].name);
    }
  }, [allColors, selectedColor]);

  return (
    <section className="bg-[#FAF9F6] py-16 lg:py-24 border-b border-border/50 font-sans">
      <div className="container-edge">
        {/* Top Header Row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-10">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground/90 font-sans">
              {t("NOS BOXERS")}
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#07132B]">
              Composez votre{" "}
              <span className="font-serif text-[#C7D400] relative inline-block">
                pack
              </span>
            </h2>
            <p className="mt-2 text-sm text-[#07132B]/70 font-sans">
              {t("Choisissez vos couleurs et votre taille préférées. Le confort reste le même.")}
            </p>
          </div>

          {/* Right Header Badges + CTA Button */}
          <div className="flex flex-wrap items-center gap-5 lg:gap-6 font-sans">
            {/* Cotton / Colors */}
            <div className="flex items-center gap-2.5">
              <Cloud className="h-5 w-5 text-[#07132B]/70 shrink-0" strokeWidth={1.5} />
              <div className="text-[11px] leading-tight font-sans">
                <p className="font-bold text-[#07132B] uppercase">{t(`${allColors.length || 6} COULEURS`)}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{t("COMBINAISONS LIBRES")}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            {/* Delivery */}
            <div className="flex items-center gap-2.5">
              <Truck className="h-5 w-5 text-[#07132B]/70 shrink-0" strokeWidth={1.5} />
              <div className="text-[11px] leading-tight font-sans">
                <p className="font-bold text-[#07132B] uppercase">{t("LIVRAISON MAROC")}</p>
                <p className="text-[10px] text-muted-foreground">{t("Gratuite à Casablanca")}</p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            {/* Payment */}
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-5 w-5 text-[#07132B]/70 shrink-0" strokeWidth={1.5} />
              <div className="text-[11px] leading-tight font-sans">
                <p className="font-bold text-[#07132B] uppercase">{t("PAIEMENT")}</p>
                <p className="text-[10px] text-muted-foreground uppercase">{t("À LA LIVRAISON")}</p>
              </div>
            </div>

            {/* Top CTA Button */}
            <Link
              to="/notre-boxer"
              className="ml-auto lg:ml-2 inline-flex items-center gap-2 bg-[#C7D400] hover:brightness-95 text-[#07132B] px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md hover:scale-[1.01] font-sans"
            >
              <span>{t("COMPOSER MON PACK")}</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {/* Card 01 — CHOISISSEZ VOTRE COULEUR */}
          <div className="flex flex-col justify-between bg-[#F2F1EC] rounded-sm border border-black/5 p-6 shadow-sm transition-all hover:shadow-md">
            <div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-3xl font-normal text-[#07132B] border-b-2 border-[#C7D400] pb-0.5 leading-none">
                  01
                </span>
                <div className="text-xs font-bold uppercase tracking-wider text-[#07132B] leading-tight font-sans">
                  <p>{t("CHOISISSEZ")}</p>
                  <p>{t("VOTRE COULEUR")}</p>
                </div>
              </div>

              {/* Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white rounded-sm shadow-inner mb-5">
                <img
                  src="/Composer-votre-pack/1.jpeg"
                  alt="Choisissez votre couleur The Aviator"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Color Swatches Grid */}
            <div className="pt-2">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {allColors.map((col) => {
                  const isSelected = selectedColor === col.name;
                  const isBicolor = col.bicolor || Boolean(col.hex2);
                  return (
                    <button
                      key={col.id || col.name}
                      type="button"
                      onClick={() => setSelectedColor(col.name)}
                      className={`flex flex-col items-center gap-1.5 p-1 rounded transition-all min-w-[56px] max-w-[86px] ${
                        isSelected ? "scale-105" : "opacity-80 hover:opacity-100"
                      }`}
                      title={col.name}
                    >
                      <span
                        className={`relative h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "ring-2 ring-offset-2 ring-[#07132B] shadow-sm"
                            : "border border-black/20"
                        }`}
                        style={isBicolor
                          ? { background: `linear-gradient(135deg, ${col.hex} 50%, ${col.hex2 || '#FFFFFF'} 50%)` }
                          : { backgroundColor: col.hex }
                        }
                      >
                        {isSelected && (
                          <Check
                            className={`h-3 w-3 ${
                              col.hex?.toLowerCase() === "#ffffff" || col.hex?.toLowerCase() === "#fff"
                                ? "text-[#07132B]"
                                : "text-white"
                            }`}
                            strokeWidth={3}
                          />
                        )}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#07132B] text-center leading-tight break-words font-sans w-full">
                        {t(col.displayName || col.name)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 02 — CHOISISSEZ VOTRE TAILLE */}
          <div className="flex flex-col justify-between bg-[#F2F1EC] rounded-sm border border-black/5 p-6 shadow-sm transition-all hover:shadow-md relative">
            <div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-3xl font-normal text-[#07132B] border-b-2 border-[#C7D400] pb-0.5 leading-none">
                  02
                </span>
                <div className="text-xs font-bold uppercase tracking-wider text-[#07132B] leading-tight font-sans">
                  <p>{t("CHOISISSEZ")}</p>
                  <p>{t("VOTRE TAILLE")}</p>
                </div>
              </div>

              {/* Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white rounded-sm shadow-inner mb-5">
                <img
                  src="/Composer-votre-pack/2.jpeg"
                  alt="Choisissez votre taille The Aviator"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Size Selector Buttons */}
            <div className="pt-2">
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 rounded-sm font-bold text-xs uppercase tracking-wider transition-all border font-sans ${
                        isSelected
                          ? "bg-[#07132B] text-white border-[#07132B] shadow-sm"
                          : "bg-white text-[#07132B] border-black/15 hover:border-black/40"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground uppercase tracking-wider font-sans">
                {t("Guide des tailles disponible")}
              </p>
            </div>

            {/* Bottom accent indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-[#C7D400]" />
          </div>

          {/* Card 03 — VOTRE PACK DE 2 */}
          <div className="flex flex-col justify-between bg-[#F2F1EC] rounded-sm border border-black/5 p-6 shadow-sm transition-all hover:shadow-md">
            <div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-serif text-3xl font-normal text-[#07132B] border-b-2 border-[#C7D400] pb-0.5 leading-none">
                  03
                </span>
                <div className="text-xs font-bold uppercase tracking-wider text-[#07132B] font-sans">
                  {t("VOTRE PACK DE 2")}
                </div>
              </div>

              {/* Photo */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white rounded-sm shadow-inner mb-4">
                <img
                  src="/Composer-votre-pack/3.jpeg"
                  alt="Votre pack de 2 Boxers The Aviator 99 DH"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Description note & live pack tag */}
            <div className="text-center pt-1 font-sans">
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-black/10 shadow-xs mb-2">
                <span className="text-[11px] font-bold text-[#07132B] font-sans">
                  {selectedColor} • Taille {selectedSize}
                </span>
              </div>
              <p className="text-xs text-[#07132B]/80 font-medium italic font-sans">
                {t("Pack de 2 boxers premium à 99 DH.")}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Trust & CTA Row */}
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between border-t border-black/10 pt-6 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 flex-1">
            {/* Feature 1 */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-[#07132B]/20 rounded-full">
                <ShieldCheck className="h-4 w-4 text-[#07132B]" />
              </div>
              <div className="text-xs font-sans">
                <p className="font-bold uppercase tracking-wider text-[#07132B]">{t("QUALITÉ PREMIUM")}</p>
                <p className="text-[11px] text-muted-foreground">{t("Coton doux et résistant")}</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-[#07132B]/20 rounded-full">
                <Ruler className="h-4 w-4 text-[#07132B]" />
              </div>
              <div className="text-xs font-sans">
                <p className="font-bold uppercase tracking-wider text-[#07132B]">{t("COUPE CONFORTABLE")}</p>
                <p className="text-[11px] text-muted-foreground">{t("Pensée pour le quotidien")}</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-[#07132B]/20 rounded-full">
                <Star className="h-4 w-4 text-[#07132B]" />
              </div>
              <div className="text-xs font-sans">
                <p className="font-bold uppercase tracking-wider text-[#07132B]">{t("SATISFACTION CLIENT")}</p>
                <p className="text-[11px] text-muted-foreground">{t("Votre confort, notre priorité")}</p>
              </div>
            </div>
          </div>

          {/* Bottom Button */}
          <Link
            to="/notre-boxer"
            className="inline-flex items-center justify-center gap-2 bg-[#C7D400] hover:brightness-95 text-[#07132B] px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md hover:scale-[1.01] shrink-0 font-sans"
          >
            <span>{t("COMPOSER MON PACK")}</span>
            <ArrowRight className="h-4 w-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>
    </section>
  );
}