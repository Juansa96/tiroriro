import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-portada.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img
        src={heroImage}
        alt="Tapizado artesanal TIRO·RIRO"
        className="w-full h-full object-cover object-center"
      />
    </div>
    <div className="absolute inset-0 bg-black/45" />
    <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
      <p className="mb-4 text-xs tracking-[0.18em] uppercase text-white/55 font-light">
        Tapizado artesanal · España
      </p>
      <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
        Algunas cosas merecen<br />
        <em className="italic font-light">hacerse a mano</em>
      </h1>
      <p className="mt-6 text-sm md:text-base text-white/75 font-light max-w-xl mx-auto leading-relaxed">
        Elige la tela y las medidas — nosotros construimos, tapizamos y enviamos. En 15 días lo tienes en casa.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/configurador"
          className="px-8 py-4 bg-white text-foreground text-xs font-medium tracking-[0.1em] uppercase hover:bg-white/90 transition-colors"
        >
          Personaliza el tuyo
        </Link>
        <Link
          to="/productos"
          className="px-8 py-4 border border-white/50 text-white text-xs font-medium tracking-[0.1em] uppercase hover:border-white hover:bg-white/10 transition-colors"
        >
          Ver productos
        </Link>
      </div>
      <p className="mt-6 text-xs text-white/40 font-light tracking-wide">
        Cabeceros desde 180€ · Bancos desde 120€
      </p>
    </div>
  </section>
);

export default HeroSection;
