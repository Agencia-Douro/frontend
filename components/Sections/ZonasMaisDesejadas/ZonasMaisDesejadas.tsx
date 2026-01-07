"use client";

import Image from "next/image";
import porto from "@/public/localizacoes/porto.jpg"
import aveiro from "@/public/localizacoes/aveiro.jpg"
import faro from "@/public/localizacoes/faro.jpg"
import coimbra from "@/public/localizacoes/coimbra.jpg"
import braga from "@/public/localizacoes/braga.jpg"
import lisboa from "@/public/localizacoes/lisboa.jpg"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ZonasMaisDesejadas() {
    const t = useTranslations("ZonasMaisDesejadas");
    const zonas = [
        { nome: "Porto", src: porto },
        { nome: "Aveiro", src: aveiro },
        { nome: "Faro", src: faro },
        { nome: "Coimbra", src: coimbra },
        { nome: "Braga", src: braga },
        { nome: "Lisboa", src: lisboa },
    ];
    return (
        <section className="container pt-12 md:pt-10 lg:pt-12 xl:pt-16 mt-6 md:mt-10 lg:mt-12 xl:mt-16">
            <div className="text-center flex flex-col items-center lg:gap-6 gap-4">
                <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">{t("title")}</h2>
                <p className="body-16-regular lg:body-18-regular text-black-muted w-full md:w-[490px] text-balance hidden md:block">{t("description")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-5 lg:mt-10 xl:mt-12">
                {zonas.map(({ nome, src }) => (
                    <div key={nome} className="overflow-hidden w-full max-h-58 group relative">
                        <Image src={src} alt={t("imageAlt", { nome })} className="object-cover bg-center" />
                        <div className="opacity-100 md:group-hover:opacity-100 md:opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="md:translate-y-16 md:group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">{nome}</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href={`/imoveis?distrito=${nome}`}>{t("viewAll")}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}   