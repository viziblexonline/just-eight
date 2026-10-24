import type { Category } from '../types'

export const categories: Category[] = [
  {
    id: 't-shirts',
    name: 'T-Shirts',
    description: 'Essential tees cut for everyday clarity.',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'hoodies',
    name: 'Hoodies & Sweatshirts',
    description: 'Layered comfort with a refined silhouette.',
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'jackets',
    name: 'Jackets & Outerwear',
    description: 'Structured outer layers for cooler days.',
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'tracksuits',
    name: 'Tracksuits',
    description: 'Coordinated sets built for movement.',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sportswear',
    name: 'Sportswear',
    description: 'Performance pieces with a clean aesthetic.',
    image:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'gloves',
    name: 'Gloves',
    description: 'Finishing details for cooler climates.',
    image:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Small pieces that complete the look.',
    image:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80',
  },
]

export function getCategoryName(id: string): string {
  return categories.find((c) => c.id === id)?.name ?? id
}
