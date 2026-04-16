import AnimatedSection from "./AnimatedSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "¿Cuánto tarda en llegar mi pedido?",
    a: "El plazo habitual es de 15 días naturales desde que confirmamos y recibimos el pago. En épocas de alta demanda puede alargarse 2-3 días — siempre te avisamos antes.",
  },
  {
    q: "¿Puedo pedir una muestra de tela antes de decidir?",
    a: "Sí. Escríbenos por WhatsApp o rellena el formulario indicando que quieres muestras y te las enviamos por correo ordinario sin coste. Así ves el color y la textura real antes de confirmar.",
  },
  {
    q: "¿Hacéis envíos a toda España?",
    a: "Enviamos a toda la península ibérica. Si estás en Baleares o Canarias, escríbenos y lo valoramos según el destino.",
  },
  {
    q: "¿Puedo devolver el producto si no me gusta?",
    a: "Al ser productos hechos a medida y personalizados, no admitimos devoluciones por cambio de opinión. Sí cubrimos cualquier defecto de fabricación — si algo no está bien hecho, lo solucionamos sin coste.",
  },
  {
    q: "¿Cómo funciona el pago?",
    a: "Aceptamos Bizum, Stripe y transferencia bancaria. El pago se realiza tras confirmar los detalles por teléfono. No pedimos ningún anticipo hasta que estés seguro/a de tu elección.",
  },
  {
    q: "¿El cabecero viene montado o hay que ensamblarlo?",
    a: "Los cabeceros llegan listos para colgar. Incluimos instrucciones y los anclajes necesarios. La instalación es sencilla y no requiere obras ni montadores.",
  },
];

const FAQSection = () => (
  <section className="py-20 md:py-32 px-6 bg-secondary">
    <div className="container mx-auto max-w-3xl">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Preguntas frecuentes</h2>
        <span className="section-line" />
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Accordion type="single" collapsible className="space-y-2">
          {FAQS.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border">
              <AccordionTrigger className="text-left font-serif text-base md:text-lg font-medium text-foreground hover:no-underline py-5">
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
);

export default FAQSection;
