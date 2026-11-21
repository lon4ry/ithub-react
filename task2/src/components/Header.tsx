import { useAuth } from '../auth/useAuth'
import { UserMenu } from './UserMenu'

// Уровень 1: шапка показывает имя пользователя
export function Header() {
  const { user } = useAuth()
  return (
    <header className="header">
      <strong>Context API Demo</strong>
      <span>{user ? `Пользователь: ${user.name}` : 'Гость'}</span>
      <UserMenu />
    </header>
  )
}
