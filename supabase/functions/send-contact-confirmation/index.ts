import {
  callerIpOf,
  capString,
  corsHeaders,
  EMAIL_RE,
  ipRateLimited,
  jsonResponse,
  recipientRateLimited,
  sendAndLog,
  serviceClient,
} from '../_shared/contact-email-log.ts'

const TEMPLATE = 'contact-confirmation'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON in request body' }, 400)
  }

  const recipient = capString(body.recipientEmail, 255)
  if (!recipient || !EMAIL_RE.test(recipient)) {
    return jsonResponse({ error: 'A valid recipientEmail is required' }, 400)
  }

  const data = (body.templateData ?? {}) as Record<string, unknown>
  const templateData = {
    firstName: capString(data.firstName, 100),
    productList: capString(data.productList, 500),
    previewLink: capString(data.previewLink, 1000),
  }

  const callerIp = callerIpOf(req)

  let supabase
  try {
    supabase = serviceClient()
  } catch (error) {
    console.error('Server configuration error', { error })
    return jsonResponse({ error: 'Server configuration error' }, 500)
  }

  if (await ipRateLimited(supabase, callerIp)) {
    console.warn('Rate limit exceeded for IP', { callerIp })
    return jsonResponse({ error: 'Rate limit exceeded' }, 429)
  }
  if (await recipientRateLimited(supabase, recipient, TEMPLATE)) {
    console.warn('Rate limit exceeded for recipient', { template: TEMPLATE })
    return jsonResponse({ error: 'Rate limit exceeded' }, 429)
  }

  try {
    const result = await sendAndLog(supabase, TEMPLATE, recipient, {
      templateData,
      idempotencyKey: capString(body.idempotencyKey, 200),
      callerIp,
    })
    return jsonResponse({ success: result.sent, reason: result.reason })
  } catch (error) {
    console.error('Failed to send contact confirmation email', {
      message: error instanceof Error ? error.message : String(error),
    })
    return jsonResponse({ error: 'Failed to send email' }, 500)
  }
})
