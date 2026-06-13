import { Helmet } from "react-helmet-async";
import AnimatedSection from "./AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "¿Cuánto cuesta un cabecero tapizado a medida?",
    a: "Nuestros cabeceros tapizados a medida parten de 225 € e incluyen la tela básica que elijas, el tamaño que necesites y el acabado a mano. El precio final depende de la forma (recto, arco, corona o ondas), del ancho y de la tela: las telas premium suben unos 40-80 € sobre la básica. En el configurador puedes ver el precio exacto en tiempo real antes de pedirlo.",
  },
  {
    q: "¿Qué tela es mejor para un cabecero?",
    a: "Para un dormitorio principal solemos recomendar lino lavado o bouclé: son cálidos, no destiñen con la luz y aguantan muy bien el paso del tiempo. Si hay mascotas o niños, mejor un velvet o un tejido con tratamiento antimanchas. Si quieres un look más nórdico, los algodones en tonos crudo o piedra funcionan siempre. Tenemos más de 60 telas y, si dudas, te ayudamos por WhatsApp con fotos del espacio.",
  },
  {
    q: "¿Merece la pena un cabecero hecho a medida frente a uno estándar?",
    a: "Sí, por tres motivos: encaja al milímetro con tu cama y pared (los estándar suelen quedar cortos o desproporcionados), eliges la tela y el color exactos para tu dormitorio, y al estar tapizado a mano la calidad y durabilidad es muy superior a la de un cabecero industrial. Y el precio (desde 225 €) suele ser competitivo frente a tiendas de gama media.",
  },
  {
    q: "¿Cómo se limpia un cabecero tapizado?",
    a: "Para el día a día basta con aspirar la superficie cada 2-3 semanas con la boquilla suave. Si hay una mancha puntual, retírala con un paño húmedo y jabón neutro, frotando desde fuera hacia dentro. Para una limpieza profunda recomendamos llamar a una tapicería local: la mayoría de nuestras telas no se pueden lavar a máquina porque el cabecero lleva relleno interior.",
  },
  {
    q: "¿Dónde se fabrican los productos de Tiroriro?",
    a: "Todo se fabrica a mano en nuestro taller de la Comunidad de Madrid, en España. Trabajamos con tapiceros artesanos con décadas de oficio. Por eso podemos personalizar cada pieza al milímetro y por eso el plazo es de 20 días: nada está prefabricado.",
  },
  {
    q: "¿Cuánto tarda en llegar mi pedido?",
    a: "El plazo habitual es de 20 días naturales desde que confirmamos y recibimos el pago. En épocas de alta demanda puede alargarse 2-3 días — siempre te avisamos antes.",
  },
  {
    q: "¿Puedo ver las telas antes de decidir?",
    a: "Sí. Puedes ver todas nuestras telas en la sección de telas de la web, con foto de detalle y descripción de cada una. Si tienes dudas, escríbenos por WhatsApp y te orientamos sobre cuál encaja mejor con tu espacio.",
  },
  {
    q: "¿Hacéis envíos a toda España?",
    a: "Enviamos a toda la península ibérica. Si estás en Baleares o Canarias, escríbenos y lo valoramos según el destino.",
  },
  {
    q: "¿Puedo devolver el producto si no me gusta?",
    a: "Al ser productos hechos a medida y personalizados, no admitimos devoluciones por cambio de opinión. Sí cubrimos cualquier defecto de fabricación — si algo no está bien hecho, lo solucionamos.",
  },
  {
    q: "¿Cómo funciona el pago?",
    a: "Aceptamos Bizum, Stripe y transferencia bancaria. El pago se realiza tras confirmar los detalles por teléfono. No pedimos ningún anticipo hasta que estés seguro/a de tu elección.",
  },
  {
    q: "¿El cabecero viene montado o hay que ensamblarlo?",
    a: "Los cabeceros llegan listos para colocar. Por defecto, no incluyen anclaje a pared. Tienes varias opciones: colocarlo sobre el somier, sin necesidad de fijarlo, añadir patas para apoyarlo directamente en el suelo, o solicitar piezas específicas para anclarlo a la pared. También ofrecemos servicio de instalación en la Comunidad de Madrid. Antes de confirmar el pedido, te explicamos todas las opciones por teléfono.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQS.map((faq) => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a,
    },
  })),
};

const FAQSection = () => (
  <>
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
  </Helmet>
  <section className="pt-20 md:pt-32 pb-10 md:pb-14 px-6 bg-secondary">
    <div className="container mx-auto max-w-3xl">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Preguntas frecuentes</h2>
        <span className="section-line" />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <Accordion type="single" collapsible className="space-y-2">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
              <AccordionTrigger className="font-body text-left text-base md:text-lg font-normal text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground font-light leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </AnimatedSection>
    </div>
  </section>
  </>
);

export default FAQSection;
