import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";

export const metadata: Metadata = {
    title: "Imóveis de Luxo",
    description:
        "Descubra a nossa exclusiva seleção de imóveis de luxo em Portugal com a Agência Douro. Propriedades premium com as melhores localizações e acabamentos de alta qualidade.",
    keywords:
        "imóveis de luxo, propriedades premium, casas de luxo, apartamentos de luxo, Portugal, Agência Douro",
};

export default async function ImoveisLuxoLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <>
            <Breadcrumbs locale={locale} items={[{ name: "Imóveis de Luxo", path: "/imoveis-luxo" }]} />
            {children}
        </>
    );
}
