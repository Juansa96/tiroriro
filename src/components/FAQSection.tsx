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
    q: "¿Qué medida de cabecero necesito para mi cama?",
    a: "Depende del ancho del colchón. La regla general es que el cabecero sobresalga 5-10 cm a cada lado. Para una cama de 150 cm, lo ideal es un cabecero de 160 cm de ancho y 120 o 130 cm de alto. Tenemos una guía completa con medidas para camas de 90, 105, 135, 150, 160, 180 y 200 cm.",
  },
  {
    q: "¿Cuánto cuesta un cabecero tapizado a medida?",
    a: "Nuestros cabeceros tapizados a medida parten de 285 € e incluyen la tela básica que elijas, el tamaño que necesites y el acabado a mano. El precio final depende de la forma (recto, arco, corona o ondas), del ancho y de la tela: las telas premium tienen un recargo variable (lo ves en el configurador antes de confirmar). En el configurador puedes ver el precio exacto en tiempo real antes de pedirlo.",
  },
  {
    q: "¿Qué tela es mejor para un cabecero?",
    a: "Para un dormitorio principal solemos recomendar lino lavado o bouclé: son cálidos, no destiñen con la luz y aguantan muy bien el paso del tiempo. Si hay mascotas o niños, mejor un velvet o un tejido con tratamiento antimanchas. Si quieres un look más nórdico, los algodones en tonos crudo o piedra funcionan siempre. Tenemos más de 60 telas y, si dudas, te ayudamos por WhatsApp con fotos del espacio.",
  },
  {
    q: "¿Merece la pena un cabecero hecho a medida frente a uno estándar?",
    a: "Sí, por tres motivos: encaja al milímetro con tu cama y pared (los estándar suelen quedar cortos o desproporcionados), eliges la tela y el color exactos para tu dormitorio, y al estar tapizado a mano la calidad y durabilidad es muy superior a la de un cabecero industrial. Y el precio (desde 285 €) suele ser competitivo frente a tiendas de gama media.",
  },
  {
    q: "¿Cómo se limpia un cabecero tapizado?",
    a: "Para el día a día basta con aspirar la superficie cada 2-3 semanas con la boquilla suave. Si hay una mancha puntual, retírala con un paño húmedo y jabón neutro, frotando desde fuera hacia dentro. Para una limpieza profunda recomendamos llamar a una tapicería local: la mayoría de nuestras telas no se pueden lavar a máquina porque el cabecero lleva relleno interior.",
  },
  {
    q: "¿De qué materiales está hecho un cabecero Tiroriro por dentro?",
    a: "La estructura interior es de tablero aglomerado con refuerzo añadido en los laterales para que el cabecero aguante perfectamente con el paso del tiempo y no se deforme. Sobre esa estructura colocamos una capa de gomaespuma de alta densidad (la buena, la que no se hunde con los años), encima una capa de guata de 8 cm para conseguir ese tacto mullido y volumen uniforme, y por último la tela que hayas elegido tapizada a mano. Esta combinación es la que da la sensación firme pero acogedora característica de nuestros cabeceros.",
  },
  {
    q: "¿Cuánto cuesta el envío y a qué zonas llegáis?",
    a: "Dentro de la Comunidad de Madrid el envío cuesta 40 € (se cobra aparte del precio del producto); en cabeceros de más de 180 cm de ancho o 120 cm de alto son 60 €, porque necesitan un transporte mayor. El configurador te dice siempre la cifra exacta de tu medida. Fuera de Madrid enviamos a toda la península ibérica y el coste se calcula según destino — te lo confirmamos por teléfono antes de cerrar el pedido. Para Baleares y Canarias también lo valoramos puntualmente. Procuramos que los transportistas vayan en pareja cuando el cabecero es grande, lo entregan en casa y se cuidan al máximo de que la pieza no sufra durante el trayecto.",
  },
  {
    q: "¿Cómo es vuestro proceso artesanal paso a paso?",
    a: "Primero pasa por carpintería: en el caso del cabecero se monta la forma según el diseño que hemos definido contigo previamente (si tú tienes una forma creativa también puedes enviárnosla y la fabricamos). Se ajustan medidas, grosor y refuerzos. Después pasa a tapizado, que va siempre en este orden: primero la gomaespuma de alta densidad, encima la guata de 8 cm y por último la tela cosida y ajustada a mano. Antes de salir del taller hacemos un control de calidad pieza a pieza y solo entonces se prepara el envío.",
  },
  {
    q: "¿Puedo enviaros mi propia tela para que la tapicéis?",
    a: "Sí, lo hacemos a menudo. El metraje exacto depende del producto y, sobre todo, del tipo de tela: hay telas de doble cara, otras que no, y algunas con rayas o estampados que tienen que casar en los bordes y eso obliga a pedir un poco más de metros. Lo más sencillo es que nos llames o nos escribas, vemos juntos la pieza y la tela y te decimos el metraje exacto antes de que la compres.",
  },
  {
    q: "¿Puedo pedir un cabecero o puf en dos telas (bicolor)?",
    a: "Sí, como quieras. Podemos combinar dos telas en el mismo cabecero, puf o cojín — por ejemplo cuerpo en una tela y ribetes o piping en otra, o mitades de distinto color. Cuéntanos la idea por teléfono y te orientamos sobre qué combinaciones quedan mejor con las telas disponibles.",
  },
  {
    q: "¿Tenéis showroom para ver las piezas antes de comprar?",
    a: "Todavía no, pero estamos trabajando en abrir un espacio físico muy pronto. Mientras tanto, podemos enviarte fotos reales adicionales de cualquier modelo y resolverte todas las dudas por WhatsApp o por teléfono antes de confirmar el pedido.",
  },
  {
    q: "¿Hacéis descuentos para hoteles, restaurantes o pedidos de empresa?",
    a: "Sí. Cuando se trata de un proyecto de empresa con volumen (hoteles, hostelería, interiorismo, promociones), aplicamos un descuento especial. Escríbenos contándonos el proyecto y te preparamos un presupuesto a medida.",
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
