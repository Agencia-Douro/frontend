"use client";

import Image from "next/image";
import Link from "next/link";
import VaniaPodcast from "@/public/vania-podcast.png";
import { siteConfigApi, podcastContentApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";

const LINKEDIN_ICON =
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

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
            <div className="grid grid-cols-1 gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16 lg:items-stretch">
                <div className="space-y-6 md:space-y-8 text-center lg:text-left flex flex-col">
                    <span className="body-14-medium text-brown uppercase tracking-wider">{podcastContent?.hostLabel || t("label")}</span>
                    <h2 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-black">{podcastContent?.hostName || "Vânia Fernandes"}</h2>
                    <p className="body-16-medium text-brown">{t("credential")}</p>

                    <div className="space-y-4">
                        <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">{t("paragraph1")}</p>
                        <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">{t("paragraph2")}</p>
                        <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">{t("paragraph3")}</p>
                        <p className="body-16-medium text-black border-l-2 border-brown pl-4 italic text-pretty">&quot;{t("quote")}&quot;</p>
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

                    {/* LinkedIn - mesmo estilo da secção Onde nos encontrar */}
                    <div className="pt-2">
                        <Link
                            href={t("linkedInUrl")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-5 py-3 md:px-6 text-white transition-colors duration-200 body-14-medium bg-[#0A66C2] hover:bg-[#004182]"
                            aria-label={t("linkedInLabel")}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d={LINKEDIN_ICON} />
                            </svg>
                            <span>{t("linkedInLabel")}</span>
                        </Link>
                    </div>
                </div>

                {/* Imagem - Desktop: mesma altura que a coluna esquerda */}
                <div className="hidden lg:block relative w-full min-h-0 overflow-hidden bg-muted">
                    <Image
                        src={siteConfig?.apresentadoraImage || VaniaPodcast}
                        alt={t("imageAlt")}
                        fill
                        className="object-cover object-top"
                        priority
                        unoptimized={!!siteConfig?.apresentadoraImage}
                        sizes="(min-width: 1024px) 50vw, 0"
                    />
                </div>
            </div>
        </section>
    );
}

