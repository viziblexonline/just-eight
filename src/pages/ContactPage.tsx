import { useState, type FormEvent } from 'react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

type Errors = Partial<Record<keyof ContactForm, string>>

export function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [success, setSuccess] = useState(false)

  function validate(): Errors {
    const next: Errors = {}
    if (!form.name.trim()) next.name = 'Name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email.'
    }
    if (!form.subject.trim()) next.subject = 'Subject is required.'
    if (form.message.trim().length < 10) {
      next.message = 'Please write at least 10 characters.'
    }
    return next
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      setSuccess(false)
      return
    }
    // Frontend-only — wire to email/API later
    setSuccess(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="container-je py-10 md:py-16">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-mute">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Contact Us
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-mute">
            Questions about products, orders, or partnerships? Send a message
            and we will respond once live support channels are connected.
          </p>
          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-mute">
                Email
              </dt>
              <dd className="mt-2">hello@justeight.example</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-mute">
                Phone
              </dt>
              <dd className="mt-2">+1 (000) 000-0000</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.16em] text-mute">
                Hours
              </dt>
              <dd className="mt-2">Mon–Fri, 9:00–17:00 (placeholder)</dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Name"
            name="name"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            label="Subject"
            name="subject"
            value={form.subject}
            error={errors.subject}
            onChange={(e) =>
              setForm((f) => ({ ...f, subject: e.target.value }))
            }
            required
          />
          <label className="block space-y-2">
            <span className="text-xs uppercase tracking-[0.14em] text-mute">
              Message
            </span>
            <textarea
              name="message"
              rows={6}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              className={[
                'w-full resize-y border bg-snow px-4 py-3 text-sm outline-none transition-colors',
                errors.message
                  ? 'border-red-500'
                  : 'border-line focus:border-ink',
              ].join(' ')}
              required
            />
            {errors.message ? (
              <span className="block text-xs text-red-600">{errors.message}</span>
            ) : null}
          </label>
          <Button type="submit" size="lg">
            Send Message
          </Button>
          {success ? (
            <p className="text-sm text-ink" role="status">
              Message captured locally for demo. Connect an email or CRM service
              to deliver real inquiries.
            </p>
          ) : null}
        </form>
      </div>
    </div>
  )
}
