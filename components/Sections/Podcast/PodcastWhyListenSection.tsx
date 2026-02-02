"use client";

import {
    Mic,
    TrendingUp,
    Building2,
    Users,
    Scale,
    FileText,
    type LucideIcon,
} from "lucide-react";

export interface WhyListenCard {
    iconKey: string;
    title: string;
    subtext: string;
}

const iconMap: Record<string, LucideIcon> = {
    mic: Mic,
    trendingUp: TrendingUp,
    building: Building2,
    users: Users,
    scale: Scale,
    fileText: FileText,
};

interface PodcastWhyListenSectionProps {
    label: string;
    title: string;
    subtitle: string;
    cards: WhyListenCard[];
}

export function PodcastWhyListenSection({
    label,
    title,
    subtitle,
    cards,
}: PodcastWhyListenSectionProps) {
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <header className="mb-6 md:mb-8 lg:mb-10 space-y-2 text-center max-w-3xl mx-auto">
                <span className="button-14-medium text-brown block">{label}</span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
                <p className="text-black-muted body-16-regular md:body-18-regular leading-relaxed text-pretty mt-4">
                    {subtitle}
                </p>
            </header>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
                {cards.map((card, index) => {
                    const Icon = iconMap[card.iconKey] ?? FileText;
                    return (
                        <div
                            key={index}
                            className="flex flex-col gap-4"
                        >
                            <Icon className="size-6 text-brown shrink-0" aria-hidden />
                            <h3 className="body-18-medium text-black text-balance">
                                {card.title}
                            </h3>
                            <p className="body-16-regular text-black-muted text-pretty">
                                {card.subtext}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
