import type { Product } from '../types'

/**
 * Demo catalog for frontend development.
 * Replace with Supabase (or other) inventory when backend is connected.
 * All items are marked `isDemo: true`.
 */
export const products: Product[] = [
  {
    id: 'je-001',
    slug: 'essential-crew-tee',
    name: 'Essential Crew Tee',
    description:
      'A clean crewneck tee in heavyweight cotton. Soft hand-feel, structured drape, and a silhouette made for everyday wear.',
    details: [
      '240gsm cotton jersey',
      'Relaxed fit with set-in sleeves',
      'Ribbed crew neckline',
      'JUST EIGHT woven label',
    ],
    care: ['Machine wash cold', 'Do not bleach', 'Tumble dry low', 'Iron on low'],
    price: 48,
    category: 't-shirts',
    audience: 'men',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'White', hex: '#ffffff' },
      { name: 'Stone', hex: '#c8c4bc' },
    ],
    stock: 42,
    featured: true,
    newArrival: true,
    popularity: 92,
    createdAt: '2026-09-12',
    isDemo: true,
  },
  {
    id: 'je-002',
    slug: 'atelier-hoodie',
    name: 'Atelier Hoodie',
    description:
      'A refined fleece hoodie with a quiet presence. Brushed interior, clean seams, and a fit that layers without bulk.',
    details: [
      'French terry fleece',
      'Kangaroo pocket',
      'Adjustable drawcord hood',
      'Ribbed cuffs and hem',
    ],
    care: ['Machine wash cold', 'Wash inside out', 'Do not tumble dry', 'Reshape while damp'],
    price: 118,
    salePrice: 98,
    category: 'hoodies',
    audience: 'men',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Charcoal', hex: '#3a3a3a' },
      { name: 'Ivory', hex: '#f2efe8' },
    ],
    stock: 28,
    featured: true,
    bestSeller: true,
    popularity: 98,
    createdAt: '2026-08-20',
    isDemo: true,
  },
  {
    id: 'je-003',
    slug: 'city-shell-jacket',
    name: 'City Shell Jacket',
    description:
      'A lightweight outer layer for transitional weather. Matte finish, minimal hardware, and a tailored but easy cut.',
    details: [
      'Water-resistant shell',
      'Two-way front zip',
      'Storm flap collar',
      'Internal pocket',
    ],
    care: ['Wipe clean', 'Do not dry clean', 'Hang to dry'],
    price: 186,
    category: 'jackets',
    audience: 'men',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Olive', hex: '#4a5240' },
    ],
    stock: 16,
    featured: true,
    newArrival: true,
    popularity: 88,
    createdAt: '2026-09-28',
    isDemo: true,
  },
  {
    id: 'je-004',
    slug: 'motion-tracksuit',
    name: 'Motion Tracksuit',
    description:
      'A two-piece tracksuit designed for ease. Soft stretch fabric, clean lines, and a coordinated set that travels well.',
    details: [
      'Stretch jersey blend',
      'Zip jacket with side pockets',
      'Tapered joggers with elastic waist',
      'Sold as a complete set',
    ],
    care: ['Machine wash cold', 'Do not bleach', 'Hang dry preferred'],
    price: 164,
    category: 'tracksuits',
    audience: 'women',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Slate', hex: '#5c6370' },
    ],
    stock: 21,
    bestSeller: true,
    popularity: 90,
    createdAt: '2026-07-15',
    isDemo: true,
  },
  {
    id: 'je-005',
    slug: 'pulse-training-set',
    name: 'Pulse Training Set',
    description:
      'Breathable activewear for focused sessions. Supportive fit, moisture-managing fabric, and a monochrome finish.',
    details: [
      'Performance stretch knit',
      'Flatlock seams',
      'High-mobility cut',
      'Moisture-wicking finish',
    ],
    care: ['Machine wash cold', 'Do not use fabric softener', 'Hang dry'],
    price: 92,
    salePrice: 78,
    category: 'sportswear',
    audience: 'women',
    images: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Graphite', hex: '#2f2f2f' },
    ],
    stock: 35,
    featured: true,
    popularity: 85,
    createdAt: '2026-08-02',
    isDemo: true,
  },
  {
    id: 'je-006',
    slug: 'nordic-knit-gloves',
    name: 'Nordic Knit Gloves',
    description:
      'Soft knit gloves with a touchscreen-friendly fingertip and a quiet JUST EIGHT finish.',
    details: [
      'Merino-blend knit',
      'Touchscreen compatible tips',
      'Ribbed cuff',
      'Unisex fit',
    ],
    care: ['Hand wash cold', 'Lay flat to dry'],
    price: 36,
    category: 'gloves',
    audience: 'men',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['S', 'M', 'L', 'One Size'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Grey', hex: '#8a8a8a' },
    ],
    stock: 54,
    newArrival: true,
    popularity: 72,
    createdAt: '2026-10-01',
    isDemo: true,
  },
  {
    id: 'je-007',
    slug: 'studio-oversized-tee',
    name: 'Studio Oversized Tee',
    description:
      'An oversized tee with deliberate volume. Dropped shoulders and a longer hem for a modern editorial cut.',
    details: [
      '220gsm cotton',
      'Dropped shoulder',
      'Extended hem',
      'Soft washed finish',
    ],
    care: ['Machine wash cold', 'Tumble dry low', 'Do not iron print'],
    price: 54,
    category: 't-shirts',
    audience: 'women',
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#0a0a0a' },
    ],
    stock: 0,
    popularity: 70,
    createdAt: '2026-06-18',
    isDemo: true,
  },
  {
    id: 'je-008',
    slug: 'line-zip-hoodie',
    name: 'Line Zip Hoodie',
    description:
      'A zip-through hoodie with a neat collar line and subtle branding. Ideal as a mid-layer or standalone piece.',
    details: [
      'Brushed fleece',
      'Full-length zip',
      'Side slit pockets',
      'Metal zipper hardware',
    ],
    care: ['Machine wash cold', 'Wash inside out', 'Do not bleach'],
    price: 128,
    category: 'hoodies',
    audience: 'men',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Fog', hex: '#d9d9d9' },
    ],
    stock: 19,
    bestSeller: true,
    popularity: 94,
    createdAt: '2026-07-30',
    isDemo: true,
  },
  {
    id: 'je-009',
    slug: 'horizon-coach-jacket',
    name: 'Horizon Coach Jacket',
    description:
      'A classic coach jacket updated with a sharper collar and clean pocket geometry.',
    details: [
      'Lightweight woven shell',
      'Snap-button front',
      'Welt pockets',
      'Internal locker loop',
    ],
    care: ['Machine wash cold', 'Hang dry', 'Cool iron if needed'],
    price: 142,
    salePrice: 120,
    category: 'jackets',
    audience: 'women',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548126032-077ad0b3f520?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Navy', hex: '#1b2430' },
    ],
    stock: 12,
    featured: true,
    popularity: 81,
    createdAt: '2026-09-05',
    isDemo: true,
  },
  {
    id: 'je-010',
    slug: 'fleet-jogger-pants',
    name: 'Fleet Jogger Pants',
    description:
      'Tapered joggers with a soft technical hand-feel. Built for commuting, training, and downtime.',
    details: [
      'Technical stretch fabric',
      'Elastic waist with drawcord',
      'Zip ankle cuffs',
      'Secure side pocket',
    ],
    care: ['Machine wash cold', 'Do not bleach', 'Hang dry'],
    price: 88,
    category: 'sportswear',
    audience: 'men',
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Ash', hex: '#9a9a9a' },
    ],
    stock: 31,
    newArrival: true,
    popularity: 86,
    createdAt: '2026-10-05',
    isDemo: true,
  },
  {
    id: 'je-011',
    slug: 'signal-cap',
    name: 'Signal Cap',
    description:
      'A structured six-panel cap with tonal embroidery. An everyday accessory with quiet branding.',
    details: [
      'Cotton twill',
      'Adjustable strap',
      'Tonal embroidery',
      'Structured crown',
    ],
    care: ['Spot clean only', 'Do not machine wash'],
    price: 42,
    category: 'accessories',
    audience: 'women',
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['One Size'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'White', hex: '#ffffff' },
    ],
    stock: 47,
    bestSeller: true,
    popularity: 89,
    createdAt: '2026-08-11',
    isDemo: true,
  },
  {
    id: 'je-012',
    slug: 'form-longsleeve',
    name: 'Form Longsleeve',
    description:
      'A slim-but-easy longsleeve in dense cotton. Clean collar, precise sleeve length, and a versatile base layer.',
    details: [
      'Dense cotton jersey',
      'Slim regular fit',
      'Reinforced collar',
      'Double-needle hem',
    ],
    care: ['Machine wash cold', 'Tumble dry low', 'Iron medium'],
    price: 62,
    category: 't-shirts',
    audience: 'women',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'White', hex: '#ffffff' },
      { name: 'Grey', hex: '#8a8a8a' },
    ],
    stock: 24,
    popularity: 76,
    createdAt: '2026-07-01',
    isDemo: true,
  },
  {
    id: 'je-013',
    slug: 'mini-crew-tee',
    name: 'Mini Crew Tee',
    description:
      'A scaled-down crew tee in soft cotton for everyday play. Easy neckline, durable seams, and a fit made to move.',
    details: [
      'Soft cotton jersey',
      'Relaxed kids fit',
      'Reinforced shoulder seams',
      'JUST EIGHT woven label',
    ],
    care: ['Machine wash cold', 'Tumble dry low', 'Do not bleach'],
    price: 28,
    category: 't-shirts',
    audience: 'kids',
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Stone', hex: '#c8c4bc' },
    ],
    stock: 36,
    featured: true,
    newArrival: true,
    popularity: 80,
    createdAt: '2026-10-08',
    isDemo: true,
  },
  {
    id: 'je-014',
    slug: 'junior-hoodie',
    name: 'Junior Hoodie',
    description:
      'A lighter fleece hoodie cut for smaller frames. Brushed inside, simple hood, and room to layer.',
    details: [
      'Lightweight fleece',
      'Kangaroo pocket',
      'Ribbed cuffs and hem',
      'Kids sizing',
    ],
    care: ['Machine wash cold', 'Wash inside out', 'Hang dry'],
    price: 58,
    salePrice: 48,
    category: 'hoodies',
    audience: 'kids',
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Ivory', hex: '#f2efe8' },
    ],
    stock: 22,
    bestSeller: true,
    popularity: 84,
    createdAt: '2026-09-18',
    isDemo: true,
  },
  {
    id: 'je-015',
    slug: 'play-tracksuit',
    name: 'Play Tracksuit',
    description:
      'A coordinated kids set for school runs and weekends. Soft stretch, elastic cuffs, and a clean two-piece finish.',
    details: [
      'Stretch jersey',
      'Zip jacket',
      'Elastic waist joggers',
      'Sold as a complete set',
    ],
    care: ['Machine wash cold', 'Do not bleach', 'Hang dry'],
    price: 74,
    category: 'tracksuits',
    audience: 'kids',
    images: [
      'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Black', hex: '#0a0a0a' },
      { name: 'Navy', hex: '#1b2430' },
    ],
    stock: 18,
    newArrival: true,
    popularity: 77,
    createdAt: '2026-10-12',
    isDemo: true,
  },
  {
    id: 'je-016',
    slug: 'little-shell-jacket',
    name: 'Little Shell Jacket',
    description:
      'A light kids jacket for cooler days. Snap front, roomy pockets, and a short hem that sits over the tracksuit.',
    details: [
      'Lightweight shell',
      'Snap-button front',
      'Side pockets',
      'Kids fit',
    ],
    care: ['Wipe clean', 'Hang to dry', 'Do not dry clean'],
    price: 86,
    category: 'jackets',
    audience: 'kids',
    images: [
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=80',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Olive', hex: '#4a5240' },
      { name: 'Black', hex: '#0a0a0a' },
    ],
    stock: 14,
    featured: true,
    popularity: 73,
    createdAt: '2026-09-22',
    isDemo: true,
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit)
}

export function getEffectivePrice(product: Product): number {
  return product.salePrice ?? product.price
}
