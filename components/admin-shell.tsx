"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LogOut, Moon, Sun } from "lucide-react"
import logoSrc from "@/public/Logo.png"
import { useAdminTheme } from "@/contexts/admin-theme-context"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui-admin/sidebar"
import { Button } from "@/components/ui-admin/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui-admin/breadcrumb"
import { ADMIN_NAV_ITEMS, getBreadcrumbSegments } from "@/lib/admin-nav"
import { useAuth } from "@/contexts/auth-context"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { theme, toggleTheme } = useAdminTheme()
  const segments = getBreadcrumbSegments(pathname)

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas">
        <SidebarHeader>
          <Link
            href="/admin/properties"
            className="flex items-center gap-2 rounded-md outline-none ring-sidebar-ring focus-visible:ring-2"
          >
            <Image
              src={logoSrc}
              alt="Agência Douro"
              width={32}
              height={32}
              className="size-8 shrink-0 object-contain"
            />
            <span className="truncate font-semibold text-sidebar-foreground">
              Agência Douro
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {ADMIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/")
                      }
                    >
                        <Link href={item.href}>
                          <Icon className="size-4 shrink-0" aria-hidden />
                          {item.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
          <SidebarTrigger aria-label="Abrir menu" />
          <Breadcrumb className="min-w-0 flex-1">
            <BreadcrumbList>
              {segments.map((seg, i) => (
                <span key={seg.href} className="contents">
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {seg.isPage ? (
                      <BreadcrumbPage>{seg.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={seg.href}>{seg.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => toggleTheme()}
            aria-label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
          >
            {theme === "dark" ? (
              <Sun className="size-4" aria-hidden />
            ) : (
              <Moon className="size-4" aria-hidden />
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            aria-label="Terminar sessão"
          >
            <LogOut className="size-4" aria-hidden />
            Sair
          </Button>
        </header>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto overflow-x-hidden">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
