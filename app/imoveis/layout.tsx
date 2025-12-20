import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Imóveis - Agência Douro",
    description: "Explore nossa seleção de imóveis para venda e aluguel em Portugal. Casas, apartamentos, escritórios e terrenos em diversas localidades. Encontre o imóvel perfeito para si.",
    keywords: "imóveis, casas, apartamentos, venda, aluguel, Portugal, imobiliária, Agência Douro, propriedades",
    openGraph: {
        title: "Imóveis - Agência Douro",
        description: "Explore nossa seleção de imóveis para venda e aluguel em Portugal.",
        type: "website",
    },
};

export default function ImoveisLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

