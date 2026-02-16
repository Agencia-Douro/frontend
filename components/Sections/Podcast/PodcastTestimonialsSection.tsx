"use client";

import { useState } from "react";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PodcastTestimonialItem {
    name: string;
    role: string;
    text: string;
}

interface PodcastTestimonialsSectionProps {
    label: string;
    title: string;
    subtitle: string;
    testimonials: PodcastTestimonialItem[];
    prevAriaLabel?: string;
    nextAriaLabel?: string;
    logoSrc?: StaticImageData | string;
    logoAlt?: string;
}

function StarRating({ count = 5 }: { count?: number }) {
    return (
        <div className="flex gap-0.5" aria-hidden>
            {Array.from({ length: count }).map((_, i) => (
                <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="text-gold shrink-0"
                >
                    <path
                        d="M9.25805 3.12353C9.56721 2.51693 10.4339 2.51693 10.743 3.12353L12.566 6.70054C12.687 6.93796 12.9142 7.1032 13.1774 7.14512L17.1398 7.77618C17.8114 7.88315 18.079 8.70612 17.5987 9.18762L14.762 12.0319C14.5741 12.2203 14.4875 12.4871 14.529 12.75L15.1541 16.7195C15.26 17.3918 14.5591 17.9006 13.9527 17.5918L10.3788 15.7711C10.1411 15.65 9.85996 15.65 9.6223 15.7711L6.04837 17.5918C5.44199 17.9006 4.74104 17.3918 4.84692 16.7195L5.47216 12.75C5.51356 12.4871 5.42694 12.2203 5.23902 12.0319L2.40235 9.18762C1.92213 8.70612 2.18974 7.88315 2.86133 7.77618L6.82373 7.14512C7.0869 7.1032 7.31415 6.93796 7.43514 6.70054L9.25805 3.12353Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1.25"
                        strokeLinejoin="round"
                    />
                </svg>
            ))}
        </div>
    );
}

export function PodcastTestimonialsSection({
    label,
    title,
    subtitle,
    testimonials,
    prevAriaLabel = "Testemunho anterior",
    nextAriaLabel = "Testemunho seguinte",
    logoSrc,
    logoAlt = "Norte Imobiliário & Business",
}: PodcastTestimonialsSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = testimonials.length;
    const current = testimonials[currentIndex];

    if (!total || !current) return null;

    const initials = current.name
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const goPrev = () => setCurrentIndex((i) => (i <= 0 ? total - 1 : i - 1));
    const goNext = () => setCurrentIndex((i) => (i >= total - 1 ? 0 : i + 1));

    return (
        <section className="bg-muted py-12 md:py-16 lg:py-20 xl:py-24 relative overflow-hidden">
            {logoSrc && (
                <>
                    <div className="absolute left-12 md:left-16 xl:left-20 top-1/2 -translate-y-1/2 w-32 md:w-40 xl:w-48 aspect-2/1 opacity-40 pointer-events-none hidden sm:block" aria-hidden>
                        <Image
                            src={logoSrc}
                            alt=""
                            fill
                            className="object-contain object-left"
                            sizes="(max-width: 768px) 128px, (max-width: 1280px) 160px, 192px"
                        />
                    </div>
                    <div className="absolute right-12 md:right-16 xl:right-20 top-1/2 -translate-y-1/2 w-32 md:w-40 xl:w-48 aspect-2/1 opacity-40 pointer-events-none hidden sm:block" aria-hidden>
                        <Image
                            src={logoSrc}
                            alt=""
                            fill
                            className="object-contain object-right"
                            sizes="(max-width: 768px) 128px, (max-width: 1280px) 160px, 192px"
                        />
                    </div>
                </>
            )}
            <div className="container relative z-10">
                <header className="mb-8 md:mb-10 lg:mb-12 text-center max-w-3xl mx-auto space-y-2">
                    <span className="button-14-medium text-gold uppercase tracking-wider block">
                        {label}
                    </span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                        {title}
                    </h2>
                    <p className="text-black-muted body-16-regular md:body-18-regular leading-relaxed text-pretty mt-4">
                        {subtitle}
                    </p>
                </header>

                <div className="max-w-2xl mx-auto">
                    <div className="bg-deaf p-6 md:p-8 lg:p-10 flex flex-col items-start text-left gap-5 md:gap-6 min-h-[260px] md:min-h-[280px]">
                        <StarRating />
                        <div className="relative w-full flex-1 min-h-[4.5rem] md:min-h-[5rem]">
                            <span
                                className="font-heading text-5xl md:text-6xl text-brown/25 leading-none select-none block -mb-2"
                                aria-hidden
                            >
                                &ldquo;
                            </span>
                            <blockquote className="text-black-muted body-16-regular md:body-18-regular leading-relaxed text-pretty pl-0">
                                {current.text}
                            </blockquote>
                            <span
                                className="font-heading text-5xl md:text-6xl text-brown/25 leading-none select-none block text-right -mt-4"
                                aria-hidden
                            >
                                &rdquo;
                            </span>
                        </div>
                        <div className="flex items-center gap-3 w-full">
                            <div
                                className="size-10 md:size-12 rounded-full bg-brown flex items-center justify-center text-white font-heading body-14-medium shrink-0"
                                aria-hidden
                            >
                                {initials}
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <p className="body-18-medium text-black">{current.name}</p>
                                <p className="text-black-muted body-16-regular">{current.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 md:mt-8 flex items-center justify-center gap-4">
                        <Button
                            variant="icon-brown"
                            size="icon"
                            onClick={goPrev}
                            aria-label={prevAriaLabel}
                            className="shrink-0"
                        >
                            <ChevronLeft className="size-5 text-gold group-hover:text-white" aria-hidden />
                        </Button>
                        <div className="flex gap-2" role="tablist" aria-label={label}>
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    role="tab"
                                    aria-selected={i === currentIndex}
                                    aria-label={`Testemunho ${i + 1}`}
                                    onClick={() => setCurrentIndex(i)}
                                    className={`size-2 rounded-full shrink-0 transition-colors ${
                                        i === currentIndex ? "bg-brown" : "bg-brown/30 hover:bg-brown/50"
                                    }`}
                                />
                            ))}
                        </div>
                        <Button
                            variant="icon-brown"
                            size="icon"
                            onClick={goNext}
                            aria-label={nextAriaLabel}
                            className="shrink-0"
                        >
                            <ChevronRight className="size-5 text-gold group-hover:text-white" aria-hidden />
                        </Button>
                    </div>
                    {logoSrc && (
                        <div className="flex justify-center mt-10 md:mt-12">
                            <div className="relative w-full max-w-[200px] md:max-w-[240px] aspect-2/1">
                                <Image
                                    src={logoSrc}
                                    alt={logoAlt}
                                    fill
                                    className="object-contain object-center opacity-90"
                                    sizes="(max-width: 768px) 200px, 240px"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
