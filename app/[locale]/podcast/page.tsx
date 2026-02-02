"use client";

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { StatCard } from "@/components/Sections/SobreNos/StatCard";
import { CulturaCard } from "@/components/Sections/SobreNos/CulturaCard";
import { useQuery } from "@tanstack/react-query";
import { siteConfigApi, podcastTopicsApi, podcastContentApi } from "@/services/api";
import { useParams } from "next/navigation";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import { Apresentadora } from "@/components/Sections/Podcast/Apresentadora";
import logoPodcast from "@/public/logoPodcast.jpg";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

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
            {/* Hero Section / Introdução */}
            <section className="container pt-24 md:pt-28 lg:pt-32 xl:pt-40 relative">
                <div className="flex justify-between gap-6">
                    <div className="space-y-3 md:space-y-4">
                        <p className="body-14-medium text-brown uppercase tracking-wider w-48">{podcastContent?.headerLabel || t("exclusiveContent")}</p>
                        <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black xl:max-w-4xl">{podcastContent?.pageTitle || t("title")}</h1>
                        <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl leading-relaxed text-pretty">
                            {t("heroIntro")}
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button asChild variant="outline" className="px-5 py-2.5 border-brown text-brown hover:bg-brown hover:text-white hover:border-brown">
                                <Link
                                    href="https://open.spotify.com/show/agenciadouro"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={t("heroCtaSpotify")}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.359.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                                    </svg>
                                    {t("heroCtaSpotify")}
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="px-5 py-2.5 border-brown text-brown hover:bg-brown hover:text-white hover:border-brown">
                                <Link
                                    href="https://www.youtube.com/@agenciadouromediacaoimobil3889"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={t("heroCtaYouTube")}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    {t("heroCtaYouTube")}
                                </Link>
                            </Button>
                            <Button asChild variant="brown" className="px-5 py-2.5">
                                <a href="#contacto" aria-label={t("heroCtaContact")}>
                                    {t("heroCtaContact")}
                                </a>
                            </Button>
                        </div>
                    </div>
                    {(config?.podcastImagem || logoPodcast) && (
                        <Image
                            src={config?.podcastImagem || logoPodcast}
                            alt={t("logoAlt")}
                            className="hidden xl:block object-contain"
                            width={300}
                            height={90}
                        />
                    )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    <StatCard className="hidden md:block" value={config?.episodiosPublicados?.toString() || ""} label={t("episodes")} />
                    <StatCard value={config?.temporadas?.toString() || ""} label={t("seasons")} />
                    <StatCard value={config?.especialistasConvidados?.toString() || ""} label={t("guests")} />
                </div>
            </section>
            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-12 md:mt-12 lg:mt-16 xl:mt-20"></div>

            <Apresentadora />

            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-12 md:mt-12 lg:mt-16 xl:mt-20"></div>

            {/* Segunda Seção - O Que Abordamos */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-20 space-y-6">
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

            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-12 md:mt-12 lg:mt-16 xl:mt-20"></div>

            {/* Terceira Seção - Episódios */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24">
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

            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-12 md:mt-12 lg:mt-16 xl:mt-20"></div>

            {/* Secção - Onde nos encontrar */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24">
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
                    {/* Instagram */}
                    <Link
                        href="https://www.instagram.com/agenciadouro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-3 bg-linear-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white transition-opacity duration-200"
                        aria-label="Instagram"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        <span className="body-14-medium">Instagram</span>
                    </Link>

                    {/* Facebook */}
                    <Link
                        href="https://www.facebook.com/agenciadouro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white transition-colors duration-200"
                        aria-label="Facebook"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <span className="body-14-medium">Facebook</span>
                    </Link>

                    {/* LinkedIn */}
                    <Link
                        href="https://www.linkedin.com/company/agência-douro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white transition-colors duration-200"
                        aria-label="LinkedIn"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <span className="body-14-medium">LinkedIn</span>
                    </Link>

                    {/* YouTube */}
                    <Link
                        href="https://www.youtube.com/@agenciadouromediacaoimobil3889"
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
                        href="https://www.tiktok.com/@douroimobiliaria"
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

            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-12 md:mt-12 lg:mt-16 xl:mt-20"></div>

            {/* CTA Final / Conversão */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24">
                <div className="max-w-3xl space-y-6">
                    <span className="button-14-medium text-brown">{t("ctaFinalLabel")}</span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">{t("ctaFinalTitle")}</h2>
                    <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">
                        {t("ctaFinalDescription")}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button asChild variant="brown" className="px-6 py-3">
                            <a href="#contacto" aria-label={t("ctaFinalButton")}>
                                {t("ctaFinalButton")}
                            </a>
                        </Button>
                        <Button asChild variant="outline" className="px-6 py-3 border-brown text-brown hover:bg-brown hover:text-white hover:border-brown">
                            <a href="#contacto" aria-label={t("ctaFinalSuggestTopic")}>
                                {t("ctaFinalSuggestTopic")}
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            <Testemunhos />
            <FaleConnosco />
            <Footer />
        </>
    );
}