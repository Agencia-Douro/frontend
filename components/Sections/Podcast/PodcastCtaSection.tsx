"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";

interface PodcastCtaSectionProps {
    label: string;
    title: string;
    description: string;
    hint: string;
    buttonLabel: string;
    buttonAriaLabel: string;
    mailtoHref: string;
    logoSrc?: StaticImageData | string;
    logoAlt?: string;
}

export function PodcastCtaSection({
    label,
    title,
    description,
    hint,
    buttonLabel,
    buttonAriaLabel,
    mailtoHref,
    logoSrc,
    logoAlt = "Norte Imobiliário & Business",
}: PodcastCtaSectionProps) {
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16 relative overflow-hidden">
            {logoSrc && (
                <div
                    className="absolute right-6 xl:right-8 top-1/2 -translate-y-1/2 hidden lg:block w-[260px] xl:w-[300px] aspect-2/1 pointer-events-none"
                    aria-hidden
                >
                    <Image
                        src={logoSrc}
                        alt={logoAlt}
                        fill
                        className="object-contain object-right"
                        sizes="(max-width: 1280px) 260px, 300px"
                    />
                </div>
            )}
            <div className="max-w-3xl space-y-4 md:space-y-5 lg:space-y-6 relative z-10">
                <span className="button-14-medium text-gold block">{label}</span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
                <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">
                    {description}
                </p>
                {hint ? (
                    <p className="body-14-regular text-black-muted text-pretty">
                        {hint}
                    </p>
                ) : null}
                <div className="pt-2">
                    <Button asChild variant="brown" className="w-fit px-6 py-3 transition-colors duration-200">
                        <a href={mailtoHref} aria-label={buttonAriaLabel}>
                            {buttonLabel}
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
