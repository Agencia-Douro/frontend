import { useQuery } from "@tanstack/react-query"
import { countryConfigsApi } from "@/services/api"

export function useCountryConfigs() {
  return useQuery({
    queryKey: ["country-configs"],
    queryFn: () => countryConfigsApi.getAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function getCountryFlag(code: string): string {
  return [...code.toUpperCase()]
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join("")
}
