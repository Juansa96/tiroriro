import { Instagram, MapPin, Phone, Truck } from "lucide-react";

const Footer = () => (
  <footer className="bg-bone border-t border-border pt-10 pb-24 md:pt-12 md:pb-12">
    <div className="container mx-auto px-6">
      {/* Grid compacto de información */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-muted-foreground/70 mb-2">
            <Truck size={16} strokeWidth={1.5} />
            <span className="text-xs tracking-extra-wide uppercase font-medium">
              Envíos
            </span>
          </div>
          <p className="text-sm text-foreground font-light leading-snug">
            Hecho a mano en España
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-muted-foreground/70 mb-2">
            <MapPin size={16} strokeWidth={1.5} />
            <span className="text-xs tracking-extra-wide uppercase font-medium">
              Dirección
            </span>
          </div>
          <p className="text-sm text-foreground font-light leading-snug">
            Cristóbal Colón, 11
          </p>
          <p className="text-xs text-muted-foreground font-light leading-snug">
            28660 Boadilla del Monte
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-muted-foreground/70 mb-2">
            <Phone size={16} strokeWidth={1.5} />
            <span className="text-xs tracking-extra-wide uppercase font-medium">
              Contacto
            </span>
          </div>
          <p className="text-sm text-foreground font-light leading-snug">
            660 786 453
          </p>
          <p className="text-xs text-muted-foreground font-light leading-snug">
            info@tirorirohome.com
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-muted-foreground/70 mb-2">
            <Instagram size={16} strokeWidth={1.5} />
            <span className="text-xs tracking-extra-wide uppercase font-medium">
              Síguenos
            </span>
          </div>
          <a
            href="https://www.instagram.com/tirorirohome/?utm_source=web&utm_medium=footer&utm_campaign=to_instagram"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Tiroriro"
            className="text-sm text-foreground font-light hover:text-accent-warm transition-colors leading-snug"
          >
            @tirorirohome
          </a>
        </div>
      </div>

      {/* Copyright */}
      <p className="mt-8 text-center text-xs text-muted-foreground/60 font-light">
        © {new Date().getFullYear()} Tiroriro Home. Todos los derechos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
