import AnimatedSection from "./AnimatedSection";
import { Palette, FileText, Phone, CreditCard, Package } from "lucide-react";

const STEPS = [
  { icon: Palette, title: "Elige y personaliza", desc: "Forma, medida, tela y acabado — el configurador te da el precio al momento." },
  { icon: FileText, title: "Rellena el formulario", desc: "Dos minutos — nos cuentas qué quieres y dónde enviamos." },
  { icon: Phone, title: "Te llamamos nosotras", desc: "Beatriz o Rocío te llaman para confirmar cada detalle y resolver cualquier duda." },
  { icon: CreditCard, title: "Confirmas y pagas", desc: "Pago por transferencia bancaria — sencillo y seguro." },
  { icon: Package, title: "Lo recibes en casa", desc: "En 15 días tu pedido llega listo para poner, sin montaje ni complicaciones." },
];

const HowItWorks = () => (
  <section className="py-20 md:py-32 px-6 bg-secondary">
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Así de fácil</h2>
        <p className="mt-4 text-muted-foreground font-light max-w-lg mx-auto">
          Sin obras, sin montadores, sin estrés — solo tú eligiendo lo que te gusta.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6">
        {STEPS.map((step, i) => (
          <AnimatedSection key={i} delay={i * 0.1} className="text-center">
            <step.icon size={28} className="mx-auto text-earth" strokeWidth={1.2} />
            <h3 className="mt-4 font-serif text-lg font-medium text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed">{step.desc}</p>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
