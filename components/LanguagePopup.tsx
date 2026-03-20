"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { useLanguageBannerOffset } from "@/components/LanguageBannerOffsetProvider"
import { ArrowRight , XIcon } from "lucide-react"

const STORAGE_KEY = "preferredLocale"

type LocaleOption = "pt" | "en" | "fr"

const CONTENT_COUNTRY_LABEL = "Portugal"

// For testing only: override the detected country code.
// Set to "fr" to simulate France, "pt" to simulate Portugal, or any other code (e.g. "es") to simulate "rest of world".
// IMPORTANT: set back to null for production.
const TEST_COUNTRY_CODE: string | null = null

type BannerVariant = "fr" | "en"

const BANNER_COPY: Record<
  BannerVariant,
  { prefix: string; changeLabel: string; closeAriaLabel: string }
> = {
  fr: {
    prefix: "Vous êtes en train de voir du contenu pour :",
    changeLabel: "Changer",
    closeAriaLabel: "Fermer",
  },
  en: {
    prefix: "You're viewing content for:",
    changeLabel: "Change",
    closeAriaLabel: "Close",
  },
}

const getLanguageLabel = (locale: LocaleOption, variant: BannerVariant) => {
  if (variant === "fr") {
    return locale === "pt" ? "Portugais" : locale === "en" ? "Anglais" : "Français"
  }

  return locale === "pt" ? "Portuguese" : locale === "en" ? "English" : "French"
}

export function LanguagePopup() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const { setBannerHeightPx } = useLanguageBannerOffset()
  const bannerRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [popup, setPopup] = useState<{
    open: boolean
    bannerVariant: BannerVariant | null
  }>({
    open: false,
    bannerVariant: null,
  })

  const safeLocale: LocaleOption = (["pt", "en", "fr"] as LocaleOption[]).includes(
    locale as LocaleOption
  )
    ? (locale as LocaleOption)
    : "pt"
  const isHomePage = pathname === "/"
  const isPodcastPage = pathname === "/podcast"
  const isHeaderTransparentLike = (isHomePage || isPodcastPage) && !isScrolled

  useEffect(() => {
    if (typeof window === "undefined") return

    const run = async () => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY) as LocaleOption | null
        if (stored && routing.locales.includes(stored)) {
          return
        }
      } catch {
        // ignore storage errors
      }

      // Fallback: detetar via browser locale
      let browserLang = ""
      if (typeof navigator !== "undefined") {
        browserLang = (navigator.languages?.[0] || navigator.language || "").toLowerCase()
      }
      const browserIsFrench = browserLang.startsWith("fr")
      const browserLooksLikePortugal =
        browserLang === "pt-pt" || browserLang.startsWith("pt-pt-") || browserLang.startsWith("pt-pt")

      // Preferir detetar via IP (se disponível)
      let ipCountryCode: string | null = null
      try {
        if (TEST_COUNTRY_CODE) {
          ipCountryCode = TEST_COUNTRY_CODE.toLowerCase()
        } else {
        const res = await fetch("/internal-api/geoip", { method: "GET" })
        if (res.ok) {
          const data = (await res.json()) as { countryCode?: string | null }
          ipCountryCode = data?.countryCode ?? null
        }
        }
      } catch {
        // ignore geo resolution errors
      }

      const bannerVariant: BannerVariant | null =
        ipCountryCode != null
          ? ipCountryCode === "pt"
            ? null
            : ipCountryCode === "fr"
              ? "fr"
              : "en"
          : browserLooksLikePortugal
            ? null
            : browserIsFrench
              ? "fr"
              : "en"

      if (!bannerVariant) {
        setPopup({ open: false, bannerVariant: null })
        return
      }

      setPopup({
        open: true,
        bannerVariant,
      })
    }

    run()
  }, [safeLocale])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Trigger after scrolling at least ~1px
    const onScroll = () => setIsScrolled(window.scrollY > 0.5)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useLayoutEffect(() => {
    if (!popup.open) {
      setBannerHeightPx(0)
      return
    }

    const el = bannerRef.current
    if (!el) return

    const measure = () => setBannerHeightPx(el.getBoundingClientRect().height)
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => {
      ro.disconnect()
      setBannerHeightPx(0)
    }
  }, [popup.open, setBannerHeightPx])

  const handleChange = () => {
    const targetLocale: LocaleOption = popup.bannerVariant === "fr" ? "fr" : "en"
    const nextLocale: LocaleOption = safeLocale === targetLocale ? "pt" : targetLocale

    try {
      window.localStorage.setItem(STORAGE_KEY, nextLocale)
    } catch {
      // ignore
    }

    setPopup((prev) => ({ ...prev, open: false }))

    if (nextLocale === locale) return

    router.replace(pathname, { locale: nextLocale })
  }

  const handleClose = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, safeLocale)
    } catch {
      // ignore
    }

    setPopup((prev) => ({ ...prev, open: false }))
  }

  if (!popup.open) return null

  const detectedVariant = popup.bannerVariant ?? "en"

  const copy = BANNER_COPY[detectedVariant]

  const contentLanguageLabel = getLanguageLabel(safeLocale, detectedVariant)

  return (
    <div
      ref={bannerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-60 transition-colors duration-200",
        isScrolled
          ? "bg-muted border-b border-[#EAE6DF]"
          : isHeaderTransparentLike
            ? "bg-transparent border-b border-[#EAE6DF] xl:border-white/20"
            : "bg-transparent border-b border-[#EAE6DF]"
      )}
    >
      <div className="container py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">

          <p
            className={cn(
              "body-14-regular truncate",
              isScrolled ? "text-brown" : "text-white"
            )}
          >
            {copy.prefix}{" "}
            <span className={cn("font-medium", isScrolled ? "text-brown" : "text-white")}>
              {CONTENT_COUNTRY_LABEL} / {contentLanguageLabel}
            </span>{" "}
            <span className={cn("inline-flex items-center", isScrolled ? "text-brown" : "text-white")}>
              <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleChange}
            className={cn(
              "body-14-regular underline underline-offset-4 transition-colors",
              isScrolled ? "text-brown hover:text-brown-muted" : "text-white hover:text-white/80"
            )}
          >
            {copy.changeLabel}
          </button>

          <button
            type="button"
            aria-label={copy.closeAriaLabel}
            onClick={handleClose}
            className="p-2 rounded-sm hover:bg-white/10 transition-colors"
          >
            <XIcon
              className={cn(
                "w-4 h-4 transition-colors",
                isScrolled ? "text-brown" : "text-white"
              )}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

