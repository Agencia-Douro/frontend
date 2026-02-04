import type { LucideIcon } from "lucide-react"
import {
  Building2,
  Mail,
  Settings,
  MessageSquare,
  FileText,
  Home,
  Mic2,
} from "lucide-react"

export type AdminNavItem = { href: string; label: string; icon: LucideIcon }

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: "/admin/properties", label: "Propriedades", icon: Building2 },
  { href: "/admin/newsletters", label: "Newsletters", icon: Mail },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: MessageSquare },
  { href: "/admin/about-us-content", label: "Sobre Nós", icon: FileText },
  { href: "/admin/sell-property-content", label: "Vender Imóvel", icon: Home },
  { href: "/admin/podcast-content", label: "Podcast", icon: Mic2 },
  { href: "/admin/site-config", label: "Configurações do Site", icon: Settings },
]

/** Path prefix to label for breadcrumb (exact or startsWith). */
const PATH_LABELS: { path: string; label: string }[] = [
  ...ADMIN_NAV_ITEMS.map((item) => ({ path: item.href, label: item.label })),
  { path: "/admin/properties/create", label: "Nova propriedade" },
  { path: "/admin/properties/", label: "Imóvel" },
  { path: "/admin/newsletters/create", label: "Nova newsletter" },
  { path: "/admin/newsletters/", label: "Editar" },
]
const PATH_SUFFIX_LABELS: { suffix: string; label: string }[] = [
  { suffix: "/edit", label: "Editar" },
  { suffix: "/create", label: "Criar" },
]

export type BreadcrumbSegment = { href: string; label: string; isPage?: boolean }

function getLabelForPath(built: string, isLast: boolean, part: string): string {
  for (const { suffix, label } of PATH_SUFFIX_LABELS) {
    if (built.endsWith(suffix)) return label
  }
  for (const { path, label } of PATH_LABELS) {
    if (path === built) return label
    if (path.endsWith("/") && built.startsWith(path)) return label
  }
  const nav = ADMIN_NAV_ITEMS.find((item) => item.href === built)
  if (nav) return nav.label
  if (isLast && part) return "Detalhe"
  return part
}

/**
 * Builds breadcrumb segments from pathname.
 * First segment is always Admin -> /admin/properties.
 */
export function getBreadcrumbSegments(pathname: string): BreadcrumbSegment[] {
  const base = pathname.replace(/^\/admin\/?/, "") || ""
  if (!base) {
    return [{ href: "/admin/properties", label: "Admin", isPage: true }]
  }

  const segments: BreadcrumbSegment[] = [
    { href: "/admin/properties", label: "Admin" },
  ]
  const parts = base.split("/").filter(Boolean)
  let built = "/admin"

  for (let i = 0; i < parts.length; i++) {
    built += `/${parts[i]}`
    const isLast = i === parts.length - 1
    const label = getLabelForPath(built, isLast, parts[i])
    segments.push({ href: built, label, isPage: isLast })
  }

  return segments
}
