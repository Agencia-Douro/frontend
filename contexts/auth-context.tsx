"use client"

import { createContext, useContext, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD
const AUTH_STORAGE_KEY = process.env.NEXT_PUBLIC_ADMIN_AUTH_STORAGE_KEY
const AUTH_EVENT_NAME = "admin-auth-change"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const isAuthenticated = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") return () => {}

      const handler = () => onStoreChange()
      window.addEventListener("storage", handler)
      window.addEventListener(AUTH_EVENT_NAME, handler)
      return () => {
        window.removeEventListener("storage", handler)
        window.removeEventListener(AUTH_EVENT_NAME, handler)
      }
    },
    () => {
      if (typeof window === "undefined") return false
      return localStorage.getItem(AUTH_STORAGE_KEY) === "true"
    },
    () => false
  )

  const login = (email: string, password: string) => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return false

    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() &&
      password === ADMIN_PASSWORD
    ) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true")
      window.dispatchEvent(new Event(AUTH_EVENT_NAME))
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    window.dispatchEvent(new Event(AUTH_EVENT_NAME))
    router.push("/admin/login")
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading: false, login, logout }}
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
