"use client";

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { StatCard } from "@/components/Sections/SobreNos/StatCard";
import { CulturaCard } from "@/components/Sections/SobreNos/CulturaCard";
import Folha from "@/components/Folha";
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
                <Folha className="lg:top-42 xl:top-48 right-0 text-brown rotate-338" />
                <Image src={logoPodcast} alt={t("logoAlt")} width={200} height={90} className="absolute lg:top-42 xl:top-48 right-0 size-26 lg:size-48" />
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
            <Testemunhos />
            <FaleConnosco />
            <Footer />
        </>
    );
}