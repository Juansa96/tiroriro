import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPage = () => (
  <>
    <Navbar />
    <main className="pt-20">
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-4">Política de Privacidad</h1>
          <span className="section-line !mx-0" />

          <div className="mt-12 space-y-10 text-sm text-muted-foreground font-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">1. ¿Quién es el responsable del tratamiento?</h2>
              <p>Tiroriro, proyecto gestionado por Beatriz [Apellido] y Rocío [Apellido].</p>
              <p className="mt-1">Email de contacto: info@tiroriro.com</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">2. ¿Qué datos recogemos?</h2>
              <p>Recogemos los datos que nos proporcionas voluntariamente a través del formulario de contacto: nombre, teléfono, email y el mensaje que nos envías con los detalles de tu consulta o pedido.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">3. ¿Para qué usamos tus datos?</h2>
              <p>Utilizamos tus datos exclusivamente para contactarte sobre tu consulta y gestionar tu pedido. No cedemos tus datos a terceros salvo a los transportistas necesarios para la entrega de tu pedido.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">4. ¿Cuánto tiempo conservamos tus datos?</h2>
              <p>Conservamos tus datos durante un máximo de 3 años desde el último contacto. Transcurrido ese plazo, los datos se eliminan de forma segura.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">5. ¿Cuáles son tus derechos?</h2>
              <p>Tienes derecho de acceso, rectificación, supresión, oposición y portabilidad de tus datos. Para ejercer cualquiera de estos derechos, escríbenos a info@tiroriro.com.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">6. Cookies</h2>
              <p>
                Puedes consultar nuestra política de cookies en la página de{" "}
                <a href="/cookies" className="underline hover:text-foreground transition-colors">Política de Cookies</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default PrivacyPage;
