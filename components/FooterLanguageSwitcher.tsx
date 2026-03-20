"use client"

import { useEffect, useState } from "react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "preferredLocale"

const LOCALE_LABELS: Record<string, string> = {
  pt: "PT",
  en: "EN",
  fr: "FR",
}

export default function FooterLanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleChangeLocale = (nextLocale: string) => {
    if (!routing.locales.includes(nextLocale as any)) return

    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale)
    } catch {
      // ignore storage errors (SSR / privacy mode)
    }

    if (nextLocale === locale) return

    router.replace(pathname, { locale: nextLocale as any })
  }

  return (
    <div className="flex items-center gap-2">
      {routing.locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => handleChangeLocale(code)}
          className={cn(
            "body-14-medium px-2 py-1 rounded-sm border transition-colors",
            code === locale
              ? "border-brown bg-brown text-white"
              : "border-transparent text-brown hover:border-brown/30 hover:bg-brown/5"
          )}
          aria-label={`Mudar idioma para ${LOCALE_LABELS[code] ?? code}`}
        >
          {LOCALE_LABELS[code] ?? code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

