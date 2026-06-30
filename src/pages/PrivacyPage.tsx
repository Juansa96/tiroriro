import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPage = () => (
  <>
    <Helmet><meta name="robots" content="noindex,follow" /></Helmet>
    <Navbar />
    <main className="pt-20">
      <section className="py-20 md:py-32 px-6">
        <div className="container mx-auto max-w-3xl">
          <h1 className="font-serif text-3xl md:text-5xl font-light text-foreground mb-4">Política de Privacidad</h1>
          <span className="section-line !mx-0" />

          <div className="mt-12 space-y-10 text-sm text-muted-foreground font-light leading-relaxed">
            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">1. ¿Quién es el responsable del tratamiento?</h2>
              <p><strong>Juan Sangrador Torres</strong> (nombre comercial: Tiroriro Home) · DNI 45577829V.</p>
              <p className="mt-1">Domicilio: Calle Cristóbal Colón, 11 · 28660 Boadilla del Monte, Madrid (España).</p>
              <p className="mt-1">Email de contacto: info@tirorirohome.com · Teléfono: +34 660 786 453.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">2. ¿Qué datos recogemos?</h2>
              <p>Recogemos los datos que nos proporcionas voluntariamente a través del formulario de contacto: nombre, teléfono, email y el mensaje o configuración del producto que nos envías con los detalles de tu consulta o presupuesto. No solicitamos categorías especiales de datos.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">3. ¿Para qué usamos tus datos?</h2>
              <p>Utilizamos tus datos exclusivamente para responder a tu consulta, elaborar tu presupuesto y, en caso de pedido, gestionar la producción y entrega. La base legal del tratamiento es tu consentimiento (art. 6.1.a RGPD) y, en su caso, la ejecución de un contrato o medidas precontractuales a petición tuya (art. 6.1.b RGPD).</p>
              <p className="mt-2">No cedemos tus datos a terceros con fines comerciales. Solo se comparten con los proveedores estrictamente necesarios para prestar el servicio: plataforma de envío de emails transaccionales, proveedor de hosting/infraestructura (Lovable Cloud — servidores en la Unión Europea) y, en su caso, transportistas para la entrega de tu pedido. No se realizan transferencias internacionales fuera del Espacio Económico Europeo.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">4. ¿Cuánto tiempo conservamos tus datos?</h2>
              <p>Conservamos tus datos durante un máximo de 5 años desde la última interacción comercial, plazo necesario para cumplir las obligaciones fiscales y contables aplicables. Transcurrido ese plazo, los datos se eliminan de forma segura.</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">5. ¿Cuáles son tus derechos?</h2>
              <p>Tienes derecho de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad de tus datos, así como a retirar el consentimiento prestado en cualquier momento. Para ejercer cualquiera de estos derechos escríbenos a <strong>info@tirorirohome.com</strong> indicando tu nombre y el derecho que deseas ejercer.</p>
              <p className="mt-2">Si consideras que el tratamiento no se ajusta a la normativa vigente, tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">www.aepd.es</a>).</p>
            </div>

            <div>
              <h2 className="font-serif text-xl font-medium text-foreground mb-3">6. Cookies</h2>
              <p>
                Puedes consultar nuestra política de cookies en la página de{" "}
                <a href="/cookies" className="underline hover:text-foreground transition-colors">Política de Cookies</a>.
              </p>
            </div>

            <p className="text-xs text-muted-foreground/70">Última actualización: 30 de junio de 2026.</p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default PrivacyPage;
