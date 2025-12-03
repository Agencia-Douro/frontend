import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cards from "./Cards";

export default function ImoveisDestacados() {
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
                <Cards/>
            </section>
            <div className="w-screen left-0 bg-gold lg:h-[382px] absolute top-110 -z-10"></div>
        </div>
    )
}