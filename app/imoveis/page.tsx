"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Sections/Imoveis/Card";
import Sidebar from "@/components/sidebar";
import { propertiesApi, PropertyFilters } from "@/services/api";

export default function Imoveis() {
    const searchParams = useSearchParams();

    // Construir filtros a partir dos parâmetros da URL
    const filters: PropertyFilters = {
        transactionType: searchParams.get("transactionType") || undefined,
        propertyType: searchParams.get("propertyType") || undefined,
        isEmpreendimento:
            searchParams.get("isEmpreendimento") === "true" || undefined,
        status: "active", // Apenas mostrar imóveis ativos
        distrito: searchParams.get("distrito") || undefined,
        concelho: searchParams.get("concelho") || undefined,
        minPrice: searchParams.get("minPrice")
            ? Number(searchParams.get("minPrice"))
            : undefined,
        maxPrice: searchParams.get("maxPrice")
            ? Number(searchParams.get("maxPrice"))
            : undefined,
        bedrooms: searchParams.get("bedrooms")?.split(",").map(Number) || undefined,
        bathrooms:
            searchParams.get("bathrooms")?.split(",").map(Number) || undefined,
        propertyState: searchParams.get("propertyState") || undefined,
        energyClass: searchParams.get("energyClass") || undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
        limit: 12,
        sortBy: searchParams.get("sortBy") || "-createdAt",
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ["properties-public", filters],
        queryFn: () => propertiesApi.getAll(filters),
    });

    return (
        <section>
            <div className="container flex divide-x divide-[#EAE6DF] h-full overflow-hidden">
                <Sidebar />
                <div className="border-r border-[#EAE6DF] bg-deaf overflow-y-auto flex-1">
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
    );
}
