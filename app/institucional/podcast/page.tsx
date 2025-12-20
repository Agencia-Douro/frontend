"use client";

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import Image from "next/image";
import testImage from "@/public/test-images/test-Image.jpg";
import Link from "next/link";

interface Episode {
    id: string;
    href: string;
    image: string | typeof testImage;
    alt: string;
    title: string;
    date?: string;
    readingTime?: string;
    season?: number;
    episodeNumber?: number;
}

interface Season {
    id: string;
    season: number;
    episodes: Episode[];
}

// Dados estáticos como fallback
const SEASONS: Season[] = [
    {
        id: "1",
        season: 1,
        episodes: [
            {
                id: "1-1",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
            {
                id: "1-2",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
            {
                id: "1-3",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
            {
                id: "1-4",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
        ],
    },
    {
        id: "2",
        season: 2,
        episodes: [
            {
                id: "2-1",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
            {
                id: "2-2",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
            {
                id: "2-3",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
            {
                id: "2-4",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
        ],
    },
    {
        id: "3",
        season: 3,
        episodes: [
            {
                id: "3-1",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
            {
                id: "3-2",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
            {
                id: "3-3",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
            {
                id: "3-4",
                href: "",
                image: testImage,
                alt: "Imagem de teste",
                title: "O início de uma nova visão sobre o setor | Com Daniela Loureiro Tobo",
            },
        ],
    },
];

export default function PodcastPage() {
    // Usar dados estáticos
    const allEpisodes = SEASONS.flatMap((season) =>
        season.episodes.map((episode, index) => ({
            ...episode,
            season: season.season,
            episodeNumber: index + 1,
        }))
    );

    return (
        <>
            <section className="container">
                <div className="py-6 md:py-10 lg:py-12 xl:py-16">
                    <div className="lg:space-y-6 space-y-4">
                        <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-balance md:whitespace-nowrap text-black">Podcast</h2>
                        <p className="text-black-muted md:body-18-regular body-16-regular w-full">Fique por dentro das últimas novidades do mercado imobiliário</p>
                    </div>

                    <div className="mt-6 md:mt-8 lg:mt-10 xl:mt-12 grid grid-cols-4 gap-6">
                        {allEpisodes.map((episode) => (
                            <Link
                                key={episode.id}
                                href={episode.href}
                                target="_blank">
                                <article className="transition-all duration-200">
                                    <div className="relative w-full aspect-video overflow-hidden">
                                        {typeof episode.image === 'string' ? (
                                            <Image 
                                                src={episode.image} 
                                                alt={episode.alt} 
                                                fill 
                                                className="object-cover" 
                                            />
                                        ) : (
                                            <Image 
                                                src={episode.image} 
                                                alt={episode.alt} 
                                                fill 
                                                className="object-cover" 
                                            />
                                        )}
                                    </div>
                                    <div className="flex justify-between gap-2 items-center mt-4">
                                        <p className="body-14-regular text-black-muted">
                                            {episode.season && episode.episodeNumber 
                                                ? `Temporada ${episode.season} • Episódio ${episode.episodeNumber}`
                                                : episode.date || ""
                                            }
                                        </p>
                                        <p className="body-14-regular text-black-muted">{episode.readingTime}</p>
                                    </div>
                                    <h3 className="body-18-medium text-black mt-2">{episode.title}</h3>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <FaleConnosco/>
            <Footer/>
        </>
    );
}