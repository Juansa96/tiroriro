import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBanner from "@/components/TrustBanner";
import ProductsPreview from "@/components/ProductsPreview";
import HowItWorks from "@/components/HowItWorks";
import WhyTiroRiro from "@/components/WhyTiroRiro";
import TeamSection from "@/components/TeamSection";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <TrustBanner />
      <ProductsPreview />
      <TeamSection />
      <WhyTiroRiro />
      <HowItWorks />
      <Testimonials />
      <ContactForm />
      <FAQSection />
    </main>
    <Footer />
  </>
);

export default Index;
