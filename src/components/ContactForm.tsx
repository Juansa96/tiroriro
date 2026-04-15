import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { toast } from "sonner";
import { Check, Loader2, ChevronDown } from "lucide-react";

const PRODUCT_OPTIONS = ["Cabecero", "Banco", "Cojines", "Puff", "Varios"];

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const fromConfig = searchParams.get('config');
  const prefilledProduct = searchParams.get('product');
  const expressParam = searchParams.get('express');
  const priceParam = searchParams.get('precio');

  const hasConfigParams = !!(prefilledProduct || fromConfig || priceParam);
  const configuradorVisitado = typeof window !== 'undefined' && localStorage.getItem('configurador_visitado') === 'true';

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    details: "",
    source: "",
  });
  const [rgpd, setRgpd] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (prefilledProduct || fromConfig) {
      let details = fromConfig || '';
      if (expressParam === 'true') {
        details += '\nEnvío express en 7 días: Sí (+35€)';
      }
      setForm(f => ({
        ...f,
        product: prefilledProduct ? mapProductName(prefilledProduct) : f.product,
        details: details || f.details,
      }));
    }
  }, [prefilledProduct, fromConfig, expressParam]);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setTouched(t => ({ ...t, [field]: true }));
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio";
    if (!form.phone.trim()) {
      errs.phone = "El teléfono es obligatorio";
    } else if (!/^[6-9]\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      errs.phone = "Introduce un teléfono español válido (9 dígitos)";
    }
    if (!form.email.trim()) {
      errs.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Introduce un email válido";
    }
    if (!form.product) errs.product = "Selecciona un producto";
    if (!rgpd) errs.rgpd = "Debes aceptar la política de privacidad";
    return errs;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      setErrors(validate());
    }
  }, [form, rgpd, touched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, phone: true, email: true, product: true, rgpd: true });
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Por favor, corrige los campos marcados en rojo.");
      return;
    }
    setSending(true);
    // TODO: Save to database
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  };

  if (sent) {
    return (
      <section className="py-20 md:py-32 px-6 bg-background">
        <div className="container mx-auto max-w-xl text-center py-20">
          <div className="w-16 h-16 rounded-full bg-accent-warm/10 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-accent-warm" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
            Gracias, {form.name.split(' ')[0]}
          </h2>
          <span className="section-line" />
          <p className="mt-6 text-muted-foreground font-light text-lg">
            Te llamamos antes de 24 horas laborables.
          </p>
          <button
            onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', product: '', details: '', source: '' }); setRgpd(false); setTouched({}); setErrors({}); }}
            className="mt-8 px-8 py-3 bg-accent-warm text-white text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity rounded-full"
          >
            Volver al inicio
          </button>
        </div>
      </section>
    );
  }

  const hasError = (field: string) => touched[field] && errors[field];
  const borderColor = (field: string) => hasError(field) ? 'border-destructive' : 'border-border focus-within:border-accent-warm';

  const showConfigSuggestion = !hasConfigParams && !configuradorVisitado && (form.product === 'Cabecero' || form.product === 'Banco');
  const showConfigReminder = !hasConfigParams && configuradorVisitado;

  return (
    <section id="contacto" className="py-20 md:py-32 px-6 bg-background">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 overflow-hidden rounded-lg border border-border/40">
          {/* Left column - editorial image (desktop only) */}
          <div className="hidden lg:block lg:col-span-2 relative">
            <img
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80"
              alt="Dormitorio con cabecero tapizado artesanal"
              className="w-full h-full object-cover min-h-[400px]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-serif text-2xl font-light text-white leading-snug">
                "El cabecero que llevas meses imaginando — en 15 días en tu habitación."
              </p>
            </div>
          </div>

          {/* Right column - form */}
          <div className="lg:col-span-3 bg-background px-6 md:px-8 py-10">
            {hasConfigParams && (
              <div className="mb-6 p-4 bg-accent-warm/10 border border-accent-warm/30 rounded">
                <p className="text-sm font-medium text-foreground">
                  ✓ Tu configuración está guardada
                </p>
                {fromConfig && (
                  <p className="text-xs text-muted-foreground mt-1">{fromConfig}</p>
                )}
                {expressParam === 'true' && (
                  <span className="block mt-1 text-xs text-accent-warm">+ Entrega express (7 días) +35€</span>
                )}
              </div>
            )}

            {showConfigReminder && (
              <div className="mb-4 text-xs text-muted-foreground italic">
                Vemos que has estado explorando el configurador. Si tienes dudas con las medidas, <Link to="/configurador" className="underline text-accent-warm">vuelve a él</Link> cuando quieras.
              </div>
            )}

            <h2 className="font-serif text-2xl font-light text-foreground">Cuéntanos qué buscas</h2>
            <p className="text-sm text-muted-foreground italic mt-1 mb-8">Te llamamos en 24 horas — sin compromiso ni presión.</p>

            <form onSubmit={handleSubmit} className="space-y-10" noValidate>
              {/* Nombre */}
              <div className={`relative border-b transition-colors ${borderColor('name')}`}>
                <input
                  id="contact-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="peer w-full bg-transparent pt-6 pb-2 text-base text-foreground placeholder-transparent focus:outline-none"
                  placeholder=" "
                />
                <label
                  htmlFor="contact-name"
                  className="absolute left-0 top-2 text-xs tracking-wide uppercase text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:tracking-wide peer-focus:uppercase peer-focus:text-accent-warm"
                >
                  Nombre *
                </label>
                {hasError('name') && <p className="text-xs mt-1 font-light text-destructive">{errors.name}</p>}
              </div>

              {/* Teléfono */}
              <div className={`relative border-b transition-colors ${borderColor('phone')}`}>
                <input
                  id="contact-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="peer w-full bg-transparent pt-6 pb-2 text-base text-foreground placeholder-transparent focus:outline-none"
                  placeholder=" "
                />
                <label
                  htmlFor="contact-phone"
                  className="absolute left-0 top-2 text-xs tracking-wide uppercase text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:tracking-wide peer-focus:uppercase peer-focus:text-accent-warm"
                >
                  Teléfono * (te llamamos nosotros)
                </label>
                {hasError('phone') && <p className="text-xs mt-1 font-light text-destructive">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div className={`relative border-b transition-colors ${borderColor('email')}`}>
                <input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="peer w-full bg-transparent pt-6 pb-2 text-base text-foreground placeholder-transparent focus:outline-none"
                  placeholder=" "
                />
                <label
                  htmlFor="contact-email"
                  className="absolute left-0 top-2 text-xs tracking-wide uppercase text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:tracking-wide peer-focus:uppercase peer-focus:text-accent-warm"
                >
                  Email *
                </label>
                {hasError('email') && <p className="text-xs mt-1 font-light text-destructive">{errors.email}</p>}
              </div>

              {/* Producto */}
              <div className={`relative border-b transition-colors ${borderColor('product')}`}>
                <label htmlFor="contact-product" className="block text-xs tracking-wide uppercase text-muted-foreground mb-1">
                  Producto de interés *
                </label>
                <div className="relative">
                  <select
                    id="contact-product"
                    value={form.product}
                    onChange={(e) => update("product", e.target.value)}
                    className="w-full bg-transparent pb-2 text-base text-foreground focus:outline-none appearance-none cursor-pointer pr-8"
                  >
                    <option value="">Seleccionar...</option>
                    {PRODUCT_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                {hasError('product') && <p className="text-xs mt-1 font-light text-destructive">{errors.product}</p>}
              </div>

              {/* Configurator suggestion */}
              {showConfigSuggestion && (
                <div className="p-3 bg-secondary rounded flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    ¿Sabes las medidas y la tela que quieres? Usa nuestro configurador para ver el precio exacto antes de enviarnos el formulario.
                  </p>
                  <Link to="/configurador" className="text-xs whitespace-nowrap text-accent-warm underline underline-offset-2 font-medium">
                    Ir al configurador →
                  </Link>
                </div>
              )}

              {/* Detalles */}
              <div className="relative border-b border-border transition-colors focus-within:border-accent-warm">
                <textarea
                  id="contact-details"
                  value={form.details}
                  onChange={(e) => update("details", e.target.value)}
                  rows={4}
                  className="peer w-full bg-transparent pt-6 pb-2 text-base text-foreground placeholder-transparent focus:outline-none resize-none"
                  placeholder=" "
                />
                <label
                  htmlFor="contact-details"
                  className="absolute left-0 top-2 text-xs tracking-wide uppercase text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:tracking-wide peer-focus:uppercase peer-focus:text-accent-warm"
                >
                  Cuéntanos un poco más
                </label>
              </div>

              {/* Fuente */}
              <div className="relative border-b border-border transition-colors focus-within:border-accent-warm">
                <input
                  id="contact-source"
                  type="text"
                  value={form.source}
                  onChange={(e) => update("source", e.target.value)}
                  className="peer w-full bg-transparent pt-6 pb-2 text-base text-foreground placeholder-transparent focus:outline-none"
                  placeholder=" "
                />
                <label
                  htmlFor="contact-source"
                  className="absolute left-0 top-2 text-xs tracking-wide uppercase text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-xs peer-focus:tracking-wide peer-focus:uppercase peer-focus:text-accent-warm"
                >
                  ¿Cómo nos has conocido? (opcional)
                </label>
              </div>

              {/* RGPD */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  id="rgpd"
                  type="checkbox"
                  checked={rgpd}
                  onChange={(e) => { setRgpd(e.target.checked); setTouched(t => ({ ...t, rgpd: true })); }}
                  className="mt-1 w-4 h-4 accent-accent-warm cursor-pointer shrink-0"
                />
                <label htmlFor="rgpd" className="text-xs text-muted-foreground font-light leading-relaxed cursor-pointer">
                  He leído y acepto la{" "}
                  <Link to="/privacidad" className="underline hover:text-foreground transition-colors">
                    Política de Privacidad
                  </Link>
                </label>
              </div>
              {touched.rgpd && errors.rgpd && (
                <p className="text-xs font-light text-destructive">{errors.rgpd}</p>
              )}

              <div className="pt-4 text-center">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-10 py-4 bg-accent-warm text-white text-sm tracking-widest uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-50 rounded-full inline-flex items-center gap-2"
                >
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Quiero el mío →"
                  )}
                </button>
                <p className="mt-4 text-xs text-muted-foreground font-light italic">
                  Te llamamos en menos de 24 horas laborables — sin compromiso.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

function mapProductName(name: string): string {
  if (name.toLowerCase().includes('cabecero')) return 'Cabecero';
  if (name.toLowerCase().includes('banco')) return 'Banco';
  if (name.toLowerCase().includes('cojin') || name.toLowerCase().includes('cojín')) return 'Cojines';
  if (name.toLowerCase().includes('puff')) return 'Puff';
  return 'Varios';
}

export default ContactForm;
