import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Imóveis de Luxo - Agência Douro",
    description: "Descubra nossa exclusiva seleção de imóveis de luxo em Portugal. Propriedades premium com as melhores localizações, acabamentos de alta qualidade e design exclusivo.",
    keywords: "imóveis de luxo, propriedades premium, casas de luxo, apartamentos de luxo, Portugal, Agência Douro, imobiliária de luxo",
    openGraph: {
        title: "Imóveis de Luxo - Agência Douro",
        description: "Descubra nossa exclusiva seleção de imóveis de luxo em Portugal.",
        type: "website",
    },
};

export default function ImoveisLuxoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

