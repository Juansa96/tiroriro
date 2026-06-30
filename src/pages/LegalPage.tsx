import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LegalPage = () => (
  <>
    <Helmet><meta name="robots" content="noindex,follow" /></Helmet>
    <Navbar />
    <main className="pt-20">
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-4">Aviso Legal</h1>
          <span className="section-line !mx-0" />

          <div className="mt-12 space-y-10 text-sm text-muted-foreground font-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Titular del sitio web</h2>
              <p><strong>Juan Sangrador Torres</strong> (nombre comercial: Tiroriro Home)</p>
              <p className="mt-1">DNI: 45577829V</p>
              <p className="mt-1">Domicilio: Calle Cristóbal Colón, 11 · 28660 Boadilla del Monte, Madrid (España)</p>
              <p className="mt-1">Email: info@tirorirohome.com</p>
              <p>Teléfono: +34 660 786 453</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Actividad</h2>
              <p>Diseño y venta de mobiliario tapizado artesanal hecho a mano en España: cabeceros, bancos, pufs, mesas de centro, cojines y pantallas de lámpara a medida. Actualmente la web se utiliza únicamente para recibir consultas y solicitudes de presupuesto (no se realizan ventas ni cobros online).</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Propiedad intelectual</h2>
              <p>Todos los textos, imágenes, diseños y contenidos de este sitio web son propiedad de Tiroriro Home o se utilizan con la debida autorización. Queda prohibida su reproducción total o parcial sin consentimiento previo por escrito del titular.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Ley aplicable</h2>
              <p>Este sitio web se rige por la legislación española. Para cualquier controversia derivada del uso de este sitio, serán competentes los juzgados y tribunales correspondientes al domicilio del titular (Boadilla del Monte, Madrid).</p>
            </div>

            <p className="text-xs text-muted-foreground/70">Última actualización: 30 de junio de 2026.</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default LegalPage;
