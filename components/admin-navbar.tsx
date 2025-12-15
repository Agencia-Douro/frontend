"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import Link from "next/link"

export function AdminNavbar() {
  const { logout } = useAuth()

  return (
    <div className="border-b border-[#EAE6DF] bg-white">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/admin">
          <h1 className="text-2xl font-semibold">Admin - Agência Douro</h1>
        </Link>
        <Button variant="ghost" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  )
}
