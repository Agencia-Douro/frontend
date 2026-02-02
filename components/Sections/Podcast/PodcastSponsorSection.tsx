"use client";

import Image from "next/image";

interface PodcastSponsorSectionProps {
    imageSrc: string | { src: string };
    imageAlt: string;
    text: string;
}

export function PodcastSponsorSection({
    imageSrc,
    imageAlt,
    text,
}: PodcastSponsorSectionProps) {
    const src = typeof imageSrc === "string" ? imageSrc : imageSrc.src;
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
                <div className="relative w-full max-w-[200px] aspect-2/1 mx-auto">
                    <Image
                        src={src}
                        alt={imageAlt}
                        fill
                        className="object-contain"
                        sizes="200px"
                    />
                </div>
                <p className="text-black-muted body-16-regular md:body-18-regular leading-relaxed text-pretty">
                    {text}
                </p>
            </div>
        </section>
    );
}
