import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { setAuthToken as storeToken, clearAuthToken } from "@/lib/api"

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
}

interface AuthContextValue {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, full_name?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("fa_auth_token")
    if (saved) {
      setToken(saved)
      storeToken(saved)
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${saved}` },
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) setUser(d.data)
        })
        .catch(() => {
          localStorage.removeItem("fa_auth_token")
          clearAuthToken()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message || "Login failed")
    setToken(data.data.token)
    setUser(data.data.user)
    localStorage.setItem("fa_auth_token", data.data.token)
    storeToken(data.data.token)
  }

  const register = async (email: string, password: string, full_name?: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name }),
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message || "Registration failed")
    setToken(data.data.token)
    setUser(data.data.user)
    localStorage.setItem("fa_auth_token", data.data.token)
    storeToken(data.data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("fa_auth_token")
    clearAuthToken()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
