export interface FaqItem {
  question: string
  answer: string
}

export const faqItems: FaqItem[] = [
  {
    question: 'Where does JUST EIGHT ship?',
    answer:
      'Shipping destinations and rates are placeholders until confirmed. Update this policy with your supported regions before launch.',
  },
  {
    question: 'How long will delivery take?',
    answer:
      'Estimated delivery windows will depend on your fulfillment partner. Typical fashion brands offer 3–7 business days domestically; confirm your actual timelines before publishing.',
  },
  {
    question: 'Can I return or exchange an item?',
    answer:
      'Returns and exchanges are outlined on the Returns & Refunds page. Finalize your window (for example 14 or 30 days) and condition rules before going live.',
  },
  {
    question: 'How do I choose the right size?',
    answer:
      'Each product page lists available sizes. A full size guide can be added later. If you are between sizes, many customers prefer sizing up for a more relaxed fit.',
  },
  {
    question: 'Are the products on this site real inventory?',
    answer:
      'The current catalog is a demo set for design and development. Live products, prices, and stock will replace these once your backend is connected.',
  },
  {
    question: 'What payment methods will you accept?',
    answer:
      'Payment methods shown at checkout are placeholders. Connect your preferred provider (for example Stripe or a local processor) before accepting real orders.',
  },
]
