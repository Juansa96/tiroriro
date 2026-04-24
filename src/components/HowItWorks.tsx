import { Link } from "react-router-dom";
import { House, PencilRuler, PhoneCall } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const STEPS = [
  {
    num: "01",
    title: "Diseña y elige",
    text: "Usa el configurador para elegir forma, medida y tela. Todo queda claro desde el principio, sin pasos confusos.",
    Icon: PencilRuler,
    tone: "bg-[#F3EFE7] border-[#E0D9CD]",
    iconTone: "bg-white/80 text-primary border border-primary/8",
    textTone: "text-foreground",
  },
  {
    num: "02",
    title: "Te llamamos",
    text: "Beatriz o Rocío te llaman en 24h para confirmar cada detalle y, si quieres, te mandamos telas a casa para que las veas antes de decidir.",
    Icon: PhoneCall,
    tone: "bg-[#E7E6DD] border-[#D6D5CA]",
    iconTone: "bg-white/75 text-primary border border-primary/8",
    textTone: "text-foreground",
  },
  {
    num: "03",
    title: "Lo recibes en casa",
    text: "En unos 15 días lo recibes listo para colocar, ya sea apoyado, colgado o tal y como lo hayas elegido. Y si estás en Madrid, también podemos instalarlo por ti.",
    Icon: House,
    tone: "bg-[#D7E0E1] border-[#C5D0D2]",
    iconTone: "bg-white/75 text-primary border border-primary/8",
    textTone: "text-foreground",
  },
];

const HowItWorks = () => (
  <section className="py-20 md:py-32 px-6 bg-secondary">
    <div className="container mx-auto">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-10 md:mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Así funciona</h2>
          <span className="section-line" />
          <p className="mt-5 text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
            Un recorrido sencillo, ordenado y claro. Sin formularios eternos, sin pasos confusos y sin sorpresas al final. Diseñas online, revisamos contigo los detalles y lo recibes en casa con un proceso cuidado de principio a fin.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {STEPS.map(({ num, title, text, Icon, tone, iconTone, textTone }) => (
            <article
              key={num}
              className={`${tone} ${textTone} rounded-[2rem] border p-6 md:p-7 lg:p-8 shadow-[0_10px_30px_rgba(16,38,46,0.05)] transition-transform duration-300 hover:-translate-y-1 min-h-[320px] md:min-h-[380px] flex flex-col`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${iconTone}`}>
                    <Icon size={18} strokeWidth={1.8} />
                  </div>
                  <span className="text-[11px] tracking-[0.28em] uppercase opacity-55">{num}</span>
                </div>
                <span className="text-lg opacity-25">↗</span>
              </div>

              <div className="mt-10 flex-1">
                <h3 className="font-serif text-2xl md:text-[2rem] leading-tight text-balance">{title}</h3>
                <p className="mt-4 text-base md:text-[1.05rem] leading-relaxed font-light opacity-80">
                  {text}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/configurador"
            className="btn-sweep btn-unir btn-unir-outline inline-flex items-center px-8 py-3 text-xs font-light"
          >
            <span>Diseña el tuyo</span>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
