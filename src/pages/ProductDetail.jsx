import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Cloud,
  Leaf,
  Layers,
  ShieldCheck,
  ShoppingBag,
  Truck,
  MapPin,
  CreditCard,
  Ruler,
  Check,
  ChevronDown,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import { useCart } from "@/lib/cart-context";
import { useLanguage } from "@/lib/language";
import { usePageMeta, useJsonLd, SITE_URL } from "@/lib/seo";
import { fetchProductBySlug, fetchColors, FALLBACK_COLORS } from "@/lib/store";

const PRODUCT_IMAGES = [
  { url: "/products/aviator-navy.jpg", label: "Bleu Marine", alt: "THE AVIATOR Boxer Bleu Marine — Vue face" },
  { url: "/products/aviator-black.jpg", label: "Noir", alt: "THE AVIATOR Boxer Noir — Vue face" },
  { url: "/products/aviator-white.jpg", label: "Blanc", alt: "THE AVIATOR Boxer Blanc — Vue face" },
  { url: "/products/aviator-pack-duo.jpg", label: "Pack Duo", alt: "THE AVIATOR Pack 2 Boxers avec packaging" },
  { url: "/products/aviator-navy-contrast.jpg", label: "Bleu Marine Liseré", alt: "THE AVIATOR Boxer Bleu Marine liseré contrasté" },
];

const COLOR_IMAGE_MAP = {
  "Bleu marine": 0,
  "Noir": 1,
  "Blanc": 2,
  "Bleu royal": 3,
  "Gris chiné": 4,
  "Bleu marine / bande blanche": 0,
  "Bleu marine / bande blanc": 0,
};

const DEFAULT_SIZES = ["M", "L", "XL", "XXL"];

export default function ProductDetail() {
  const [liveProduct, setLiveProduct] = useState(null);
  const [colorsList, setColorsList] = useState(FALLBACK_COLORS);
  const [activeImg, setActiveImg] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [selectedGlobalSize, setSelectedGlobalSize] = useState("L");

  // Independent color & size selection for Boxer 1 and Boxer 2
  const [boxer1Color, setBoxer1Color] = useState("Bleu marine");
  const [boxer1Size, setBoxer1Size] = useState("L");
  const [boxer2Color, setBoxer2Color] = useState("Blanc");
  const [boxer2Size, setBoxer2Size] = useState("L");

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeBoxerSelect, setActiveBoxerSelect] = useState(null); // 1 or 2 or null

  const { addItem } = useCart();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    fetchProductBySlug("the-aviator-boxer")
      .then((p) => {
        if (p) setLiveProduct(p);
      })
      .catch(() => {});

    const refreshColors = () => {
      fetchColors()
        .then((colors) => {
          if (Array.isArray(colors) && colors.length > 0) {
            setColorsList(colors);
            setBoxer1Color((prev) => (colors.some((c) => c.name === prev) ? prev : colors[0].name));
            setBoxer2Color((prev) => (colors.some((c) => c.name === prev) ? prev : (colors[1]?.name || colors[0].name)));
          }
        })
        .catch(() => {});
    };

    refreshColors();
    window.addEventListener("aviator-colors-updated", refreshColors);
    window.addEventListener("storage", refreshColors);
    return () => {
      window.removeEventListener("aviator-colors-updated", refreshColors);
      window.removeEventListener("storage", refreshColors);
    };
  }, []);

  const sizes = (liveProduct?.sizes && liveProduct.sizes.length > 0) ? liveProduct.sizes : DEFAULT_SIZES;

  const handleColor1Select = (colorName) => {
    setBoxer1Color(colorName);
    if (COLOR_IMAGE_MAP[colorName] !== undefined) {
      setActiveImg(COLOR_IMAGE_MAP[colorName]);
    }
  };

  const handleColor2Select = (colorName) => {
    setBoxer2Color(colorName);
    if (COLOR_IMAGE_MAP[colorName] !== undefined) {
      setActiveImg(COLOR_IMAGE_MAP[colorName]);
    }
  };

  usePageMeta({
    title: `${liveProduct?.name || "THE AVIATOR BOXER — Pack de 2"} à ${liveProduct?.price || 99} DH`,
    description:
      "Pack de 2 Boxers THE AVIATOR à 99 DH. 95% coton, 5% élasthanne. Choisissez vos 2 couleurs et vos tailles. Livraison partout au Maroc.",
  });

  const handleGlobalSizeChange = (s) => {
    setSelectedGlobalSize(s);
    setBoxer1Size(s);
    setBoxer2Size(s);
  };

  const handleAddToCart = () => {
    addItem({
      productId: liveProduct?.id || "the-aviator-boxer",
      slug: liveProduct?.slug || "the-aviator-boxer",
      name: liveProduct?.name || "THE AVIATOR BOXER — Pack de 2",
      image: (liveProduct?.images && liveProduct.images[0]) || PRODUCT_IMAGES[0].url,
      price: liveProduct?.price || 99,
      quantity: 1,
      stock: liveProduct?.stock || 100,
      category: "Boxers",
      packDetails: {
        boxer1: { color: boxer1Color, size: boxer1Size },
        boxer2: { color: boxer2Color, size: boxer2Size },
      },
    });
    navigate("/panier");
  };

  const nextImg = () => {
    setActiveImg((prev) => (prev + 1) % PRODUCT_IMAGES.length);
  };

  const prevImg = () => {
    setActiveImg((prev) => (prev - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);
  };

  const boxer1ColorObj = colorsList.find((c) => c.name === boxer1Color) || colorsList[1] || { name: boxer1Color, hex: "#07132B" };
  const boxer2ColorObj = colorsList.find((c) => c.name === boxer2Color) || colorsList[3] || { name: boxer2Color, hex: "#FFFFFF" };

  return (
    <div className="bg-[#FAF9F5] text-[#0A1128] min-h-screen py-10 lg:py-16 font-sans">
      <div className="container-edge max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: GALLERY + BENEFIT BADGES                    */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div className="flex gap-4 items-start">
              {/* Vertical Thumbnail Strip */}
              <div className="flex flex-col gap-3 shrink-0">
                {PRODUCT_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImg(idx)}
                    className={`w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden border-2 transition-all ${
                      activeImg === idx
                        ? "border-[#C7D400] shadow-md scale-105"
                        : "border-gray-200 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image Viewer */}
              <div className="relative flex-1 aspect-[4/5] bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm group">
                <Image
                  src={PRODUCT_IMAGES[activeImg].url}
                  alt={PRODUCT_IMAGES[activeImg].alt}
                  className="w-full h-full object-contain p-4 transition-all duration-300 cursor-zoom-in"
                  onClick={() => setIsZoomOpen(true)}
                />

                {/* Left/Right Carousel Arrows */}
                <button
                  type="button"
                  onClick={prevImg}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center text-[#0A1128] hover:bg-white transition-colors"
                  aria-label="Image précédente"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={nextImg}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center text-[#0A1128] hover:bg-white transition-colors"
                  aria-label="Image suivante"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Zoom Icon */}
                <button
                  type="button"
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center text-gray-600 hover:text-[#0A1128]"
                  aria-label="Agrandir l'image"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Lightbox Modal */}
            {isZoomOpen && (
              <div
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
                onClick={() => setIsZoomOpen(false)}
              >
                <div className="relative max-w-4xl max-h-[90vh] bg-white p-4 rounded-sm shadow-2xl flex flex-col items-center">
                  <img
                    src={PRODUCT_IMAGES[activeImg].url}
                    alt={PRODUCT_IMAGES[activeImg].alt}
                    className="max-h-[80vh] w-auto object-contain"
                  />
                  <p className="mt-3 text-xs font-bold text-gray-600 uppercase tracking-wider font-sans">
                    {PRODUCT_IMAGES[activeImg].alt}
                  </p>
                </div>
              </div>
            )}

            {/* 4 Feature Badges below gallery */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-200 text-center font-sans">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 text-[#0A1128]">
                  <Cloud className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0A1128] leading-tight font-sans">
                  95 % coton <br />
                  <span className="font-normal text-gray-500">5 % élasthanne</span>
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 text-[#0A1128]">
                  <Leaf className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0A1128] leading-tight font-sans">
                  Confort au <br />
                  <span className="font-normal text-gray-500">quotidien</span>
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 text-[#0A1128]">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0A1128] leading-tight font-sans">
                  Coupe et finitions <br />
                  <span className="font-normal text-gray-500">soignées</span>
                </span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 text-[#0A1128]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-bold text-[#0A1128] leading-tight font-sans">
                  Matière douce <br />
                  <span className="font-normal text-gray-500">et résistante</span>
                </span>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: PURCHASE & BUILDER PANEL                    */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 bg-white p-7 sm:p-9 border border-gray-200 rounded-sm shadow-sm font-sans">
            <span className="text-[10px] font-medium tracking-[0.25em] text-gray-400 uppercase block font-sans">
              THE AVIATOR
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-normal text-[#07132B] mt-1 tracking-tight leading-tight">
              {liveProduct?.name || "THE AVIATOR BOXER"}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2 font-sans">
              <div className="flex text-[#C7D400]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-sans font-light">
                {liveProduct?.rating || "4.8"} ({liveProduct?.review_count || 120} avis clients)
              </span>
            </div>

            {/* Price & Subtitle */}
            <div className="mt-4 pb-4 border-b border-gray-100">
              <div className="font-serif text-2xl sm:text-3xl font-normal text-[#07132B]">
                Pack de 2 — <span className="text-[#C7D400] font-serif">{liveProduct?.price ? `${liveProduct.price} DH` : "99 DH"}</span>
              </div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400 mt-1 font-sans">
                95 % COTON • 5 % ÉLASTHANNE
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed font-sans font-light">
                {liveProduct?.description || "Pensé dans chaque détail pour offrir confort, maintien et liberté de mouvement au quotidien."}
              </p>
            </div>

            {/* 1. CHOISISSEZ VOTRE TAILLE */}
            <div className="mt-6 font-sans">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#07132B] font-sans">
                  1. CHOISISSEZ VOTRE TAILLE
                </span>
                <Link
                  to="/guide-des-tailles"
                  className="text-xs text-gray-500 hover:text-[#07132B] flex items-center gap-1.5 underline underline-offset-2 font-sans"
                >
                  <Ruler className="h-3.5 w-3.5" /> Guide des tailles
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleGlobalSizeChange(size)}
                    className={`py-2.5 text-xs font-bold uppercase rounded-sm border transition-all font-sans ${
                      selectedGlobalSize === size
                        ? "bg-[#07132B] text-white border-[#07132B] shadow-xs"
                        : "bg-white text-[#07132B] border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. CHOISISSEZ VOS 2 COULEURS */}
            <div className="mt-7 font-sans">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#07132B] font-sans">
                  2. CHOISISSEZ VOS 2 COULEURS
                </span>
                <span className="text-[11px] font-medium text-gray-500 font-sans truncate max-w-[200px]">
                  {boxer1Color} + {boxer2Color}
                </span>
              </div>

              {/* Swatches reference visual row */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4 p-2.5 rounded-sm bg-[#FAF9F5] border border-gray-200/80">
                {colorsList.map((c) => {
                  const is1 = boxer1Color === c.name;
                  const is2 = boxer2Color === c.name;
                  const isBicolor = c.bicolor || Boolean(c.hex2);
                  return (
                    <button
                      key={c.id || c.name}
                      type="button"
                      onClick={() => {
                        if (!is1 && !is2) {
                          handleColor1Select(c.name);
                        } else if (is1 && !is2) {
                          handleColor2Select(c.name);
                        } else {
                          handleColor1Select(c.name);
                        }
                      }}
                      className={`flex flex-col items-center justify-between p-2 rounded transition-all group ${
                        is1 || is2 ? "bg-white shadow-xs ring-1 ring-[#07132B]" : "hover:bg-white/80"
                      }`}
                      title={c.name}
                    >
                      <div className="relative mb-1.5">
                        <div
                          className={`w-7 h-7 rounded-full shadow-inner transition-transform group-hover:scale-105 ${
                            c.border || c.hex?.toUpperCase() === "#FFFFFF" ? "border border-gray-300" : "border border-black/10"
                          }`}
                          style={isBicolor
                            ? { background: `linear-gradient(135deg, ${c.hex} 50%, ${c.hex2 || '#FFFFFF'} 50%)` }
                            : { backgroundColor: c.hex }
                          }
                        />
                        {(is1 || is2) && (
                          <span className="absolute -bottom-1 -right-1 bg-[#07132B] text-[#C7D400] text-[8px] font-bold px-1 rounded-full border border-white leading-none py-0.5 shadow-2xs">
                            {is1 && is2 ? "1+2" : is1 ? "1" : "2"}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-sans font-medium text-center leading-tight text-[#07132B] break-words w-full px-0.5">
                        {c.displayName || c.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dual Boxer Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 font-sans">
                {/* Boxer 1 Selector */}
                <div className="border border-gray-200 p-3.5 rounded-sm bg-[#FAF9F5]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-sans">
                      BOXER 1
                    </span>
                    <span className="text-[10px] font-semibold text-[#07132B] truncate max-w-[130px] font-sans">
                      {boxer1Color}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-white border border-gray-200 px-3 py-2 rounded-sm relative shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`w-4 h-4 rounded-full shrink-0 ${
                          boxer1ColorObj.border || boxer1ColorObj.hex?.toUpperCase() === "#FFFFFF" ? "border border-gray-300" : "border border-black/10"
                        }`}
                        style={boxer1ColorObj.bicolor || boxer1ColorObj.hex2
                          ? { background: `linear-gradient(135deg, ${boxer1ColorObj.hex} 50%, ${boxer1ColorObj.hex2 || '#FFFFFF'} 50%)` }
                          : { backgroundColor: boxer1ColorObj.hex }
                        }
                      />
                      <select
                        value={boxer1Color}
                        onChange={(e) => handleColor1Select(e.target.value)}
                        className="w-full text-xs font-semibold text-[#07132B] bg-transparent focus:outline-none cursor-pointer pr-4 font-sans truncate"
                      >
                        {colorsList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.displayName || c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Individual size selector */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-500 font-sans">
                    <span>Taille :</span>
                    <div className="flex gap-1">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setBoxer1Size(s)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans transition-colors ${
                            boxer1Size === s
                              ? "bg-[#07132B] text-white shadow-2xs"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Boxer 2 Selector */}
                <div className="border border-gray-200 p-3.5 rounded-sm bg-[#FAF9F5]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-sans">
                      BOXER 2
                    </span>
                    <span className="text-[10px] font-semibold text-[#07132B] truncate max-w-[130px] font-sans">
                      {boxer2Color}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-white border border-gray-200 px-3 py-2 rounded-sm relative shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className={`w-4 h-4 rounded-full shrink-0 ${
                          boxer2ColorObj.border || boxer2ColorObj.hex?.toUpperCase() === "#FFFFFF" ? "border border-gray-300" : "border border-black/10"
                        }`}
                        style={boxer2ColorObj.bicolor || boxer2ColorObj.hex2
                          ? { background: `linear-gradient(135deg, ${boxer2ColorObj.hex} 50%, ${boxer2ColorObj.hex2 || '#FFFFFF'} 50%)` }
                          : { backgroundColor: boxer2ColorObj.hex }
                        }
                      />
                      <select
                        value={boxer2Color}
                        onChange={(e) => handleColor2Select(e.target.value)}
                        className="w-full text-xs font-semibold text-[#07132B] bg-transparent focus:outline-none cursor-pointer pr-4 font-sans truncate"
                      >
                        {colorsList.map((c) => (
                          <option key={c.id || c.name} value={c.name}>
                            {c.displayName || c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Individual size selector */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-500 font-sans">
                    <span>Taille :</span>
                    <div className="flex gap-1">
                      {sizes.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setBoxer2Size(s)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-sans transition-colors ${
                            boxer2Size === s
                              ? "bg-[#07132B] text-white shadow-2xs"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Box & Add to Cart */}
            <div className="mt-7 pt-5 border-t border-gray-100 font-sans">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#07132B]/60 font-sans">
                  VOTRE PACK — 2 BOXERS
                </span>
                <span className="font-serif text-3xl font-normal text-[#C7D400] leading-none">
                  99 DH
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full bg-[#C7D400] hover:brightness-95 text-[#07132B] font-bold py-4 px-6 rounded-sm flex items-center justify-center gap-2 transition-all uppercase tracking-wider text-xs font-sans shadow-xs hover:shadow-md hover:scale-[1.01]"
              >
                <ShoppingBag className="h-4 w-4" /> AJOUTER AU PANIER
              </button>

              {/* Delivery Badges Row */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-[11px] text-gray-500 gap-2 font-sans">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-3.5 w-3.5 text-[#C7D400]" />
                  Livraison partout au Maroc
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#C7D400]" />
                  Livraison gratuite à Casablanca
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5 text-[#C7D400]" />
                  Paiement à la livraison
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Watermark */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] text-gray-400 font-sans">
          <span>THE AVIATOR BOXERS</span>
          <span>CONFORT &nbsp;·&nbsp; STYLE &nbsp;·&nbsp; AU QUOTIDIEN</span>
        </div>
      </div>
    </div>
  );
}