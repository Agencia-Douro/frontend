"use client";

import { useQuery } from "@tanstack/react-query";
import { propertiesApi } from "@/services/api";
import Card from "../Imoveis/Card";

interface ImoveisRelacionadosProps {
    currentPropertyId: string;
    currentPrice: string | number;
}

export default function ImoveisRelacionados({ currentPropertyId, currentPrice }: ImoveisRelacionadosProps) {
    // Calcular faixa de preço (±20% do preço atual)
    const price = typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice;
    const minPrice = Math.floor(price * 0.8);
    const maxPrice = Math.ceil(price * 1.2);

    const { data, isLoading } = useQuery({
        queryKey: ["related-properties", currentPropertyId, minPrice, maxPrice],
        queryFn: () => propertiesApi.getAll({
            minPrice,
            maxPrice,
            status: "active",
            limit: 3
        }),
    });

    // Filtrar o imóvel atual dos resultados
    const relatedProperties = data?.data?.filter(p => p.id !== currentPropertyId) || [];

    // Pegar apenas os 3 primeiros se houver mais
    const displayProperties = relatedProperties.slice(0, 3);

    if (isLoading) {
        return (
            <section className="container py-16">
                <div className="flex justify-between items-center">
                    <h2 className="text-heading-tres text-brown">Imóveis Relacionados</h2>
                </div>
                <div className="pt-6">
                    <p className="text-brown/50 body-16-regular">A carregar imóveis relacionados...</p>
                </div>
            </section>
        );
    }

    if (displayProperties.length === 0) {
        return null; // Não mostra a seção se não houver imóveis relacionados
    }

    return (
        <section className="container py-16">
            <div className="flex justify-between items-center">
                <h2 className="text-heading-tres text-brown">Imóveis Relacionados</h2>
            </div>
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayProperties.map((property) => (
                    <Card
                        key={property.id}
                        href={`/imoveis/${property.id}`}
                        titulo={property.title}
                        localizacao={`${property.concelho}, ${property.distrito}`}
                        preco={property.price.toString()}
                        image={property.image}
                    />
                ))}
            </div>
        </section>
    );
}