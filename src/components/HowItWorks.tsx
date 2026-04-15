import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { Palette, Phone, Package, CreditCard, ArrowRight } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Diseña y elige",
    desc: "Usa el configurador para elegir forma, medida y tela. El precio aparece al momento — sin sorpresas.",
    Icon: Palette,
    link: "/configurador",
  },
  {
    num: "02",
    title: "Te llamamos nosotros",
    desc: "Beatriz o Rocío te llaman en 24h para confirmar cada detalle. Pagas cómodamente por Bizum o tarjeta.",
    Icon: Phone,
    showPayment: true,
    link: "/contacto",
  },
  {
    num: "03",
    title: "Lo recibes en casa",
    desc: "En 15 días tu pedido llega listo para poner. Hecho a mano, embalado con cuidado, sin montaje.",
    Icon: Package,
    link: null,
  },
];

const StepCircle = ({ num, Icon, clickable }: { num: string; Icon: React.ComponentType<Record<string, unknown>>; clickable: boolean }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto relative bg-background transition-colors duration-200 ${clickable ? 'group-hover:border-accent-warm' : ''}`}
      style={{ borderColor: 'hsl(var(--accent-warm))' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span
        className={`font-serif text-xl font-medium text-accent-warm absolute transition-opacity duration-300 ${hovered ? 'opacity-0' : 'opacity-100'}`}
      >
        {num}
      </span>
      <div className={`absolute transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
        <Icon size={24} className="text-accent-warm" />
      </div>
    </div>
  );
};

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 px-6 bg-secondary">
      <div className="container mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Así de fácil</h2>
          <span className="section-line" />
          <p className="mt-6 text-muted-foreground font-light max-w-lg mx-auto">
            Sin obras, sin montadores, sin estrés — solo tú eligiendo lo que te gusta.
          </p>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          {/* Desktop connector line */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px border-t border-dashed" style={{ borderColor: 'hsl(var(--accent-warm))' }} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 relative">
            {STEPS.map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.15} className="text-center">
                <div
                  className={`group ${step.link ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={() => step.link && navigate(step.link)}
                  role={step.link ? 'link' : undefined}
                >
                  <StepCircle num={step.num} Icon={step.Icon} clickable={!!step.link} />
                  <h3 className="mt-5 font-serif text-lg font-medium text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed max-w-xs mx-auto">
                    {step.desc}
                  </p>
                  {step.showPayment && (
                    <div className="mt-3 flex items-center justify-center gap-3 text-xs text-muted-foreground">
                      <span className="font-bold" style={{ color: '#003DA5' }}>Bizum</span>
                      <CreditCard size={16} className="text-muted-foreground" />
                    </div>
                  )}
                  {step.link && (
                    <ArrowRight size={14} className="mx-auto mt-3 text-accent-warm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
