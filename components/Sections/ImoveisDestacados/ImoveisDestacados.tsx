"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Cards from "./Cards";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";
import { useTranslations } from "next-intl";

export default function ImoveisDestacados() {
    const { data: properties = [], isLoading, isError } = useFeaturedProperties();
    const t = useTranslations("ImoveisDestacados");

    if (properties.length < 3 && !isLoading) {
        return null;
    }

    return (
        <section className="relative">
            <div className="container pt-8 md:pt-10 lg:pt-8 xl:pt-20 z-20">
                <div className="md:text-center flex flex-col md:items-center lg:gap-6 gap-4">
                    <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">{t("title")}</h2>
                    <p className="body-16-regular lg:body-18-regular text-black-muted md:w-[722px] hidden md:block">{t("description")}</p>
                    <Button variant="gold" className="mt-4 md:mt-5 hidden md:block">
                        <Link href="/imoveis">{t("viewAll")}</Link>
                    </Button>
                </div>

                {isLoading && (
                    <div className="mt-8 text-center">
                        <p className="text-medium text-black-muted">{t("loading")}</p>
                    </div>
                )}

                {isError && (
                    <div className="mt-8 text-center">
                        <p className="text-medium text-red-500">{t("error")}</p>
                    </div>
                )}

                {!isLoading && !isError && <Cards className="min-w-80" properties={properties} />}
                <Button variant="gold" className="mt-4 md:mt-5 block md:hidden w-full">
                    <Link href="/imoveis">{t("viewAllMobile")}</Link>
                </Button>
            </div>
            <div className="w-screen left-0 bg-[#EDE3D7] lg:h-[200px] xl:h-[386px] absolute top-128 -z-10"></div>
        </section>
    )
}