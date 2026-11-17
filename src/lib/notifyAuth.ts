const ADMIN_NOTIFY_EMAIL = 'justeightuk@gmail.com'

type AuthNotifyEvent = 'signup' | 'login'

/**
 * Notifies the store inbox when a customer signs up or logs in.
 * Uses FormSubmit (no API key). The first request emails the inbox
 * a confirmation link — activate that once, then alerts arrive normally.
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

  try {
    await fetch(`https://formsubmit.co/ajax/${ADMIN_NOTIFY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `JUST EIGHT — Customer ${action}`,
        _template: 'table',
        event: input.event,
        customer_name: who,
        customer_email: email,
        provider,
        time_utc: when,
        site: typeof window !== 'undefined' ? window.location.origin : '',
        message: `${who} (${email}) just ${action} on JUST EIGHT via ${provider}.`,
      }),
    })
  } catch {
    // Never block auth UX if mail relay fails
  }
}
