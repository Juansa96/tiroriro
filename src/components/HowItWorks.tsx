import { Link } from "react-router-dom";

const STEPS = [
  {
    num: "01",
    title: "Diseña y elige",
    text: "Usa el configurador para elegir forma, medida y tela. El precio aparece al momento — sin sorpresas.",
    href: "/configurador",
    alt: false,
  },
  {
    num: "02",
    title: "Te llamamos nosotros",
    text: "Beatriz o Rocío te llaman en 24h para confirmar cada detalle. Pagas de forma segura.",
    href: null,
    alt: true,
  },
  {
    num: "03",
    title: "Muestras a casa",
    text: "Antes de confirmar, te mandamos muestras de tela (con coste, que se descuenta de tu pedido si compras) para que veas el color real.",
    href: null,
    alt: true,
  },
  {
    num: "04",
    title: "Lo recibes en casa",
    text: "En 15 días llega listo para colocar. Sin anclaje incluido por defecto: añade patas, fijación a pared o instalación (solo Madrid) si lo necesitas.",
    href: null,
    alt: false,
  },
];

const HowItWorks = () => (
  <section className="py-20 md:py-32 px-6 bg-secondary">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
        <div>
          <span className="block w-5 h-px bg-primary mb-3" />
          <p className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground mb-2">El proceso</p>
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Así funciona</h2>
        </div>
        <p className="text-base text-muted-foreground font-light max-w-[200px] md:text-right leading-relaxed">
          Sin obras, sin montadores, sin estrés.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border max-w-4xl mx-auto">
        {STEPS.map((s) => (
          <div
            key={s.num}
            className={`relative p-10 group transition-colors duration-300 ${
              s.alt
                ? "bg-muted hover:bg-secondary"
                : "bg-secondary hover:bg-muted"
            }`}
          >
            <span className="block font-serif text-6xl font-light text-border leading-none mb-6 select-none">
              {s.num}
            </span>
            <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground mb-3">{s.title}</h3>
            <p className="text-base leading-relaxed text-muted-foreground font-light">{s.text}</p>
            <span className="absolute bottom-6 right-6 text-border group-hover:text-muted-foreground transition-colors duration-300 text-lg">
              ↗
            </span>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link
          to="/configurador"
          className="btn-sweep inline-flex items-center px-8 py-3 bg-primary text-primary-foreground text-xs tracking-[0.1em] uppercase font-light transition-all duration-300 hover:opacity-90"
        >
          <span className="relative z-10">Diseña el tuyo</span>
        </Link>
      </div>
    </div>
  </section>
);

export default HowItWorks;
