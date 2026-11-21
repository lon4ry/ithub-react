import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <>
      <h1>Главная</h1>
      <p>Демонстрация клиентской маршрутизации на React Router.</p>
      <p><Link to="/products">Перейти к каталогу</Link></p>
    </>
  )
}
