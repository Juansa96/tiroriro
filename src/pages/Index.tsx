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

const Index = () => (
  <>
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
