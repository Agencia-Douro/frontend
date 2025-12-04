"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cards from "./Cards";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";

export default function ImoveisDestacados() {
    const { data: properties = [], isLoading, isError } = useFeaturedProperties()

    return (
        <div className="relative">
            <section className="container mt-16 z-20">
                <div className="text-center flex flex-col items-center">
                    <h2 className="text-heading-dois">Imóveis Destacados</h2>
                    <p className="mt-6 text-medium text-black-muted w-[722px]">Uma seleção criteriosa de imóveis que representam o mais elevado padrão de qualidade, arquitetura e localização, pensada para atender aos clientes mais exigentes.</p>
                    <Button variant="brown" className="mt-5">
                        <Link href="/imoveis">Ver tudo</Link>
                    </Button>
                </div>

                {isLoading && (
                    <div className="mt-8 text-center">
                        <p className="text-medium text-black-muted">Carregando imóveis destacados...</p>
                    </div>
                )}

                {isError && (
                    <div className="mt-8 text-center">
                        <p className="text-medium text-red-500">Erro ao carregar imóveis destacados. Tente novamente mais tarde.</p>
                    </div>
                )}

                {!isLoading && !isError && <Cards properties={properties} />}
            </section>
            <div className="w-screen left-0 bg-gold lg:h-[382px] absolute top-110 -z-10"></div>
        </div>
    )
}