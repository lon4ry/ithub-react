import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthContextValue {
  user: string | null
  login: (name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'router_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))

  const login = (name: string) => {
    localStorage.setItem(STORAGE_KEY, name)
    setUser(name)
  }
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth должен использоваться внутри <AuthProvider>')
  return ctx
}
