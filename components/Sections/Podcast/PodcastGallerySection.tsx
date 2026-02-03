"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import type { StaticImageData } from "next/image";
import "yet-another-react-lightbox/styles.css";

export interface PodcastGalleryImage {
    src: string | StaticImageData;
    alt: string;
}

function getImageSrc(src: string | StaticImageData): string {
    if (typeof src === "string") return src;
    return (src as StaticImageData).src;
}

interface PodcastGallerySectionProps {
    label: string;
    title: string;
    description: string;
    images: PodcastGalleryImage[];
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

    const slides = images.map((img) => ({ src: getImageSrc(img.src) }));
    const displayImages = images.slice(0, 9);

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
                {displayImages.map((img, index) => (
                    <button
                        key={index}
                        type="button"
                        className="relative w-full h-full min-h-[160px] sm:min-h-[200px] lg:min-h-0 overflow-hidden bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2"
                        onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                        }}
                        aria-label={`${openLightboxAriaLabel}: ${img.alt}`}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="size-full object-cover object-center"
                            sizes="(max-width: 1024px) 33vw, 33vw"
                        />
                    </button>
                ))}
            </div>
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={slides}
                styles={{
                    root: { "--yarl__color_backdrop": "rgba(0, 0, 0, 0.85)" },
                    slide: { padding: "80px 20px" },
                }}
            />
        </section>
    );
}
