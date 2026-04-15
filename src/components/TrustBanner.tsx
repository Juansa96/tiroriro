const TrustBanner = () => (
  <section className="py-4 bg-secondary">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8">
      <span className="text-xs tracking-extra-wide uppercase text-muted-foreground font-light">
        Más de 150 piezas entregadas
      </span>
      <span className="hidden sm:inline text-muted-foreground/40">·</span>
      <span className="text-xs tracking-extra-wide uppercase text-muted-foreground font-light">
        Hecho a mano en España
      </span>
      <span className="hidden sm:inline text-muted-foreground/40">·</span>
      <span className="text-xs tracking-extra-wide uppercase text-muted-foreground font-light">
        Entrega en 15 días
      </span>
    </div>
  </section>
);

export default TrustBanner;
