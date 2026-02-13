import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";

export const metadata: Metadata = {
    title: "Podcast Norte Imobiliário & Business",
    description:
        "Podcast da Agência Douro sobre mercado imobiliário no Norte de Portugal. Tendências, estratégias e conversas com especialistas. Ouça no Spotify e YouTube.",
    keywords:
        "podcast imobiliário, Norte Imobiliário, Agência Douro, mercado imobiliário Portugal, investimento imobiliário",
};

export default async function PodcastLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <>
            <Breadcrumbs locale={locale} items={[{ name: "Podcast", path: "/podcast" }]} />
            {children}
        </>
    );
}
