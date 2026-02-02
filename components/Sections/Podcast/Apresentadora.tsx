"use client";

import Image from "next/image";
import VaniaPodcast from "@/public/vania-podcast.png";
import { siteConfigApi, podcastContentApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";

export function Apresentadora() {
    const t = useTranslations("Podcast.apresentadora");
    const locale = useLocale();
    
    const { data: siteConfig } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    });

    const { data: podcastContent } = useQuery({
        queryKey: ["podcast-content", locale],
        queryFn: () => podcastContentApi.get(locale),
    });

    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-center">
                <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                    <span className="body-14-medium text-brown uppercase tracking-wider">{podcastContent?.hostLabel || t("label")}</span>
                    <h2 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-black">{podcastContent?.hostName || "Vânia Fernandes"}</h2>
                    <p className="body-16-medium text-brown">{t("credential")}</p>

                    <div className="space-y-4">
                        <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">{podcastContent?.hostDescription || t("description")}</p>
                        <p className="body-16-medium text-black border-l-2 border-brown pl-4 italic text-pretty">"{t("quote")}"</p>
                    </div>

                    {/* Imagem - Mobile */}
                    <div className="lg:hidden relative w-full max-w-md mx-auto aspect-4/5 overflow-hidden bg-muted">
                        <Image
                            src={siteConfig?.apresentadoraImage || VaniaPodcast}
                            alt={t("imageAlt")}
                            fill
                            className="object-cover"
                            priority
                            unoptimized={!!siteConfig?.apresentadoraImage}
                        />
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-6 md:gap-8 pt-4">
                        <div className="flex flex-col gap-2">
                            <div className="heading-tres-regular md:heading-dois-regular text-brown">
                                {siteConfig?.anosExperiencia}+
                            </div>
                            <p className="body-16-medium text-brown">
                                {t("stats.anosExperiencia")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="heading-tres-regular md:heading-dois-regular text-brown">
                                {siteConfig?.eurosEmTransacoes}M+
                            </div>
                            <p className="body-16-medium text-brown">
                                {t("stats.eurosTransacoes")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="heading-tres-regular md:heading-dois-regular text-brown">
                                {siteConfig?.clientesSatisfeitos}+
                            </div>
                            <p className="body-16-medium text-brown">
                                {t("stats.clientesSatisfeitos")}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="heading-tres-regular md:heading-dois-regular text-brown">
                                {siteConfig?.episodiosPublicados}+
                            </div>
                            <p className="body-16-medium text-brown">
                                {t("stats.episodiosGravados")}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Imagem - Desktop */}
                <div className="hidden lg:block relative w-full lg:max-w-none lg:mx-0 lg:aspect-3/4 xl:aspect-4/5 overflow-hidden bg-muted">
                    <Image
                        src={siteConfig?.apresentadoraImage || VaniaPodcast}
                        alt={t("imageAlt")}
                        fill
                        className="object-cover"
                        priority
                        unoptimized={!!siteConfig?.apresentadoraImage}
                    />
                </div>
            </div>
        </section>
    );
}

