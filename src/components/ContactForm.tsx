import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { toast } from "sonner";
import { Check, Loader2, ChevronDown } from "lucide-react";

const PRODUCT_OPTIONS = ["Cabecero", "Banco", "Mesita", "Cojines", "Puff", "Varios"];

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const fromConfig = searchParams.get('config');
  const prefilledProduct = searchParams.get('product');
  const expressParam = searchParams.get('express');

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
    // TODO: Save to Supabase table `pedidos`
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  };

  if (sent) {
    return (
      <section className="py-20 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80" alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-background/85" />
        </div>
        <div className="relative z-10 container mx-auto max-w-xl text-center py-20">
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
            className="mt-8 px-8 py-3 bg-accent-warm text-white text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity"
          >
            Volver al inicio
          </button>
          <p className="font-serif text-xl mt-8 tracking-ultra-wide text-foreground/60">TIRO·RIRO</p>
        </div>
      </section>
    );
  }

  const fieldError = (field: string) =>
    touched[field] && errors[field] ? (
      <p className="text-xs mt-1 font-light" style={{ color: 'hsl(0 84% 60%)' }}>{errors[field]}</p>
    ) : null;

  const fieldBorderColor = (field: string) =>
    touched[field] && errors[field] ? '#ef4444' : '#E8DCC8';

  return (
    <section id="contacto" className="py-20 md:py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80" alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative z-10 container mx-auto max-w-xl">
        {fromConfig && (
          <AnimatedSection className="mb-8">
            <div className="border-l-4 px-5 py-4 rounded-r text-sm text-foreground font-light" style={{ borderColor: 'hsl(var(--accent-warm))', backgroundColor: 'hsl(29 43% 59% / 0.08)' }}>
              Tu configuración está guardada ↓ Revísala y completa tus datos.
              {expressParam === 'true' && (
                <span className="block mt-1 text-accent-warm">+ Entrega express (7 días) +35€</span>
              )}
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Cuéntanos qué quieres</h2>
          <span className="section-line" />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FieldCard label="Nombre *" htmlFor="contact-name" borderColor={fieldBorderColor('name')}>
              <input id="contact-name" type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="field-input" placeholder="Tu nombre" />
              {fieldError('name')}
            </FieldCard>

            <FieldCard label="Teléfono * (te llamamos nosotros)" htmlFor="contact-phone" borderColor={fieldBorderColor('phone')}>
              <input id="contact-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="field-input" placeholder="612 345 678" />
              {fieldError('phone')}
            </FieldCard>

            <FieldCard label="Email *" htmlFor="contact-email" borderColor={fieldBorderColor('email')}>
              <input id="contact-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="field-input" placeholder="tu@email.com" />
              {fieldError('email')}
            </FieldCard>

            <FieldCard label="Producto de interés *" htmlFor="contact-product" borderColor={fieldBorderColor('product')}>
              <div className="relative">
                <select id="contact-product" value={form.product} onChange={(e) => update("product", e.target.value)} className="field-input appearance-none cursor-pointer pr-8">
                  <option value="">Seleccionar...</option>
                  {PRODUCT_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              {fieldError('product')}
            </FieldCard>

            <FieldCard label="Cuéntanos un poco más" htmlFor="contact-details">
              <textarea
                id="contact-details"
                value={form.details}
                onChange={(e) => update("details", e.target.value)}
                rows={4}
                className="field-input resize-none"
                placeholder="Tengo una cama de 150, me gusta el lino en tono crudo y quiero el cabecero con vivo doble..."
              />
            </FieldCard>

            <FieldCard label="¿Cómo nos has conocido? (opcional)" htmlFor="contact-source">
              <input id="contact-source" type="text" value={form.source} onChange={(e) => update("source", e.target.value)} className="field-input" placeholder="Instagram, un amigo, Google..." />
            </FieldCard>

            {/* RGPD Checkbox */}
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
              <p className="text-xs font-light" style={{ color: 'hsl(0 84% 60%)' }}>{errors.rgpd}</p>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={sending}
                className="w-full sm:w-auto sm:mx-auto sm:block px-10 py-3.5 bg-accent-warm text-white text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Quiero el mío"
                )}
              </button>
              <p className="mt-4 text-xs text-muted-foreground font-light italic text-center">
                Te llamamos en menos de 24 horas laborables — sin compromiso.
              </p>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
};

const FieldCard = ({ label, children, htmlFor, borderColor = '#E8DCC8' }: { label: string; children: React.ReactNode; htmlFor?: string; borderColor?: string }) => (
  <div className="rounded p-4 transition-colors duration-200" style={{ backgroundColor: '#FDFAF5', border: `1px solid ${borderColor}` }}>
    <label htmlFor={htmlFor} className="block text-xs tracking-extra-wide uppercase text-muted-foreground mb-2 font-light">{label}</label>
    {children}
  </div>
);

function mapProductName(name: string): string {
  if (name.toLowerCase().includes('cabecero')) return 'Cabecero';
  if (name.toLowerCase().includes('banco')) return 'Banco';
  if (name.toLowerCase().includes('mesita')) return 'Mesita';
  if (name.toLowerCase().includes('cojin') || name.toLowerCase().includes('cojín')) return 'Cojines';
  if (name.toLowerCase().includes('puff')) return 'Puff';
  return 'Varios';
}

export default ContactForm;
