import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VirtualTryOn from "@/components/VirtualTryOn";

const TryOnPage = () => (
  <>
    <Navbar />
    <main className="pt-20">
      <VirtualTryOn />
    </main>
    <Footer />
  </>
);

export default TryOnPage;
