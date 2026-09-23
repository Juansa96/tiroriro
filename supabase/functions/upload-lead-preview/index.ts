// Sube el dibujo (PNG) que el cliente ha montado en el configurador a un
// bucket público de Storage y devuelve su URL. Esa URL se usa en el email
// interno, en la confirmación al cliente y en el CRM: los clientes de correo
// (Gmail sobre todo) no muestran imágenes incrustadas en data URL ni SVG, así
// que la imagen tiene que estar alojada.
//
// El bucket se crea solo la primera vez (con la service role) para no
// depender de migraciones ni de pasos manuales.
import { createClient } from 'npm:@supabase/supabase-js@2'
import { LEAD_PREVIEW_BUCKET as BUCKET } from '../_shared/lead-preview.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const MAX_BYTES = 600_000 // un PNG de la silueta ronda los 10-40 KB
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

// Límite por IP en memoria (por instancia), igual que en submit-lead.
const HITS = new Map<string, { count: number; reset: number }>()
const LIMIT = 20
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

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

function decodePngDataUrl(value: unknown): Uint8Array | null {
  if (typeof value !== 'string') return null
  const prefix = 'data:image/png;base64,'
  if (!value.startsWith(prefix)) return null
  const b64 = value.slice(prefix.length)
  // 4 caracteres base64 = 3 bytes: descartamos antes de decodificar si es enorme.
  if (b64.length > (MAX_BYTES * 4) / 3 + 4) return null
  let bytes: Uint8Array
  try {
    const bin = atob(b64)
    bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  } catch {
    return null
  }
  if (bytes.length < 100 || bytes.length > MAX_BYTES) return null
  for (let i = 0; i < PNG_SIGNATURE.length; i++) {
    if (bytes[i] !== PNG_SIGNATURE[i]) return null
  }
  return bytes
}

async function ensureBucket(supabase: ReturnType<typeof createClient>) {
  const { data } = await supabase.storage.getBucket(BUCKET)
  if (data) return
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_BYTES,
    allowedMimeTypes: ['image/png'],
  })
  // Si dos peticiones lo crean a la vez, la segunda falla con "already exists":
  // no es un error real, la subida de abajo lo confirma.
  if (error && !/exist/i.test(error.message)) throw error
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  const ip = req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (rateLimited(ip)) return json({ error: 'Too many requests' }, 429)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const bytes = decodePngDataUrl(body.png)
  if (!bytes) return json({ error: 'png must be a PNG data URL under 600 KB' }, 400)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase environment variables')
    return json({ error: 'Server configuration error' }, 500)
  }
  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    await ensureBucket(supabase)
    const day = new Date().toISOString().slice(0, 10)
    const path = `${day}/${crypto.randomUUID()}.png`
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, bytes, {
      contentType: 'image/png',
      cacheControl: '31536000',
      upsert: false,
    })
    if (uploadError) throw uploadError
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return json({ url: data.publicUrl })
  } catch (error) {
    console.error('Failed to upload lead preview', {
      message: error instanceof Error ? error.message : String(error),
    })
    return json({ error: 'Failed to upload preview' }, 500)
  }
})
