import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsPreview from "@/components/ProductsPreview";
import HowItWorks from "@/components/HowItWorks";
import WhyTiroRiro from "@/components/WhyTiroRiro";
import TeamSection from "@/components/TeamSection";
import Testimonials from "@/components/Testimonials";
import FAQSection from "@/components/FAQSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import SectionCTA from "@/components/SectionCTA";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <ProductsPreview />
      <SectionCTA to="/configurador" label="Diseña el tuyo" />
      <HowItWorks />
      <SectionCTA to="/configurador" label="Empieza ahora" />
      <WhyTiroRiro />
      <SectionCTA to="/contacto" label="Encarga el tuyo" />
      <TeamSection />
      <SectionCTA to="/contacto" label="Hablamos" />
      <Testimonials />
      <FAQSection />
      <ContactForm />
    </main>
    <Footer />
  </>
);

export default Index;
