"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface EpisodeCardProps {
    id: string;
    url: string;
    title: string;
    videoId: string | null;
    episodeNumber: number;
    episodeLabel: string;
}

export function EpisodeCard({
    url,
    title,
    videoId,
    episodeNumber,
    episodeLabel,
}: EpisodeCardProps) {
    const thumbnailUrl = videoId
        ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        : null;

    return (
        <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 rounded-none"
            aria-label={title}
        >
            <article className="overflow-hidden">
                <div className="relative w-full aspect-video overflow-hidden bg-muted">
                    {thumbnailUrl ? (
                        <Image
                            src={thumbnailUrl}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-200 ease-out group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-muted" aria-hidden>
                            <svg className="size-16 text-grey" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    )}
                    <div
                        className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/20"
                        aria-hidden
                    >
                        <div className="flex size-14 md:size-16 items-center justify-center rounded-full bg-red-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <svg className="size-8 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="mt-3 space-y-1">
                    <span className="text-xs text-brown font-medium body-14-medium">
                        {episodeLabel} {episodeNumber}
                    </span>
                    <h3 className="body-16-medium md:body-18-medium text-black transition-colors duration-200 group-hover:text-brown text-pretty line-clamp-2">
                        {title}
                    </h3>
                </div>
            </article>
        </Link>
    );
}
