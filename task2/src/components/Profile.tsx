import { useAuth } from '../auth/useAuth'

// Уровень 3: профиль доступен только авторизованному пользователю
export function Profile() {
  const { user } = useAuth()
  if (!user) return <p>Профиль доступен после входа.</p>
  return (
    <dl>
      <dt>ID</dt><dd>{user.id}</dd>
      <dt>Имя</dt><dd>{user.name}</dd>
    </dl>
  )
}
