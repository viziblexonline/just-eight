import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { faqItems } from '../data/faq'

export function FAQPage() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="container-je py-10 md:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-mute">Help</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        FAQ
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-mute md:text-base">
        Answers below use editable placeholders until JUST EIGHT confirms final
        policies.
      </p>

      <div className="mx-auto mt-12 max-w-3xl divide-y divide-line border-y border-line">
        {faqItems.map((item, index) => {
          const isOpen = open === index
          return (
            <div key={item.question}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : index)}
              >
                <span className="font-display text-lg font-semibold md:text-xl">
                  {item.question}
                </span>
                <ChevronDown
                  size={20}
                  className={[
                    'shrink-0 transition-transform duration-300',
                    isOpen ? 'rotate-180' : '',
                  ].join(' ')}
                />
              </button>
              <div
                className={[
                  'grid transition-all duration-300',
                  isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]',
                ].join(' ')}
              >
                <div className="overflow-hidden">
                  <p className="text-sm leading-relaxed text-mute">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
