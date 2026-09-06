import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VirtualTryOn from "@/components/VirtualTryOn";
import SEO from "@/components/SEO";

const TryOnPage = () => (
  <>
    <SEO
      title="Probador virtual: ve un cabecero en tu dormitorio | Tiroriro"
      description="Sube una foto de tu dormitorio y mira cómo queda un cabecero tapizado a medida antes de pedirlo. Elige forma, medidas y tela. Hecho a mano en España."
      canonical="https://tirorirohome.com/probador"
    />
    <Navbar />
    <main className="pt-20">
      <VirtualTryOn />
    </main>
    <Footer />
  </>
);

export default TryOnPage;
