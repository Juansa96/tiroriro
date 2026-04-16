import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-portada.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={heroImage}
        alt="Dormitorio elegante con cabecero tapizado artesanal, luz cálida lateral"
        className="w-full h-full object-cover object-center"
        style={{ width: "100%", height: "100%" }}
        loading="eager"
        decoding="async"
      />
    </div>
    <div className="absolute inset-0 bg-black/40" />

    <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
        Algunas cosas merecen hacerse a mano
      </h1>

      <p className="mt-6 text-base md:text-lg text-white/90 font-light max-w-xl mx-auto leading-relaxed">
        Nuestro equipo construye, tapiza y envía — tú solo eliges la tela y el tamaño y en 15 días lo tienes en casa.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/configurador"
          className="px-8 py-4 bg-primary text-primary-foreground text-base font-bold tracking-wide uppercase hover:opacity-90 transition-opacity rounded-sm"
        >
          Personaliza el tuyo
        </Link>
        <Link
          to="/productos"
          className="px-8 py-4 border-2 border-white text-white text-base font-medium tracking-wide uppercase hover:bg-white/10 transition-colors rounded-sm"
        >
          Ver productos
        </Link>
      </div>

      <p
        className="mt-6 text-white font-medium"
        style={{ fontSize: "1.1rem", letterSpacing: "0.02em" }}
      >
        Cabeceros desde 180€ · Bancos desde 120€ · Precio exacto en el configurador
      </p>
    </div>
  </section>
);

export default HeroSection;
