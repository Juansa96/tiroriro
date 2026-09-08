import { createEmailWebhookHandler } from 'npm:@lovable.dev/email-js@0.1.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

type Outcome = {
  reason: 'bounce' | 'complaint' | 'unsubscribe'
  status: 'bounced' | 'complained' | 'suppressed'
  message: string
}

const OUTCOMES: Record<string, Outcome> = {
  bounce: {
    reason: 'bounce',
    status: 'bounced',
    message: 'Permanent bounce — email address is invalid or rejected',
  },
  complaint: {
    reason: 'complaint',
    status: 'complained',
    message: 'Spam complaint — recipient marked email as spam',
  },
  unsubscribe: {
    reason: 'unsubscribe',
    status: 'suppressed',
    message: 'Recipient unsubscribed',
  },
}

// Records the delivery outcome in the project's own history tables. These rows
// are notification-only: Lovable enforces suppression at send time.
async function record(
  kind: keyof typeof OUTCOMES,
  recipient: string | undefined,
  eventId: string,
) {
  const outcome = OUTCOMES[kind]
  if (!recipient) {
    console.warn('Email event without recipient', { event_id: eventId })
    return
  }
  const normalizedEmail = recipient.toLowerCase()

  const { error: suppressError } = await supabase
    .from('suppressed_emails')
    .upsert(
      { email: normalizedEmail, reason: outcome.reason, metadata: null },
      { onConflict: 'email' },
    )
  if (suppressError) {
    console.error('Failed to upsert suppressed email', {
      event_id: eventId,
      code: suppressError.code,
      message: suppressError.message,
    })
    throw new Error('Failed to write suppression')
  }

  const { error: logError } = await supabase.from('email_send_log').insert({
    message_id: null,
    template_name: 'system',
    recipient_email: normalizedEmail,
    status: outcome.status,
    error_message: outcome.message,
    metadata: null,
  })
  if (logError) {
    console.error('Failed to insert email_send_log', {
      event_id: eventId,
      code: logError.code,
      message: logError.message,
    })
    throw new Error('Failed to write send log')
  }
}

const handler = createEmailWebhookHandler({
  apiKey: Deno.env.get('LOVABLE_API_KEY')!,
  on: {
    'email.bounced': async (event) => {
      await record('bounce', (event.data as { recipient?: string }).recipient, event.event_id)
    },
    'email.complaint': async (event) => {
      await record('complaint', (event.data as { recipient?: string }).recipient, event.event_id)
    },
    'email.unsubscribed': async (event) => {
      await record('unsubscribe', (event.data as { recipient?: string }).recipient, event.event_id)
    },
  },
})

Deno.serve((req) => handler(req))
