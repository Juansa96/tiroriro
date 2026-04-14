import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsPreview from "@/components/ProductsPreview";
import HowItWorks from "@/components/HowItWorks";
import WhyTiroRiro from "@/components/WhyTiroRiro";
import TeamSection from "@/components/TeamSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <ProductsPreview />
      <HowItWorks />
      <WhyTiroRiro />
      <TeamSection />
      <ContactForm />
    </main>
    <Footer />
  </>
);

export default Index;
