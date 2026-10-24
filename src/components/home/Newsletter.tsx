import { useState, type FormEvent } from 'react'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!valid) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    // Frontend-only for now — wire to email provider / Supabase later
    setStatus('success')
    setMessage('Thanks — you are on the list. (Demo confirmation only.)')
    setEmail('')
  }

  return (
    <section className="border-y border-line bg-paper">
      <div className="container-je py-16 md:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-mute">Newsletter</p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Stay ahead of the drop.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-mute md:text-base">
            Receive new arrivals, restocks, and brand updates. No spam — just
            considered notes from JUST EIGHT.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setStatus('idle')
              }}
              placeholder="Email address"
              aria-label="Email address"
              className="w-full border border-line bg-snow px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
            />
            <Button type="submit" className="shrink-0 sm:px-10">
              Subscribe
            </Button>
          </form>
          {status !== 'idle' ? (
            <p
              className={[
                'mt-4 text-sm',
                status === 'success' ? 'text-ink' : 'text-red-600',
              ].join(' ')}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  )
}
