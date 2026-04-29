const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ─── Helper: enviar email via Resend ────────────────────────────────────────
async function sendEmail(apiKey: string, payload: {
  from: string;
  to: string[];
  reply_to?: string;
  subject: string;
  html: string;
}): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Resend error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  console.log('[send-contact-email] Email enviado:', data.id)
}

// ─── Email interno a Tiroriro ────────────────────────────────────────────────
function buildInternalEmail(params: {
  fullName: string;
  email: string;
  phone?: string;
  productList: string;
  otherDetail?: string;
  configSummary?: string;
  details?: string;
}): string {
  const { fullName, email, phone, productList, otherDetail, configSummary, details } = params
  const fecha = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'full', timeStyle: 'short' })

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px; background: #fafaf8;">

  <div style="background: #1a4b5b; padding: 24px 28px; border-radius: 8px 8px 0 0;">
    <h1 style="font-size: 20px; font-weight: 400; color: #ffffff; margin: 0; letter-spacing: 0.02em;">Nueva solicitud de presupuesto</h1>
    <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 6px 0 0; font-family: Arial, sans-serif;">
      TiroRiro Home · Formulario web · ${fecha}
    </p>
  </div>

  <div style="background: #ffffff; border: 1px solid #e8e4de; border-top: none; border-radius: 0 0 8px 8px; padding: 28px;">

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; width: 150px; color: #888; font-size: 12px; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.08em;">Nombre</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; font-size: 15px; font-weight: 500;">${fullName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #888; font-size: 12px; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.08em;">Email</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; font-size: 14px;">
          <a href="mailto:${email}" style="color: #1a4b5b; text-decoration: none;">${email}</a>
        </td>
      </tr>
      ${phone ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #888; font-size: 12px; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.08em;">Teléfono</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; font-size: 14px;">
          <a href="tel:${phone}" style="color: #1a4b5b; text-decoration: none;">${phone}</a>
        </td>
      </tr>` : ''}
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #888; font-size: 12px; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.08em;">Productos</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; font-size: 14px;">${productList}</td>
      </tr>
      ${otherDetail ? `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; color: #888; font-size: 12px; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.08em;">Detalle</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0ede8; font-size: 14px;">${otherDetail}</td>
      </tr>` : ''}
    </table>

    ${configSummary ? `
    <div style="background: #f5f0e8; border-left: 3px solid #1a4b5b; padding: 14px 16px; margin-bottom: 20px; border-radius: 0 6px 6px 0;">
      <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #1a4b5b; margin: 0 0 8px; font-weight: 600; font-family: Arial, sans-serif;">Configuración del diseñador</p>
      <pre style="font-family: Georgia, serif; font-size: 13px; color: #333; margin: 0; white-space: pre-wrap;">${configSummary}</pre>
    </div>` : ''}

    ${details ? `
    <div style="margin-bottom: 24px;">
      <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin: 0 0 10px; font-weight: 600; font-family: Arial, sans-serif;">Mensaje del cliente</p>
      <p style="font-size: 14px; line-height: 1.75; color: #333; margin: 0; white-space: pre-wrap; background: #faf8f5; padding: 14px 16px; border-radius: 6px; border: 1px solid #ede9e1;">${details}</p>
    </div>` : ''}

    <div style="background: #f0f7f9; border-radius: 6px; padding: 14px 16px; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: #1a4b5b;">
        👆 Responde directamente a este email para contactar con ${fullName.split(' ')[0]}
      </p>
    </div>

  </div>

  <p style="font-size: 11px; color: #bbb; text-align: center; margin-top: 16px; font-family: Arial, sans-serif;">
    Enviado desde tirorirohome.com
  </p>
</body>
</html>`
}

// ─── Email de confirmación al cliente ────────────────────────────────────────
function buildConfirmationEmail(params: {
  firstName: string;
  productList: string;
}): string {
  const { firstName, productList } = params

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 24px; background: #fafaf8;">

  <div style="background: #1a4b5b; padding: 32px 28px; border-radius: 8px 8px 0 0; text-align: center;">
    <h1 style="font-size: 26px; font-weight: 300; color: #ffffff; margin: 0; letter-spacing: 0.02em;">
      Gracias, ${firstName}
    </h1>
    <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin: 10px 0 0; font-family: Arial, sans-serif;">
      Hemos recibido tu solicitud
    </p>
  </div>

  <div style="background: #ffffff; border: 1px solid #e8e4de; border-top: none; border-radius: 0 0 8px 8px; padding: 32px 28px; text-align: center;">

    <p style="font-size: 16px; line-height: 1.75; color: #444; margin: 0 0 20px;">
      Tu petición sobre <strong style="color: #1a4b5b;">${productList}</strong> está en nuestras manos.<br>
      Te respondemos en <strong>menos de 24 horas laborables</strong>.
    </p>

    <div style="display: inline-block; background: #f5f0e8; border-radius: 8px; padding: 20px 28px; margin: 10px 0 28px; text-align: left;">
      <p style="margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; font-family: Arial, sans-serif;">Próximos pasos</p>
      <p style="margin: 6px 0; font-size: 14px; color: #333;">✦ &nbsp;Revisamos tu solicitud con detalle</p>
      <p style="margin: 6px 0; font-size: 14px; color: #333;">✦ &nbsp;Te enviamos presupuesto personalizado</p>
      <p style="margin: 6px 0; font-size: 14px; color: #333;">✦ &nbsp;Empezamos cuando tú confirmes</p>
    </div>

    <p style="font-size: 14px; color: #666; margin: 0 0 24px; line-height: 1.6;">
      Si tienes prisa o prefieres hablar, escríbenos por WhatsApp:
    </p>

    <a href="https://wa.me/34660786453" style="display: inline-block; background: #25D366; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-family: Arial, sans-serif; font-weight: 500;">
      Abrir WhatsApp
    </a>

    <hr style="border: none; border-top: 1px solid #f0ede8; margin: 32px 0 20px;" />

    <p style="font-size: 12px; color: #bbb; margin: 0; font-family: Arial, sans-serif; line-height: 1.6;">
      Tiroriro Home · <a href="https://tirorirohome.com" style="color: #1a4b5b; text-decoration: none;">tirorirohome.com</a><br>
      Si no esperabas este email, puedes ignorarlo con seguridad.
    </p>
  </div>

</body>
</html>`
}

// ─── Handler principal ────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {
  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 1. Comprobar API key
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      console.error('[send-contact-email] ERROR: RESEND_API_KEY no configurada')
      throw new Error('Configuración de servidor incorrecta')
    }

    // 2. Parsear body
    const body = await req.json()
    const { name, lastName, phone, email, products, otherDetail, details, configSummary } = body

    console.log('[send-contact-email] Nueva solicitud de:', email, '| Productos:', products)

    // 3. Validación básica
    if (!name?.trim() || !email?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Nombre y email son obligatorios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Sanitizar inputs básicos (strip HTML tags)
    const sanitize = (s: string) => s?.replace(/<[^>]*>/g, '').trim() ?? ''

    const safeEmail    = sanitize(email)
    const fullName     = [sanitize(name), sanitize(lastName ?? '')].filter(Boolean).join(' ')
    const firstName    = sanitize(name).split(' ')[0]
    const safePhone    = sanitize(phone ?? '')
    const safeDetails  = sanitize(details ?? '')
    const safeOther    = sanitize(otherDetail ?? '')
    const safeSummary  = sanitize(configSummary ?? '')
    const productList  = Array.isArray(products)
      ? products.map(sanitize).join(', ')
      : sanitize(products ?? 'No especificado')

    // 4. Email interno a Tiroriro (con reply-to al cliente)
    await sendEmail(RESEND_API_KEY, {
      from: 'TiroRiro Web <noreply@tirorirohome.com>',
      to: ['info@tirorirohome.com'],
      reply_to: safeEmail,
      subject: `Nueva solicitud de ${fullName} — ${productList}`,
      html: buildInternalEmail({
        fullName,
        email: safeEmail,
        phone: safePhone || undefined,
        productList,
        otherDetail: safeOther || undefined,
        configSummary: safeSummary || undefined,
        details: safeDetails || undefined,
      }),
    })

    // 5. Email de confirmación al cliente
    try {
      await sendEmail(RESEND_API_KEY, {
        from: 'TiroRiro Home <noreply@tirorirohome.com>',
        to: [safeEmail],
        subject: `Hemos recibido tu solicitud, ${firstName} ✦`,
        html: buildConfirmationEmail({ firstName, productList }),
      })
      console.log('[send-contact-email] Confirmación enviada a:', safeEmail)
    } catch (confirmErr) {
      // No bloqueamos si falla la confirmación — el importante es el interno
      console.warn('[send-contact-email] No se pudo enviar confirmación al cliente:', confirmErr)
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('[send-contact-email] Error:', err)
    const message = err instanceof Error ? err.message : 'Error interno'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
