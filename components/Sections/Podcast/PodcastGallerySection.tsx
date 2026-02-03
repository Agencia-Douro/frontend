"use client";

import Image from "next/image";
import { Cambio } from "cambio";
import type { StaticImageData } from "next/image";

export interface PodcastGalleryImage {
    src: string | StaticImageData;
    alt: string;
}

interface PodcastGallerySectionProps {
    label: string;
    title: string;
    description: string;
    images: PodcastGalleryImage[];
    openLightboxAriaLabel?: string;
    closeLightboxAriaLabel?: string;
}

export function PodcastGallerySection({
    label,
    title,
    description,
    images,
    openLightboxAriaLabel = "Ver imagem em tamanho maior",
    closeLightboxAriaLabel = "Fechar",
}: PodcastGallerySectionProps) {
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <header className="mb-6 md:mb-8 lg:mb-10 space-y-2 text-center max-w-3xl mx-auto">
                <span className="button-14-medium text-brown uppercase tracking-wider block">
                    {label}
                </span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
                <p className="text-black-muted body-16-regular md:body-18-regular leading-relaxed text-pretty mt-4">
                    {description}
                </p>
            </header>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 lg:grid-rows-[1fr_1fr] lg:gap-3 lg:h-[520px] xl:h-[600px]">
                {images.slice(0, 4).map((img, index) => {
                    const placement =
                        index === 0
                            ? "min-h-[160px] sm:min-h-[180px] lg:col-span-3 lg:row-start-1 aspect-[4/3] lg:aspect-auto"
                            : index === 1
                              ? "min-h-[160px] sm:min-h-[180px] lg:col-span-1 lg:row-start-1 aspect-[4/3] lg:aspect-auto"
                              : index === 2
                                ? "min-h-[160px] sm:min-h-[180px] lg:col-span-1 lg:row-start-2 aspect-[4/3] lg:aspect-auto"
                                : "min-h-[160px] sm:min-h-[180px] lg:col-span-3 lg:row-start-2 aspect-[4/3] lg:aspect-auto";
                    return (
                    <div key={index} className={placement}>
                        <Cambio.Root motion="smooth" dismissible>
                            <Cambio.Trigger
                                className="relative w-full h-full min-h-full overflow-hidden bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brown focus-visible:ring-offset-2"
                                aria-label={`${openLightboxAriaLabel}: ${img.alt}`}
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="size-full object-cover object-center"
                                    sizes={index === 0 || index === 3 ? "(max-width: 1024px) 100vw, 75vw" : "(max-width: 1024px) 50vw, 25vw"}
                                />
                            </Cambio.Trigger>
                        <Cambio.Portal>
                            <Cambio.Backdrop className="bg-black/80" />
                            <Cambio.Popup className="relative flex items-center justify-center p-6 max-w-[90vw] max-h-[90dvh] outline-none">
                                <div className="relative w-full max-w-4xl min-h-[60dvh] aspect-video">
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 896px) 90vw, 896px"
                                        unoptimized={typeof img.src === "string"}
                                    />
                                </div>
                                <Cambio.Close
                                    className="absolute top-4 right-4 z-10 size-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                                    aria-label={closeLightboxAriaLabel}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                        <path d="M18 6 6 18" />
                                        <path d="m6 6 12 12" />
                                    </svg>
                                </Cambio.Close>
                            </Cambio.Popup>
                        </Cambio.Portal>
                        </Cambio.Root>
                    </div>
                    );
                })}
            </div>
        </section>
    );
}
