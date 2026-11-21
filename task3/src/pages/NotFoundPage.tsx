import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <>
      <h1>404 — страница не найдена</h1>
      <Link to="/">На главную</Link>
    </>
  )
}
