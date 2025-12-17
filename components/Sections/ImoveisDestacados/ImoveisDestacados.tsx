"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cards from "./Cards";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";

export default function ImoveisDestacados() {
    const { data: properties = [], isLoading, isError } = useFeaturedProperties()

    return (
        <section className="relative">
            <div className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 z-20">
                <div className="md:text-center flex flex-col md:items-center lg:gap-6 gap-4">
                    <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">Imóveis Destacados</h2>
                    <p className="body-16-regular lg:body-18-regular text-black-muted md:w-[722px]">Uma seleção criteriosa de imóveis que representam o mais elevado padrão de qualidade, arquitetura e localização, pensada para atender aos clientes mais exigentes.</p>
                    <Button variant="brown" className="mt-4 md:mt-5 w-min">
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

                {!isLoading && !isError && <Cards className="min-w-80" properties={properties} />}
                {/* 
                <div className="mt-4 md:mt-6 flex lg:hidden items-center justify-between">
                    <Button variant="icon-brown" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown group-hover:text-white">
                            <path d="M6.52692 9.16658L10.9969 4.69657L9.81842 3.51807L3.33659 9.99992L9.81842 16.4817L10.9969 15.3032L6.52692 10.8332H16.6699V9.16658H6.52692Z" fill="currentColor"/>
                        </svg>
                    </Button>
                    <Button variant="icon-brown" size="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown group-hover:text-white">
                            <path d="M13.4731 9.16658L9.00308 4.69657L10.1816 3.51807L16.6634 9.99992L10.1816 16.4817L9.00308 15.3032L13.4731 10.8332H3.33008V9.16658H13.4731Z" fill="currentColor"/>
                        </svg>
                    </Button>
                </div>
                     */  }
            </div>
            <div className="w-screen left-0 bg-[#EDE3D7] lg:h-[386px] absolute top-132 -z-10"></div>
        </section>
    )
}