const Diamond = () => (
  <svg width="6" height="6" viewBox="0 0 6 6" className="text-accent-warm/60" aria-hidden="true">
    <rect x="3" y="0" width="4.24" height="4.24" transform="rotate(45 3 0)" fill="currentColor" />
  </svg>
);

const Stat = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-foreground/60 font-light">
    <span className="text-accent-warm/70" aria-hidden="true">⟡</span>
    {children}
  </span>
);

const TrustBanner = () => (
  <section className="py-3 bg-primary/10">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
      <Stat>Más de 150 piezas entregadas</Stat>
      <span className="hidden sm:inline-flex"><Diamond /></span>
      <Stat>Hecho a mano en España</Stat>
      <span className="hidden sm:inline-flex"><Diamond /></span>
      <Stat>Entrega en 15 días</Stat>
    </div>
  </section>
);

export default TrustBanner;
