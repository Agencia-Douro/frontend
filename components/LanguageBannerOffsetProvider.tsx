"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type LanguageBannerOffsetContextValue = {
  bannerHeightPx: number
  setBannerHeightPx: (height: number) => void
}

const LanguageBannerOffsetContext =
  createContext<LanguageBannerOffsetContextValue | null>(null)

export function LanguageBannerOffsetProvider({ children }: { children: ReactNode }) {
  const [bannerHeightPx, setBannerHeightPxState] = useState(0)

  const setBannerHeightPx = useCallback((height: number) => {
    setBannerHeightPxState(Math.max(0, Math.round(height)))
  }, [])

  const value = useMemo(
    () => ({ bannerHeightPx, setBannerHeightPx }),
    [bannerHeightPx, setBannerHeightPx]
  )

  return (
    <LanguageBannerOffsetContext.Provider value={value}>
      {children}
    </LanguageBannerOffsetContext.Provider>
  )
}

export function useLanguageBannerOffset() {
  const ctx = useContext(LanguageBannerOffsetContext)
  return (
    ctx ?? {
      bannerHeightPx: 0,
      setBannerHeightPx: () => {},
    }
  )
}
