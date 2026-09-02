import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, MessageCircle } from "lucide-react";
import ProductSVGPreview from "./ProductSVGPreview";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { CLICK_ID_PARAMS, getClickIds, trackLeadConversion } from "@/lib/tracking";
import {
  SHIPPING_MADRID,
  HEADBOARD_OVERSIZED_SHIPPING_SURCHARGE,
  isHeadboardOversized,
} from "@/data/pricing";

const PRODUCT_OPTIONS = ["Cabeceros", "Bancos entelados", "Cojines y almohadones", "Pufs", "Mesas de centro", "Pantallas de lámpara", "Otro"];
const WHATSAPP_URL = "https://wa.me/34660786453?text=" + encodeURIComponent("Hola, me interesa uno de vuestros productos tapizados y quería más información.");

function mapProductName(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('cabecero')) return 'Cabeceros';
  if (n.includes('banco')) return 'Bancos entelados';
  if (n.includes('cojin') || n.includes('cojín') || n.includes('almohad')) return 'Cojines y almohadones';
  if (n.includes('puf')) return 'Pufs';
  if (n.includes('mesa')) return 'Mesas de centro';
  if (n.includes('pantalla') || n.includes('lámpara') || n.includes('lampara')) return 'Pantallas de lámpara';
  return 'Varios';
}

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fromConfig = searchParams.get('config');
  const prefilledProduct = searchParams.get('product');
  const expressParam = searchParams.get('express');
  const hasConfigParams = !!(prefilledProduct || fromConfig);
  const previewPrice = searchParams.get('previewPrice');

  const [form, setForm] = useState({ name: "", lastName: "", phone: "", email: "", postalCode: "", details: "" });
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [rgpd, setRgpd] = useState(false);
  const [otherProductDetail, setOtherProductDetail] = useState("");
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [clickIds] = useState(() => getClickIds());

  // Cálculo de envío según CP: Madrid (28xxx) = 40€, resto = a consultar.
  const cp = form.postalCode.trim();
  const isMadridCP = /^28\d{3}$/.test(cp);

  // Draft autosave key. Include configurator params so distintas configs no se pisan.
  const DRAFT_KEY = "tiro_contact_draft_v1";

  const previewType = searchParams.get("previewType") as "cabecero" | "banco" | "cojin" | "puf" | "mesa" | "pantalla" | null;
  const previewForma = searchParams.get("previewForma") || undefined;
  const previewColor = searchParams.get("previewColor") || "#D4C5A9";
  const previewTexture = searchParams.get("previewTexture") || undefined;
  const previewLateralTexture = searchParams.get("previewLateralTexture") || undefined;
  const previewFinish = searchParams.get("previewFinish") || "";
  const previewVivo = searchParams.get("previewVivo") || undefined;
  const previewWidth = searchParams.get("previewWidth");
  const previewHeight = searchParams.get("previewHeight");
  const previewDepth = searchParams.get("previewDepth");
  const previewFabricName = searchParams.get("previewFabricName") || undefined;
  const previewVivoName = searchParams.get("previewVivoName") || undefined;
  const previewVivoImage = searchParams.get("previewVivoImage") || undefined;
  const previewLateralHex = searchParams.get("previewLateralHex") || undefined;
  const previewLateralImage = searchParams.get("previewLateralImage") || undefined;
  const previewLateralName = searchParams.get("previewLateralName") || undefined;

  // Cabeceros de más de 1,80 m de largo o más de 1,20 m de alto: +20 € de envío (solo Madrid).
  const productPrice = previewPrice && Number(previewPrice) > 0 ? Number(previewPrice) : null;
  const previewWidthNum = previewWidth ? Number(previewWidth) : undefined;
  const previewHeightNum = previewHeight ? Number(previewHeight) : undefined;
  const headboardOversizedSurcharge = previewType === 'cabecero' && isHeadboardOversized(previewWidthNum, previewHeightNum)
    ? HEADBOARD_OVERSIZED_SHIPPING_SURCHARGE
    : 0;
  const shippingCost = isMadridCP ? SHIPPING_MADRID + headboardOversizedSurcharge : null;
  const totalIfKnown = productPrice !== null && shippingCost !== null ? productPrice + shippingCost : null;

  useEffect(() => {
    if (prefilledProduct || fromConfig) {
      let details = fromConfig || '';
      if (expressParam === 'true') details += '\nEnvío express en 7 días: Sí';
      if (prefilledProduct) {
        const mapped = mapProductName(prefilledProduct);
        setSelectedProducts(prev => prev.includes(mapped) ? prev : [...prev, mapped]);
      }
      setForm(f => ({ ...f, details: details || f.details }));
    }
  }, [prefilledProduct, fromConfig, expressParam]);

  // #10 — Restaurar borrador guardado (si el usuario cerró la web a medias).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        form?: typeof form;
        selectedProducts?: string[];
        otherProductDetail?: string;
      };
      if (draft.form) setForm(f => ({ ...f, ...draft.form, details: f.details || draft.form?.details || "" }));
      if (draft.selectedProducts?.length) {
        setSelectedProducts(prev => Array.from(new Set([...prev, ...draft.selectedProducts!])));
      }
      if (draft.otherProductDetail) setOtherProductDetail(draft.otherProductDetail);
    } catch {
      /* ignore */
    }
    // solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Guardar borrador con debounce ligero cada vez que cambia algo relevante.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const hasAnything = form.name || form.email || form.phone || form.details || selectedProducts.length;
        if (!hasAnything) return;
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ form, selectedProducts, otherProductDetail }),
        );
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [form, selectedProducts, otherProductDetail]);

  const toggleProduct = (p: string) => {
    setSelectedProducts(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    setTouched(t => ({ ...t, product: true }));
    if (p === "Otro" && selectedProducts.includes("Otro")) {
      setOtherProductDetail("");
    }
  };

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setTouched(t => ({ ...t, [field]: true }));
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "El nombre es obligatorio";
    if (!form.phone.trim()) errs.phone = "El teléfono es obligatorio";
    else if (!/^\+?[0-9\s]{7,16}$/.test(form.phone.trim())) errs.phone = "Introduce un teléfono válido (7-15 dígitos)";
    if (!form.email.trim()) { errs.email = "El email es obligatorio"; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Introduce un email válido";
    // Cuando la solicitud viene del configurador ya sabemos qué producto quieren, no pedimos el campo.
    if (!hasConfigParams && selectedProducts.length === 0) errs.product = "Selecciona al menos un producto";
    if (selectedProducts.includes("Otro") && !otherProductDetail.trim()) errs.other = "Cuéntanos qué quieres exactamente";
    if (!rgpd) errs.rgpd = "Debes aceptar la política de privacidad";
    return errs;
  };

  useEffect(() => {
    if (Object.keys(touched).length > 0) setErrors(validate());
  }, [form, rgpd, selectedProducts, touched, otherProductDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, phone: true, email: true, product: true, other: true, rgpd: true });
    if (Object.keys(validationErrors).length > 0) { toast.error("Por favor, corrige los campos marcados en rojo."); return; }
    setSending(true);
    try {
      const fullName = [form.name, form.lastName].filter(Boolean).join(' ').trim();
      const firstName = form.name.trim().split(' ')[0];
      const productList = selectedProducts.includes("Otro")
        ? [...selectedProducts.filter(p => p !== "Otro"), `Otro: ${otherProductDetail}`].join(', ')
        : selectedProducts.join(', ') || 'No especificado';

      const submittedAt = new Date().toLocaleString('es-ES', {
        timeZone: 'Europe/Madrid', dateStyle: 'full', timeStyle: 'short',
      });
      const idempotencyBase = `${form.email}-${Date.now()}`;

      // Build a public link that recreates the customer's selection (renders the SVG drawing).
      // This lets the team click the email and see exactly what the customer designed.
      const previewLink = hasConfigParams
        ? `${window.location.origin}/?${searchParams.toString()}#contacto`
        : undefined;

      // 1. Email interno a TiroRiro (obligatorio)
      const oversizedLine = headboardOversizedSurcharge > 0
        ? ` (incluye suplemento cabecero grande: ${headboardOversizedSurcharge} €)`
        : '';
      const shippingLine = isMadridCP
        ? `Envío Madrid: ${SHIPPING_MADRID} €${oversizedLine} — Total: ${totalIfKnown ?? '—'} € (IVA incl.)`
        : `Envío fuera de Madrid: a consultar según destino${cp ? ` (CP ${cp})` : ''}`;
      const { error: internalError } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'contact-internal',
          recipientEmail: 'info@tirorirohome.com',
          replyTo: form.email,
          idempotencyKey: `contact-internal-${idempotencyBase}`,
          templateData: {
            fullName,
            email: form.email,
            phone: form.phone || undefined,
            productList,
            otherDetail: otherProductDetail || undefined,
            configSummary: fromConfig || undefined,
            details: [form.details, shippingLine].filter(Boolean).join('\n') || undefined,
            submittedAt,
            previewLink,
            formOrigin: hasConfigParams ? 'Configurador' : 'Formulario directo (sin configurador)',
            tracking: CLICK_ID_PARAMS
              .filter((k) => clickIds[k])
              .map((k) => `${k}: ${clickIds[k]}`)
              .join('\n') || undefined,
          },
        },
      });
      if (internalError) throw internalError;

      // 2. Confirmación al cliente (no bloqueante)
      try {
        await supabase.functions.invoke('send-transactional-email', {
          body: {
            templateName: 'contact-confirmation',
            recipientEmail: form.email,
            idempotencyKey: `contact-confirmation-${idempotencyBase}`,
            templateData: { firstName, productList, previewLink },
          },
        });
      } catch (confirmErr) {
        console.warn('No se pudo enviar la confirmación al cliente:', confirmErr);
      }

      // 3. Registrar lead en CRM (no bloqueante, fallo silencioso)
      try {
        const mensajeCRM = [
          selectedProducts.length > 0 ? `Productos: ${selectedProducts.join(', ')}` : null,
          otherProductDetail ? `Otro: ${otherProductDetail}` : null,
          fromConfig ? `Configuración: ${fromConfig}` : null,
          form.details ? `Detalles: ${form.details}` : null,
        ].filter(Boolean).join('\n');

        const presupuestoFlag = previewType === 'banco' && fromConfig?.includes('Mis medidas')
          ? 'a_consultar'
          : (previewPrice && Number(previewPrice) > 0 ? 'cerrado' : 'a_consultar');

        // Build structured configurator data if coming from configurator
        const configuradorData = hasConfigParams ? {
          tipo: previewType ?? undefined,
          forma: searchParams.get('previewForma') ?? undefined,
          tela: previewFabricName ?? undefined,
          telaLateral: previewLateralName ?? undefined,
          anchoCama: previewWidth ?? undefined,
          altoCm: previewHeight ?? undefined,
          acabado: previewFinish || 'vivo-simple',
          coleccionTela: searchParams.get('fabricGroup') ?? 'Básicas',
          precio: previewPrice && Number(previewPrice) > 0 ? Number(previewPrice) : undefined,
          envioMadrid: isMadridCP ? SHIPPING_MADRID : undefined,
          suplementoEnvioCabeceroGrande: headboardOversizedSurcharge > 0 ? headboardOversizedSurcharge : undefined,
          costeEnvioTotal: shippingCost ?? undefined,
        } : undefined;

        await supabase.functions.invoke('submit-lead', {
          body: {
            nombre: fullName,
            email: form.email,
            telefono: form.phone,
            ciudad: '',
            mensaje: mensajeCRM,
            origen: hasConfigParams ? 'Configurador' : 'Formulario web',
            configurador: configuradorData,
            presupuesto: presupuestoFlag,
            gclid: clickIds.gclid,
            gbraid: clickIds.gbraid,
            wbraid: clickIds.wbraid,
            utm_source: clickIds.utm_source,
            utm_medium: clickIds.utm_medium,
            utm_campaign: clickIds.utm_campaign,
            utm_term: clickIds.utm_term,
            fbclid: clickIds.fbclid,
            landing_path: clickIds.landing_path,
          },
        });
      } catch (crmErr) {
        console.warn('CRM no disponible:', crmErr);
      }

      // Analytics: evento estándar GA4 para conversión de lead.
      const leadParams = {
        currency: 'EUR',
        value: previewPrice && Number(previewPrice) > 0 ? Number(previewPrice) : 0,
        method: hasConfigParams ? 'configurador' : 'formulario_directo',
        products: selectedProducts.join(','),
      };
      trackEvent('generate_lead', leadParams);
      trackLeadConversion(form.email);
      // Limpia el borrador tras envío correcto
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      navigate(`/gracias?name=${encodeURIComponent(form.name)}`);
    } catch (err) {
      console.error('Error enviando email:', err);
      toast.error("No se pudo enviar el mensaje. Escríbenos por WhatsApp o al email.");
    } finally {
      setSending(false);
    }
  };

  const hasError = (field: string) => touched[field] && errors[field];
  const inputBase = "w-full bg-secondary border border-border rounded-md px-4 py-3 text-base text-foreground placeholder:text-sm placeholder:text-muted-foreground/40 placeholder:font-light focus:outline-none focus:border-accent-warm focus:ring-1 focus:ring-accent-warm/30 transition-colors";

  return (
    <section id="contacto" className="py-20 md:py-32 px-6 bg-background">
      <div className="container mx-auto max-w-[600px]">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">Cuéntanos qué buscas</h2>
          <span className="section-line" />
          <p className="mt-4 text-base text-muted-foreground font-light italic">Te respondemos en menos de 24 horas — sin compromiso ni presión.</p>
        </div>

        {!hasConfigParams && (
          <div className="mb-8 p-4 bg-muted/40 border border-border/50 rounded-md flex items-start gap-2.5">
            <span className="text-muted-foreground mt-0.5 text-sm">📝</span>
            <p className="text-sm text-muted-foreground font-light">
              Estás usando el formulario directo. Si quieres ver el resultado antes de pedir,{" "}
              <a href="/configurador" className="underline hover:text-foreground transition-colors">prueba el configurador</a>.
            </p>
          </div>
        )}

        {hasConfigParams && (
          <div className="mb-8 p-5 bg-accent-warm/10 border border-accent-warm/30">
            <p className="text-sm font-medium text-foreground flex items-start gap-2">
              <span className="text-accent-warm">✦</span>
              <span>Hemos recuperado tu selección del configurador. Te llamamos en menos de 24 h laborables para confirmar detalles.</span>
            </p>
            {previewType && (
              <div className="mt-5 rounded-2xl border border-border bg-background px-4 py-5">
                {/* Resumen de medidas */}
                {fromConfig && (
                  <div className="mb-4 pb-4 border-b border-border/40">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-medium mb-2">Tu configuración</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {fromConfig.replace('Me interesa: ', '').split(' · ').map((part, i) => (
                        <span key={i} className="text-xs text-foreground font-light">
                          {i === 0 ? <strong>{part}</strong> : `· ${part}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <ProductSVGPreview
                      type={previewType}
                      color={previewColor}
                      fabricImage={previewTexture}
                      lateralFabricImage={previewLateralTexture}
                      finish={previewFinish}
                      vivoColor={previewVivo}
                      forma={previewForma}
                      widthCm={previewWidth ? Number(previewWidth) : undefined}
                      heightCm={previewHeight ? Number(previewHeight) : undefined}
                      depthCm={previewDepth ? Number(previewDepth) : undefined}
                    />
                  </div>
                  {previewFabricName && (
                    <div className="w-20 flex-shrink-0 border-l border-border/30 pl-4 flex flex-col gap-3">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] tracking-wide uppercase text-muted-foreground font-medium">Tela</p>
                        <div className="w-full h-12 rounded border border-border/40 overflow-hidden" style={{ backgroundColor: previewColor }}>
                          {previewTexture && <img src={previewTexture} alt={previewFabricName} className="w-full h-full object-cover" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-light leading-tight">{previewFabricName}</p>
                      </div>
                      {previewType === 'cabecero' && previewLateralName && (
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] tracking-wide uppercase text-muted-foreground font-medium">Laterales</p>
                          <div className="w-full h-12 rounded border border-border/40 overflow-hidden" style={{ backgroundColor: previewLateralHex || previewColor }}>
                            {previewLateralImage && <img src={previewLateralImage} alt={previewLateralName} className="w-full h-full object-cover" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground font-light leading-tight">{previewLateralName}</p>
                        </div>
                      )}
                      {previewVivo && previewVivoName && (
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] tracking-wide uppercase text-muted-foreground font-medium">Vivo</p>
                          <div className="w-full h-8 rounded border border-border/40 overflow-hidden" style={{ backgroundColor: previewVivo }}>
                            {previewVivoImage && <img src={previewVivoImage} alt={previewVivoName} className="w-full h-full object-cover" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground font-light leading-tight">{previewVivoName}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Desglose de precio y envío */}
                {productPrice !== null && (
                  <div className="mt-5 pt-4 border-t border-border/40 space-y-1.5">
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-muted-foreground font-light">Producto</span>
                      <span className="font-medium text-foreground">{productPrice} €</span>
                    </div>
                    {isMadridCP ? (
                      <>
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="text-muted-foreground font-light">Envío Madrid</span>
                          <span className="font-medium text-foreground">{SHIPPING_MADRID} €</span>
                        </div>
                        {headboardOversizedSurcharge > 0 && (
                          <div className="flex items-baseline justify-between text-sm">
                            <span className="text-muted-foreground font-light">Suplemento cabecero grande</span>
                            <span className="font-medium text-foreground">{headboardOversizedSurcharge} €</span>
                          </div>
                        )}
                        <div className="flex items-baseline justify-between text-base pt-2 border-t border-border/30">
                          <span className="font-serif text-foreground">Total</span>
                          <span className="font-serif text-xl text-foreground">{totalIfKnown} € <span className="text-[10px] text-muted-foreground font-sans">IVA incl.</span></span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="text-muted-foreground font-light">Envío</span>
                          <span className="text-foreground font-light italic">a consultar según destino</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-light italic mt-2">
                          {cp ? 'Confirmaremos el importe exacto de envío en la llamada de menos de 24 h.' : 'Añade tu código postal abajo para calcular el envío. Si no es Madrid, lo confirmamos en la llamada.'}
                        </p>
                      </>
                    )}
                  </div>
                )}
                <div className="mt-4 p-3 bg-accent-warm/10 border border-accent-warm/30 rounded text-center">
                  <p className="text-[11px] text-foreground font-medium tracking-wide">
                    Reserva con el 50% · El resto al recibir · Garantía de fabricación
                  </p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground font-light text-center">
                  Te llamamos en menos de 24 h laborables.
                </p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Parámetros de clic de campañas (Google Ads / Meta) — solo lectura */}
          {CLICK_ID_PARAMS.map((key) => (
            <input key={key} type="hidden" name={key} value={clickIds[key] ?? ""} readOnly />
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-name" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">Nombre *</label>
              <input id="contact-name" type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Tu nombre" className={`${inputBase} ${hasError('name') ? 'border-destructive' : ''}`} />
              {hasError('name') && <p className="text-xs mt-1 text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="contact-lastname" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">Apellidos</label>
              <input id="contact-lastname" type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Tus apellidos" className={inputBase} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="contact-phone" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">Teléfono / WhatsApp *</label>
              <input id="contact-phone" type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="600 000 000" className={`${inputBase} ${hasError('phone') ? 'border-destructive' : ''}`} />
              {hasError('phone') && <p className="text-xs mt-1 text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">Email *</label>
              <input id="contact-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="tu@email.com" className={`${inputBase} ${hasError('email') ? 'border-destructive' : ''}`} />
              {hasError('email') && <p className="text-xs mt-1 text-destructive">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="contact-cp" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">
              Código postal <span className="normal-case tracking-normal text-muted-foreground/70 font-light">(para calcular el envío)</span>
            </label>
            <input
              id="contact-cp"
              type="text"
              inputMode="numeric"
              maxLength={5}
              value={form.postalCode}
              onChange={(e) => update("postalCode", e.target.value.replace(/\D/g, ''))}
              placeholder="28001"
              className={`${inputBase} max-w-[180px]`}
            />
            {cp.length === 5 && (
              <p className="mt-2 text-xs text-muted-foreground font-light">
                {isMadridCP
                  ? <>Envío Madrid: <span className="font-medium text-foreground">{SHIPPING_MADRID} €</span>{headboardOversizedSurcharge > 0 && <> + <span className="font-medium text-foreground">{headboardOversizedSurcharge} €</span> suplemento cabecero grande</>}</>
                  : <>Fuera de Madrid — envío a consultar en la llamada.</>}
              </p>
            )}
          </div>

          {!hasConfigParams && (
          <div>
            <span className="block text-xs tracking-wide uppercase text-muted-foreground mb-3 font-medium">
              Tipo de producto * <span className="normal-case tracking-normal text-muted-foreground/70 font-light">(puedes elegir varios)</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {PRODUCT_OPTIONS.map((p) => {
                const active = selectedProducts.includes(p);
                return (
                  <button key={p} type="button" onClick={() => toggleProduct(p)} aria-pressed={active}
                    className={`min-h-[40px] px-4 py-2 text-sm border rounded-md transition-all ${
                      active ? 'border-accent-warm bg-accent-warm/10 text-accent-warm font-medium' : 'border-border bg-background text-foreground hover:border-foreground/60'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            {selectedProducts.includes("Otro") && (
              <div className="mt-4 rounded-2xl border border-border bg-secondary/50 p-4">
                <label htmlFor="other-product" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">
                  Cuéntanos qué te gustaría hacer
                </label>
                <input
                  id="other-product"
                  type="text"
                  value={otherProductDetail}
                  onChange={(e) => { setOtherProductDetail(e.target.value); setTouched(t => ({ ...t, other: true })); }}
                  placeholder="Ej.: un asiento corrido, un panel tapizado, una pieza especial..."
                  className={`${inputBase} ${hasError('other') ? 'border-destructive' : ''}`}
                />
                <p className="mt-2 text-xs text-muted-foreground font-light">
                  Si no ves aquí tu producto, descríbelo y te orientamos.
                </p>
              </div>
            )}
            {hasError('product') && <p className="text-xs mt-2 text-destructive">{errors.product}</p>}
            {hasError('other') && <p className="text-xs mt-2 text-destructive">{errors.other}</p>}
          </div>
          )}

          <div>
            <label htmlFor="contact-details" className="block text-xs tracking-wide uppercase text-muted-foreground mb-2 font-medium">
              Detalles del proyecto <span className="normal-case tracking-normal text-muted-foreground/70 font-light">(opcional)</span>
            </label>
            <textarea id="contact-details" value={form.details} onChange={(e) => update("details", e.target.value)} rows={5}
              placeholder={hasConfigParams ? 'Cualquier detalle extra que quieras añadir (opcional).' : 'Cuéntanos: medidas aproximadas, material o tela que te gusta, estilo de tu espacio, colores, plazo...'}
              className={`${inputBase} resize-none`} />
            <p className="mt-2 text-xs text-muted-foreground italic font-light">Sin problema si lo dejas en blanco: lo repasamos contigo en la llamada.</p>
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input id="rgpd" type="checkbox" checked={rgpd} onChange={(e) => { setRgpd(e.target.checked); setTouched(t => ({ ...t, rgpd: true })); }} className="mt-1 w-4 h-4 accent-accent-warm cursor-pointer shrink-0" />
            <label htmlFor="rgpd" className="text-xs text-muted-foreground font-light leading-relaxed cursor-pointer">
              Acepto la{" "}
              <Link to="/privacidad" className="underline hover:text-foreground transition-colors">política de privacidad</Link>
              . Mis datos se usarán únicamente para responder a esta solicitud.
            </label>
          </div>
          {touched.rgpd && errors.rgpd && <p className="text-xs text-destructive">{errors.rgpd}</p>}

          <div className="pt-2 p-3 bg-muted/40 border border-border/40 rounded-md">
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              <span className="font-medium text-foreground">Envío a la península.</span> Dentro de Madrid <span className="font-medium">40 €</span>; en el resto lo confirmamos en la llamada de menos de 24 h.
            </p>
            <p className="text-[11px] text-muted-foreground/70 font-light mt-1 italic">Telas sujetas a disponibilidad de stock.</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={sending}
              className="btn-sweep btn-unir btn-unir-outline w-full inline-flex items-center justify-center px-8 py-3 text-xs tracking-[0.18em] uppercase font-light disabled:opacity-50"
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {sending
                  ? (<><Loader2 size={16} className="animate-spin" />Enviando...</>)
                  : hasConfigParams && productPrice !== null
                    ? `Lo quiero — reserva por ${productPrice} € →`
                    : "Enviar solicitud →"}
              </span>
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-border/40 text-center">
          <p className="text-sm text-muted-foreground font-light">
            ¿Prefieres hablar?{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-accent-warm hover:underline font-medium">
              <MessageCircle size={14} />Escríbenos por WhatsApp
            </a>
            {" "}— respondemos en minutos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
