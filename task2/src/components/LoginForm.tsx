import { useState, type SyntheticEvent } from 'react'
import { useAuth } from '../auth/useAuth'

// Уровень 3: условный рендеринг — форма входа или приветствие
export function LoginForm() {
  const { user, login } = useAuth()
  const [name, setName] = useState('')

  if (user) return <p>Вы вошли как <b>{user.name}</b>.</p>

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) login(trimmed)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Имя <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите имя" />
      </label>
      <button type="submit" disabled={!name.trim()}>Войти</button>
    </form>
  )
}
