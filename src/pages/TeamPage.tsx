import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";

const TeamPage = () => (
  <>
    <Navbar />
    <main className="pt-20 md:pt-24">
      <TeamSection />
    </main>
    <Footer />
  </>
);

export default TeamPage;
