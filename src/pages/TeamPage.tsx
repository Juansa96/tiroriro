import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import SEO from "@/components/SEO";

const TeamPage = () => (
  <>
    <SEO
      title="Quiénes somos | Tiroriro · Tapizado artesanal"
      description="Conoce el equipo detrás de Tiroriro: artesanos especializados en tapizado a medida, hecho a mano en España con más de 60 telas disponibles."
      canonical="https://tirorirohome.com/nosotros"
    />
    <Navbar />
    <main className="pt-20 md:pt-24">
      <TeamSection />
    </main>
    <Footer />
  </>
);

export default TeamPage;
