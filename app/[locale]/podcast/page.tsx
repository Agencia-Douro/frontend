"use client";

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import { useQuery } from "@tanstack/react-query";
import { siteConfigApi, podcastTopicsApi, podcastContentApi } from "@/services/api";
import { useParams } from "next/navigation";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import { Apresentadora } from "@/components/Sections/Podcast/Apresentadora";
import { SectionDivider } from "@/components/Sections/Podcast/SectionDivider";
import { PodcastHero } from "@/components/Sections/Podcast/PodcastHero";
import { PodcastTopicsSection } from "@/components/Sections/Podcast/PodcastTopicsSection";
import { PodcastEpisodesSection } from "@/components/Sections/Podcast/PodcastEpisodesSection";
import { PodcastPlatformsSection } from "@/components/Sections/Podcast/PodcastPlatformsSection";
import { PodcastCtaSection } from "@/components/Sections/Podcast/PodcastCtaSection";
import { PodcastAboutSection } from "@/components/Sections/Podcast/PodcastAboutSection";
import { PodcastGuestsSection } from "@/components/Sections/Podcast/PodcastGuestsSection";
import logoPodcast from "@/public/logoPodcast.jpg";
import { useTranslations } from "next-intl";

export default function PodcastPage() {
    const t = useTranslations("Podcast");
    const params = useParams();
    const locale = params.locale as string;

    const { data: config } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    });

    const { data: topics, isLoading: topicsLoading } = useQuery({
        queryKey: ["podcast-topics"],
        queryFn: () => podcastTopicsApi.getAll(),
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
                description={t("guestsDescription")}
            />

            <SectionDivider />

            <PodcastTopicsSection
                label={podcastContent?.topicsLabel || t("themesAndInsights")}
                title={podcastContent?.topicsTitle || t("whatWeCover")}
                topics={topics ?? []}
                locale={locale}
                isLoading={topicsLoading}
                loadingText="A carregar tópicos..."
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
            />

            <Testemunhos />
            <FaleConnosco />
            <Footer />
        </>
    );
}
