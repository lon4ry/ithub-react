import { useAuth } from '../auth/useAuth'

// Уровень 2: вложен в Header, кнопка выхода
export function UserMenu() {
  const { user, logout } = useAuth()
  if (!user) return null
  return <button onClick={logout}>Выйти</button>
}
