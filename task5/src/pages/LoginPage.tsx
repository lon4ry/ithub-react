import { useState, type SyntheticEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { errorMessage } from '../api/client'
import type { LocationState } from '../components/ProtectedRoute'
import { useAuthStore } from '../store/authStore'

export function LoginPage() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? '/cabinet'

  const [username, setUsername] = useState('student')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  if (user) return <Navigate to={from} replace />

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (username.trim().length < 3) {
      setError('Логин должен содержать минимум 3 символа')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }
    setPending(true)
    setError('')
    try {
      await login(username.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <h1>Вход</h1>
      {from !== '/cabinet' && <p className="notice">Для доступа к странице {from} требуется вход.</p>}
      <form className="form" onSubmit={(e) => void handleSubmit(e)}>
        <label className="field">
          Логин
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label className="field">
          Пароль
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={pending}>
          {pending ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </>
  )
}
