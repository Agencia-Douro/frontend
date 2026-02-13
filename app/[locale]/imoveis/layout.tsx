import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";

export const metadata: Metadata = {
    title: "Comprar Imóveis em Portugal",
    description:
        "Encontre o seu imóvel ideal em Portugal com a Agência Douro. Casas, apartamentos, escritórios e terrenos para venda e arrendamento em diversas localidades.",
    keywords:
        "imóveis, casas, apartamentos, venda, aluguel, Portugal, imobiliária, Agência Douro, propriedades",
};

export default async function ImoveisLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <>
            <Breadcrumbs locale={locale} items={[{ name: "Imóveis", path: "/imoveis" }]} />
            {children}
        </>
    );
}
