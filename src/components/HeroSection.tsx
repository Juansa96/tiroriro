import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Award, Heart, Truck } from "lucide-react";

const useTypewriter = (text: string, startDelay: number, speed = 60) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started || displayed.length >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed]);

  return displayed;
};

const HeroSection = () => {
  const part1 = useTypewriter("Algunas cosas", 3000, 55);
  const part2 = useTypewriter("merecen hacerse a mano", 6000, 55);
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowRest(true), 8800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative mt-20 md:mt-0 h-[76vh] md:h-auto md:min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-portada.jpg"
          className="w-full h-full object-cover object-center"
        >
          <source src="/Herovideo.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-black/20 md:bg-black/45" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pb-20 md:pb-0">
        <div
          className="hidden md:block transition-all duration-700 ease-out mb-4"
          style={{
            opacity: showRest ? 1 : 0,
            transform: showRest ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <p className="text-xs tracking-[0.18em] uppercase text-white/55 font-light">
            Tapizado artesanal · España
          </p>
        </div>

        <h1 className="font-serif text-3xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
          <span>{part1 || "\u00A0"}</span>
          <br />
          <em className="italic font-light">{part2 || "\u00A0"}</em>
        </h1>

        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: showRest ? 1 : 0,
            transform: showRest ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <p className="hidden md:block mt-6 text-sm md:text-base text-white/75 font-light max-w-xl mx-auto leading-relaxed">
            Elige la tela y las medidas — nosotros construimos, tapizamos y enviamos. En 15 días lo tienes en casa.
          </p>
          <div className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              to="/configurador"
              className="hidden md:inline-flex px-8 py-4 bg-white text-foreground text-xs font-medium tracking-[0.1em] uppercase hover:bg-white/90 transition-colors"
            >
              Personaliza el tuyo
            </Link>
            <Link
              to="/productos"
              className="px-6 py-3 md:px-8 md:py-4 bg-white text-foreground text-xs font-medium tracking-[0.1em] uppercase hover:bg-white/90 transition-colors"
            >
              Ver productos
            </Link>
          </div>
          <div className="mt-5 flex flex-col items-center gap-1 text-white/45">
            <span className="text-[11px] font-light tracking-widest uppercase">Cabeceros desde 180€ · Bancos desde 120€</span>
            <span className="text-[11px] font-light tracking-widest uppercase">Puffs desde 90€ · Cojines desde 30€</span>
          </div>
        </div>
      </div>

      {/* Franja inferior con iconos — solo móvil */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white z-10 py-4 px-6">
        <div className="flex items-start justify-around">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Award size={18} className="text-foreground/50" />
            <span className="text-xs font-medium text-foreground leading-tight">+150 piezas</span>
            <span className="text-[10px] text-foreground/45 font-light">entregadas</span>
          </div>
          <div className="w-px self-stretch bg-foreground/10" />
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Heart size={18} className="text-foreground/50" />
            <span className="text-xs font-medium text-foreground leading-tight">Hecho a mano</span>
            <span className="text-[10px] text-foreground/45 font-light">en España</span>
          </div>
          <div className="w-px self-stretch bg-foreground/10" />
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Truck size={18} className="text-foreground/50" />
            <span className="text-xs font-medium text-foreground leading-tight">Entrega</span>
            <span className="text-[10px] text-foreground/45 font-light">en 15 días</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
