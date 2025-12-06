"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar a página
    const auth = localStorage.getItem("admin-authenticated")
    setIsAuthenticated(auth === "true")
  }, [])

  const login = (email: string, password: string) => {
    // Credenciais estáticas
    if (email === "admin@agenciadouro.com" && password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("admin-authenticated", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin-authenticated")
    router.push("/admin/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
