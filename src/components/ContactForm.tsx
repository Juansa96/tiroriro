import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { toast } from "sonner";
import { Check } from "lucide-react";

const PRODUCT_OPTIONS = ["Cabecero", "Banco", "Mesita", "Cojines", "Puff", "Varios"];
const PROGRESS_STEPS = ["Elige", "Configura", "Confirma"];

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const fromConfig = searchParams.get('config');
  const prefilledProduct = searchParams.get('product');

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    details: "",
    source: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (prefilledProduct || fromConfig) {
      setForm(f => ({
        ...f,
        product: prefilledProduct ? mapProductName(prefilledProduct) : f.product,
        details: fromConfig || f.details,
      }));
    }
  }, [prefilledProduct, fromConfig]);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.product) {
      toast.error("Por favor, rellena los campos obligatorios.");
      return;
    }
    setSending(true);
    // TODO: Save to Supabase
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
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">Lo tenemos</h2>
          <span className="section-line" />
          <p className="mt-6 text-muted-foreground font-light text-lg">
            Beatriz o Rocío te llaman antes de 48 horas.
          </p>
          <p className="font-serif text-xl mt-8 tracking-ultra-wide text-foreground/60">TIRO·RIRO</p>
        </div>
      </section>
    );
  }

  return (
    <section id="contacto" className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80" alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-background/85" />
      </div>

      <div className="relative z-10 container mx-auto max-w-xl">
        {/* Progress indicator */}
        <AnimatedSection className="mb-10">
          <div className="flex items-center justify-center gap-2">
            {PROGRESS_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  i === 2 ? "bg-accent-warm text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <span className={`text-xs tracking-extra-wide uppercase ${
                  i === 2 ? "text-accent-warm font-medium" : "text-muted-foreground font-light"
                }`}>{step}</span>
                {i < PROGRESS_STEPS.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Config banner */}
        {fromConfig && (
          <AnimatedSection className="mb-8">
            <div className="border-l-4 px-5 py-4 rounded-r text-sm text-foreground font-light" style={{ borderColor: 'hsl(var(--accent-warm))', backgroundColor: 'hsl(29 43% 59% / 0.08)' }}>
              Hemos añadido tu configuración — revísala y completa tus datos.
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Cuéntanos qué quieres</h2>
          <span className="section-line" />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <FieldCard label="Nombre *">
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="field-input" required />
            </FieldCard>
            <FieldCard label="Teléfono * (te llamamos nosotras)">
              <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="field-input" required />
            </FieldCard>
            <FieldCard label="Email *">
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="field-input" required />
            </FieldCard>
            <FieldCard label="Producto de interés *">
              <select value={form.product} onChange={(e) => update("product", e.target.value)} className="field-input appearance-none cursor-pointer" required>
                <option value="">Seleccionar...</option>
                {PRODUCT_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </FieldCard>
            <FieldCard label="Cuéntanos un poco más">
              <textarea
                value={form.details}
                onChange={(e) => update("details", e.target.value)}
                rows={4}
                className="field-input resize-none"
                placeholder="Tengo una cama de 150, me gusta el lino en tono crudo y quiero el cabecero con vivo doble..."
              />
            </FieldCard>
            <FieldCard label="¿Cómo nos has conocido? (opcional)">
              <input type="text" value={form.source} onChange={(e) => update("source", e.target.value)} className="field-input" />
            </FieldCard>

            <div className="pt-4">
              <button
                type="submit"
                disabled={sending}
                className="w-full sm:w-auto sm:mx-auto sm:block px-10 py-3.5 bg-accent-warm text-white text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {sending ? "Enviando..." : "Quiero el mío"}
              </button>
              <p className="mt-4 text-xs text-muted-foreground font-light italic text-center">
                Te llamamos en menos de 48 horas — sin compromiso.
              </p>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
};

const FieldCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded p-4 border" style={{ backgroundColor: '#FDFAF5', borderColor: '#E8DCC8' }}>
    <label className="block text-xs tracking-extra-wide uppercase text-muted-foreground mb-2 font-light">{label}</label>
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
