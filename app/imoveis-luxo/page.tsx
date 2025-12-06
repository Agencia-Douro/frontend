"use client"

import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import Card from "@/components/Sections/Imoveis/Card"
import Sidebar from "@/components/sidebar"
import { propertiesApi, PropertyFilters } from "@/services/api"

export default function Imoveis() {
    const searchParams = useSearchParams()

    // Construir filtros a partir dos parâmetros da URL + filtro fixo de preço mínimo 800k
    const filters: PropertyFilters = {
        transactionType: searchParams.get("transactionType") || undefined,
        propertyType: searchParams.get("propertyType") || undefined,
        isEmpreendimento: searchParams.get("isEmpreendimento") === "true" || undefined,
        status: "active", // Apenas mostrar imóveis ativos
        distrito: searchParams.get("distrito") || undefined,
        concelho: searchParams.get("concelho") || undefined,
        minPrice: 800000, // Filtro fixo: preço mínimo de 800k para imóveis de luxo
        maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
        bedrooms: searchParams.get("bedrooms")?.split(",").map(Number) || undefined,
        bathrooms: searchParams.get("bathrooms")?.split(",").map(Number) || undefined,
        propertyState: searchParams.get("propertyState") || undefined,
        energyClass: searchParams.get("energyClass") || undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
        limit: 12,
        sortBy: searchParams.get("sortBy") || "-createdAt",
    }

    const { data, isLoading, error } = useQuery({
        queryKey: ["properties-luxury", filters],
        queryFn: () => propertiesApi.getAll(filters),
    })

    return (
        <section className="h-[calc(100vh-73px)]">
            <div className="container flex divide-x divide-[#EAE6DF] h-full">
                <Sidebar />
                <div className="border-r border-[#EAE6DF] bg-deaf">
                    <div></div>
                    <div className="grid grid-cols-3 gap-4 p-4">
                        {isLoading ? (
                            <p>Carregando...</p>
                        ) : error ? (
                            <p>Erro ao carregar imóveis</p>
                        ) : !data || data.data.length === 0 ? (
                            <p>Nenhum imóvel encontrado</p>
                        ) : (
                            data.data.map((property) => (
                                <Card
                                    key={property.id}
                                    image={property.images[0] || "/placeholder.jpg"}
                                    href={`/imoveis/${property.id}`}
                                    titulo={property.title}
                                    localizacao={`${property.concelho}, ${property.distrito}`}
                                    preco={property.price}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}