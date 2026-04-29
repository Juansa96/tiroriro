import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Award, Heart, Truck, ChevronDown } from "lucide-react";

// Module-level flag: survives SPA navigation but resets on page reload
let animationHasPlayed = false;

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

  // Skip animation if already played in this browser session (SPA navigation)
  // But on page reload, animationHasPlayed resets to false automatically
  const [skipAnimation] = useState(() => animationHasPlayed);

  useEffect(() => {
    animationHasPlayed = true;
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS Safari requires these attributes
    video.setAttribute("x-webkit-airplay", "deny");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("playsinline", "");

    const isMobileViewport = () => window.innerWidth < 768;

    const attemptPlay = () => {
      // On mobile, skip first 3 seconds
      if (isMobileViewport() && video.currentTime < 3) {
        video.currentTime = 3;
      }
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    };

    // On mobile: when video loops back to near 0, jump back to second 3
    const handleTimeUpdate = () => {
      if (isMobileViewport() && video.currentTime < 1) {
        video.currentTime = 3;
      }
    };
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Try to play immediately if ready
    if (video.readyState >= 2) {
      attemptPlay();
    } else {
      video.addEventListener("canplay", attemptPlay, { once: true });
      video.addEventListener("loadeddata", attemptPlay, { once: true });
    }

    // Re-play when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) attemptPlay();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // On mobile: allow user touch to trigger play (low power mode fallback)
    const handleTouch = () => {
      if (video.paused) attemptPlay();
    };
    document.addEventListener("touchstart", handleTouch, { once: true, passive: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("touchstart", handleTouch);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const part1 = useTypewriter("Algunas cosas", isMobile ? 1500 : 3000, 55, skipAnimation);
  const part2 = useTypewriter("merecen hacerse a mano", isMobile ? 2200 : 6000, 55, skipAnimation);
  const [showRest, setShowRest] = useState(skipAnimation);

  useEffect(() => {
    if (skipAnimation) return;
    const t = setTimeout(() => setShowRest(true), isMobile ? 3600 : 8800);
    return () => clearTimeout(t);
  }, [isMobile, skipAnimation]);

  return (
    <section className="relative mt-20 md:mt-0 h-[76vh] md:h-auto md:min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-poster.webp"
          className="w-full h-full object-cover object-center"
          onPause={() => {
            videoRef.current?.play().catch(() => {});
          }}
        >
          <source src="/Herovideo.webm" type="video/webm" />
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
          <span>{part1 || " "}</span>
          <br />
          <em className="italic font-light">{part2 || " "}</em>
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
              className="btn-sweep hidden md:inline-flex px-8 py-4 bg-[#1a4b5b] text-white text-xs font-medium tracking-[0.1em] uppercase hover:bg-[#1a4b5b]/85 hover:scale-105 active:scale-95 transition-all duration-200 hover:shadow-lg rounded-sm"
            >
              <span className="relative z-10">Personaliza el tuyo</span>
            </Link>
            <Link
              to="/productos"
              className="btn-sweep px-6 py-3 md:px-8 md:py-4 bg-[#1a4b5b] text-white md:bg-white md:text-foreground text-xs font-medium tracking-[0.1em] uppercase hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 hover:shadow-lg rounded-sm"
            >
              <span className="relative z-10">Ver productos</span>
            </Link>
          </div>
          <div className="mt-5 flex flex-col items-center gap-1 text-white/55">
            <span className="text-[12px] md:text-[11px] font-light tracking-widest uppercase">Cabeceros desde xx€ · Bancos desde xx€</span>
            <span className="text-[12px] md:text-[11px] font-light tracking-widest uppercase">Puffs desde xx€ · Cojines desde xx€</span>
          </div>

          {/* Sigue bajando — desktop only */}
          <div className="hidden md:flex justify-center mt-10">
            <button
              onClick={() => document.getElementById("productos-home")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-sweep btn-unir btn-unir-light inline-flex items-center gap-2 px-6 py-2.5 text-xs font-light rounded-sm"
              aria-label="Sigue bajando"
            >
              <span className="relative z-10">Sigue bajando</span>
              <ChevronDown size={14} className="relative z-10" />
            </button>
          </div>
        </div>
      </div>

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
