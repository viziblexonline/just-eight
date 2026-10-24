import { readStorage, writeStorage } from './storage'
import type { OrderSummary } from '../types'

export const ORDER_HISTORY_KEY = 'just-eight-order-history'
export const SALES_EVENT = 'just-eight-sales'

export type SalesRange = '7d' | '30d' | '12m'

export interface SalesPoint {
  key: string
  label: string
  revenue: number
  orders: number
}

export function readOrderHistory(): OrderSummary[] {
  const history = readStorage<OrderSummary[]>(ORDER_HISTORY_KEY, [])
  return Array.isArray(history) ? history : []
}

export function recordSale(order: OrderSummary) {
  const history = readOrderHistory()
  if (history.some((entry) => entry.id === order.id)) return
  writeStorage(ORDER_HISTORY_KEY, [order, ...history].slice(0, 100))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SALES_EVENT))
  }
}

function wave(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function dayKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function orderKey(order: OrderSummary, range: SalesRange) {
  const created = new Date(order.createdAt)
  if (Number.isNaN(created.getTime())) return ''
  return range === '12m' ? monthKey(created) : dayKey(created)
}

export function buildSalesSeries(
  range: SalesRange,
  now = new Date(),
  orders: OrderSummary[] = [],
): SalesPoint[] {
  const points: SalesPoint[] = []

  if (range === '12m') {
    for (let index = 11; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1)
      const seasonal = 1 + 0.28 * Math.sin(((date.getMonth() + 1) / 12) * Math.PI * 2)
      const base = 3800 + wave(date.getFullYear() * 12 + date.getMonth() + 3) * 6400
      const revenue = Math.round(base * seasonal)
      points.push({
        key: monthKey(date),
        label: date.toLocaleString('en-US', { month: 'short' }),
        revenue,
        orders: Math.max(12, Math.round(revenue / 96)),
      })
    }
  } else {
    const days = range === '7d' ? 7 : 30
    for (let index = days - 1; index >= 0; index -= 1) {
      const date = new Date(now)
      date.setHours(12, 0, 0, 0)
      date.setDate(date.getDate() - index)
      const weekend = date.getDay() === 0 || date.getDay() === 6 ? 1.42 : 1
      const base = 160 + wave(Math.floor(date.getTime() / 86400000)) * 460
      const revenue = Math.round(base * weekend)
      points.push({
        key: dayKey(date),
        label:
          range === '7d'
            ? date.toLocaleString('en-US', { weekday: 'short' })
            : date.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
        revenue,
        orders: Math.max(1, Math.round(revenue / 78)),
      })
    }
  }

  for (const order of orders) {
    const key = orderKey(order, range)
    const point = points.find((entry) => entry.key === key)
    const total = Number(order.total)
    if (!point || !Number.isFinite(total)) continue
    point.revenue += Math.round(total)
    point.orders += 1
  }

  return points
}

export function previousWindowDate(range: SalesRange, now = new Date()) {
  const date = new Date(now)
  if (range === '12m') date.setFullYear(date.getFullYear() - 1)
  else date.setDate(date.getDate() - (range === '7d' ? 7 : 30))
  return date
}

export function seriesTotals(points: SalesPoint[]) {
  const revenue = points.reduce((sum, point) => sum + point.revenue, 0)
  const orders = points.reduce((sum, point) => sum + point.orders, 0)
  return {
    revenue,
    orders,
    average: orders > 0 ? revenue / orders : 0,
  }
}
