import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImage from "@/assets/hero-portada.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={heroImage}
          alt="Dormitorio elegante con cabecero tapizado artesanal, luz cálida lateral"
          className="w-full h-[120%] object-cover object-center"
          loading="eager"
          decoding="async"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/35 to-foreground/15" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-primary-foreground leading-tight"
          style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}
        >
          Algunas cosas merecen hacerse a mano
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-6 text-base md:text-lg text-primary-foreground/80 font-light max-w-xl mx-auto leading-relaxed"
          style={{ textShadow: '0 1px 16px rgba(0,0,0,0.45)' }}
        >
          Nuestro equipo construye, tapiza y envía — tú solo eliges la tela y el tamaño y en 15 días lo tienes en casa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/productos"
            className="px-8 py-3.5 bg-accent-warm text-accent-warm-foreground text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity"
          >
            Ver productos
          </Link>
          <Link
            to="/configurador"
            className="px-8 py-3.5 border border-primary-foreground/60 text-primary-foreground text-sm tracking-extra-wide uppercase font-light hover:bg-primary-foreground/10 transition-colors"
          >
            Personaliza el tuyo
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-xs text-primary-foreground/60 font-light tracking-wide mt-4"
          style={{ textShadow: '0 1px 16px rgba(0,0,0,0.45)' }}
        >
          Cabeceros desde 180€ · Bancos desde 120€ · Precio exacto en el configurador
        </motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
