import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Podcast - Agência Douro",
    description: "Fique por dentro das últimas novidades do mercado imobiliário. Assista aos nossos podcasts sobre imóveis, investimentos e tendências do setor.",
    keywords: "podcast, imobiliário, mercado imobiliário, investimentos, imóveis, Agência Douro",
    openGraph: {
        title: "Podcast - Agência Douro",
        description: "Fique por dentro das últimas novidades do mercado imobiliário.",
        type: "website",
    },
};

export default function PodcastLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

