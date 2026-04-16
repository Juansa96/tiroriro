import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, Phone, Package, type LucideIcon } from "lucide-react";

const STEPS = [
  {
    title: "Diseña y elige",
    text: "Usa el configurador para elegir forma, medida y tela. El precio aparece al momento — sin sorpresas.",
    Icon: Palette,
    href: "/configurador",
  },
  {
    title: "Te llamamos nosotros",
    text: "Beatriz o Rocío te llaman en 24h para confirmar cada detalle. Pagas de forma segura.",
    Icon: Phone,
    href: "/contacto",
  },
  {
    title: "Lo recibes en casa",
    text: "En 15 días tu pedido llega listo para poner. Hecho a mano, embalado con cuidado, sin montaje.",
    Icon: Package,
    href: null,
  },
];

interface StepProps {
  Icon: LucideIcon;
  title: string;
  text: string;
  href: string | null;
}

const Step = ({ Icon, title, text, href }: StepProps) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative cursor-pointer rounded-xl p-8 border border-border transition-all duration-200 min-h-[220px]"
      style={{
        background: hovered ? "hsl(var(--primary) / 0.15)" : "hsl(var(--card))",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => href && navigate(href)}
      role={href ? "link" : undefined}
    >
      <div className="mb-5">
        <Icon size={36} color="hsl(var(--primary))" />
      </div>
      <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground">
        {title}
      </h3>
      <p className="text-sm mt-2 leading-relaxed text-muted-foreground">
        {text}
      </p>
    </div>
  );
};

const HowItWorks = () => (
  <section className="py-20 md:py-32 px-6 bg-secondary">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Así funciona</h2>
        <span className="section-line" />
        <p className="mt-6 text-muted-foreground font-light max-w-lg mx-auto text-base">
          Sin obras, sin montadores, sin estrés — solo tú eligiendo lo que te gusta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {STEPS.map((s) => (
          <Step key={s.title} {...s} />
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
