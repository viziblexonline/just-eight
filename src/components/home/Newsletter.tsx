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
    setMessage('You’re on the list.')
    setEmail('')
  }

  return (
    <section className="border-y border-line bg-paper">
      <div className="container-je py-16 md:py-20">
        <Reveal className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-medium tracking-[0.06em] uppercase md:text-3xl">
            Stay in the know
          </h2>
          <p className="mt-3 text-sm text-mute">
            New arrivals and early access — straight to your inbox.
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
              className="w-full border border-line bg-snow px-4 py-3.5 text-sm outline-none transition-colors focus:border-ink"
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
