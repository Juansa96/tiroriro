import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => (
  <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
    {/* Video placeholder — using an image for now */}
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80"
        alt="Taller artesanal de tapizado"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/40" />
    </div>

    <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-primary-foreground leading-tight"
      >
        Algunas cosas merecen hacerse a mano
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-6 text-base md:text-lg text-primary-foreground/80 font-light max-w-xl mx-auto leading-relaxed"
      >
        Nosotras construimos, tapizamos y enviamos — tú solo eliges la tela y el tamaño y en 15 días lo tienes en casa.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link
          to="/productos"
          className="px-8 py-3.5 bg-primary-foreground text-primary text-sm tracking-extra-wide uppercase font-medium hover:bg-primary-foreground/90 transition-colors"
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
    </div>
  </section>
);

export default HeroSection;
