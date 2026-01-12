"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { propertiesApi } from "@/services/api";
import { Property } from "@/types/property";
import Card from "../Imoveis/Card";

interface ImoveisRelacionadosProps {
    currentPropertyId: string;
    currentPrice: string | number;
    property?: Property;
}

export default function ImoveisRelacionados({ currentPropertyId, currentPrice, property }: ImoveisRelacionadosProps) {
    const params = useParams();
    const locale = params.locale as string;
    const t = useTranslations("PropertyDetails");
    // Verificar se existem relacionamentos manuais
    const hasManualRelated = property?.relatedProperties && property.relatedProperties.length > 0;

    // Calcular faixa de preço (±20% do preço atual) - só usado se não houver relacionamentos manuais
    const price = typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice;
    const minPrice = Math.floor(price * 0.8);
    const maxPrice = Math.ceil(price * 1.2);

    // Buscar propriedades por faixa de preço apenas se não houver relacionamentos manuais
    const { data, isLoading } = useQuery({
        queryKey: ["related-properties-by-price", currentPropertyId, minPrice, maxPrice, locale],
        queryFn: () => propertiesApi.getAll({
            minPrice,
            maxPrice,
            status: "active",
            limit: 3,
            lang: locale
        }),
        enabled: !hasManualRelated, // Só faz a query se não houver relacionamentos manuais
    });

    // Determinar quais propriedades mostrar
    let displayProperties: Property[] = [];

    if (hasManualRelated) {
        // Usar todos os relacionamentos manuais (sem limite)
        displayProperties = property!.relatedProperties!;
    } else if (data?.data) {
        // Usar busca por faixa de preço (limitado a 3)
        const relatedByPrice = data.data.filter(p => p.id !== currentPropertyId);
        displayProperties = relatedByPrice.slice(0, 3);
    }

    // Só mostrar loading se estiver fazendo a busca por preço (não tem relacionamentos manuais)
    if (!hasManualRelated && isLoading) {
        return (
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16">
                <div className="flex justify-between items-center">
                    <h2 className="text-heading-tres text-brown">{t("relatedProperties")}</h2>
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
        <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 mb-10">
            <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">{t("relatedProperties")}</h2>
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayProperties.map((property) => (
                    <Card
                        key={property.id}
                        href={`/${locale}/imoveis/${property.id}`}
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