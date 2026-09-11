import { Link } from "react-router-dom";
import { ArrowUpRight, Tag } from "lucide-react";
import { useAsync } from "@/lib/useAsync";
import { fetchActivePromotion } from "@/lib/store";
import { useLanguage } from "@/lib/language";

export default function PromotionBanner() {
  const { data: promotion } = useAsync(() => fetchActivePromotion(), []);
  const { language } = useLanguage();
  if (!promotion) return null;

  const title = language === "darija" ? (promotion.titleDarija || promotion.title_darija || promotion.titleFr || promotion.title_fr) : (promotion.titleFr || promotion.title_fr);
  const subtitle = language === "darija" ? (promotion.subtitleDarija || promotion.subtitle_darija || promotion.subtitleFr || promotion.subtitle_fr) : (promotion.subtitleFr || promotion.subtitle_fr);
  const badge = language === "darija" ? (promotion.badgeDarija || promotion.badge_darija || promotion.badgeFr || promotion.badge_fr) : (promotion.badgeFr || promotion.badge_fr);
  const ctaLabel = language === "darija" ? (promotion.ctaLabelDarija || promotion.cta_label_darija || promotion.ctaLabelFr || promotion.cta_label_fr) : (promotion.ctaLabelFr || promotion.cta_label_fr);
  const imageUrl = promotion.imageUrl || promotion.image_url;
  const backgroundColor = promotion.backgroundColor || promotion.background_color || "#00285E";
  const textColor = promotion.textColor || promotion.text_color || "#FFFFFF";
  const accentColor = promotion.accentColor || promotion.accent_color || "#C7D400";
  const ctaUrl = promotion.ctaUrl || promotion.cta_url;
  const couponCode = promotion.couponCode || promotion.coupon_code;
  if (!title) return null;

  const style = {
    backgroundColor,
    color: textColor,
    "--promo-accent": accentColor,
    backgroundImage: imageUrl ? `linear-gradient(90deg, ${backgroundColor} 20%, transparent), url(${imageUrl})` : undefined,
  };

  return (
    <section className="relative overflow-hidden bg-cover bg-center" style={style} aria-label={promotion.title_fr}>
      <div className="container-edge flex min-h-44 items-center py-10 sm:min-h-52">
        <div className="max-w-xl">
          {(badge || couponCode) && <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--promo-accent)" }}><Tag className="h-3.5 w-3.5" />{badge || `Code ${couponCode}`}</span>}
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-2 text-sm opacity-80 sm:text-base">{subtitle}</p>}
          {ctaUrl && ctaLabel && <Link to={ctaUrl} className="mt-5 inline-flex items-center gap-2 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-navy">{ctaLabel}<ArrowUpRight className="h-4 w-4" /></Link>}
        </div>
      </div>
    </section>
  );
}