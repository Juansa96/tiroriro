import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, MessageCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WHATSAPP_URL =
  "https://wa.me/34660786453?text=" +
  encodeURIComponent(
    "Hola, acabo de enviar el formulario y quería confirmar que lo habéis recibido."
  );

const GraciasPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "";
  const firstName = name.split(" ")[0];

  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background flex flex-col">
        <section className="flex-1 flex items-center justify-center py-24 px-6">
          <div className="container mx-auto max-w-lg text-center">

            {/* Icono */}
            <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-[#1a4b5b]/8 border border-[#1a4b5b]/15 flex items-center justify-center">
              <CheckCircle2 size={38} strokeWidth={1.4} className="text-[#1a4b5b]" />
            </div>

            {/* Título */}
            <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground leading-tight">
              {firstName ? `Gracias, ${firstName}` : "¡Mensaje recibido!"}
            </h1>
            <span className="section-line" />

            {/* Subtítulo */}
            <p className="mt-6 text-base md:text-lg text-muted-foreground font-light leading-relaxed">
              Hemos recibido tu solicitud y te responderemos{" "}
              <strong className="font-medium text-foreground">en menos de 24 horas laborables</strong>.
              <br />
              Revisa también tu bandeja de entrada — te hemos enviado una copia.
            </p>

            {/* Separador con info */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              {[
                { step: "01", label: "Revisamos tu solicitud", desc: "Estudiamos tu petición con detalle." },
                { step: "02", label: "Te enviamos presupuesto", desc: "Sin compromiso, ajustado a ti." },
                { step: "03", label: "Empezamos a hacer magia", desc: "Manos a la obra cuando confirmes." },
              ].map(({ step, label, desc }) => (
                <div key={step} className="rounded-xl border border-border/50 bg-secondary/40 px-4 py-5">
                  <p className="text-[10px] tracking-[0.20em] uppercase text-muted-foreground/60 font-medium mb-1">{step}</p>
                  <p className="text-sm font-medium text-foreground font-serif">{label}</p>
                  <p className="text-xs text-muted-foreground font-light mt-0.5 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/"
                className="btn-sweep btn-unir btn-unir-outline inline-flex items-center gap-2 px-8 py-3.5 text-xs tracking-[0.18em] uppercase font-light"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  Volver al inicio <ArrowRight size={13} />
                </span>
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-accent-warm hover:underline font-medium"
              >
                <MessageCircle size={15} />
                ¿Tienes prisa? Escríbenos por WhatsApp
              </a>
            </div>

            {/* Nota al pie */}
            <p className="mt-12 text-xs text-muted-foreground/50 font-light">
              Si no recibes respuesta en 24 h, revisa la carpeta de spam o escríbenos a{" "}
              <a href="mailto:info@tirorirohome.com" className="underline hover:text-foreground transition-colors">
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
