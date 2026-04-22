import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const useTypewriter = (text: string, startDelay: number, speed = 55) => {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(delayTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [started, displayed, text, speed]);

  return displayed;
};

const HeroSection = () => {
  const line1 = useTypewriter("Algunas cosas merecen", 3000, 60);
  const line2 = useTypewriter("hacerse a mano", 6000, 65);
  const [showRest, setShowRest] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowRest(true), 8200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/src/assets/hero-portada.jpg"
          className="w-full h-full object-cover object-center"
        >
          <source src="/src/assets/Herovideo.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">

        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight min-h-[1.2em]">
          <span>{line1}</span>
          {line2 && (
            <>
              <br />
              <em className="italic font-light">{line2}</em>
            </>
          )}
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
    </section>
  );
};

export default HeroSection;
