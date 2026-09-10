import AnnouncementBar from "@/components/storefront/AnnouncementBar";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import PackPreview from "@/components/home/PackPreview";
import Benefits from "@/components/home/Benefits";
import BrandStory from "@/components/home/BrandStory";
import Certifications from "@/components/home/Certifications";
import ReviewsSection from "@/components/home/ReviewsSection";
import FAQSection from "@/components/home/FAQSection";
import Newsletter from "@/components/home/Newsletter";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";

export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <TrustBar />
      <FeaturedCollection />
      <PackPreview />
      <Benefits />
      <BrandStory />
      <Certifications />
      <ReviewsSection />
      <FAQSection />
      <Newsletter />
      <WhatsAppCTA />
    </>
  );
}