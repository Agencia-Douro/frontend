"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/internal-api/admin/me", { method: "GET" })
        if (!res.ok) throw new Error("Not authenticated")
        const data: { isAuthenticated: boolean } = await res.json()
        if (!cancelled) setIsAuthenticated(!!data.isAuthenticated)
      } catch {
        if (!cancelled) setIsAuthenticated(false)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/internal-api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) return false
      setIsAuthenticated(true)
      return true
    } catch {
      return false
    }
  }

  const logout = async () => {
    try {
      await fetch("/internal-api/admin/logout", { method: "POST" })
    } finally {
      setIsAuthenticated(false)
      router.push("/admin/login")
    }
  }

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, login, logout }),
    [isAuthenticated, isLoading]
  )

  return (
    <AuthContext.Provider
      value={value}
    >
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
