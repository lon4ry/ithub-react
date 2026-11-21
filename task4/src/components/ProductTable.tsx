import type { Product } from '../types'

interface ProductTableProps {
  products: Product[]
  onSelect: (id: number) => void
}

export function ProductTable({ products, onSelect }: ProductTableProps) {
  return (
    <table>
      <thead>
        <tr><th>ID</th><th>Название</th><th>Категория</th><th>Цена</th><th>Наличие</th><th /></tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.title}</td>
            <td>{p.category}</td>
            <td>{p.price.toLocaleString('ru-RU')} ₽</td>
            <td>{p.in_stock ? 'есть' : 'нет'}</td>
            <td><button onClick={() => onSelect(p.id)}>Подробнее</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
