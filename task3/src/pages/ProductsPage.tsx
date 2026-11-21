import { Link } from 'react-router-dom'
import { products } from '../data'

export function ProductsPage() {
  return (
    <>
      <h1>Товары</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <Link to={`/products/${p.id}`}>{p.title}</Link> — {p.price} ₽
          </li>
        ))}
      </ul>
    </>
  )
}
