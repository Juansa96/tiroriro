import { Instagram, MapPin, Phone, Truck } from "lucide-react";

const Footer = () => (
  <footer className="bg-secondary pt-6 pb-8 md:pt-8 md:pb-10">
    <div className="container mx-auto px-6">
      {/* Grid compacto de información */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-1">
            <Truck size={13} strokeWidth={1.5} />
            <span className="text-[0.6rem] tracking-extra-wide uppercase font-medium">
              Envíos
            </span>
          </div>
          <p className="text-xs text-foreground font-light leading-snug">
            Hecho a mano en España
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-1">
            <MapPin size={13} strokeWidth={1.5} />
            <span className="text-[0.6rem] tracking-extra-wide uppercase font-medium">
              Dirección
            </span>
          </div>
          <p className="text-xs text-foreground font-light leading-snug">
            Cristóbal Colón, 11
          </p>
          <p className="text-[0.7rem] text-muted-foreground/50 font-light leading-snug">
            28660 Boadilla del Monte
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-1">
            <Phone size={13} strokeWidth={1.5} />
            <span className="text-[0.6rem] tracking-extra-wide uppercase font-medium">
              Contacto
            </span>
          </div>
          <p className="text-xs text-foreground font-light leading-snug">
            660 786 453
          </p>
          <p className="text-[0.7rem] text-muted-foreground/50 font-light leading-snug">
            info@tirorirohome.com
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-muted-foreground/60 mb-1">
            <Instagram size={13} strokeWidth={1.5} />
            <span className="text-[0.6rem] tracking-extra-wide uppercase font-medium">
              Síguenos
            </span>
          </div>
          <a
            href="https://www.instagram.com/tirorirohome/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Tiroriro"
            className="text-xs text-foreground font-light hover:text-accent-warm transition-colors leading-snug"
          >
            @tirorirohome
          </a>
        </div>
      </div>

      {/* Copyright */}
      <p className="mt-6 text-center text-[0.65rem] text-muted-foreground/40 font-light">
        © {new Date().getFullYear()} Tiroriro Home. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
