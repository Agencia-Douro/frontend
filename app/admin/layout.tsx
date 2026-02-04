"use client"

import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/auth-context"
import { AdminThemeProvider } from "@/contexts/admin-theme-context"
import { AdminAuthGuard } from "@/components/admin-auth-guard"
import { AdminShell } from "@/components/admin-shell"
import { usePathname } from "next/navigation"
import { Mona_Sans } from "next/font/google"
import "../globals.css"
import { QueryProvider } from "@/providers/query-provider"

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
})

const themeScript = `(function(){var t=localStorage.getItem('admin-theme');document.documentElement.classList.toggle('dark',t!=='light');})();`

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"

  return (
    <html
      lang="pt-BR"
      data-admin
      className={`${monaSans.variable} overflow-x-hidden`}
    >
      <body className="relative flex max-w-screen flex-col overflow-x-hidden bg-background text-foreground antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AdminThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <div className="flex h-dvh flex-col overflow-hidden bg-background antialiased">
                {isLoginPage ? (
                  children
                ) : (
                  <AdminAuthGuard>
                    <AdminShell>{children}</AdminShell>
                  </AdminAuthGuard>
                )}
                <Toaster />
              </div>
            </AuthProvider>
          </QueryProvider>
        </AdminThemeProvider>
      </body>
    </html>
  )
}