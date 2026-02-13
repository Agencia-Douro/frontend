"use client";

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import { useQuery } from "@tanstack/react-query";
import {
    siteConfigApi,
    podcastContentApi,
    podcastGuestsApi,
    podcastTestimonialsApi,
    podcastGalleryApi,
    podcastWhyListenApi,
} from "@/services/api";
import { useParams } from "next/navigation";
import { Apresentadora } from "@/components/Sections/Podcast/Apresentadora";
import { SectionDivider } from "@/components/Sections/Podcast/SectionDivider";
import { PodcastHero } from "@/components/Sections/Podcast/PodcastHero";
import { PodcastEpisodesSection } from "@/components/Sections/Podcast/PodcastEpisodesSection";
import { PodcastPlatformsSection } from "@/components/Sections/Podcast/PodcastPlatformsSection";
import { PodcastCtaSection } from "@/components/Sections/Podcast/PodcastCtaSection";
import { PodcastAboutSection } from "@/components/Sections/Podcast/PodcastAboutSection";
import { PodcastGuestsSection, type GuestItem } from "@/components/Sections/Podcast/PodcastGuestsSection";
import { PodcastSponsorSection } from "@/components/Sections/Podcast/PodcastSponsorSection";
import { PodcastWhyListenSection, type WhyListenCard } from "@/components/Sections/Podcast/PodcastWhyListenSection";
import { PodcastTestimonialsSection, type PodcastTestimonialItem } from "@/components/Sections/Podcast/PodcastTestimonialsSection";
import { PodcastGallerySection } from "@/components/Sections/Podcast/PodcastGallerySection";
import type { PodcastGalleryImage } from "@/components/Sections/Podcast/PodcastGallerySection";
import logoPodcast from "@/public/logoPodcast.jpg";
import patrocinadorPodcast from "@/public/patrocinador-podcast.jpeg";
import logoNorteImobiliario from "@/public/norte-imobilirio-business-gold.png";
import hero1 from "@/public/hero/hero1.jpg";
import hero2 from "@/public/hero/hero2.jpg";
import hero3 from "@/public/hero/hero3.jpg";
import vaniaPodcast from "@/public/vania-podcast.png";
import { useTranslations } from "next-intl";
import { DiretorProducao } from "@/components/Sections/Podcast/Diretor";

const GALLERY_IMAGES: PodcastGalleryImage[] = [
    { src: hero1, alt: "" },
    { src: hero2, alt: "" },
    { src: hero3, alt: "" },
    { src: logoPodcast, alt: "" },
    { src: vaniaPodcast, alt: "" },
];

export default function PodcastPage() {
    const t = useTranslations("Podcast");
    const params = useParams();
    const locale = params.locale as string;

    const { data: config } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    });

    const { data: podcastContent } = useQuery({
        queryKey: ["podcast-content", locale],
        queryFn: () => podcastContentApi.get(locale),
    });

    const { data: podcastGuests } = useQuery({
        queryKey: ["podcast-guests", locale],
        queryFn: () => podcastGuestsApi.getAll(locale),
    });

    const { data: podcastTestimonials } = useQuery({
        queryKey: ["podcast-testimonials", locale],
        queryFn: () => podcastTestimonialsApi.getAll(locale),
    });

    const { data: podcastGalleryImages } = useQuery({
        queryKey: ["podcast-gallery", locale],
        queryFn: () => podcastGalleryApi.getAll(locale),
    });

    const { data: podcastWhyListenCards } = useQuery({
        queryKey: ["podcast-why-listen", locale],
        queryFn: () => podcastWhyListenApi.getAll(locale),
    });

    const galleryImages = Array.from({ length: 9 }, (_, i) => ({
        ...GALLERY_IMAGES[i % GALLERY_IMAGES.length],
        alt: t("galleryImageAlt"),
    }));

    const podcastSchema =
        podcastContent
            ? {
                "@context": "https://schema.org",
                "@type": "PodcastSeries",
                name: podcastContent.pageTitle || t("title"),
                description: podcastContent.pageDescription || t("description"),
                episode: (podcastContent.episodes || [])
                    .slice(0, 12)
                    .map((ep: { title: string; url: string }) => ({
                        "@type": "PodcastEpisode",
                        name: ep.title,
                        url: ep.url,
                    })),
            }
            : null;

    return (
        <>
            {podcastSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastSchema) }}
                />
            )}

            <PodcastHero
                headerLabel={podcastContent?.headerLabel || t("exclusiveContent")}
                title={podcastContent?.pageTitle || t("title")}
                intro={t("heroIntro")}
                ctaSpotifyLabel={t("heroCtaSpotify")}
                ctaYouTubeLabel={t("heroCtaYouTube")}
                ctaContactLabel={t("heroCtaContact")}
                ctaContactMailto={`mailto:podcastnorteimobiliario@gmail.com?subject=${encodeURIComponent(t("ctaFinalMailSubject"))}`}
                logoAlt={t("logoAlt")}
                logo={config?.podcastImagem || logoPodcast}
                episodesCount={config?.episodiosPublicados?.toString()}
                seasonsCount={config?.temporadas?.toString()}
                guestsCount={config?.especialistasConvidados?.toString()}
                episodesLabel={t("episodes")}
                seasonsLabel={t("seasons")}
                guestsLabel={t("guests")}
            />

            <SectionDivider noTopMargin />

            <PodcastAboutSection
                label={podcastContent?.aboutLabel || t("aboutLabel")}
                title={podcastContent?.aboutTitle || t("aboutTitle")}
                intro={podcastContent?.aboutIntro || t("aboutIntro")}
                origin={podcastContent?.aboutOrigin || t("aboutOrigin")}
                intention={podcastContent?.aboutIntention || t("aboutIntention")}
                presentation={podcastContent?.aboutPresentation || t("aboutPresentation")}
                logoSrc={logoNorteImobiliario}
                logoAlt="Norte Imobiliário & Business"
            />

            <Apresentadora />

            <DiretorProducao />

            <PodcastGuestsSection
                label={podcastContent?.guestsLabel || t("guestsLabel")}
                title={podcastContent?.guestsTitle || t("guestsTitle")}
                guests={
                    podcastGuests && podcastGuests.length > 0
                        ? podcastGuests.map((g) => ({ name: g.name, role: g.role || g.role_pt, imageUrl: g.imageUrl }))
                        : (t.raw("guestsList") as GuestItem[]) ?? []
                }
            />

            <PodcastGallerySection
                label={podcastContent?.galleryLabel || t("galleryLabel")}
                title={podcastContent?.galleryTitle || t("galleryTitle")}
                description={podcastContent?.galleryDescription || t("galleryDescription")}
                images={
                    podcastGalleryImages && podcastGalleryImages.length > 0
                        ? podcastGalleryImages.map((img) => ({
                            src: img.imageUrl,
                            alt: img.alt || t("galleryImageAlt"),
                            mediaType: img.mediaType || "image",
                            videoUrl: img.videoUrl,
                        }))
                        : galleryImages
                }
                openLightboxAriaLabel={t("galleryOpenAria")}
            />

            <PodcastSponsorSection
                imageSrc={patrocinadorPodcast}
                imageAlt={t("sponsorImageAlt")}
            />

            <PodcastWhyListenSection
                label={podcastContent?.whyListenLabel || t("whyListenLabel")}
                title={podcastContent?.whyListenTitle || t("whyListenTitle")}
                subtitle={podcastContent?.whyListenSubtitle || t("whyListenSubtitle")}
                cards={
                    podcastWhyListenCards && podcastWhyListenCards.length > 0
                        ? podcastWhyListenCards.map((c) => ({
                            iconKey: c.iconKey,
                            title: c.title || c.title_pt,
                            subtext: c.subtext || c.subtext_pt,
                        }))
                        : (t.raw("whyListenCards") as WhyListenCard[]) ?? []
                }
                logoSrc={logoNorteImobiliario}
                logoAlt="Norte Imobiliário & Business"
            />


            <PodcastEpisodesSection
                label={podcastContent?.episodesLabel || t("watchNow")}
                title={podcastContent?.episodesTitle || t("featuredEpisodes")}
                description={podcastContent?.episodesDescription || t("episodesDescription")}
                episodes={podcastContent?.episodes ?? []}
                episodeLabel={t("episode")}
            />

            <SectionDivider />

            <PodcastPlatformsSection
                label={podcastContent?.platformsLabel || t("whereToFindUs")}
                title={podcastContent?.platformsTitle || t("whereToFindUsTitle")}
                description={podcastContent?.platformsDescription || t("whereToFindUsDescription")}
            />


            <PodcastCtaSection
                label={podcastContent?.ctaLabel || t("ctaFinalLabel")}
                title={podcastContent?.ctaTitle || t("ctaFinalTitle")}
                description={podcastContent?.ctaDescription || t("ctaFinalDescription")}
                hint={podcastContent?.ctaHint || t("ctaFinalHint")}
                buttonLabel={podcastContent?.ctaButtonLabel || t("ctaFinalButton")}
                buttonAriaLabel={podcastContent?.ctaButtonLabel || t("ctaFinalButton")}
                mailtoHref={`mailto:podcastnorteimobiliario@gmail.com?subject=${encodeURIComponent(t("ctaFinalMailSubject"))}`}
                logoSrc={logoNorteImobiliario}
                logoAlt="Norte Imobiliário & Business"
            />

            <PodcastTestimonialsSection
                label={podcastContent?.testimonialsLabel || t("testimonialsLabel")}
                title={podcastContent?.testimonialsTitle || t("testimonialsTitle")}
                subtitle={podcastContent?.testimonialsSubtitle || t("testimonialsSubtitle")}
                testimonials={
                    podcastTestimonials && podcastTestimonials.length > 0
                        ? podcastTestimonials.map((item) => ({
                            name: item.name,
                            role: item.role || item.role_pt,
                            text: item.text || item.text_pt,
                        }))
                        : (t.raw("testimonialsList") as PodcastTestimonialItem[]) ?? []
                }
                prevAriaLabel={t("testimonialsPrevAria")}
                nextAriaLabel={t("testimonialsNextAria")}
                logoSrc={logoNorteImobiliario}
                logoAlt="Norte Imobiliário & Business"
            />

            <FaleConnosco />
            <Footer />
        </>
    );
}
