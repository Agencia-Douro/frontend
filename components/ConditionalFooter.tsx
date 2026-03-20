"use client"

import { usePathname } from "@/i18n/navigation"
import Footer from "@/components/Sections/Footer/Footer"

export function ConditionalFooter() {
  const pathname = usePathname()

  const isImoveisListing =
    pathname === "/imoveis" || pathname === "/imoveis-luxo"

  if (isImoveisListing) return null

  return <Footer />
}

