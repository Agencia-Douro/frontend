"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import type { StaticImageData } from "next/image";
import podcastHeroImg from "@/public/podcast.jpg";

interface PodcastHeroProps {
    headerLabel: string;
    title: string;
    intro: string;
    ctaSpotifyLabel: string;
    ctaYouTubeLabel: string;
    ctaContactLabel: string;
    ctaContactMailto?: string;
    logoAlt: string;
    logo?: string | StaticImageData;
    episodesCount?: string;
    seasonsCount?: string;
    guestsCount?: string;
    episodesLabel: string;
    seasonsLabel: string;
    guestsLabel: string;
}

export function PodcastHero({
    headerLabel,
    intro,
    ctaSpotifyLabel,
    ctaYouTubeLabel,
    ctaContactLabel,
    ctaContactMailto,
    episodesCount = "",
    seasonsCount = "",
    guestsCount = "",
    episodesLabel,
    seasonsLabel,
    guestsLabel,
}: PodcastHeroProps) {
    return (
        <section className="relative">
            <div className="relative w-full min-h-dvh">
                {/* Imagem de fundo */}
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={podcastHeroImg}
                        alt=""
                        fill
                        placeholder="blur"
                        className="object-cover object-center"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-black/50 to-black/80" aria-hidden />
                </div>

                {/* Conteúdo centrado; 16px de espaço abaixo dos botões */}
                <div className="relative flex flex-col justify-center min-h-dvh py-16 md:py-20 lg:py-16 pb-4">
                    <div className="container px-4 w-full">
                        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
                            <p className="body-14-medium text-white/90 uppercase tracking-wider mb-4">
                                {headerLabel}
                            </p>
                             {/* <h1 className="text-white leading-tight heading-quatro-medium md:heading-tres-regular xl:heading-dois-regular text-balance drop-shadow-lg mb-6">{title}</h1> */}
                            <p className="text-white/95 text-3xl md:text-4xl xl:text-5xl max-w-3xl leading-relaxed text-pretty drop-shadow-md mb-8 md:mb-10 font-normal">{intro}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center absolute left-0 right-0 bottom-12 px-4">
                    <Button asChild variant="outline" className="shrink-0 px-4 py-2.5 md:px-5 border-gold text-gold hover:bg-gold hover:text-white hover:border-gold transition-colors duration-200">
                        <Link
                            href="https://open.spotify.com/show/3K8jsTPPNt59OKWyubhA71"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={ctaSpotifyLabel}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.359.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                            {ctaSpotifyLabel}
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="shrink-0 px-4 py-2.5 md:px-5 border-gold text-gold hover:bg-gold hover:text-white hover:border-gold transition-colors duration-200">
                        <Link
                            href="https://www.youtube.com/@norteimobiliariobusiness/videos"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={ctaYouTubeLabel}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            {ctaYouTubeLabel}
                        </Link>
                    </Button>
                    <Button asChild variant="gold" className="shrink-0 px-4 py-2.5 md:px-5 transition-colors duration-200">
                        <a
                            href={ctaContactMailto ?? "#contacto"}
                            aria-label={ctaContactLabel}
                            {...(ctaContactMailto?.startsWith("mailto:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                            {ctaContactLabel}
                        </a>
                    </Button>
                </div>
            </div>

            {/* Stats - abaixo da imagem, fundo claro; mesmo espaçamento em cima e em baixo */}
            <div className="bg-muted pt-8 pb-8 md:pt-10 md:pb-10 lg:pt-12 lg:pb-12">
                <div className="container px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 max-w-4xl mx-auto">
                        {episodesCount && (
                            <div className="hidden md:flex gap-3 md:gap-4 w-full min-w-0 max-w-xs">
                                <div className="flex flex-col gap-3 shrink-0">
                                    <div className="w-px bg-brown h-1/3 min-h-6" aria-hidden />
                                    <div className="w-px bg-brown/20 h-2/3 min-h-12" aria-hidden />
                                </div>
                                <div className="flex flex-col items-start text-left gap-0.5 flex-1 min-w-0">
                                    <div className="heading-tres-regular md:heading-dois-regular text-brown tabular-nums truncate max-w-full">
                                        {episodesCount}+
                                    </div>
                                    <p className="body-16-medium text-brown/90 wrap-break-word">{episodesLabel}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex gap-3 md:gap-4 w-full min-w-0 max-w-xs">
                            <div className="flex flex-col gap-3 shrink-0">
                                <div className="w-px bg-brown h-1/3 min-h-6" aria-hidden />
                                <div className="w-px bg-brown/20 h-2/3 min-h-12" aria-hidden />
                            </div>
                            <div className="flex flex-col items-start text-left gap-0.5 flex-1 min-w-0">
                                <div className="heading-tres-regular md:heading-dois-regular text-brown tabular-nums">
                                    {seasonsCount}+
                                </div>
                                <p className="body-16-medium text-brown/90 wrap-break-word">{seasonsLabel}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 md:gap-4 w-full min-w-0 max-w-xs md:col-span-1">
                            <div className="flex flex-col gap-3 shrink-0">
                                <div className="w-px bg-brown h-1/3 min-h-6" aria-hidden />
                                <div className="w-px bg-brown/20 h-2/3 min-h-12" aria-hidden />
                            </div>
                            <div className="flex flex-col items-start text-left gap-0.5 flex-1 min-w-0">
                                <div className="heading-tres-regular md:heading-dois-regular text-brown tabular-nums">
                                    {guestsCount}+
                                </div>
                                <p className="body-16-medium text-brown/90 wrap-break-word">{guestsLabel}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
