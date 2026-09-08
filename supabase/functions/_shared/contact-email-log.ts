import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2'
import { sendTemplateEmail } from './transactional-email-templates/send-email.ts'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

export function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

export function serviceClient(): SupabaseClient {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

export function callerIpOf(req: Request): string {
  return (
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export const EMAIL_RE = /^[^\s@<>"']{1,64}@[^\s@<>"']{1,255}\.[^\s@<>"']{1,64}$/

export function capString(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, max) : undefined
}

/** Max 10 sends/hour per caller IP. */
export async function ipRateLimited(
  supabase: SupabaseClient,
  callerIp: string,
): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('email_send_log')
    .select('id', { count: 'exact', head: true })
    .eq('metadata->>caller_ip', callerIp)
    .gte('created_at', oneHourAgo)
  return (count ?? 0) >= 10
}

/** Max 3 sends/10min for the same recipient + template. */
export async function recipientRateLimited(
  supabase: SupabaseClient,
  recipient: string,
  templateName: string,
): Promise<boolean> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('email_send_log')
    .select('id', { count: 'exact', head: true })
    .eq('recipient_email', recipient)
    .eq('template_name', templateName)
    .gte('created_at', tenMinutesAgo)
  return (count ?? 0) >= 3
}

async function log(
  supabase: SupabaseClient,
  row: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase.from('email_send_log').insert(row)
  if (error) {
    console.warn('Failed to insert email_send_log', { error })
  }
}

/**
 * Sends a registered template through Lovable's managed email API and records
 * the outcome in email_send_log (notification history only — it never gates a
 * send). Suppression, retries, and rate limits are enforced by Lovable.
 */
export async function sendAndLog(
  supabase: SupabaseClient,
  templateName: string,
  recipient: string,
  options: {
    templateData?: Record<string, unknown>
    idempotencyKey?: string
    replyTo?: string
    callerIp?: string
  } = {},
): Promise<{ sent: boolean; reason?: string }> {
  const metadata = options.callerIp ? { caller_ip: options.callerIp } : null
  try {
    const result = await sendTemplateEmail(templateName, recipient, {
      templateData: options.templateData as Record<string, any> | undefined,
      idempotencyKey: options.idempotencyKey,
      replyTo: options.replyTo,
    })

    if (result.sent) {
      await log(supabase, {
        template_name: templateName,
        recipient_email: recipient,
        status: 'sent',
        metadata,
      })
      return { sent: true }
    }

    await log(supabase, {
      template_name: templateName,
      recipient_email: recipient,
      status: 'suppressed',
      error_message: 'Recipient is suppressed (bounce, complaint or unsubscribe)',
      metadata,
    })
    return { sent: false, reason: result.reason }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown send error'
    await log(supabase, {
      template_name: templateName,
      recipient_email: recipient,
      status: 'failed',
      error_message: message.slice(0, 500),
      metadata,
    })
    throw error
  }
}
