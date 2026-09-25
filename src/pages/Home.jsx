import Hero from "@/components/home/Hero";
import PackBuilderSection from "@/components/home/PackBuilderSection";
import BrandStory from "@/components/home/BrandStory";
import SatisfactionSection from "@/components/home/SatisfactionSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import FAQSection from "@/components/home/FAQSection";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import { usePageMeta, useJsonLd, breadcrumbJsonLd, SITE_URL, FALLBACK_TITLE } from "@/lib/seo";

export default function Home() {
  usePageMeta({ title: FALLBACK_TITLE, type: "website" });
  useJsonLd(breadcrumbJsonLd([{ name: "Accueil", url: SITE_URL }]));
  return (
    <>
      <Hero />
      <PackBuilderSection />
      <BrandStory />
      <SatisfactionSection />
      <ReviewsSection />
      <FAQSection />
      <WhatsAppCTA />
    </>
  );
}