const ITEMS = [
  'NEW DROP LIVE',
  'EVERYDAY FROM £8',
  'MEN · WOMEN · KIDS',
  'FREE SHIPPING OVER £150',
  'JUST EIGHT',
  'HOODIES · TEES · OUTERWEAR',
]

export function MarqueeStrip() {
  const line = [...ITEMS, ...ITEMS]

  return (
    <div className="overflow-hidden border-y border-line bg-paper py-3.5">
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
        {line.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="font-display text-xl tracking-[0.12em] text-ink/80 md:text-2xl"
          >
            {item}
            <span className="ml-10 text-accent">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
