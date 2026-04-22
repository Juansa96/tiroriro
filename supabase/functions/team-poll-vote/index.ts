import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const VALID_OPTIONS = ['inaki-rocio', 'juan-bea'] as const
type OptionId = typeof VALID_OPTIONS[number]

function currentMonth(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

async function sha256(input: string): Promise<string> {
  const buf = new TextEncoder().encode(input)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, serviceKey)

    const month = currentMonth()

    // GET-style action via POST body { action: 'counts' | 'vote' }
    let body: { action?: string; option_id?: string; voter_cookie?: string } = {}
    try {
      body = await req.json()
    } catch {
      body = {}
    }

    const action = body.action || 'counts'

    if (action === 'counts') {
      const { data, error } = await supabase
        .from('team_poll_votes')
        .select('option_id')
        .eq('vote_month', month)

      if (error) throw error

      const counts: Record<OptionId, number> = { 'inaki-rocio': 0, 'juan-bea': 0 }
      for (const row of data || []) {
        const opt = row.option_id as OptionId
        if (opt in counts) counts[opt]++
      }

      return new Response(
        JSON.stringify({ month, counts }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'vote') {
      const optionId = body.option_id as OptionId
      const voterCookie = body.voter_cookie

      if (!optionId || !VALID_OPTIONS.includes(optionId)) {
        return new Response(
          JSON.stringify({ error: 'Opción inválida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (!voterCookie || typeof voterCookie !== 'string' || voterCookie.length < 8) {
        return new Response(
          JSON.stringify({ error: 'Cookie de votante inválida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // IP hash (cf-connecting-ip / x-forwarded-for)
      const ipRaw =
        req.headers.get('cf-connecting-ip') ||
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        'unknown'
      const ipHash = await sha256(`tiroriro:${ipRaw}:${month}`)

      const { error: insertError } = await supabase
        .from('team_poll_votes')
        .insert({
          option_id: optionId,
          voter_cookie: voterCookie,
          ip_hash: ipHash,
          vote_month: month,
        })

      let resolvedVote: OptionId = optionId
      if (insertError) {
        // 23505 = unique_violation => ya votó
        const alreadyVoted = (insertError as { code?: string }).code === '23505'
        if (!alreadyVoted) {
          console.error('Insert error:', insertError)
        } else {
          const { data: existingVote } = await supabase
            .from('team_poll_votes')
            .select('option_id')
            .eq('vote_month', month)
            .or(`voter_cookie.eq.${voterCookie},ip_hash.eq.${ipHash}`)
            .order('created_at', { ascending: true })
            .limit(1)
            .maybeSingle()

          if (existingVote?.option_id && VALID_OPTIONS.includes(existingVote.option_id as OptionId)) {
            resolvedVote = existingVote.option_id as OptionId
          }
        }
      }

      // Devolver siempre conteos actualizados
      const { data, error } = await supabase
        .from('team_poll_votes')
        .select('option_id')
        .eq('vote_month', month)
      if (error) throw error

      const counts: Record<OptionId, number> = { 'inaki-rocio': 0, 'juan-bea': 0 }
      for (const row of data || []) {
        const opt = row.option_id as OptionId
        if (opt in counts) counts[opt]++
      }

      return new Response(
        JSON.stringify({ month, counts, voted: resolvedVote }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Acción desconocida' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Edge function error:', err)
    const message = err instanceof Error ? err.message : 'Error interno'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
