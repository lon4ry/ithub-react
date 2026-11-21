import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext, type User } from './AuthContext'

const STORAGE_KEY = 'auth_user'

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' && value !== null &&
    typeof (value as User).id === 'number' && typeof (value as User).name === 'string'
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [restored, setRestored] = useState(false)

  // Восстановление пользователя при загрузке приложения
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
      if (isUser(saved)) setUser(saved)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
    setRestored(true)
  }, [])

  // Синхронизация с localStorage после восстановления
  useEffect(() => {
    if (!restored) return
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user, restored])

  const login = (name: string) => setUser({ id: Date.now(), name })
  const logout = () => setUser(null)

  if (!restored) return null

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
