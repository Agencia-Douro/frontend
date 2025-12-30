"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cards from "./Cards";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";

export default function ImoveisDestacados() {
    const { data: properties = [], isLoading, isError } = useFeaturedProperties()

    if (properties.length < 3 && !isLoading) {
        return null;
    }

    return (
        <section className="relative">
            <div className="container pt-6 md:pt-10 lg:pt-12 xl:pt-[120px] z-20">
                <div className="md:text-center flex flex-col md:items-center lg:gap-6 gap-4">
                    <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">Imóveis Destacados</h2>
                    <p className="body-16-regular lg:body-18-regular text-black-muted md:w-[722px] hidden md:block">Uma seleção criteriosa de imóveis que representam o mais elevado padrão de qualidade, arquitetura e localização, pensada para atender aos clientes mais exigentes.</p>
                    <Button variant="brown" className="mt-4 md:mt-5 hidden md:block">
                        <Link href="/imoveis">Ver tudo</Link>
                    </Button>
                </div>

                {isLoading && (
                    <div className="mt-8 text-center">
                        <p className="text-medium text-black-muted">A carregar imóveis destacados...</p>
                    </div>
                )}

                {isError && (
                    <div className="mt-8 text-center">
                        <p className="text-medium text-red-500">Erro ao carregar imóveis destacados. Tente novamente mais tarde.</p>
                    </div>
                )}

                {!isLoading && !isError && <Cards className="min-w-80" properties={properties} />}
                <Button variant="brown" className="mt-4 md:mt-5 block md:hidden w-full">
                    <Link href="/imoveis">Ver Todos</Link>
                </Button>
            </div>
            <div className="w-screen left-0 bg-[#EDE3D7] lg:h-[386px] absolute top-148 -z-10"></div>
        </section>
    )
}