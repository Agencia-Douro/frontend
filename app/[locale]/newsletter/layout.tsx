import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Newsletter - Agência Douro",
    description: "Fique por dentro das últimas novidades do mercado imobiliário. Acesse nossos artigos sobre mercado, dicas e notícias sobre imóveis em Portugal.",
    keywords: "newsletter, artigos imobiliários, dicas imobiliárias, mercado imobiliário, notícias, Agência Douro",
    openGraph: {
        title: "Newsletter - Agência Douro",
        description: "Fique por dentro das últimas novidades do mercado imobiliário.",
        type: "website",
    },
};

export default function NewsletterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

