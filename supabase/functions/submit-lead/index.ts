const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Simple in-memory IP rate limit (per cold-start instance)
const HITS = new Map<string, { count: number; reset: number }>()
const LIMIT = 5
const WINDOW_MS = 10 * 60 * 1000

function rateLimited(ip: string) {
  const now = Date.now()
  const entry = HITS.get(ip)
  if (!entry || now > entry.reset) {
    HITS.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }
  entry.count++
  return entry.count > LIMIT
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Minimal validation
  if (!body?.nombre || !body?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return new Response(JSON.stringify({ error: 'Missing or invalid fields' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Cap field lengths to prevent abuse
  const trim = (v: unknown, n: number) => (typeof v === 'string' ? v.slice(0, n) : v)
  const payload = {
    nombre: trim(body.nombre, 200),
    email: trim(body.email, 255),
    telefono: trim(body.telefono, 30),
    ciudad: trim(body.ciudad, 100),
    mensaje: trim(body.mensaje, 4000),
    origen: trim(body.origen, 100),
    configurador: body.configurador,
    presupuesto: body.presupuesto,
  }

  const url = Deno.env.get('CRM_API_URL')
  const key = Deno.env.get('CRM_API_KEY')
  if (!url || !key) {
    console.error('CRM config missing')
    return new Response(JSON.stringify({ error: 'Server not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': key },
      body: JSON.stringify(payload),
    })
    const ok = resp.ok
    return new Response(JSON.stringify({ ok }), {
      status: ok ? 200 : 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('CRM proxy error', err)
    return new Response(JSON.stringify({ error: 'Upstream error' }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})