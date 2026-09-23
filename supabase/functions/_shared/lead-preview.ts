// Bucket público donde upload-lead-preview deja el dibujo (PNG) de cada
// solicitud. Los emails solo admiten imágenes de ahí: así nadie puede colar
// una imagen ajena en el correo interno ni en el que recibe el cliente.
export const LEAD_PREVIEW_BUCKET = 'lead-previews'

export function leadPreviewPublicPrefix(): string | null {
  const base = Deno.env.get('SUPABASE_URL')
  if (!base) return null
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/${LEAD_PREVIEW_BUCKET}/`
}

/** Devuelve la URL solo si apunta a nuestro bucket de dibujos; si no, undefined. */
export function safeLeadPreviewUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const url = value.trim()
  const prefix = leadPreviewPublicPrefix()
  if (!prefix || !url.startsWith(prefix) || url.length > 600) return undefined
  if (!/^[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/.test(url)) return undefined
  return url
}
