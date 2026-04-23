import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, Award, Hammer, Truck } from "lucide-react";

const useTypewriter = (text: string, startDelay: number, speed = 60, skip = false) => {
  const [displayed, setDisplayed] = useState(skip ? text : "");
  const [started, setStarted] = useState(skip);

  useEffect(() => {
    if (skip) return;
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay, skip]);

  useEffect(() => {
    if (skip || !started || displayed.length >= text.length) return;
    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [started, displayed, text, speed, skip]);

  return displayed;
};

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasSeenAnimation] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("hero_animation_seen") === "true";
  });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      attemptPlay();
    } else {
      video.addEventListener("loadeddata", attemptPlay, { once: true });
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const part1 = useTypewriter("Algunas cosas", isMobile ? 1500 : 3000, 55, hasSeenAnimation);
  const part2 = useTypewriter("merecen hacerse a mano", isMobile ? 5000 : 6000, 55, hasSeenAnimation);
  const [showRest, setShowRest] = useState(hasSeenAnimation);

  useEffect(() => {
    if (hasSeenAnimation) {
      setShowRest(true);
      return;
    }
    const t = setTimeout(() => setShowRest(true), isMobile ? 7800 : 8800);
    return () => clearTimeout(t);
  }, [isMobile, hasSeenAnimation]);

  const handleScrollDown = () => {
    const target = document.getElementById("productos-home") || document.getElementById("equipo");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative mt-20 md:mt-0 h-[76vh] md:h-auto md:min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/hero-portada.jpg"
          className="w-full h-full object-cover object-center"
          onPause={() => {
            videoRef.current?.play().catch(() => {});
          }}
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
              className="btn-sweep btn-unir btn-unir-home hidden md:inline-flex px-8 py-4 text-xs font-medium"
            >
              <span className="relative z-10">Personaliza el tuyo</span>
            </Link>
            <Link
              to="/productos"
              className="btn-sweep btn-unir btn-unir-outline btn-unir-home px-6 py-3 md:px-8 md:py-4 text-xs font-medium"
            >
              <span className="relative z-10">Ver productos</span>
            </Link>
          </div>
        </div>

      </div>

      <button
        type="button"
        onClick={handleScrollDown}
        className="hidden md:inline-flex absolute left-1/2 bottom-10 -translate-x-1/2 z-10 items-center gap-2 rounded-full border border-white/45 bg-white/10 px-5 py-2 text-[11px] tracking-[0.22em] uppercase font-light text-white backdrop-blur-sm transition-colors duration-300 hover:bg-white/18"
      >
        <span>Sigue bajando</span>
        <ArrowDown size={14} />
      </button>

      {/* Franja inferior con iconos — solo móvil */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white z-10 py-4 px-6">
        <div className="flex items-start justify-around">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Award size={18} className="text-foreground/50" />
            <span className="text-xs font-medium text-foreground leading-tight">Atención</span>
            <span className="text-[10px] text-foreground/45 font-light">personalizada</span>
          </div>
          <div className="w-px self-stretch bg-foreground/10" />
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Hammer size={18} className="text-foreground/50" />
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
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("hero_animation_seen", "true");
    }
  }, []);
