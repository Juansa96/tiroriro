const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurada')
    }

    const body = await req.json()
    const { name, lastName, phone, email, products, otherDetail, details, configSummary } = body

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: 'Nombre y email son obligatorios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const productList = Array.isArray(products) ? products.join(', ') : (products || 'No especificado')
    const fullName = [name, lastName].filter(Boolean).join(' ')

    const htmlBody = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="font-family: Georgia, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="border-bottom: 2px solid #1a4b5b; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 24px; font-weight: 400; color: #1a4b5b; margin: 0;">Nueva solicitud de presupuesto</h1>
    <p style="color: #666; font-size: 13px; margin: 4px 0 0;">TiroRiro Home · Formulario web</p>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; width: 160px; color: #666; font-size: 13px;">Nombre</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; font-weight: 500;">${fullName}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Email</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px;"><a href="mailto:${email}" style="color: #1a4b5b;">${email}</a></td>
    </tr>
    ${phone ? `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Teléfono</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px;">${phone}</td>
    </tr>` : ''}
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Productos</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px;">${productList}</td>
    </tr>
    ${otherDetail ? `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; color: #666; font-size: 13px;">Detalle (Otro)</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px;">${otherDetail}</td>
    </tr>` : ''}
  </table>

  ${configSummary ? `
  <div style="background: #f5f0e8; border-left: 3px solid #1a4b5b; padding: 14px 16px; margin-bottom: 20px; border-radius: 0 4px 4px 0;">
    <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #1a4b5b; margin: 0 0 8px; font-weight: 600;">Configuración del diseñador</p>
    <pre style="font-family: inherit; font-size: 13px; color: #333; margin: 0; white-space: pre-wrap;">${configSummary}</pre>
  </div>` : ''}

  ${details ? `
  <div style="margin-bottom: 24px;">
    <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin: 0 0 8px; font-weight: 600;">Mensaje</p>
    <p style="font-size: 14px; line-height: 1.7; color: #333; margin: 0; white-space: pre-wrap;">${details}</p>
  </div>` : ''}

  <div style="border-top: 1px solid #eee; padding-top: 16px; margin-top: 24px; font-size: 12px; color: #999;">
    <p style="margin: 0;">Enviado desde tirorirohome.com · ${new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' })}</p>
    <p style="margin: 4px 0 0;">Responde directamente a este mensaje para contactar con el cliente.</p>
  </div>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TiroRiro Web <noreply@tirorirohome.com>',
        to: ['info@tirorirohome.com'],
        reply_to: email,
        subject: `Nueva solicitud de ${fullName} — ${productList}`,
        html: htmlBody,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Resend error ${res.status}: ${errText}`)
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('send-contact-email error:', err)
    const message = err instanceof Error ? err.message : 'Error interno'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
