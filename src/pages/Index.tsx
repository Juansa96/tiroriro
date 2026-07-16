import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBanner from "@/components/TrustBanner";
import ProductsPreview from "@/components/ProductsPreview";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

// Lazy load de secciones bajo el fold para reducir el bundle inicial.
const ReviewsCarousel = lazy(() => import("@/components/ReviewsCarousel"));
const HowItWorks = lazy(() => import("@/components/HowItWorks"));
const WhyTiroRiro = lazy(() => import("@/components/WhyTiroRiro"));
const ContactForm = lazy(() => import("@/components/ContactForm"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const InstagramFeedTeaser = lazy(() => import("@/components/InstagramFeedTeaser"));

const Index = () => (
  <>
    <SEO
      title="Tiroriro | Cabeceros tapizados a medida · Hecho en España"
      description="Cabeceros, pufs, mesas y pantallas tapizados a medida y hechos a mano en España. Más de 60 telas disponibles. Elige tela, tamaño y acabado — en 20 días en tu casa."
      canonical="https://tirorirohome.com/"
    />
    <Navbar />
    <main>
      <HeroSection />
      <TrustBanner />
      <ProductsPreview />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <ReviewsCarousel />
        <HowItWorks />
        <WhyTiroRiro />
        <InstagramFeedTeaser />
        <ContactForm />
        <FAQSection />
      </Suspense>
    </main>
    <Footer />
  </>
);

export default Index;
