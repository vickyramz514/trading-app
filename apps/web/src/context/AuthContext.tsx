import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AuthContextType {
  user: string | null
  login: (username: string, _password: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(() =>
    sessionStorage.getItem('trading-user')
  )

  const login = useCallback((username: string, _password: string) => {
    setUser(username)
    sessionStorage.setItem('trading-user', username)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem('trading-user')
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
