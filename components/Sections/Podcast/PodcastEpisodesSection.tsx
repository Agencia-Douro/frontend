"use client";

import { EpisodeCard } from "./EpisodeCard";

interface Episode {
    id: string;
    url: string;
    title: string;
    videoId: string | null;
}

interface PodcastEpisodesSectionProps {
    label: string;
    title: string;
    description: string;
    episodes: Episode[];
    episodeLabel: string;
}

export function PodcastEpisodesSection({
    label,
    title,
    description,
    episodes,
    episodeLabel,
}: PodcastEpisodesSectionProps) {
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <header className="mb-6 md:mb-8 lg:mb-10 xl:mb-12 space-y-2 md:space-y-3">
                <span className="button-14-medium text-gold block">{label}</span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
                <p className="text-black-muted md:body-18-regular body-16-regular max-w-3xl text-pretty">
                    {description}
                </p>
            </header>
            <div className="grid grid-cols-1 gap-6 sm:gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
                {episodes.map((episode, index) => (
                    <EpisodeCard
                        key={episode.id}
                        id={episode.id}
                        url={episode.url}
                        title={episode.title}
                        videoId={episode.videoId}
                        episodeNumber={index + 1}
                        episodeLabel={episodeLabel}
                    />
                ))}
            </div>
        </section>
    );
}
