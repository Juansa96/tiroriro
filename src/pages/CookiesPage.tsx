import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CookiesPage = () => (
  <>
    <Helmet><meta name="robots" content="noindex,follow" /></Helmet>
    <Navbar />
    <main className="pt-20">
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-4">Política de Cookies</h1>
          <span className="section-line !mx-0" />

          <div className="mt-12 space-y-10 text-sm text-muted-foreground font-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">¿Qué son las cookies?</h2>
              <p>Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Sirven para recordar tus preferencias y mejorar tu experiencia de navegación.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">¿Qué cookies utilizamos?</h2>
              <p>En Tiroriro Home solo utilizamos cookies técnicas estrictamente necesarias para el correcto funcionamiento de la web. Estas cookies no recogen información personal ni se utilizan con fines publicitarios.</p>
              <ul className="mt-3 list-disc list-inside space-y-1">
                <li><strong>cookies_accepted</strong> — Recuerda si has aceptado el aviso de cookies (localStorage)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Cookies de terceros</h2>
              <p>Actualmente no utilizamos cookies de terceros ni herramientas de analítica. Si en el futuro incorporamos Google Analytics u otra herramienta similar, actualizaremos esta política, te lo informaremos mediante el banner de cookies y solo se cargarán previa aceptación expresa por tu parte (Consent Mode v2).</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">¿Cómo gestionar las cookies?</h2>
              <p>Puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento. Ten en cuenta que si desactivas las cookies técnicas, algunas funciones de la web podrían no estar disponibles.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Responsable</h2>
              <p>Juan Sangrador Torres (Tiroriro Home) · DNI 45577829V · Calle Cristóbal Colón, 11 · 28660 Boadilla del Monte, Madrid · info@tirorirohome.com</p>
            </div>

            <p className="text-xs text-muted-foreground/70">Última actualización: 30 de junio de 2026.</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default CookiesPage;
