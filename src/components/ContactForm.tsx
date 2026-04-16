import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Check, Loader2, MessageCircle } from "lucide-react";

const PRODUCT_OPTIONS = ["Cabecero", "Banco tapizado", "Cojines", "Puff", "Mesa de centro", "Otro"];

const WHATSAPP_URL = "https://wa.me/34645363323?text=" + encodeURIComponent("Hola, me interesa uno de vuestros productos tapizados y quería más información.");

function mapProductName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('cabecero')) return 'Cabecero';
  if (n.includes('banco')) return 'Banco tapizado';
  if (n.includes('cojin') || n.includes('cojín')) return 'Cojines';
  if (n.includes('puff')) return 'Puff';
  if (n.includes('mesa')) return 'Mesa de centro';
  return 'Varios';
}

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const fromConfig = searchParams.get('config');
  const prefilledProduct = searchParams.get('product');
  const expressParam = searchParams.get('express');
  const priceParam = searchParams.get('precio');

  const hasConfigParams = !!(prefilledProduct || fromConfig || priceParam);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    details: "",
  });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
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
      if (prefilledProduct) {
        const mapped = mapProductName(prefilledProduct);
        setSelectedProducts(prev => prev.includes(mapped) ? prev : [...prev, mapped]);
      }
      setForm(f => ({
        ...f,
        details: details || f.details,
      }));
    }
  }, [prefilledProduct, fromConfig, expressParam]);

  const toggleProduct = (p: string) => {
    setSelectedProducts(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    setTouched(t => ({ ...t, product: true }));
  };

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setTouched(t => ({ ...t, [field]: true }));
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio";
    if (form.phone.trim() && !/^[6-9]\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      errs.phone = "Introduce un teléfono español válido (9 dígitos)";
    }
    if (!form.email.trim()) {
      errs.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Introduce un email válido";
    }
    if (selectedProducts.length === 0) errs.product = "Selecciona al menos un producto";
    if (!rgpd) errs.rgpd = "Debes aceptar la política de privacidad";
    return errs;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      setErrors(validate());
    }
  }, [form, rgpd, selectedProducts, touched]);

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
    // TODO: Save to database (Lovable Cloud)
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
            Te respondemos en menos de 24 horas laborables.
          </p>
          <button
            onClick={() => { setSent(false); setForm({ name: '', lastName: '', phone: '', email: '', details: '' }); setSelectedProducts([]); setRgpd(false); setTouched({}); setErrors({}); }}
            className="mt-8 px-8 py-3 bg-accent-warm text-white text-sm tracking-extra-wide uppercase font-medium hover:opacity-90 transition-opacity rounded-full"
          >
            Volver al inicio
          </button>
        </div>
      </section>
    );
  }

  const hasError = (field: string) => touched[field] && errors[field];
  const inputBase = "w-full bg-background border border-border rounded-lg px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-warm focus:ring-1 focus:ring-accent-warm/30 transition-colors";

  // Build config tags from URL params
  const configTags: { label: string; value: string }[] = [];
  if (prefilledProduct) configTags.push({ label: 'Producto', value: mapProductName(prefilledProduct) });
  if (fromConfig) {
    // Parse summary string like "Me interesa: Cabeceros tapizados · Arco · Cama 150cm · Color: Lino Natural (aprox. 255€)"
    const cleaned = fromConfig.replace(/^Me interesa:\s*/i, '').replace(/\s*\(aprox\.[^)]+\)\s*$/, '');
    const parts = cleaned.split('·').map(p => p.trim()).filter(Boolean);
    parts.slice(1).forEach((p) => {
      configTags.push({ label: '', value: p });
    });
  }
  if (priceParam) configTags.push({ label: 'Precio aprox.', value: `${priceParam}€` });
  if (expressParam === 'true') configTags.push({ label: 'Extras', value: 'Express 7 días (+35€)' });

  return (
    <section id="contacto" className="py-20 md:py-32 px-6 bg-background">
      <div className="container mx-auto max-w-[600px]">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">Cuéntanos qué buscas</h2>
          <span className="section-line" />
          <p className="mt-4 text-base text-muted-foreground font-light italic">
            Te respondemos en menos de 24 horas — sin compromiso ni presión.
          </p>
        </div>

        {hasConfigParams && (
          <div className="mb-8 p-5 bg-accent-warm/10 border border-accent-warm/30 rounded-md">
            <p className="text-sm font-medium text-foreground flex items-start gap-2">
              <span className="text-accent-warm">✦</span>
              <span>Hemos recuperado tu selección del configurador — los campos ya están rellenados. Puedes modificarlos.</span>
            </p>
            {configTags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {configTags.map((t, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-background border border-border rounded-full text-foreground">
                    {t.label && <span className="text-muted-foreground mr-1">{t.label}:</span>}
                    {t.value}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Nombre + Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-name" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">
                Nombre *
              </label>
              <input
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Tu nombre"
                className={`${inputBase} ${hasError('name') ? 'border-destructive' : ''}`}
              />
              {hasError('name') && <p className="text-xs mt-1 text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="contact-phone" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">
                Teléfono / WhatsApp
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="600 000 000"
                className={`${inputBase} ${hasError('phone') ? 'border-destructive' : ''}`}
              />
              {hasError('phone') && <p className="text-xs mt-1 text-destructive">{errors.phone}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="contact-email" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">
              Email *
            </label>
            <input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="tu@email.com"
              className={`${inputBase} ${hasError('email') ? 'border-destructive' : ''}`}
            />
            {hasError('email') && <p className="text-xs mt-1 text-destructive">{errors.email}</p>}
          </div>

          {/* Producto */}
          <div>
            <label htmlFor="contact-product" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">
              Tipo de producto *
            </label>
            <div className="relative">
              <select
                id="contact-product"
                value={form.product}
                onChange={(e) => update("product", e.target.value)}
                className={`${inputBase} appearance-none cursor-pointer pr-10 ${hasError('product') ? 'border-destructive' : ''}`}
              >
                <option value="">Seleccionar...</option>
                {PRODUCT_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {hasError('product') && <p className="text-xs mt-1 text-destructive">{errors.product}</p>}
          </div>

          {/* Detalles */}
          <div>
            <label htmlFor="contact-details" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">
              Detalles del proyecto
            </label>
            <textarea
              id="contact-details"
              value={form.details}
              onChange={(e) => update("details", e.target.value)}
              rows={5}
              placeholder="Cuéntanos: medidas aproximadas, material o tela que te gusta, estilo de tu espacio, colores, plazo... Cuanto más nos cuentes, más ajustado será el presupuesto."
              className={`${inputBase} resize-none`}
            />
            <p className="mt-2 text-xs text-muted-foreground italic font-light">
              Medidas, tela, color, forma — todo va aquí. Si no lo sabes aún, sin problema.
            </p>
          </div>

          {/* Sección de pago */}
          <div className="p-4 bg-secondary rounded-md">
            <p className="text-xs tracking-wide uppercase text-muted-foreground font-medium mb-3">Métodos de pago</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-background border border-border rounded-full text-foreground">
                <span>📱</span> Bizum
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-background border border-border rounded-full text-foreground">
                <span>💳</span> Stripe
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-background border border-border rounded-full text-foreground">
                <span>🏦</span> Transferencia bancaria
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground italic">
              50% al confirmar · 50% a la entrega
            </p>
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
              Acepto la{" "}
              <Link to="/privacidad" className="underline hover:text-foreground transition-colors">
                política de privacidad
              </Link>
              . Mis datos se usarán únicamente para responder a esta solicitud.
            </label>
          </div>
          {touched.rgpd && errors.rgpd && (
            <p className="text-xs text-destructive">{errors.rgpd}</p>
          )}

          {/* Botón enviar */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={sending}
              className="w-full px-8 py-4 bg-accent-warm text-white text-sm tracking-widest uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-50 rounded-lg inline-flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar solicitud →"
              )}
            </button>
            <p className="mt-3 text-xs text-muted-foreground font-light text-center">
              Respondemos en menos de 24h · Sin compromiso
            </p>
          </div>
        </form>

        {/* WhatsApp footer */}
        <div className="mt-10 pt-8 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground font-light">
            ¿Prefieres hablar?{" "}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent-warm hover:underline font-medium"
            >
              <MessageCircle size={14} />
              Escríbenos por WhatsApp
            </a>
            {" "}— respondemos en minutos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
