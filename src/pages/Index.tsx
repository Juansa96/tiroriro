import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBanner from "@/components/TrustBanner";
import ProductsPreview from "@/components/ProductsPreview";
import HowItWorks from "@/components/HowItWorks";
import WhyTiroRiro from "@/components/WhyTiroRiro";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => (
  <>
    <SEO
      title="Tiroriro | Cabeceros tapizados a medida · Hecho en España"
      description="Cabeceros, pufs, mesas y pantallas tapizados a medida y hechos a mano en España. Más de 60 telas disponibles. Elige tela, tamaño y acabado — en 15 días en tu casa."
      canonical="https://tirorirohome.com/"
    />
    <Navbar />
    <main>
      <HeroSection />
      <TrustBanner />
      <ProductsPreview />
      <HowItWorks />
      <WhyTiroRiro />
      <Testimonials />
      <ContactForm />
      <FAQSection />
    </main>
    <Footer />
  </>
);

export default Index;
