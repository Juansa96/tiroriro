import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";
import { Check, MessageCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WHATSAPP_URL =
  "https://wa.me/34660786453?text=" +
  encodeURIComponent(
    "Hola, acabo de enviar el formulario y tengo algo de prisa. ¿Podéis responderme pronto?"
  );

const STEPS = [
  { n: "01", title: "Revisamos tu solicitud", body: "Estudiamos tu petición con detalle." },
  { n: "02", title: "Te enviamos presupuesto", body: "Sin compromiso, ajustado a ti." },
  { n: "03", title: "Empezamos a hacer magia", body: "Manos a la obra cuando confirmes." },
];

const GraciasPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const firstName = name.split(" ")[0];

  return (
    <>
      <Helmet><meta name="robots" content="noindex,follow" /></Helmet>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background flex flex-col">
        <section className="flex-1 flex items-center justify-center py-28 md:py-36 px-6">
          <div className="w-full max-w-[460px] mx-auto text-center">

            {/* Icono — sutil, limpio, sin exceso */}
            <div className="mx-auto mb-12 w-11 h-11 rounded-full border border-border/70 bg-secondary/50 flex items-center justify-center">
              <Check size={16} strokeWidth={1.8} className="text-foreground/60" />
            </div>

            {/* Título */}
            <h1 className="font-serif text-5xl md:text-[3.5rem] font-light text-foreground leading-none tracking-tight">
              {firstName ? `Gracias, ${firstName}` : "Recibido"}
            </h1>
            <span className="section-line mt-5" />

            {/* Mensaje principal */}
            <p className="mt-8 text-base text-muted-foreground font-light leading-relaxed">
              Hemos recibido tu solicitud y te responderemos{" "}
              <strong className="font-medium text-foreground">en menos de 24 horas laborables</strong>.
            </p>
            <p className="mt-2 text-sm text-muted-foreground/60 font-light">
              Revisa tu bandeja de entrada — te hemos enviado una copia.
            </p>

            {/* Pasos: lista conectada vertical-on-mobile / horizontal-on-sm */}
            <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 rounded-2xl border border-border/40 overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-border/30">
              {STEPS.map(({ n, title, body }) => (
                <div key={n} className="px-6 py-7 text-left bg-secondary/30 flex flex-col gap-2.5">
                  <span className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground/40 font-medium">{n}</span>
                  <p className="text-sm font-medium text-foreground leading-snug">{title}</p>
                  <p className="text-xs text-muted-foreground/80 font-light leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-12 flex flex-col items-center gap-5">
              <Link
                to="/"
                className="btn-sweep btn-unir btn-unir-outline inline-flex items-center gap-2.5 px-8 py-3 text-xs tracking-[0.18em] uppercase font-light"
              >
                <span className="relative z-10 inline-flex items-center gap-2.5">
                  Volver al inicio <ArrowRight size={12} />
                </span>
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-light"
              >
                <MessageCircle size={14} className="text-accent-warm shrink-0" />
                ¿Tienes prisa? Escríbenos por WhatsApp
              </a>
            </div>

            {/* Nota discreta al pie */}
            <p className="mt-16 text-[11px] text-muted-foreground/35 font-light leading-relaxed">
              Si no recibes respuesta en 24 h, revisa el spam o escríbenos a{" "}
              <a
                href="mailto:info@tirorirohome.com"
                className="underline underline-offset-2 hover:text-muted-foreground/60 transition-colors"
              >
                info@tirorirohome.com
              </a>
            </p>

          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default GraciasPage;
