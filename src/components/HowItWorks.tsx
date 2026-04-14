import AnimatedSection from "./AnimatedSection";
import { motion } from "framer-motion";

const STEPS = [
  { num: "01", title: "Elige y personaliza", desc: "Forma, medida, tela y acabado — el configurador te da el precio al momento." },
  { num: "02", title: "Rellena el formulario", desc: "Dos minutos — nos cuentas qué quieres y dónde enviamos." },
  { num: "03", title: "Te llamamos nosotras", desc: "Beatriz o Rocío te llaman para confirmar cada detalle y resolver cualquier duda." },
  { num: "04", title: "Confirmas y pagas", desc: "Pago por transferencia bancaria — sencillo y seguro." },
  { num: "05", title: "Lo recibes en casa", desc: "En 15 días tu pedido llega listo para poner, sin montaje ni complicaciones." },
];

const HowItWorks = () => (
  <section className="py-20 md:py-32 px-6" style={{ backgroundColor: 'hsl(29 43% 59% / 0.08)' }}>
    <div className="container mx-auto">
      <AnimatedSection className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Así de fácil</h2>
        <span className="section-line" />
        <p className="mt-6 text-muted-foreground font-light max-w-lg mx-auto">
          Sin obras, sin montadores, sin estrés — solo tú eligiendo lo que te gusta.
        </p>
      </AnimatedSection>

      {/* Desktop: horizontal with connector line */}
      <div className="hidden md:block relative">
        {/* Connector line */}
        <div className="absolute top-8 left-[10%] right-[10%] h-px border-t border-dashed" style={{ borderColor: 'hsl(var(--accent-warm))' }} />
        <div className="grid grid-cols-5 gap-6 relative">
          {STEPS.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.12} className="text-center">
              <motion.div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border-2 bg-background relative z-10"
                style={{ borderColor: 'hsl(var(--accent-warm))' }}
                whileInView={{ scale: [1, 1.1, 1] }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 + 0.3 }}
              >
                <span className="font-serif text-xl font-medium text-accent-warm">{step.num}</span>
              </motion.div>
              <h3 className="mt-5 font-serif text-lg font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed">{step.desc}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Mobile: vertical with left connector */}
      <div className="md:hidden relative pl-12">
        {/* Vertical connector line */}
        <div className="absolute left-[31px] top-0 bottom-0 w-px border-l border-dashed" style={{ borderColor: 'hsl(var(--accent-warm))' }} />
        <div className="space-y-10">
          {STEPS.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.1} className="relative">
              <div
                className="absolute -left-12 top-0 w-16 h-16 rounded-full flex items-center justify-center border-2 bg-background"
                style={{ borderColor: 'hsl(var(--accent-warm))' }}
              >
                <span className="font-serif text-xl font-medium text-accent-warm">{step.num}</span>
              </div>
              <div className="pt-3">
                <h3 className="font-serif text-lg font-medium text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground font-light leading-relaxed">{step.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
