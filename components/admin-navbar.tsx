"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui-admin/button"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Logo from "@/public/Logo.svg"

export function AdminNavbar() {
  const { logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Bloquear scroll quando menu mobile está aberto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <header className="border-b border-border bg-card">
      <div className="container">
        <div className="flex items-center xl:h-18 h-16 gap-6">
          {/* Logo */}
          <div className="w-full flex flex-col justify-center">
            <Link href="/admin" className="inline-flex" onClick={() => setMobileMenuOpen(false)}>
              <Image
                className="xl:h-10 xl:w-22 h-8 w-[71px]"
                src={Logo}
                alt="Agência Douro Logótipo"
                width={88}
                height={40}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/admin"
              className={`text-base font-medium transition-colors ${
                pathname === "/admin" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/properties"
              className={`text-base font-medium transition-colors ${
                pathname?.includes("/admin/properties") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Imóveis
            </Link>
            <Link
              href="/admin/newsletters"
              className={`text-base font-medium transition-colors ${
                pathname?.includes("/admin/newsletters") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Newsletters
            </Link>
            <Link
              href="/admin/desired-zones"
              className={`text-base font-medium transition-colors ${
                pathname?.includes("/admin/desired-zones") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Zonas
            </Link>
            <Link
              href="/admin/site-config"
              className={`text-base font-medium transition-colors ${
                pathname?.includes("/admin/site-config") ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Configurações
            </Link>
          </nav>

          {/* Logout Button + Mobile Menu Toggle */}
          <div className="w-full flex gap-2 justify-end">
            <Button
              variant="secondary"
              onClick={logout}
            >
              Sair
            </Button>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              className="block p-1 lg:hidden cursor-pointer z-999 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.42L10.59 12l-4.89 4.88a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z" fill="currentColor" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21V8H3V6ZM3 16H21V18H3V16Z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <nav className={`lg:hidden p-4 border-t border-border flex flex-col items-center pt-8 gap-6 h-[calc(100dvh-64px)] fixed top-16 bg-card w-full left-0 z-1000 overflow-hidden transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <Link
            href="/admin"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/properties"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Imóveis
          </Link>
          <Link
            href="/admin/newsletters"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Newsletters
          </Link>
          <Link
            href="/admin/desired-zones"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Zonas
          </Link>
          <Link
            href="/admin/site-config"
            className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Configurações
          </Link>
          <Button
            variant="secondary"
            onClick={() => {
              logout()
              setMobileMenuOpen(false)
            }}
            className="mt-8"
          >
            Sair
          </Button>
        </nav>
      </div>
    </header>
  )
}
