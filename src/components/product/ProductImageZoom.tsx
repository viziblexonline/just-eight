import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type TouchEvent,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const ZOOM = 2.35
const SWIPE_THRESHOLD = 42

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
  const touchStartX = useRef<number | null>(null)
  const dragX = useRef(0)
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

  function go(delta: number) {
    if (images.length <= 1) return
    const next = (activeIndex + delta + images.length) % images.length
    onSelect(next)
  }

  function onSwipeStart(clientX: number) {
    touchStartX.current = clientX
    dragX.current = 0
  }

  function onSwipeMove(clientX: number) {
    if (touchStartX.current === null) return
    dragX.current = clientX - touchStartX.current
  }

  function onSwipeEnd() {
    if (touchStartX.current === null) return
    if (dragX.current > SWIPE_THRESHOLD) go(-1)
    else if (dragX.current < -SWIPE_THRESHOLD) go(1)
    touchStartX.current = null
    dragX.current = 0
  }

  function onTouchMoveZoom(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0]
    if (!touch) return
    onSwipeMove(touch.clientX)
    if (Math.abs(dragX.current) < 12) {
      setHovering(true)
      updateOrigin(touch.clientX, touch.clientY)
    }
  }

  const src = images[activeIndex] ?? images[0]

  return (
    <div className="grid gap-4 lg:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:flex-col lg:overflow-visible">
        {images.map((img, i) => (
          <button
            key={`${img}-${i}`}
            type="button"
            onClick={() => onSelect(i)}
            className={[
              'relative aspect-square w-[4.5rem] shrink-0 overflow-hidden border transition-all duration-300 lg:w-full',
              i === activeIndex
                ? 'border-navy'
                : 'border-transparent opacity-70 hover:opacity-100',
            ].join(' ')}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
            {i === activeIndex ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="order-1 lg:order-2">
        <div
          ref={frameRef}
          className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden bg-mist select-none"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onMouseMove={onMouseMove}
          onTouchStart={(event) => {
            const touch = event.touches[0]
            if (!touch) return
            onSwipeStart(touch.clientX)
            updateOrigin(touch.clientX, touch.clientY)
          }}
          onTouchMove={onTouchMoveZoom}
          onTouchEnd={() => {
            onSwipeEnd()
            setHovering(false)
          }}
        >
          {src ? (
            <img
              key={src}
              src={src}
              alt={alt}
              draggable={false}
              className="animate-image-swap h-full w-full object-contain object-center will-change-transform"
              style={{
                transform: hovering ? `scale(${ZOOM})` : 'scale(1)',
                transformOrigin: `${origin.x}% ${origin.y}%`,
                transition: hovering
                  ? 'transform 0.12s linear'
                  : 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          ) : null}

          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-snow/90 text-ink opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  go(-1)
                }}
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-snow/90 text-ink opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  go(1)
                }}
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </>
          ) : null}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
            <p className="bg-snow/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-mute">
              Swipe · hover to zoom
            </p>
            {images.length > 1 ? (
              <p className="bg-ink/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-snow">
                {activeIndex + 1} / {images.length}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
