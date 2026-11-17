const STORE_EMAIL = 'justeightsuk@gmail.com'
const STORE_FROM_NAME = 'Just Eight'

type AuthNotifyEvent = 'signup' | 'login'

function welcomeBody(fullName: string, site: string): string {
  const hi = fullName.trim() || 'there'
  return [
    `Hi ${hi},`,
    '',
    'Welcome to Just Eight — thanks for joining us.',
    '',
    'Your account is ready. Browse Men, Women, and Kids and find pieces you love.',
    site ? `Shop now: ${site}` : '',
    '',
    'If you did not create this account, you can ignore this email.',
    '',
    `— ${STORE_FROM_NAME}`,
    STORE_EMAIL,
  ]
    .filter(Boolean)
    .join('\n')
}

/**
 * Notifies the store inbox when a customer signs up or logs in.
 * On signup, also sends a welcome auto-response to the customer.
 *
 * Uses FormSubmit (no API key). First request to the store inbox needs
 * one activation click in Gmail — after that, alerts arrive normally.
 *
 * For confirmation emails that show From: Just Eight <justeightsuk@gmail.com>,
 * configure Supabase custom SMTP (see docs/EMAIL.md).
 */
export async function notifyAdminAuthEvent(input: {
  event: AuthNotifyEvent
  email: string
  fullName?: string
  provider?: 'email' | 'google' | string
}): Promise<void> {
  const email = input.email.trim()
  if (!email) return

  const key = `je-auth-notify:${input.event}:${email.toLowerCase()}`
  try {
    if (sessionStorage.getItem(key) === '1') return
    sessionStorage.setItem(key, '1')
  } catch {
    // private mode / blocked storage — still try to send
  }

  const action = input.event === 'signup' ? 'signed up' : 'logged in'
  const provider = input.provider || 'email'
  const who = input.fullName?.trim() || email
  const when = new Date().toISOString()
  const site =
    typeof window !== 'undefined' ? window.location.origin : 'https://justeight.co.uk'

  const payload: Record<string, string> = {
    _subject: `${STORE_FROM_NAME} — Customer ${action}`,
    _template: 'table',
    _replyto: email,
    name: who,
    email,
    event: input.event,
    customer_name: who,
    customer_email: email,
    provider,
    time_utc: when,
    site,
    message: `${who} (${email}) just ${action} on ${STORE_FROM_NAME} via ${provider}.`,
  }

  if (input.event === 'signup') {
    payload._autoresponse = welcomeBody(who, site)
  }

  try {
    await fetch(`https://formsubmit.co/ajax/${STORE_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    // Never block auth UX if mail relay fails
  }
}
