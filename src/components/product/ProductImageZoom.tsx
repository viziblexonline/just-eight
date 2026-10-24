import { useEffect, useRef, useState, type MouseEvent, type TouchEvent } from 'react'

const ZOOM = 2.2

type ProductImageZoomProps = {
  images: string[]
  activeIndex: number
  onSelect: (index: number) => void
  alt: string
}

export function ProductImageZoom({
  images,
  activeIndex,
  onSelect,
  alt,
}: ProductImageZoomProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })

  useEffect(() => {
    setHovering(false)
    setOrigin({ x: 50, y: 50 })
  }, [activeIndex, images])

  function updateOrigin(clientX: number, clientY: number) {
    const frame = frameRef.current
    if (!frame) return
    const rect = frame.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    setOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    })
  }

  function onMouseMove(event: MouseEvent<HTMLDivElement>) {
    setHovering(true)
    updateOrigin(event.clientX, event.clientY)
  }

  function onTouchMove(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0]
    if (!touch) return
    setHovering(true)
    updateOrigin(touch.clientX, touch.clientY)
  }

  const src = images[activeIndex] ?? images[0]

  return (
    <div>
      <div
        ref={frameRef}
        className="relative aspect-[3/4] cursor-zoom-in overflow-hidden bg-mist"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={onMouseMove}
        onTouchStart={(event) => {
          const touch = event.touches[0]
          if (!touch) return
          setHovering(true)
          updateOrigin(touch.clientX, touch.clientY)
        }}
        onTouchMove={onTouchMove}
        onTouchEnd={() => setHovering(false)}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="h-full w-full object-contain object-center transition-transform duration-150 ease-out will-change-transform"
            style={{
              transform: hovering ? `scale(${ZOOM})` : 'scale(1)',
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          />
        ) : null}
        <p className="pointer-events-none absolute bottom-3 left-3 bg-snow/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-mute">
          Move cursor to zoom
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => onSelect(i)}
            className={[
              'aspect-square overflow-hidden border transition-colors',
              i === activeIndex ? 'border-ink' : 'border-transparent hover:border-line',
            ].join(' ')}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
