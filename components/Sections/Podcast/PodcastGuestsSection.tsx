"use client";

interface PodcastGuestsSectionProps {
    label: string;
    title: string;
    description: string;
}

export function PodcastGuestsSection({
    label,
    title,
    description,
}: PodcastGuestsSectionProps) {
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:gap-10 xl:gap-12 lg:items-start">
                <header className="lg:col-span-4 space-y-2 lg:pt-1">
                    <span className="button-14-medium text-brown block">{label}</span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                        {title}
                    </h2>
                </header>
                <div className="lg:col-span-8 lg:pl-10 xl:pl-12">
                    <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}
