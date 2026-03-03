"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { desiredZonesApi, countryConfigsApi } from "@/services/api";
import { useState, useMemo } from "react";

export default function ZonasMaisDesejadas() {
    const t = useTranslations("ZonasMaisDesejadas");
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

    const { data: allZonas, isLoading: isLoadingZones } = useQuery({
        queryKey: ["desired-zones-active-all"],
        queryFn: () => desiredZonesApi.getActive(),
    });

    const { data: countryConfigs, isLoading: isLoadingCountries } = useQuery({
        queryKey: ["country-configs"],
        queryFn: () => countryConfigsApi.getAll(),
    });

    const isLoading = isLoadingZones || isLoadingCountries;

    // Países configurados que têm pelo menos uma zona ativa
    const availableCountries = useMemo(() => {
        if (!allZonas || !countryConfigs) return [];
        const codesWithZones = new Set(allZonas.map(z => z.country || "PT"));
        return countryConfigs.filter(c => codesWithZones.has(c.code));
    }, [allZonas, countryConfigs]);

    // País efetivo: o selecionado se ainda disponível, senão o primeiro
    const effectiveCountryCode = useMemo(() => {
        if (availableCountries.length === 0) return null;
        const found = availableCountries.find(c => c.code === selectedCountry);
        return found ? found.code : availableCountries[0].code;
    }, [availableCountries, selectedCountry]);

    // Zonas do país efetivo
    const zonas = useMemo(() => {
        if (!allZonas || !effectiveCountryCode) return [];
        return allZonas.filter(z => (z.country || "PT") === effectiveCountryCode);
    }, [allZonas, effectiveCountryCode]);

    const showTabs = availableCountries.length > 1;

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

    return (
        <section className="container pt-10 md:pt-10 lg:pt-12 xl:pt-16">
            <div className="text-center flex flex-col items-center lg:gap-6 gap-4">
                <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">{t("title")}</h2>
                <p className="body-16-regular lg:body-18-regular text-black-muted w-full md:w-[490px] text-balance hidden md:block">{t("description")}</p>
            </div>

            {/* Tabs de países - só mostrar se houver mais de um país com zonas */}
            {showTabs && (
                <div className="flex justify-center items-center w-full mt-6 md:mt-8 lg:mt-10">
                    <div className="flex flex-row gap-0 overflow-x-auto">
                        {availableCountries.map((country) => (
                            <Button
                                key={country.code}
                                type="button"
                                variant={effectiveCountryCode === country.code ? "gold" : "ghost"}
                                className="px-3 md:px-4.5 md:w-min whitespace-nowrap body-14-medium"
                                onClick={() => setSelectedCountry(country.code)}
                            >
                                {country.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {zonas && zonas.length > 0 ? (
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
                            <div className="opacity-100 md:group-hover:opacity-100 md:opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-150 transition-all">
                                <div className="md:translate-y-16 md:group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-150 ease-out">
                                    <p className="text-white body-20-medium">{zona.name}</p>
                                    <Button variant="gold" asChild className="w-min">
                                        <Link href={`/imoveis?${effectiveCountryCode !== "PT" ? "city" : "distrito"}=${zona.name}`}>{t("viewAll")}</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center py-16 mt-4 md:mt-5 lg:mt-10 xl:mt-12">
                    <p className="body-16-regular text-black-muted">{t("noZones")}</p>
                </div>
            )}
        </section>
    )
}
