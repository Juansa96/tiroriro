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
                <li><strong>cookies_accepted</strong> — Recuerda si has interactuado con el aviso de cookies (localStorage).</li>
                <li><strong>cookies_consent</strong> — Guarda tu decisión ("granted" o "denied") sobre las cookies analíticas (localStorage).</li>
              </ul>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Cookies de terceros</h2>
              <p>Utilizamos <strong>Google Analytics 4</strong> (Google Ireland Ltd.) para medir de forma agregada cómo se usa la web (páginas vistas, dispositivo, país). Se carga <strong>únicamente si aceptas</strong> las cookies analíticas en el banner, aplicando <strong>Google Consent Mode v2</strong> (por defecto todo está denegado). Cookies que puede instalar: <code>_ga</code>, <code>_ga_&lt;ID&gt;</code>. Puedes cambiar tu decisión borrando las cookies del sitio en tu navegador.</p>
              <p className="mt-2 text-xs">Más info: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">política de privacidad de Google</a>.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">¿Cómo gestionar las cookies?</h2>
              <p>Puedes configurar tu navegador para bloquear o eliminar cookies en cualquier momento. Ten en cuenta que si desactivas las cookies técnicas, algunas funciones de la web podrían no estar disponibles.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Responsable</h2>
              <p>Juan Sangrador Torres (Tiroriro Home) · DNI 45577829V · Calle Cristóbal Colón, 11 · 28660 Boadilla del Monte, Madrid · info@tirorirohome.com</p>
            </div>

            <p className="text-xs text-muted-foreground/70">Última actualización: 1 de julio de 2026.</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default CookiesPage;
