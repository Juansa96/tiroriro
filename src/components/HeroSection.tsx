import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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
    <section className="relative mt-20 md:mt-0 h-[calc(100vh-5rem)] md:h-auto md:min-h-screen flex items-center justify-center overflow-hidden">
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

      <div className="absolute inset-0 hidden md:block bg-black/45" />

      <div className="hidden md:block relative z-10 text-center px-6 max-w-3xl mx-auto">
        <div
          className="transition-all duration-700 ease-out mb-4"
          style={{
            opacity: showRest ? 1 : 0,
            transform: showRest ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <p className="text-xs tracking-[0.18em] uppercase text-white/55 font-light">
            Tapizado artesanal · España
          </p>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight">
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
      </div>

      <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white z-10 py-3 px-4">
        <p className="text-center text-xs text-foreground/60 font-light tracking-wide">
          Más de 150 piezas entregadas · Hecho a mano en España · Entrega en 15 días
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
