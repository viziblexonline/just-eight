import { Minus, Plus } from 'lucide-react'

interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center border border-line">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="grid h-11 w-11 place-items-center text-ink transition-colors hover:bg-mist disabled:opacity-40"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={16} />
      </button>
      <span className="min-w-10 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        className="grid h-11 w-11 place-items-center text-ink transition-colors hover:bg-mist disabled:opacity-40"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
