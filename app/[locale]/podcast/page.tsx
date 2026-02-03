"use client";

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import { useQuery } from "@tanstack/react-query";
import { siteConfigApi, podcastContentApi } from "@/services/api";
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
                label={t("aboutLabel")}
                title={t("aboutTitle")}
                intro={t("aboutIntro")}
                origin={t("aboutOrigin")}
                intention={t("aboutIntention")}
                presentation={t("aboutPresentation")}
                logoSrc={logoNorteImobiliario}
                logoAlt="Norte Imobiliário & Business"
            />

            <Apresentadora />

            <PodcastGuestsSection
                label={t("guestsLabel")}
                title={t("guestsTitle")}
                guests={(t.raw("guestsList") as GuestItem[]) ?? []}
            />

            <PodcastGallerySection
                label={t("galleryLabel")}
                title={t("galleryTitle")}
                description={t("galleryDescription")}
                images={galleryImages}
                openLightboxAriaLabel={t("galleryOpenAria")}
            />

            <PodcastSponsorSection
                imageSrc={patrocinadorPodcast}
                imageAlt={t("sponsorImageAlt")}
            />

            <PodcastWhyListenSection
                label={t("whyListenLabel")}
                title={t("whyListenTitle")}
                subtitle={t("whyListenSubtitle")}
                cards={(t.raw("whyListenCards") as WhyListenCard[]) ?? []}
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
                label={t("whereToFindUs")}
                title={t("whereToFindUsTitle")}
                description={t("whereToFindUsDescription")}
            />


            <PodcastCtaSection
                label={t("ctaFinalLabel")}
                title={t("ctaFinalTitle")}
                description={t("ctaFinalDescription")}
                hint={t("ctaFinalHint")}
                buttonLabel={t("ctaFinalButton")}
                buttonAriaLabel={t("ctaFinalButton")}
                mailtoHref={`mailto:podcastnorteimobiliario@gmail.com?subject=${encodeURIComponent(t("ctaFinalMailSubject"))}`}
                logoSrc={logoNorteImobiliario}
                logoAlt="Norte Imobiliário & Business"
            />

            <PodcastTestimonialsSection
                label={t("testimonialsLabel")}
                title={t("testimonialsTitle")}
                subtitle={t("testimonialsSubtitle")}
                testimonials={(t.raw("testimonialsList") as PodcastTestimonialItem[]) ?? []}
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
