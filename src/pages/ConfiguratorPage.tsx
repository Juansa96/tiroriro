import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductConfigurator from "@/components/ProductConfigurator";
import SEO from "@/components/SEO";

const ConfiguratorPage = () => (
  <>
    <SEO
      title="Diseña tu cabecero o puf a medida | Configurador | Tiroriro"
      description="Configura tu cabecero, puf, mesa o pantalla tapizados a medida. Elige forma, medidas y tela — el precio se actualiza en tiempo real. Hecho a mano en España."
      canonical="https://tirorirohome.com/configurador"
    />
    <Navbar />
    <main className="pt-16 md:pt-20">
      <ProductConfigurator />
    </main>
    <Footer />
  </>
);

export default ConfiguratorPage;
