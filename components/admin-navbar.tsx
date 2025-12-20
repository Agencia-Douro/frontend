"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "./ui/button"
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
    <header className="border-b border-[#EAE6DF]">
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
              className={`body-16-medium transition-colors ${
                pathname === "/admin" ? "text-gold" : "text-brown hover:text-gold"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/properties"
              className={`body-16-medium transition-colors ${
                pathname?.includes("/admin/properties") ? "text-gold" : "text-brown hover:text-gold"
              }`}
            >
              Imóveis
            </Link>
            <Link
              href="/admin/newsletters"
              className={`body-16-medium transition-colors ${
                pathname?.includes("/admin/newsletters") ? "text-gold" : "text-brown hover:text-gold"
              }`}
            >
              Newsletters
            </Link>
          </nav>

          {/* Logout Button + Mobile Menu Toggle */}
          <div className="w-full flex gap-2 justify-end">
            <Button
              variant="brown"
              onClick={logout}
            >
              Sair
            </Button>
            <button className="block p-1 lg:hidden cursor-pointer z-999" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
                  <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.42L10.59 12l-4.89 4.88a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z" fill="currentColor" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
                  <path d="M3 6H21V8H3V6ZM3 16H21V18H3V16Z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <nav className={`lg:hidden p-4 border-t border-[#EAE6DF] flex flex-col justify-between items-center py-24 h-[calc(100vh-64px)] fixed top-16 bg-muted w-full left-0 z-[1000] overflow-hidden transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <Link
            href="/admin"
            className="body-16-medium text-brown hover:text-gold transition-colors px-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/properties"
            className="body-16-medium text-brown hover:text-gold transition-colors px-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Imóveis
          </Link>
          <Link
            href="/admin/newsletters"
            className="body-16-medium text-brown hover:text-gold transition-colors px-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Newsletters
          </Link>
          <Button
            variant="brown"
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
