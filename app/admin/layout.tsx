"use client"

import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminNavbar } from "@/components/admin-navbar"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  return (
    <AuthProvider>
      <div className="antialiased bg-white min-h-screen">
        {isLoginPage ? (
          children
        ) : (
          <AdminAuthGuard>
            <AdminNavbar />
            {children}
          </AdminAuthGuard>
        )}
        <Toaster />
      </div>
    </AuthProvider>
  );
}