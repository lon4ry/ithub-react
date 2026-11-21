import { useState, type SyntheticEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import type { LocationState } from '../components/PrivateRoute'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from?.pathname ?? '/'
  const [name, setName] = useState('')

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) return
    login(name.trim())
    navigate(from, { replace: true })
  }

  return (
    <>
      <h1>Вход</h1>
      {from !== '/' && <p>Для доступа к странице {from} нужно войти.</p>}
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
        <button type="submit">Войти</button>
      </form>
    </>
  )
}
