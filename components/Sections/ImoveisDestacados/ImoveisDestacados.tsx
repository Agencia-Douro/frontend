"use client"

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import Cards from "./Cards";
import { useFeaturedProperties } from "@/hooks/useFeaturedProperties";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Logo from "@/public/Logo.png";

export default function ImoveisDestacados() {
    const params = useParams();
    const locale = params.locale as string;
    const { data: properties = [], isLoading, isError } = useFeaturedProperties(locale);
    const t = useTranslations("ImoveisDestacados");

    if (properties.length < 3 && !isLoading) {
        return null;
    }

    return (
        <section className="relative">
            {/* Logo Esquerda */}
            <div className="hidden xl:block absolute left-8 top-1/2 -translate-y-1/2 -z-10">
                <Image
                    src={Logo}
                    alt=""
                    width={200}
                    height={200}
                    sizes="200px"
                    className="w-[200px] h-auto opacity-30"
                />
            </div>

            {/* Logo Direita */}
            <div className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 -z-10">
                <Image
                    src={Logo}
                    alt=""
                    width={200}
                    height={200}
                    sizes="200px"
                    className="w-[200px] h-auto opacity-30"
                />
            </div>

            <div className="container pt-8 md:pt-10 lg:pt-20 xl:pt-20 z-20">
                <div className="md:text-center flex flex-col md:items-center lg:gap-6 gap-4">
                    <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">{t("title")}</h2>
                    <p className="body-16-regular lg:body-18-regular text-black-muted md:w-[722px] hidden md:block">{t("description")}</p>
                    <div className="mt-4 md:mt-5 hidden md:flex gap-4">
                        <Button variant="outline">
                            <Link href={`/imoveis`}>
                                {t("viewAll")}
                            </Link>
                        </Button>

                        <a href="tel:+351919766324">
                            <Button variant="gold">
                                {t("contact")}
                            </Button>
                        </a>
                    </div>

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

                {!isLoading && !isError && <Cards className="min-w-80" properties={properties} locale={locale} />}
                <Button variant="gold" className="mt-4 md:mt-5 block md:hidden w-full">
                    <Link href={`/imoveis`}>{t("viewAllMobile")}</Link>
                </Button>
            </div>
            <div className="w-screen left-0 bg-[#EDE3D7] lg:h-[200px] xl:h-[386px] absolute top-128 -z-10"></div>
        </section>
    )
}