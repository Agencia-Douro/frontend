"use client";

interface PodcastAboutSectionProps {
    label: string;
    title: string;
    intro: string;
    origin: string;
    intention: string;
    presentation: string;
}

export function PodcastAboutSection({
    label,
    title,
    intro,
    origin,
    intention,
    presentation,
}: PodcastAboutSectionProps) {
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <header className="mb-6 md:mb-8 lg:mb-10 space-y-2">
                <span className="button-14-medium text-brown block">{label}</span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
            </header>
            <div className="max-w-3xl space-y-6 md:space-y-8">
                <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">
                    {intro}
                </p>
                <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">
                    {origin}
                </p>
                <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">
                    {intention}
                </p>
                <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">
                    {presentation}
                </p>
            </div>
        </section>
    );
}
