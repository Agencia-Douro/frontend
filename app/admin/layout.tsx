"use client"

import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminNavbar } from "@/components/admin-navbar"
import { usePathname } from "next/navigation"
import { Mona_Sans } from "next/font/google"
import "../globals.css"
import { QueryProvider } from "@/providers/query-provider"

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  return (
    <html lang="pt-BR" className={`${monaSans.variable} overflow-x-hidden`}>
      <body className="antialiased max-w-screen overflow-x-hidden flex flex-col relative">
        <QueryProvider>
          <AuthProvider>
            <div className="antialiased bg-[#fafafa] min-h-screen">
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

        </QueryProvider>

      </body>
    </html>
  );
}