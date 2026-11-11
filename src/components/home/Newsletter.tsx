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
    setStatus('success')
    setMessage('Thanks — you are on the list. (Demo confirmation only.)')
    setEmail('')
  }

  return (
    <section className="navy-panel relative overflow-hidden border-y border-accent/20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="container-je relative py-20 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-accent">Newsletter</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[0.04em] text-snow md:text-5xl">
            Stay ahead of the drop.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/65 md:text-base">
            Receive new arrivals, restocks, and brand updates. No spam — just
            considered notes from JUST EIGHT.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
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
              className="w-full border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-snow outline-none transition-colors placeholder:text-white/40 focus:border-accent"
            />
            <Button type="submit" className="shrink-0 sm:px-10">
              Subscribe
            </Button>
          </form>
          {status !== 'idle' ? (
            <p
              className={[
                'mt-4 text-sm',
                status === 'success' ? 'text-accent-soft' : 'text-red-300',
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
