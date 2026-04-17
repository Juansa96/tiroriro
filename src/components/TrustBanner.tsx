const TrustBanner = () => (
  <section className="py-4 bg-primary/10">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8">
      <span className="text-sm tracking-wide uppercase text-foreground/70 font-light">Más de 150 piezas entregadas</span>
      <span className="hidden sm:inline text-foreground/30">·</span>
      <span className="text-sm tracking-wide uppercase text-foreground/70 font-light">Hecho a mano en España</span>
      <span className="hidden sm:inline text-foreground/30">·</span>
      <span className="text-sm tracking-wide uppercase text-foreground/70 font-light">Entrega en 15 días</span>
    </div>
  </section>
);
export default TrustBanner;
