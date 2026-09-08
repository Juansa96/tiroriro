import {
  callerIpOf,
  capString,
  corsHeaders,
  EMAIL_RE,
  ipRateLimited,
  jsonResponse,
  sendAndLog,
  serviceClient,
} from '../_shared/contact-email-log.ts'

const TEMPLATE = 'contact-internal'
const INTERNAL_RECIPIENT = 'info@tirorirohome.com'

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

  const data = (body.templateData ?? {}) as Record<string, unknown>
  const email = capString(data.email, 255)
  if (!email || !EMAIL_RE.test(email)) {
    return jsonResponse({ error: 'A valid email is required' }, 400)
  }
  const fullName = capString(data.fullName, 200)
  if (!fullName) {
    return jsonResponse({ error: 'fullName is required' }, 400)
  }

  const templateData = {
    fullName,
    email,
    phone: capString(data.phone, 40),
    productList: capString(data.productList, 500),
    otherDetail: capString(data.otherDetail, 1000),
    configSummary: capString(data.configSummary, 2000),
    details: capString(data.details, 4000),
    submittedAt: capString(data.submittedAt, 100),
    previewLink: capString(data.previewLink, 1000),
    formOrigin: capString(data.formOrigin, 100),
    tracking: capString(data.tracking, 2000),
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

  try {
    const result = await sendAndLog(supabase, TEMPLATE, INTERNAL_RECIPIENT, {
      templateData,
      idempotencyKey: capString(body.idempotencyKey, 200),
      replyTo: email,
      callerIp,
    })
    return jsonResponse({ success: result.sent, reason: result.reason })
  } catch (error) {
    console.error('Failed to send internal contact email', {
      message: error instanceof Error ? error.message : String(error),
    })
    return jsonResponse({ error: 'Failed to send email' }, 500)
  }
})
