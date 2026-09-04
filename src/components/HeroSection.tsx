import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Award, Heart, Truck } from "lucide-react";

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

    // iOS Safari requires these attributes for inline autoplay
    video.setAttribute("x-webkit-airplay", "deny");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("playsinline", "");
    // Forzar muted por propiedad: React no siempre refleja el atributo `muted`
    // en la propiedad del DOM, y sin muted los navegadores bloquean el autoplay.
    video.muted = true;
    video.defaultMuted = true;

    const isMobileViewport = () => window.innerWidth < 768;

    // Salta los primeros 3 s en móvil, pero SOLO si ese punto ya está en buffer,
    // para no provocar un seek que atasque la reproducción en conexiones lentas.
    const skipIntroIfSafe = () => {
      if (!isMobileViewport() || video.currentTime >= 3) return;
      try {
        const s = video.seekable;
        if (s.length && s.end(s.length - 1) >= 3) video.currentTime = 3;
      } catch { /* seekable aún no disponible */ }
    };

    const attemptPlay = () => {
      video.muted = true; // re-asegura muted en cada intento
      const p = video.play();
      if (p !== undefined) {
        p.then(skipIntroIfSafe).catch(() => { /* reintentará con gesto o eventos */ });
      }
    };

    // Al hacer loop y volver cerca de 0, vuelve al segundo 3 en móvil (si es seguro)
    const handleTimeUpdate = () => {
      if (isMobileViewport() && video.currentTime < 1) skipIntroIfSafe();
    };
    video.addEventListener("timeupdate", handleTimeUpdate);

    // Reintenta reproducir en cada hito de carga (cubre buffering lento en móvil)
    const playEvents = ["loadeddata", "canplay", "canplaythrough", "loadedmetadata"] as const;
    playEvents.forEach((e) => video.addEventListener(e, attemptPlay));
    if (video.readyState >= 2) attemptPlay();

    // Fallback por gesto de usuario: imprescindible en Modo de bajo consumo de iOS,
    // que bloquea el autoplay aunque el vídeo esté muted. Los listeners se mantienen
    // hasta que el vídeo realmente empieza a reproducirse (evento `playing`).
    const gestureEvents = ["touchstart", "pointerdown", "click", "scroll"] as const;
    const handleGesture = () => { if (video.paused) attemptPlay(); };
    const addGestureListeners = () =>
      gestureEvents.forEach((e) => document.addEventListener(e, handleGesture, { passive: true }));
    const removeGestureListeners = () =>
      gestureEvents.forEach((e) => document.removeEventListener(e, handleGesture));
    addGestureListeners();
    const handlePlaying = () => removeGestureListeners();
    video.addEventListener("playing", handlePlaying);

    // Reintenta al volver a la pestaña
    const handleVisibilityChange = () => {
      if (!document.hidden && video.paused) attemptPlay();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Pausa el vídeo cuando sale del viewport (ahorra CPU/batería)
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) attemptPlay();
          else video.pause();
        },
        { threshold: 0.05 }
      );
      observer.observe(video);
    }

    return () => {
      playEvents.forEach((e) => video.removeEventListener(e, attemptPlay));
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      removeGestureListeners();
      observer?.disconnect();
    };
  }, []);

  const headlineLine1 = useTypewriter("Cabeceros tapizados a medida,", isMobile ? 200 : 300, 45, skipAnimation);
  const headlineLine2 = useTypewriter("hechos a mano en España", isMobile ? 1600 : 1700, 45, skipAnimation);
  const [showRest, setShowRest] = useState(skipAnimation);

  useEffect(() => {
    if (skipAnimation) return;
    const t = setTimeout(() => setShowRest(true), isMobile ? 2900 : 3000);
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
          preload="auto"
          poster="/hero-poster.webp"
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        >
          <source src="/Herovideo.webm" type="video/webm" />
          <source src="/Herovideo.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="absolute inset-0 bg-black/40 md:bg-black/45" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pb-20 md:pb-0">
        <div
          className="hidden md:block transition-all duration-700 ease-out mb-4"
          style={{
            opacity: showRest ? 1 : 0,
            transform: showRest ? "translateY(0)" : "translateY(12px)",
          }}
        >
          <p className="text-xs tracking-[0.18em] uppercase text-white/80 font-light">
            Tapizado artesanal · España
          </p>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-white leading-tight min-h-[2.4em]">
          <span>{headlineLine1 || " "}</span>
          <br />
          <span>{headlineLine2 || " "}</span>
        </h1>

        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: showRest ? 1 : 0,
            transform: showRest ? "translateY(0)" : "translateY(16px)",
          }}
        >
          <p className="hidden md:block mt-6 text-sm md:text-base text-white/90 font-light max-w-xl mx-auto leading-relaxed">
            Elige la tela y las medidas — nosotros construimos, tapizamos y enviamos. En 20 días lo tienes en casa.
          </p>
          <div className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              to="/configurador"
              className="btn-sweep inline-flex px-6 py-3 md:px-8 md:py-4 bg-[hsl(var(--accent-warm))] text-white text-xs font-medium tracking-[0.1em] uppercase hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 hover:shadow-lg rounded-sm"
            >
              <span className="relative z-10">Diseña el tuyo →</span>
            </Link>
            <Link
              to="/productos"
              className="inline-flex items-center justify-center px-4 py-2 text-xs tracking-[0.18em] uppercase font-light text-white/85 hover:text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-colors"
            >
              Ver productos →
            </Link>
          </div>
          <div className="mt-5 flex flex-col items-center gap-1 text-white/85">
            <span className="text-[12px] md:text-[11px] font-normal tracking-widest">Cabeceros desde 290 € · Mesas de centro desde 220 € · Pufs desde 150 € · Pantallas de lámpara desde 25 €</span>
          </div>

        </div>
      </div>

      {/* Franja inferior con iconos — solo móvil */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white z-10 py-4 px-6">
        <div className="flex items-start justify-around">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Award size={18} className="text-foreground/70" />
            <span className="text-xs font-medium text-foreground leading-tight">Atención</span>
            <span className="text-[10px] text-foreground/70 font-light">personalizada</span>
          </div>
          <div className="w-px self-stretch bg-foreground/10" />
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Heart size={18} className="text-foreground/70" />
            <span className="text-xs font-medium text-foreground leading-tight">Hecho a mano</span>
            <span className="text-[10px] text-foreground/70 font-light">en España</span>
          </div>
          <div className="w-px self-stretch bg-foreground/10" />
          <div className="flex flex-col items-center gap-1.5 text-center">
            <Truck size={18} className="text-foreground/70" />
            <span className="text-xs font-medium text-foreground leading-tight">Entrega</span>
            <span className="text-[10px] text-foreground/70 font-light">en 20 días</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
