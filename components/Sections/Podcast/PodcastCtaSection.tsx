"use client";

import { Button } from "@/components/ui/button";

interface PodcastCtaSectionProps {
    label: string;
    title: string;
    description: string;
    hint: string;
    buttonLabel: string;
    buttonAriaLabel: string;
}

export function PodcastCtaSection({
    label,
    title,
    description,
    hint,
    buttonLabel,
    buttonAriaLabel,
}: PodcastCtaSectionProps) {
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <div className="max-w-3xl space-y-4 md:space-y-5 lg:space-y-6">
                <span className="button-14-medium text-brown block">{label}</span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
                <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">
                    {description}
                </p>
                <p className="body-14-regular text-black-muted text-pretty">
                    {hint}
                </p>
                <div className="pt-2">
                    <Button asChild variant="brown" className="px-6 py-3 transition-colors duration-200">
                        <a href="#contacto" aria-label={buttonAriaLabel}>
                            {buttonLabel}
                        </a>
                    </Button>
                </div>
            </div>
        </section>
    );
}
