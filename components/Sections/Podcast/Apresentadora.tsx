"use client";

import Image from "next/image";
import Link from "next/link";
import VaniaPodcast from "@/public/vania-podcast.png";
import { siteConfigApi, podcastContentApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";

const LINKEDIN_ICON =
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z";

export function Apresentadora() {
    const t = useTranslations("Podcast.apresentadora");
    const locale = useLocale();

    const { data: siteConfig } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    });

    const { data: podcastContent } = useQuery({
        queryKey: ["podcast-content", locale],
        queryFn: () => podcastContentApi.get(locale),
    });

    return (
        <section className="container pt-8 md:pt-10 lg:pt-12 xl:pt-16 overflow-x-hidden">
            <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:justify-between lg:gap-12 xl:gap-16 lg:items-stretch min-h-0">
                <div className="space-y-4 md:space-y-6 lg:space-y-8 text-left flex flex-col min-w-0 min-h-0">
                    <span className="body-14-medium text-gold uppercase tracking-wider">{podcastContent?.hostLabel || t("label")}</span>
                    <h2 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-black">{podcastContent?.hostName || "Vânia Fernandes"}</h2>

                    <div className="space-y-4 text-justify lg:text-left min-w-0">
                        <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty wrap-break-word">{podcastContent?.hostParagraph1 || t("paragraph1")}</p>
                        <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty wrap-break-word">{podcastContent?.hostParagraph2 || t("paragraph2")}</p>
                        <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty wrap-break-word">{podcastContent?.hostParagraph3 || t("paragraph3")}</p>
                        <p className="body-16-medium text-black border-l-2 border-brown pl-4 italic text-pretty wrap-break-word lg:hidden">&quot;{podcastContent?.hostQuote || t("quote")}&quot;</p>
                    </div>

                    {/* Imagem - Mobile: 88% corta a base, LinkedIn dentro da área visível, canto inferior direito */}
                    <div className="lg:hidden relative w-full max-w-md mx-auto aspect-4/5 max-h-[70vh] overflow-hidden bg-muted shrink-0">
                        <div className="absolute inset-x-0 top-0 h-[88%] overflow-hidden">
                            <Image
                                src={siteConfig?.apresentadoraImage || VaniaPodcast}
                                alt={t("imageAlt")}
                                fill
                                className="object-cover object-top"
                                priority
                                sizes="(max-width: 1023px) 448px, 0"
                            />
                            <Link
                                href={podcastContent?.hostLinkedInUrl || t("linkedInUrl")}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute bottom-4 right-4 z-10 inline-flex items-center justify-center gap-3 min-h-[44px] px-4 py-2.5 text-white transition-colors duration-200 body-14-medium bg-[#0A66C2] hover:bg-[#004182]"
                                aria-label={podcastContent?.hostLinkedInLabel || t("linkedInLabel")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d={LINKEDIN_ICON} />
                                </svg>
                                <span>{podcastContent?.hostLinkedInLabel || t("linkedInLabel")}</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Imagem - Desktop: wrapper com altura menor para cortar a parte de baixo */}
                <div className="hidden lg:flex lg:justify-center lg:items-center lg:min-w-[340px] lg:w-[45%] lg:shrink-0 bg-muted">
                    <div className="relative w-full aspect-4/5 overflow-hidden max-h-full">
                        <div className="absolute inset-x-0 top-0 h-[88%] overflow-hidden">
                            <Image
                                src={siteConfig?.apresentadoraImage || VaniaPodcast}
                                alt={t("imageAlt")}
                                fill
                                className="object-cover object-top"
                                priority
                                sizes="(min-width: 1024px) 50vw, 0"
                            />
                            {/* Quote e LinkedIn ao fundo da área visível da imagem (16px) */}
                            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-end gap-3">
                                <Link
                                    href={podcastContent?.hostLinkedInUrl || t("linkedInUrl")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-4 py-2.5 text-white transition-colors duration-200 body-14-medium bg-[#0A66C2] hover:bg-[#004182] shrink-0"
                                    aria-label={podcastContent?.hostLinkedInLabel || t("linkedInLabel")}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                        <path d={LINKEDIN_ICON} />
                                    </svg>
                                    <span>{podcastContent?.hostLinkedInLabel || t("linkedInLabel")}</span>
                                </Link>
                                <div className="w-full p-4 bg-black/30 backdrop-blur-md">
                                    <p className="body-16-medium text-white italic text-pretty max-w-2xl">
                                        &quot;{podcastContent?.hostQuote || t("quote")}&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

