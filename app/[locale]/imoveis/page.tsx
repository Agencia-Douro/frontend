"use client";

import { Suspense, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Card from "@/components/Sections/Imoveis/Card";
import Sidebar from "@/components/sidebar";
import { propertiesApi, PropertyFilters } from "@/services/api";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-flat";
import useFavorites from "@/hooks/useFavorites";
import { useTranslations } from "next-intl";

function ImoveisContent() {
    // Desabilitar scroll no body quando estiver nesta página
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);
    const t = useTranslations("Imoveis");
    const searchParams = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;
    const { favorites } = useFavorites();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Construir filtros a partir dos parâmetros da URL
    const filters: PropertyFilters = {
        transactionType: searchParams.get("transactionType") || undefined,
        propertyType: searchParams.get("propertyType") || undefined,
        isEmpreendimento:
            searchParams.get("isEmpreendimento") === "true" || undefined,
        status: "active", // Apenas mostrar imóveis ativos
        country: searchParams.get("country") || undefined,
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
        limit: 9,
        sortBy: searchParams.get("sortBy") || "-createdAt",
        lang: locale,
    };

    const onlyFavorites = searchParams.get("onlyFavorites") === "true";

    const { data, isLoading, error } = useQuery({
        queryKey: ["properties-public", locale, filters],
        queryFn: () => propertiesApi.getAll(filters),
    });

    // Filtrar imóveis favoritos se necessário
    const filteredData = onlyFavorites && data ? {
        ...data,
        data: data.data.filter(property => favorites.includes(property.id)),
        total: data.data.filter(property => favorites.includes(property.id)).length,
        totalPages: Math.ceil(data.data.filter(property => favorites.includes(property.id)).length / (filters.limit || 9))
    } : data;

    const currentPage = filters.page || 1;
    const itemsPerPage = filters.limit || 9;
    const totalItems = filteredData?.total || 0;
    const totalPages = filteredData?.totalPages || 1;

    // Calcular o range de itens exibidos
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`/${locale}/imoveis?${params.toString()}`);
    };

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        // Mapear valores do select para sortBy da API
        const sortMap: { [key: string]: string } = {
            "mais-recentes": "-createdAt",
            "mais-antigos": "createdAt",
            "menor-preco": "price",
            "maior-preco": "-price",
        };

        params.set("sortBy", sortMap[value] || "-createdAt");
        params.delete("page"); // Reset para página 1 ao mudar ordenação
        router.push(`/${locale}/imoveis?${params.toString()}`);
    };

    const getSortLabel = (sortBy: string) => {
        if (sortBy === "createdAt") return "mais-antigos";
        if (sortBy === "price") return "menor-preco";
        if (sortBy === "-price") return "maior-preco";
        return "mais-recentes";
    };

    return (
        <section className="h-[calc(100vh-64px)] xl:h-[calc(100vh-72px)] overflow-hidden">
            <div className="container flex flex-col lg:flex-row lg:divide-x divide-[#EAE6DF] h-full overflow-hidden">
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                <div className="border-r border-[#EAE6DF] bg-deaf w-full flex flex-col overflow-hidden min-h-0">
                    <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row gap-4 sm:justify-between border-b border-[#EAE6DF] shrink-0">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="xl:hidden bg-white shadow-pretty p-1.5 cursor-pointer hover:bg-deaf text-black-muted body-14-medium flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-grey">
                                    <path d="M8 4V16M16.4 4H3.6C2.71634 4 2 4.59695 2 5.33333V14.6667C2 15.4031 2.71634 16 3.6 16H16.4C17.2837 16 18 15.4031 18 14.6667V5.33333C18 4.59695 17.2837 4 16.4 4Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
                                </svg>
                                {t("filter")}
                            </button>
                            <div className="bg-white shadow-pretty divide-x divide-muted">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="cursor-pointer p-1.5 hover:bg-deaf disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-black-grey">
                                        <path d="M8.33333 4.79163L3.125 9.99996L8.33333 15.2083M3.75 9.99996H16.875" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="cursor-pointer p-1.5 hover:bg-deaf disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-black-muted">
                                        <path d="M11.6667 4.79163L16.875 9.99996L11.6667 15.2083M16.25 9.99996H3.125" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                            <p className="text-[15px] text-black-muted"><span>{startItem} - {endItem}</span> {t("of")} <span>{totalItems}</span> {t("properties")}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="tipo" className="body-14-medium text-grey whitespace-nowrap">{t("sortBy")}</Label>
                            <Select value={getSortLabel(filters.sortBy || "-createdAt")} onValueChange={handleSortChange}>
                                <SelectTrigger id="tipo" name="tipo">
                                    <SelectValue placeholder={t("sortOptions.mostRecent")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mais-recentes">{t("sortOptions.mostRecent")}</SelectItem>
                                    <SelectItem value="mais-antigos">{t("sortOptions.oldest")}</SelectItem>
                                    <SelectItem value="menor-preco">{t("sortOptions.lowestPrice")}</SelectItem>
                                    <SelectItem value="maior-preco">{t("sortOptions.highestPrice")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {isLoading ?
                            (<div className="grid place-content-center h-full min-h-[400px]">
                                <p>{t("loading")}</p>
                            </div>) : error ?
                                (<div className="grid place-content-center h-full min-h-[400px]">
                                    <p>{t("error")}</p>
                                </div>) : !filteredData || filteredData.data.length === 0 ?
                                    (<div className="grid place-content-center h-full min-h-[400px] text-center p-4">
                                        <p className="body-16-medium text-brown">{t("noResults")}</p>
                                        <p className="body-14-regular mt-1 w-80 text-grey">{t("noResultsDescription")}</p>
                                    </div>) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                            {filteredData.data.map((property) => (
                                                <Card
                                                    key={property.id}
                                                    image={property.image}
                                                    href={`/${locale}/imoveis/${property.id}`}
                                                    titulo={property.title}
                                                    localizacao={`${property.concelho}, ${property.distrito}`}
                                                    preco={property.price}
                                                    status={property.status}
                                                />))}
                                        </div>
                                    )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function Imoveis() {
    const t = useTranslations("Imoveis");
    return (
        <Suspense fallback={<div className="grid place-content-center h-screen">{t("loadingSuspense")}</div>}>
            <ImoveisContent />
        </Suspense>
    );
}