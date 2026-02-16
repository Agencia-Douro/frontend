"use client";

import { CulturaCard } from "@/components/Sections/SobreNos/CulturaCard";

interface Topic {
    id: string;
    title_pt: string;
    title_en?: string;
    title_fr?: string;
    description_pt: string;
    description_en?: string;
    description_fr?: string;
}

interface PodcastTopicsSectionProps {
    label: string;
    title: string;
    topics: Topic[];
    locale: string;
    isLoading?: boolean;
    loadingText?: string;
}

export function PodcastTopicsSection({
    label,
    title,
    topics,
    locale,
    isLoading = false,
    loadingText = "A carregar tópicos...",
}: PodcastTopicsSectionProps) {
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <header className="mb-6 md:mb-8 lg:mb-10 space-y-2">
                <span className="button-14-medium text-gold block">{label}</span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
            </header>
            {isLoading ? (
                <div className="flex justify-center py-12 md:py-16">
                    <p className="body-16-regular text-grey">{loadingText}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:gap-6 md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
                    {topics.map((topic) => {
                        const titleText =
                            locale === "en" ? (topic.title_en || topic.title_pt) :
                            locale === "fr" ? (topic.title_fr || topic.title_pt) :
                            topic.title_pt;
                        const descriptionText =
                            locale === "en" ? (topic.description_en || topic.description_pt) :
                            locale === "fr" ? (topic.description_fr || topic.description_pt) :
                            topic.description_pt;
                        return (
                            <CulturaCard
                                key={topic.id}
                                title={titleText}
                                description={descriptionText}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}
