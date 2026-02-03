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
        <section className="container pb-12 md:pb-16 lg:pb-20 xl:pb-24">
            <div className="grid grid-cols-1 xl:grid-cols-[auto_1fr] xl:gap-x-12 xl:gap-y-0 gap-y-8 xl:min-h-[28rem] xl:items-stretch">
                <header className="flex flex-col justify-between mb-4 xl:mb-0">
                    <div className="space-y-2 xl:pt-1">
                        <span className="button-14-medium text-brown block">{label}</span>
                        <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">{title}</h2>
                    </div>
                    <div className="h-px w-full bg-brown/30 mt-4 xl:mt-8 hidden xl:block" aria-hidden />
                </header>
                <div className="flex flex-col items-start xl:items-end justify-end max-w-3xl xl:ml-auto space-y-6 md:space-y-8">
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
            </div>
        </section>
    );
}
