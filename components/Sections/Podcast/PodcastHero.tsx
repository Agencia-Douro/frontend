"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/Sections/SobreNos/StatCard";
import type { StaticImageData } from "next/image";

interface PodcastHeroProps {
    headerLabel: string;
    title: string;
    intro: string;
    ctaSpotifyLabel: string;
    ctaYouTubeLabel: string;
    ctaContactLabel: string;
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
    title,
    intro,
    ctaSpotifyLabel,
    ctaYouTubeLabel,
    ctaContactLabel,
    logoAlt,
    logo,
    episodesCount = "",
    seasonsCount = "",
    guestsCount = "",
    episodesLabel,
    seasonsLabel,
    guestsLabel,
}: PodcastHeroProps) {
    return (
        <section className="container pt-16 pb-8 md:pt-20 md:pb-10 lg:pt-24 lg:pb-12 xl:pt-32 xl:pb-16">
            <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:justify-between lg:gap-10 xl:gap-12">
                <div className="flex flex-col gap-4 md:gap-5 lg:min-w-0 lg:flex-1">
                    <p className="body-14-medium text-brown uppercase tracking-wider max-w-xs">
                        {headerLabel}
                    </p>
                    <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black xl:max-w-4xl">
                        {title}
                    </h1>
                    <p className="text-black-muted md:body-18-regular body-16-regular max-w-3xl leading-relaxed text-pretty">
                        {intro}
                    </p>
                    <div className="flex flex-wrap gap-3 pt-1">
                        <Button
                            asChild
                            variant="outline"
                            className="px-4 py-2.5 md:px-5 border-brown text-brown hover:bg-brown hover:text-white hover:border-brown transition-colors duration-200"
                        >
                            <Link
                                href="https://open.spotify.com/show/agenciadouro"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={ctaSpotifyLabel}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.359.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
                                </svg>
                                {ctaSpotifyLabel}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="px-4 py-2.5 md:px-5 border-brown text-brown hover:bg-brown hover:text-white hover:border-brown transition-colors duration-200"
                        >
                            <Link
                                href="https://www.youtube.com/@agenciadouromediacaoimobil3889"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={ctaYouTubeLabel}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                {ctaYouTubeLabel}
                            </Link>
                        </Button>
                        <Button asChild variant="brown" className="px-4 py-2.5 md:px-5 transition-colors duration-200">
                            <a href="#contacto" aria-label={ctaContactLabel}>
                                {ctaContactLabel}
                            </a>
                        </Button>
                    </div>
                </div>
                {logo && (
                    <div className="hidden shrink-0 xl:block xl:w-[280px] xl:max-w-[300px]">
                        <Image
                            src={logo}
                            alt={logoAlt}
                            width={300}
                            height={90}
                            className="object-contain w-full h-auto"
                        />
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3 md:gap-8 lg:gap-10 xl:gap-12 mt-8 md:mt-10 lg:mt-12">
                {episodesCount && <StatCard className="hidden md:flex" value={episodesCount} label={episodesLabel} />}
                <StatCard value={seasonsCount} label={seasonsLabel} />
                <StatCard value={guestsCount} label={guestsLabel} />
            </div>
        </section>
    );
}
