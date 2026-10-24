import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={inputId} className="block space-y-2">
      <span className="text-xs uppercase tracking-[0.14em] text-mute">{label}</span>
      <input
        id={inputId}
        className={[
          'w-full border bg-snow px-4 py-3 text-sm text-ink outline-none transition-colors',
          error ? 'border-red-500' : 'border-line focus:border-ink',
          className,
        ].join(' ')}
        {...props}
      />
      {error ? <span className="block text-xs text-red-600">{error}</span> : null}
    </label>
  )
}
