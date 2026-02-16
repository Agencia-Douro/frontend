"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";

interface PodcastSponsorSectionProps {
    imageSrc: string | StaticImageData | { src: string };
    imageAlt: string;
}

function getAspectRatio(
    imageSrc: string | StaticImageData | { src: string }
): string {
    if (typeof imageSrc === "object" && imageSrc !== null && "width" in imageSrc && "height" in imageSrc) {
        return `${(imageSrc as StaticImageData).width}/${(imageSrc as StaticImageData).height}`;
    }
    return "2.5/1";
}

export function PodcastSponsorSection({
    imageSrc,
    imageAlt,
}: PodcastSponsorSectionProps) {
    const aspectRatio = getAspectRatio(imageSrc);
    return (
        <section className="py-8 md:py-10 lg:py-12 xl:py-16 overflow-x-hidden">
            <div
                className="w-screen relative left-1/2 -translate-x-1/2 max-w-none"
                style={{ aspectRatio }}
            >
                <Image
                    src={imageSrc as string | StaticImageData}
                    alt={imageAlt}
                    fill
                    className="object-contain"
                    sizes="100vw"
                />
            </div>
        </section>
    );
}
