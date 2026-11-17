import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '../../types'
import { ProductCard } from '../product/ProductCard'
import { Reveal } from '../ui/Reveal'

interface ProductRailProps {
  eyebrow?: string
  title: string
  products: Product[]
  viewAllTo?: string
}

export function ProductRail({
  title,
  products,
  viewAllTo = '/shop',
}: ProductRailProps) {
  const railRef = useRef<HTMLDivElement>(null)

  function scrollBy(direction: -1 | 1) {
    const el = railRef.current
    if (!el) return
    el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.85, 400), behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <section className="py-14 md:py-20">
      <div className="container-je">
        <Reveal className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <h2 className="text-2xl font-medium tracking-[0.08em] uppercase md:text-3xl">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll left"
              className="hidden h-9 w-9 place-items-center border border-line text-ink transition-colors hover:border-ink sm:grid"
              onClick={() => scrollBy(-1)}
            >
              <ChevronLeft size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Scroll right"
              className="hidden h-9 w-9 place-items-center border border-line text-ink transition-colors hover:border-ink sm:grid"
              onClick={() => scrollBy(1)}
            >
              <ChevronRight size={16} strokeWidth={1.5} />
            </button>
            <Link
              to={viewAllTo}
              className="ml-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink link-underline"
            >
              View all
            </Link>
          </div>
        </Reveal>
      </div>
      <div className="container-je">
        <div ref={railRef} className="rail-scroll">
          {products.map((product, index) => (
            <div key={product.id} className="rail-item">
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
