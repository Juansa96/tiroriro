import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

const ContactPage = () => (
  <>
    <Navbar />
    <main className="pt-20">
      <ContactForm />
    </main>
    <Footer />
  </>
);

export default ContactPage;
