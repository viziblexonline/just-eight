import { useEffect, useId, useMemo, useState } from 'react'
import { formatPrice } from '../../lib/format'
import { Reveal } from '../ui/Reveal'
import {
  SALES_EVENT,
  buildSalesSeries,
  previousWindowDate,
  readOrderHistory,
  seriesTotals,
  type SalesRange,
} from '../../lib/sales'

const RANGES: { id: SalesRange; label: string }[] = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '12m', label: '12 months' },
]

const WIDTH = 760
const HEIGHT = 280
const PAD = { top: 18, right: 8, bottom: 32, left: 52 }

function compactMoney(amount: number) {
  if (amount >= 1000) {
    const value = amount / 1000
    return `$${value >= 10 ? Math.round(value) : value.toFixed(1)}k`
  }
  return `$${Math.round(amount)}`
}

export function SalesChart() {
  const gradientId = useId().replace(/:/g, '')
  const [range, setRange] = useState<SalesRange>('30d')
  const [active, setActive] = useState<number | null>(null)
  const [revision, setRevision] = useState(0)

  useEffect(() => {
    const refresh = () => setRevision((value) => value + 1)
    window.addEventListener(SALES_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(SALES_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const now = useMemo(() => new Date(), [revision])
  const orders = useMemo(() => readOrderHistory(), [revision])
  const points = useMemo(
    () => buildSalesSeries(range, now, orders),
    [range, now, orders],
  )
  const previous = useMemo(
    () => buildSalesSeries(range, previousWindowDate(range, now), orders),
    [range, now, orders],
  )
  const totals = seriesTotals(points)
  const previousTotals = seriesTotals(previous)
  const change =
    previousTotals.revenue > 0
      ? ((totals.revenue - previousTotals.revenue) / previousTotals.revenue) * 100
      : 0

  const innerW = WIDTH - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom
  const max = Math.max(...points.map((point) => point.revenue), 1)
  const xAt = (index: number) =>
    PAD.left +
    (points.length <= 1 ? innerW / 2 : (index / (points.length - 1)) * innerW)
  const yAt = (value: number) => PAD.top + innerH - (value / max) * innerH

  const line = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${xAt(index)} ${yAt(point.revenue)}`)
    .join(' ')
  const area =
    points.length > 0
      ? `${line} L ${xAt(points.length - 1)} ${PAD.top + innerH} L ${xAt(0)} ${PAD.top + innerH} Z`
      : ''

  const ticks = [0, 0.5, 1]
  const labelStep = range === '30d' ? 5 : 1
  const hovered = active !== null ? points[active] : null

  function moveTo(clientX: number, bounds: DOMRect) {
    if (points.length === 0 || bounds.width === 0) return
    const viewX = ((clientX - bounds.left) / bounds.width) * WIDTH
    let nearest = 0
    let best = Number.POSITIVE_INFINITY
    points.forEach((_, index) => {
      const distance = Math.abs(xAt(index) - viewX)
      if (distance < best) {
        best = distance
        nearest = index
      }
    })
    setActive(nearest)
  }

  return (
    <section className="border-t border-line bg-paper py-16 md:py-24">
      <Reveal className="container-je">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-mute">Performance</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Sales
            </h2>
            <p className="mt-3 max-w-xl text-sm text-mute">
              Revenue for the selected period. Orders placed at checkout are added
              to the matching day.
            </p>
          </div>
          <div className="flex border border-line bg-snow">
            {RANGES.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setRange(option.id)
                  setActive(null)
                }}
                className={[
                  'px-4 py-2.5 text-xs uppercase tracking-[0.14em]',
                  range === option.id ? 'bg-ink text-snow' : 'text-mute hover:text-ink',
                ].join(' ')}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Metric label="Revenue" value={formatPrice(totals.revenue)} />
          <Metric label="Orders" value={String(totals.orders)} />
          <Metric
            label="Vs previous period"
            value={`${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
          />
        </div>

        <div className="mt-8 border border-line bg-snow p-4 md:p-6">
          <div className="relative">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full touch-none"
            role="img"
            aria-label={`Sales chart, ${formatPrice(totals.revenue)} across ${points.length} points`}
            onMouseLeave={() => setActive(null)}
            onMouseMove={(event) =>
              moveTo(event.clientX, event.currentTarget.getBoundingClientRect())
            }
            onTouchStart={(event) => {
              const touch = event.touches[0]
              if (!touch) return
              moveTo(touch.clientX, event.currentTarget.getBoundingClientRect())
            }}
            onTouchMove={(event) => {
              const touch = event.touches[0]
              if (!touch) return
              moveTo(touch.clientX, event.currentTarget.getBoundingClientRect())
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
              </linearGradient>
            </defs>

            {ticks.map((tick) => {
              const y = yAt(max * tick)
              return (
                <g key={tick}>
                  <line
                    x1={PAD.left}
                    x2={WIDTH - PAD.right}
                    y1={y}
                    y2={y}
                    stroke="#e5e5e5"
                  />
                  <text
                    x={PAD.left - 8}
                    y={y + 4}
                    textAnchor="end"
                    fill="#6b6b6b"
                    fontSize="11"
                  >
                    {compactMoney(max * tick)}
                  </text>
                </g>
              )
            })}

            {area ? <path d={area} fill={`url(#${gradientId})`} /> : null}
            {line ? (
              <path d={line} fill="none" stroke="#0a0a0a" strokeWidth="2" />
            ) : null}

            {hovered && active !== null ? (
              <g>
                <line
                  x1={xAt(active)}
                  x2={xAt(active)}
                  y1={PAD.top}
                  y2={PAD.top + innerH}
                  stroke="#0a0a0a"
                  strokeDasharray="3 3"
                />
                <circle cx={xAt(active)} cy={yAt(hovered.revenue)} r="4.5" fill="#0a0a0a" />
              </g>
            ) : null}

            {points.map((point, index) =>
              index % labelStep === 0 || index === points.length - 1 ? (
                <text
                  key={point.key}
                  x={xAt(index)}
                  y={HEIGHT - 8}
                  textAnchor="middle"
                  fill="#6b6b6b"
                  fontSize="11"
                >
                  {point.label}
                </text>
              ) : null,
            )}
          </svg>

          {hovered && active !== null ? (
            <div
              className="pointer-events-none absolute top-2 z-10 min-w-36 border border-line bg-snow px-3 py-2 text-sm shadow-sm"
              style={{
                left: `clamp(0px, ${(xAt(active) / WIDTH) * 100}%, calc(100% - 9.5rem))`,
              }}
            >
              <p className="text-xs uppercase tracking-[0.14em] text-mute">{hovered.label}</p>
              <p className="mt-1 font-display text-lg font-semibold">
                {formatPrice(hovered.revenue)}
              </p>
              <p className="text-xs text-mute">
                {hovered.orders} order{hovered.orders === 1 ? '' : 's'}
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-mute">Hover the chart to read a point.</p>
          )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-snow p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-mute">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold md:text-3xl">{value}</p>
    </div>
  )
}
