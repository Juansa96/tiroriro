import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Palette, Phone, Package } from "lucide-react";

const STEPS = [
  {
    num: "01",
    title: "Diseña y elige",
    text: "Usa el configurador para elegir forma, medida y tela. El precio aparece al momento — sin sorpresas.",
    Icon: Palette,
    href: "/configurador",
  },
  {
    num: "02",
    title: "Te llamamos nosotros",
    text: "Beatriz o Rocío te llaman en 24h para confirmar cada detalle. Pagas de forma segura.",
    Icon: Phone,
    href: "/contacto",
  },
  {
    num: "03",
    title: "Lo recibes en casa",
    text: "En 15 días tu pedido llega listo para poner. Hecho a mano, embalado con cuidado, sin montaje.",
    Icon: Package,
    href: null,
  },
];

interface StepProps {
  num: string;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  title: string;
  text: string;
  href: string | null;
}

const Step = ({ num, Icon, title, text, href }: StepProps) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="relative cursor-pointer rounded-xl p-8 border border-border transition-all duration-200 min-h-[220px]"
      style={{
        background: hovered ? "hsl(var(--primary))" : "hsl(var(--card))",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => href && navigate(href)}
      role={href ? "link" : undefined}
    >
      <span
        className="font-serif text-5xl font-light absolute top-6 left-6 transition-opacity duration-200"
        style={{ opacity: hovered ? 0 : 0.2, color: "hsl(var(--primary))" }}
      >
        {num}
      </span>
      <div
        className="absolute top-6 left-6 transition-opacity duration-200"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <Icon size={32} color="white" />
      </div>
      <div className="mt-16">
        <h3
          className="font-serif text-xl font-medium transition-colors duration-200"
          style={{ color: hovered ? "white" : "hsl(var(--foreground))" }}
        >
          {title}
        </h3>
        <p
          className="text-sm mt-2 leading-relaxed transition-colors duration-200"
          style={{ color: hovered ? "rgba(255,255,255,0.85)" : "hsl(var(--muted-foreground))" }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

const HowItWorks = () => (
  <section className="py-20 md:py-32 px-6 bg-secondary">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Así de fácil</h2>
        <span className="section-line" />
        <p className="mt-6 text-muted-foreground font-light max-w-lg mx-auto text-base">
          Sin obras, sin montadores, sin estrés — solo tú eligiendo lo que te gusta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {STEPS.map((s) => (
          <Step key={s.num} {...s} />
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
