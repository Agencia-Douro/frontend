import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Podcast Norte Imobiliário & Business | Agência Douro",
    description: "Podcast da Agência Douro sobre mercado imobiliário no Norte de Portugal. Tendências, estratégias e conversas com especialistas. Ouça no Spotify e YouTube. Contacte para sugerir temas ou agendar conversa.",
    keywords: "podcast imobiliário, Norte Imobiliário, Agência Douro, mercado imobiliário Portugal, investimento imobiliário, podcast negócios",
    openGraph: {
        title: "Podcast Norte Imobiliário & Business | Agência Douro",
        description: "Podcast sobre mercado imobiliário no Norte de Portugal. Tendências, estratégias e conversas com especialistas.",
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

