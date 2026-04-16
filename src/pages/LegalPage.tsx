import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LegalPage = () => (
  <>
    <Navbar />
    <main className="pt-20">
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-4">Aviso Legal</h1>
          <span className="section-line !mx-0" />

          <div className="mt-12 space-y-10 text-sm text-muted-foreground font-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Titular del sitio web</h2>
              <p>[Nombre completo] · [DNI — completar manualmente]</p>
              <p className="mt-1">Domicilio: España</p>
              <p>Email: contacto@tiroriro.com</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Actividad</h2>
              <p>Diseño y venta de mobiliario tapizado artesanal hecho a mano en España.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Propiedad intelectual</h2>
              <p>Todos los textos, imágenes, diseños y contenidos de este sitio web son propiedad de Tiroriro o se utilizan con la debida autorización. Queda prohibida su reproducción total o parcial sin consentimiento previo.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">Ley aplicable</h2>
              <p>Este sitio web se rige por la legislación española. Para cualquier controversia derivada del uso de este sitio, serán competentes los juzgados y tribunales correspondientes al domicilio del titular.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default LegalPage;
