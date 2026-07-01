import { Link } from "react-router-dom";
import { Instagram, MapPin, Phone, Mail, Truck } from "lucide-react";
import Logo from "./Logo";

const InfoBlock = ({
  icon: Icon,
  title,
  lines,
  secondary,
}: {
  icon: React.ElementType;
  title: string;
  lines: string[];
  secondary?: string;
}) => (
  <div className="flex flex-col items-center text-center px-4 py-5">
    <div className="flex items-center gap-2 text-muted-foreground/70 mb-2">
      <Icon size={14} strokeWidth={1.5} />
      <span className="text-[0.65rem] tracking-extra-wide uppercase font-medium">
        {title}
      </span>
    </div>
    {lines.map((line, i) => (
      <p
        key={i}
        className="text-sm text-foreground font-light leading-relaxed"
      >
        {line}
      </p>
    ))}
    {secondary && (
      <p className="mt-1 text-xs text-muted-foreground/70 font-light leading-relaxed">
        {secondary}
      </p>
    )}
  </div>
);

const Footer = () => (
  <footer className="bg-secondary pt-10 pb-16 md:pt-14 md:pb-20">
    <div className="container mx-auto px-6">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <Link to="/" className="inline-flex" aria-label="Tiroriro inicio">
          <Logo
            className="text-primary"
            viewBox="0 340 929 220"
            style={{ width: 200, height: "auto" }}
          />
        </Link>
      </div>

      {/* Separador */}
      <div className="mt-8 md:mt-10 flex justify-center">
        <div className="w-[60px] h-px bg-border" />
      </div>

      {/* Grid de información */}
      <div className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-sm border border-border/60 bg-background/40">
          <InfoBlock
            icon={Truck}
            title="Envíos"
            lines={["Hecho a mano en España"]}
            secondary="Envío dentro de la Comunidad de Madrid · Resto de España bajo consulta"
          />
        </div>

        <div className="rounded-sm border border-border/60 bg-background/40">
          <InfoBlock
            icon={MapPin}
            title="Dirección"
            lines={["Calle Cristóbal Colón, 11"]}
            secondary="28660 Boadilla del Monte, Madrid"
          />
        </div>

        <div className="rounded-sm border border-border/60 bg-background/40">
          <InfoBlock
            icon={Phone}
            title="Contacto"
            lines={["660 786 453"]}
            secondary="info@tirorirohome.com"
          />
        </div>

        <div className="rounded-sm border border-border/60 bg-background/40">
          <div className="flex flex-col items-center text-center px-4 py-5">
            <div className="flex items-center gap-2 text-muted-foreground/70 mb-2">
              <Instagram size={14} strokeWidth={1.5} />
              <span className="text-[0.65rem] tracking-extra-wide uppercase font-medium">
                Síguenos
              </span>
            </div>
            <a
              href="https://www.instagram.com/tirorirohome/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Tiroriro"
              className="text-sm text-foreground font-light hover:text-accent-warm transition-colors"
            >
              @tirorirohome
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="mt-10 md:mt-12 text-center text-xs text-muted-foreground/50 font-light">
        © {new Date().getFullYear()} Tiroriro. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
