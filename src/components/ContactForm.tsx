import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { toast } from "sonner";

const PRODUCT_OPTIONS = ["Cabecero", "Banco", "Mesita", "Cojines", "Puff", "Varios"];

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    product: "",
    details: "",
    source: "",
  });
  const [sending, setSending] = useState(false);

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
    toast.success("¡Gracias! Te llamamos en menos de 48 horas.");
    setForm({ name: "", phone: "", email: "", product: "", details: "", source: "" });
    setSending(false);
  };

  const inputClass = "w-full bg-transparent border-b border-border px-0 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors font-light";

  return (
    <section id="contacto" className="py-20 md:py-32 px-6">
      <div className="container mx-auto max-w-xl">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-5xl font-light text-foreground">Cuéntanos qué quieres</h2>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Nombre *"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className={inputClass}
              required
            />
            <input
              type="tel"
              placeholder="Teléfono * (te llamamos nosotras)"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
              required
            />
            <input
              type="email"
              placeholder="Email *"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              required
            />
            <select
              value={form.product}
              onChange={(e) => update("product", e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
              required
            >
              <option value="">Producto de interés *</option>
              {PRODUCT_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <textarea
              placeholder="Cuéntanos un poco más — &quot;Tengo una cama de 150, me gusta el lino en tono crudo y quiero el cabecero con vivo doble...&quot;"
              value={form.details}
              onChange={(e) => update("details", e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
            />
            <input
              type="text"
              placeholder="¿Cómo nos has conocido? (opcional)"
              value={form.source}
              onChange={(e) => update("source", e.target.value)}
              className={inputClass}
            />
            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={sending}
                className="px-10 py-3.5 bg-foreground text-background text-sm tracking-extra-wide uppercase font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {sending ? "Enviando..." : "Quiero el mío"}
              </button>
              <p className="mt-4 text-xs text-muted-foreground font-light italic">
                Te llamamos en menos de 48 horas — sin compromiso.
              </p>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ContactForm;
