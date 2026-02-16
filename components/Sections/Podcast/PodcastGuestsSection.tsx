"use client";

import Image from "next/image";

export interface GuestItem {
    name: string;
    role: string;
    imageUrl?: string;
}

interface PodcastGuestsSectionProps {
    label: string;
    title: string;
    guests: GuestItem[];
}

export function PodcastGuestsSection({
    label,
    title,
    guests,
}: PodcastGuestsSectionProps) {
    return (
        <section className="container pt-4 pb-8 md:pt-6 md:pb-10 lg:pt-8 lg:pb-12 xl:pt-10 xl:pb-16">
            <header className="mb-6 md:mb-8 lg:mb-10 space-y-2 text-center max-w-3xl mx-auto">
                <span className="button-14-medium text-gold block">{label}</span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
            </header>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-10 max-w-4xl mx-auto justify-items-center">
                {guests.map((guest, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                        {guest.imageUrl ? (
                            <div className="relative size-32 rounded-full overflow-hidden shrink-0">
                                <Image
                                    src={guest.imageUrl}
                                    alt={guest.name}
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            </div>
                        ) : (
                            <div className="size-32 rounded-full bg-brown/20 shrink-0" aria-hidden />
                        )}
                        <h3 className="body-16-medium md:body-18-medium text-black mt-3 text-pretty">{guest.name}</h3>
                        <p className="body-14-regular text-black-muted mt-1 text-pretty">{guest.role}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
