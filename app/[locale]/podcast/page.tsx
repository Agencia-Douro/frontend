"use client";

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import { useQuery } from "@tanstack/react-query";
import { siteConfigApi, podcastContentApi } from "@/services/api";
import { useParams } from "next/navigation";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
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
import logoPodcast from "@/public/logoPodcast.jpg";
import Logo from "@/public/Logo.png";
import { useTranslations } from "next-intl";

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
                logoAlt={t("logoAlt")}
                logo={config?.podcastImagem || logoPodcast}
                episodesCount={config?.episodiosPublicados?.toString()}
                seasonsCount={config?.temporadas?.toString()}
                guestsCount={config?.especialistasConvidados?.toString()}
                episodesLabel={t("episodes")}
                seasonsLabel={t("seasons")}
                guestsLabel={t("guests")}
            />

            <SectionDivider />

            <PodcastAboutSection
                label={t("aboutLabel")}
                title={t("aboutTitle")}
                intro={t("aboutIntro")}
                origin={t("aboutOrigin")}
                intention={t("aboutIntention")}
                presentation={t("aboutPresentation")}
            />

            <SectionDivider />

            <Apresentadora />

            <SectionDivider />

            <PodcastGuestsSection
                label={t("guestsLabel")}
                title={t("guestsTitle")}
                guests={(t.raw("guestsList") as GuestItem[]) ?? []}
            />

            <SectionDivider />

            <PodcastSponsorSection
                imageSrc={Logo}
                imageAlt={t("sponsorImageAlt")}
                text={t("sponsorText")}
            />

            <SectionDivider />

            <PodcastWhyListenSection
                label={t("whyListenLabel")}
                title={t("whyListenTitle")}
                subtitle={t("whyListenSubtitle")}
                cards={(t.raw("whyListenCards") as WhyListenCard[]) ?? []}
            />

            <SectionDivider />

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

            <SectionDivider />

            <PodcastCtaSection
                label={t("ctaFinalLabel")}
                title={t("ctaFinalTitle")}
                description={t("ctaFinalDescription")}
                hint={t("ctaFinalHint")}
                buttonLabel={t("ctaFinalButton")}
                buttonAriaLabel={t("ctaFinalButton")}
                mailtoHref={`mailto:podcastnorteimobiliario@gmail.com?subject=${encodeURIComponent(t("ctaFinalMailSubject"))}`}
            />

            <Testemunhos />
            <FaleConnosco />
            <Footer />
        </>
    );
}
