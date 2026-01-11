import { useQuery } from "@tanstack/react-query"
import { propertiesApi } from "@/services/api"
import { Property } from "@/types/property"

export function useFeaturedProperties(locale?: string) {
  return useQuery<Property[], Error>({
    queryKey: ["properties", "featured", locale],
    queryFn: () => propertiesApi.getFeatured(locale),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
