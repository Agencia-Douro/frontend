"use client"

import useMobile from "use-mobile"

export function useIsMobile(breakpoint = 768) {
  const { isMobile } = useMobile({ phoneBreakpoint: breakpoint })
  return isMobile
}
