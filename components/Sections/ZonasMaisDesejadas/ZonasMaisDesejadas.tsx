"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { desiredZonesApi } from "@/services/api";

export default function ZonasMaisDesejadas() {
    const t = useTranslations("ZonasMaisDesejadas");

    const { data: zonas, isLoading } = useQuery({
        queryKey: ["desired-zones-active"],
        queryFn: () => desiredZonesApi.getActive(),
    });

    if (isLoading) {
        return (
            <section className="container pt-12 md:pt-10 lg:pt-12 xl:pt-16 mt-6 md:mt-10 lg:mt-12 xl:mt-16">
                <div className="text-center flex flex-col items-center lg:gap-6 gap-4">
                    <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">{t("title")}</h2>
                    <p className="body-16-regular lg:body-18-regular text-black-muted w-full md:w-[490px] text-balance hidden md:block">{t("description")}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-5 lg:mt-10 xl:mt-12">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="overflow-hidden w-full h-58 bg-gray-200 animate-pulse" />
                    ))}
                </div>
            </section>
        );
    }

    if (!zonas || zonas.length === 0) {
        return null;
    }

    return (
        <section className="container pt-12 md:pt-10 lg:pt-12 xl:pt-16 mt-6 md:mt-10 lg:mt-12 xl:mt-16">
            <div className="text-center flex flex-col items-center lg:gap-6 gap-4">
                <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">{t("title")}</h2>
                <p className="body-16-regular lg:body-18-regular text-black-muted w-full md:w-[490px] text-balance hidden md:block">{t("description")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-5 lg:mt-10 xl:mt-12">
                {zonas.map((zona) => (
                    <div key={zona.id} className="overflow-hidden w-full max-h-58 group relative">
                        <Image
                            src={zona.image}
                            alt={t("imageAlt", { nome: zona.name })}
                            width={600}
                            height={400}
                            className="object-cover bg-center w-full h-full"
                        />
                        <div className="opacity-100 md:group-hover:opacity-100 md:opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-200 transition-all">
                            <div className="md:translate-y-16 md:group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                                <p className="text-white body-20-medium">{zona.name}</p>
                                <Button variant="gold" asChild className="w-min">
                                    <Link href={`/imoveis?distrito=${zona.name}`}>{t("viewAll")}</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}