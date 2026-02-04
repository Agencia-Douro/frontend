"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import type { StaticImageData } from "next/image";
import "yet-another-react-lightbox/styles.css";

export type MediaType = "image" | "video";

export interface PodcastGalleryItem {
    src: string | StaticImageData;
    alt: string;
    mediaType?: MediaType;
    videoUrl?: string;
}

// Mantém compatibilidade com interface antiga
export interface PodcastGalleryImage extends PodcastGalleryItem {}

function getImageSrc(src: string | StaticImageData): string {
    if (typeof src === "string") return src;
    return (src as StaticImageData).src;
}

// Helper para extrair ID do YouTube
function getYouTubeVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
}

// Helper para gerar thumbnail do YouTube
function getYouTubeThumbnail(url: string): string {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    return "";
}

interface VideoModalProps {
    videoUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

function VideoModal({ videoUrl, isOpen, onClose }: VideoModalProps) {
    const videoId = getYouTubeVideoId(videoUrl);

    if (!isOpen || !videoId) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={onClose}
        >
            <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
                onClick={onClose}
                aria-label="Fechar vídeo"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <div
                className="relative w-full max-w-4xl aspect-video mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                />
            </div>
        </div>
    );
}

interface PodcastGallerySectionProps {
    label: string;
    title: string;
    description: string;
    images: PodcastGalleryItem[];
    openLightboxAriaLabel?: string;
    closeLightboxAriaLabel?: string;
}

export function PodcastGallerySection({
    label,
    title,
    description,
    images,
    openLightboxAriaLabel = "Ver imagem em tamanho maior",
}: PodcastGallerySectionProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");

    const displayImages = images.slice(0, 9);

    // Filtrar apenas imagens para o lightbox
    const imageOnlySlides = displayImages
        .filter((img) => img.mediaType !== "video")
        .map((img) => ({ src: getImageSrc(img.src) }));

    const handleItemClick = useCallback(
        (item: PodcastGalleryItem, index: number) => {
            if (item.mediaType === "video" && item.videoUrl) {
                setCurrentVideoUrl(item.videoUrl);
                setVideoModalOpen(true);
            } else {
                // Encontrar o índice correto no array de slides (apenas imagens)
                const imageIndex = displayImages
                    .slice(0, index + 1)
                    .filter((img) => img.mediaType !== "video").length - 1;
                setLightboxIndex(Math.max(0, imageIndex));
                setLightboxOpen(true);
            }
        },
        [displayImages]
    );

    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <header className="mb-6 md:mb-8 lg:mb-10 space-y-2 text-center max-w-3xl mx-auto">
                <span className="button-14-medium text-brown uppercase tracking-wider block">
                    {label}
                </span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
                <p className="text-black-muted body-16-regular md:body-18-regular leading-relaxed text-pretty mt-4">
                    {description}
                </p>
            </header>
            <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 min-h-[200px] sm:min-h-[280px] lg:min-h-0 lg:grid-rows-3 lg:h-[520px] xl:h-[600px]">
                {displayImages.map((item, index) => {
                    const isVideo = item.mediaType === "video";
                    const thumbnailSrc = item.src || (isVideo && item.videoUrl ? getYouTubeThumbnail(item.videoUrl) : "");

                    return (
                        <button
                            key={index}
                            type="button"
                            className="relative w-full h-full min-h-[160px] sm:min-h-[200px] lg:min-h-0 overflow-hidden bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2 group"
                            onClick={() => handleItemClick(item, index)}
                            aria-label={
                                isVideo
                                    ? `Reproduzir vídeo: ${item.alt}`
                                    : `${openLightboxAriaLabel}: ${item.alt}`
                            }
                        >
                            {thumbnailSrc && (
                                <Image
                                    src={thumbnailSrc}
                                    alt={item.alt}
                                    fill
                                    className="size-full object-cover object-center"
                                    sizes="(max-width: 1024px) 33vw, 33vw"
                                />
                            )}
                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                    <div className="bg-red-600 rounded-full p-3 sm:p-4 group-hover:scale-110 transition-transform">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-0.5"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={imageOnlySlides}
                styles={{
                    root: { "--yarl__color_backdrop": "rgba(0, 0, 0, 0.85)" },
                    slide: { padding: "80px 20px" },
                }}
            />
            <VideoModal
                videoUrl={currentVideoUrl}
                isOpen={videoModalOpen}
                onClose={() => setVideoModalOpen(false)}
            />
        </section>
    );
}
