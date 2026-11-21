import { useEffect } from 'react'
import { ProductTable } from './components/ProductTable'
import { RequestView } from './components/RequestView'
import { useProductsStore } from './store/productsStore'

export default function App() {
  const { list, details, loadProducts, loadProduct } = useProductsStore()

  useEffect(() => {
    void loadProducts()
  }, [loadProducts])

  return (
    <main>
      <h1>Каталог (FastAPI + Axios + Zustand)</h1>

      <section>
        <h2>Список товаров <button onClick={() => void loadProducts()}>Обновить</button></h2>
        <RequestView state={list} onRetry={() => void loadProducts()}>
          {(products) => <ProductTable products={products} onSelect={(id) => void loadProduct(id)} />}
        </RequestView>
      </section>

      <section>
        <h2>
          Карточка товара{' '}
          <button onClick={() => void loadProduct(999)}>Запросить несуществующий (404)</button>
        </h2>
        {details.status === 'idle' && <p>Выберите товар в таблице.</p>}
        <RequestView state={details}>
          {(p) => (
            <div className="card">
              <h3>{p.title}</h3>
              <p>Категория: {p.category}</p>
              <p>Цена: {p.price.toLocaleString('ru-RU')} ₽</p>
              <p>{p.in_stock ? 'В наличии' : 'Нет в наличии'}</p>
            </div>
          )}
        </RequestView>
      </section>
    </main>
  )
}
