export interface Product {
  id: number
  title: string
  price: number
  description: string
}

export const products: Product[] = [
  { id: 1, title: 'Клавиатура', price: 3500, description: 'Механическая клавиатура, 87 клавиш.' },
  { id: 2, title: 'Мышь', price: 1200, description: 'Беспроводная мышь, 4000 DPI.' },
  { id: 3, title: 'Монитор', price: 18900, description: '27 дюймов, 2560×1440, IPS.' },
]
