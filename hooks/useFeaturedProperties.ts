import { useQuery } from "@tanstack/react-query"
import { propertiesApi } from "@/services/api"
import { Property } from "@/types/property"

export function useFeaturedProperties() {
  return useQuery<Property[], Error>({
    queryKey: ["properties", "featured"],
    queryFn: () => propertiesApi.getFeatured(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
