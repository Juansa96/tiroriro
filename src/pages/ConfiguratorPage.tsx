import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductConfigurator from "@/components/ProductConfigurator";

const ConfiguratorPage = () => (
  <>
    <Navbar />
    <main className="pt-16 md:pt-20">
      <ProductConfigurator />
    </main>
    <Footer />
  </>
);

export default ConfiguratorPage;
