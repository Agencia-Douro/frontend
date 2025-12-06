"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Card from "@/components/Sections/Imoveis/Card";
import Sidebar from "@/components/sidebar";
import { propertiesApi, PropertyFilters } from "@/services/api";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-flat";

function ImoveisContent() {
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
                <div className="border-r border-[#EAE6DF] bg-deaf">
                    <div className="px-6 py-4 flex justify-between border-b border-[#EAE6DF]">
                        <div className="flex items-center gap-4">
                            <p><span>1 - 20</span> de <span>125</span> imóveis </p>
                            <div className="bg-white shadow-pretty divide-x divide-muted">
                                <button className="cursor-pointer p-1.5 hover:bg-deaf">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-black-grey">
                                        <path d="M8.33333 4.79163L3.125 9.99996L8.33333 15.2083M3.75 9.99996H16.875" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                                <button className="cursor-pointer p-1.5 hover:bg-deaf">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-black-muted">
                                        <path d="M11.6667 4.79163L16.875 9.99996L11.6667 15.2083M16.25 9.99996H3.125" stroke="currentColor" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="tipo" className="body-14-medium text-grey whitespace-nowrap">Ordenar por:</Label>
                            <Select>
                                <SelectTrigger id="tipo" name="tipo">
                                    <SelectValue placeholder="Mais recentes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mais-recentes">Mais recentes</SelectItem>
                                    <SelectItem value="mais antigos">Mais antigos</SelectItem>
                                    <SelectItem value="menor-preco">Menos preço</SelectItem>
                                    <SelectItem value="maior-preco">Maior preço</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
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

export default function Imoveis() {
    return (
        <Suspense fallback={<div className="grid place-items-center h-screen">A carregar...</div>}>
            <ImoveisContent />
        </Suspense>
    );
}
