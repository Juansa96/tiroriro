import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State =
  | { kind: "loading" }
  | { kind: "valid" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });
  // Helmet rendered below

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (!res.ok) {
          setState({ kind: "invalid" });
          return;
        }
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setState({ kind: "already" });
        } else if (data.valid === true) {
          setState({ kind: "valid" });
        } else {
          setState({ kind: "invalid" });
        }
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setState({ kind: "success" });
      } else if (data?.reason === "already_unsubscribed") {
        setState({ kind: "already" });
      } else {
        setState({ kind: "error", message: "No hemos podido procesar la baja." });
      }
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Error inesperado",
      });
    }
  };

  return (
    <>
      <Helmet><meta name="robots" content="noindex,follow" /></Helmet>
      <Navbar />
      <main className="pt-20 min-h-screen bg-background flex flex-col">
        <section className="flex-1 flex items-center justify-center py-24 px-6">
          <div className="container mx-auto max-w-md text-center">
            {state.kind === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={32} className="animate-spin text-accent-warm" />
                <p className="text-sm text-muted-foreground font-light">Verificando tu enlace…</p>
              </div>
            )}

            {state.kind === "valid" && (
              <>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-foreground">
                  ¿Quieres darte de baja?
                </h1>
                <span className="section-line" />
                <p className="mt-6 text-base text-muted-foreground font-light leading-relaxed">
                  Confirma para dejar de recibir nuestros emails. Podrás escribirnos de nuevo cuando quieras.
                </p>
                <button
                  onClick={handleConfirm}
                  className="btn-sweep btn-unir btn-unir-outline mt-10 inline-flex items-center px-8 py-3 text-xs tracking-[0.18em] uppercase font-light"
                >
                  <span className="relative z-10">Confirmar baja →</span>
                </button>
              </>
            )}

            {state.kind === "submitting" && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 size={32} className="animate-spin text-accent-warm" />
                <p className="text-sm text-muted-foreground font-light">Procesando…</p>
              </div>
            )}

            {state.kind === "success" && (
              <>
                <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-[#1a4b5b]/8 border border-[#1a4b5b]/15 flex items-center justify-center">
                  <CheckCircle2 size={38} strokeWidth={1.4} className="text-[#1a4b5b]" />
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-foreground">
                  Te hemos dado de baja
                </h1>
                <span className="section-line" />
                <p className="mt-6 text-base text-muted-foreground font-light leading-relaxed">
                  No recibirás más emails de Tiroriro. Si fue un error, escríbenos y lo arreglamos.
                </p>
                <Link to="/" className="cta-link mt-10 inline-block">Volver al inicio</Link>
              </>
            )}

            {state.kind === "already" && (
              <>
                <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <CheckCircle2 size={38} strokeWidth={1.4} className="text-muted-foreground" />
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-foreground">
                  Ya estabas dado de baja
                </h1>
                <span className="section-line" />
                <p className="mt-6 text-base text-muted-foreground font-light leading-relaxed">
                  No volverás a recibir emails de nuestra parte.
                </p>
                <Link to="/" className="cta-link mt-10 inline-block">Volver al inicio</Link>
              </>
            )}

            {(state.kind === "invalid" || state.kind === "error") && (
              <>
                <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                  <AlertCircle size={38} strokeWidth={1.4} className="text-destructive" />
                </div>
                <h1 className="font-serif text-3xl md:text-4xl font-light text-foreground">
                  Enlace no válido
                </h1>
                <span className="section-line" />
                <p className="mt-6 text-base text-muted-foreground font-light leading-relaxed">
                  {state.kind === "error"
                    ? state.message
                    : "Este enlace ha caducado o no es correcto. Si quieres darte de baja, escríbenos a info@tirorirohome.com."}
                </p>
                <Link to="/" className="cta-link mt-10 inline-block">Volver al inicio</Link>
              </>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default UnsubscribePage;