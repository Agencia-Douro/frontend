"use client";

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { StatCard } from "@/components/Sections/SobreNos/StatCard";
import { CulturaCard } from "@/components/Sections/SobreNos/CulturaCard";
import { useQuery } from "@tanstack/react-query";
import { siteConfigApi, podcastTopicsApi, podcastContentApi } from "@/services/api";
import { useParams } from "next/navigation";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import { Apresentadora } from "@/components/Sections/Podcast/Apresentadora";
import logoPodcast from "@/public/logoPodcast.jpg";
import { useTranslations } from "next-intl";

export default function PodcastPage() {
    const t = useTranslations("Podcast");
    const params = useParams();
    const locale = params.locale as string;

    const { data: config } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    })

    const { data: topics, isLoading: topicsLoading } = useQuery({
        queryKey: ["podcast-topics"],
        queryFn: () => podcastTopicsApi.getAll(),
    })

    const { data: podcastContent } = useQuery({
        queryKey: ["podcast-content", locale],
        queryFn: () => podcastContentApi.get(locale),
    })

    return (
        <>
            {/* Primeira Seção - Apresentação do Podcast */}
            <section className="container pt-20 md:pt-20 lg:pt-24 xl:pt-32 relative">
                <Image
                    src={logoPodcast}
                    alt={t("logoAlt")}
                    width={200}
                    height={90}
                    className="hidden lg:block absolute -right-2 lg:-right-6 xl:-right-12 top-0 lg:top-4 xl:top-2 size-26 lg:size-48"
                />
                <div className="lg:space-y-6 space-y-4">
                    <div className="body-14-medium text-gold uppercase tracking-wider">{podcastContent?.headerLabel || t("exclusiveContent")}</div>
                    <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black">{podcastContent?.pageTitle || t("title")}</h1>
                    <h2 className="body-18-medium md:body-20-medium text-black max-w-2xl">{podcastContent?.pageSubtitle || t("subtitle")}</h2>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl leading-relaxed">{podcastContent?.pageDescription || t("description")}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    <div className="hidden md:block">
                        <StatCard value={config?.episodiosPublicados?.toString() || ""} label={t("episodes")} />
                    </div>
                    <StatCard value={config?.temporadas?.toString() || ""} label={t("seasons")} />
                    <StatCard value={config?.especialistasConvidados?.toString() || ""} label={t("guests")} />
                </div>
            </section>
            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-8 md:mt-8 lg:mt-12 xl:mt-16"></div>

            <Apresentadora />

            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-8 md:mt-8 lg:mt-12 xl:mt-16"></div>

            {/* Segunda Seção - O Que Abordamos */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 space-y-6">
                <div>
                    <span className="button-14-medium text-brown">{podcastContent?.topicsLabel || t("themesAndInsights")}</span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{podcastContent?.topicsTitle || t("whatWeCover")}</h2>
                </div>
                {topicsLoading ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">A carregar tópicos...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                        {topics?.map((topic) => {
                            const title = locale === 'en' ? (topic.title_en || topic.title_pt) :
                                         locale === 'fr' ? (topic.title_fr || topic.title_pt) :
                                         topic.title_pt;
                            const description = locale === 'en' ? (topic.description_en || topic.description_pt) :
                                               locale === 'fr' ? (topic.description_fr || topic.description_pt) :
                                               topic.description_pt;

                            return (
                                <CulturaCard
                                    key={topic.id}
                                    title={title}
                                    description={description}
                                />
                            );
                        })}
                    </div>
                )}
            </section>

            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-8 md:mt-8 lg:mt-12 xl:mt-16"></div>

            {/* Terceira Seção - Episódios */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16">
                <div className="lg:space-y-6 space-y-4 mb-6 md:mb-8 lg:mb-10 xl:mb-12">
                    <div>
                        <span className="button-14-medium text-brown">{podcastContent?.episodesLabel || t("watchNow")}</span>
                        <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{podcastContent?.episodesTitle || t("featuredEpisodes")}</h2>
                    </div>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl">
                        {podcastContent?.episodesDescription || t("episodesDescription")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {podcastContent?.episodes?.map((episode, index) => (
                        <Link
                            key={episode.id}
                            href={episode.url}
                            target="_blank"
                            className="group">
                            <article className="">
                                <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                                    <Image
                                        src={`https://img.youtube.com/vi/${episode.videoId}/maxresdefault.jpg`}
                                        alt={episode.title}
                                        fill
                                        className="object-cover transition-transform duration-300"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-brown font-medium">{t("episode")} {index + 1}</span>
                                    </div>
                                    <h3 className="body-16-medium md:body-18-medium text-black group-hover:text-brown transition-colors">
                                        {episode.title}
                                    </h3>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-8 md:mt-8 lg:mt-12 xl:mt-16"></div>

            {/* Secção - Onde nos encontrar */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16">
                <div className="lg:space-y-6 space-y-4 mb-6 md:mb-8 lg:mb-10 xl:mb-12">
                    <div>
                        <span className="button-14-medium text-brown">{t("whereToFindUs")}</span>
                        <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{t("whereToFindUsTitle")}</h2>
                    </div>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl">
                        {t("whereToFindUsDescription")}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    {/* YouTube */}
                    <Link
                        href="https://www.youtube.com/@agenciadouro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-3 bg-[#FF0000] hover:bg-[#CC0000] text-white transition-colors duration-200"
                        aria-label="YouTube"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <span className="body-14-medium">YouTube</span>
                    </Link>

                    {/* Spotify */}
                    <Link
                        href="https://open.spotify.com/show/agenciadouro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white transition-colors duration-200"
                        aria-label="Spotify"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.359.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        <span className="body-14-medium">Spotify</span>
                    </Link>

                    {/* TikTok */}
                    <Link
                        href="https://www.tiktok.com/@agenciadouro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-3 bg-black hover:bg-gray-800 text-white transition-colors duration-200"
                        aria-label="TikTok"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        <span className="body-14-medium">TikTok</span>
                    </Link>
                </div>
            </section>

            <Testemunhos />
            <FaleConnosco />
            <Footer />
        </>
    );
}