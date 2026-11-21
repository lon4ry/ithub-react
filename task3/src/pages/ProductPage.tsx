import { Link, useParams } from 'react-router-dom'
import { products } from '../data'

type ProductParams = { id: string }

export function ProductPage() {
  const { id } = useParams<ProductParams>()
  const product = products.find((p) => p.id === Number(id))

  if (!product) {
    return (
      <>
        <h1>Товар не найден</h1>
        <Link to="/products">Назад к списку</Link>
      </>
    )
  }

  return (
    <>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>Цена: {product.price} ₽</p>
      <Link to="/products">Назад к списку</Link>
    </>
  )
}
