import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/format'
import { writeStorage } from '../lib/storage'
import { recordSale } from '../lib/sales'
import type { CheckoutFormData, OrderSummary } from '../types'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { EmptyState } from '../components/ui/EmptyState'

type FormErrors = Partial<Record<keyof CheckoutFormData, string>>

const ORDER_KEY = 'just-eight-last-order'

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [form, setForm] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card',
  })

  const shipping = subtotal >= 150 ? 0 : subtotal > 0 ? 12 : 0
  const total = subtotal + shipping

  const lineItems = useMemo(() => items, [items])

  function validate(): FormErrors {
    const next: FormErrors = {}
    if (!form.fullName.trim()) next.fullName = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    if (!/^[+\d\s()-]{7,}$/.test(form.phone.trim())) {
      next.phone = 'Enter a valid phone number.'
    }
    if (!form.address.trim()) next.address = 'Shipping address is required.'
    if (!form.city.trim()) next.city = 'City is required.'
    if (!form.postalCode.trim()) next.postalCode = 'Postal code is required.'
    if (!form.paymentMethod) next.paymentMethod = 'Select a payment method.'
    return next
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)

    // Demo-only confirmation — no real payment or order processing
    const order: OrderSummary = {
      id: `JE-${Date.now().toString().slice(-8)}`,
      items: [...items],
      form: { ...form },
      subtotal,
      shipping,
      total,
      createdAt: new Date().toISOString(),
    }
    writeStorage(ORDER_KEY, order)
    recordSale(order)
    clearCart()
    navigate(`/order-confirmation/${order.id}`, { replace: true })
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to checkout"
        description="Add products to your cart before continuing."
        actionLabel="Shop Collection"
        actionTo="/shop"
      />
    )
  }

  return (
    <div className="container-je py-10 md:py-14">
      <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
        Checkout
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-mute">
        This checkout collects order details for demonstration only. No real
        payment is processed and no order is sent to a fulfillment system yet.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-10 grid gap-12 lg:grid-cols-[1fr_360px]"
        noValidate
      >
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold">
              Contact details
            </h2>
            <Input
              label="Full name"
              name="fullName"
              value={form.fullName}
              error={errors.fullName}
              onChange={(e) =>
                setForm((f) => ({ ...f, fullName: e.target.value }))
              }
              autoComplete="name"
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Email"
                name="email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                autoComplete="email"
                required
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={form.phone}
                error={errors.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                autoComplete="tel"
                required
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold">
              Shipping address
            </h2>
            <Input
              label="Address"
              name="address"
              value={form.address}
              error={errors.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              autoComplete="street-address"
              required
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="City"
                name="city"
                value={form.city}
                error={errors.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
                autoComplete="address-level2"
                required
              />
              <Input
                label="Postal code"
                name="postalCode"
                value={form.postalCode}
                error={errors.postalCode}
                onChange={(e) =>
                  setForm((f) => ({ ...f, postalCode: e.target.value }))
                }
                autoComplete="postal-code"
                required
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold">
              Payment method
            </h2>
            <p className="text-sm text-mute">
              Placeholder options only — connect a payment provider before going
              live.
            </p>
            <div className="space-y-3">
              {(
                [
                  ['card', 'Card (placeholder)'],
                  ['cod', 'Cash on delivery (placeholder)'],
                  ['bank', 'Bank transfer (placeholder)'],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className={[
                    'flex cursor-pointer items-center gap-3 border px-4 py-3 text-sm transition-colors',
                    form.paymentMethod === value
                      ? 'border-ink bg-mist'
                      : 'border-line hover:border-mute',
                  ].join(' ')}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={form.paymentMethod === value}
                    onChange={() =>
                      setForm((f) => ({ ...f, paymentMethod: value }))
                    }
                    className="accent-ink"
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit border border-line p-6">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <ul className="mt-6 space-y-4">
            {lineItems.map((item) => (
              <li
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-3 text-sm"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-16 w-12 object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-mute">
                    {item.color} / {item.size} × {item.quantity}
                  </p>
                </div>
                <p>{formatPrice(item.unitPrice * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-3 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-mute">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Shipping</dt>
              <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between text-base font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Button
            type="submit"
            fullWidth
            size="lg"
            className="mt-6"
            disabled={submitting}
          >
            {submitting ? 'Placing order…' : 'Place demo order'}
          </Button>
          <Link to="/cart" className="mt-3 block text-center text-xs uppercase tracking-[0.14em] text-mute hover:text-ink">
            Back to cart
          </Link>
        </aside>
      </form>
    </div>
  )
}
