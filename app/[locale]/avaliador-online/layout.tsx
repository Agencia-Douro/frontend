import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";

export const metadata: Metadata = {
    title: "Avaliador Online",
    description:
        "Descubra o valor do seu imóvel com o avaliador online da Agência Douro. Avaliação gratuita e imediata de casas, apartamentos e terrenos em Portugal.",
    keywords:
        "avaliador online, avaliação imóvel, quanto vale a minha casa, Agência Douro, Portugal",
};

export default async function AvaliadorOnlineLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <>
            <Breadcrumbs locale={locale} items={[{ name: "Avaliador Online", path: "/avaliador-online" }]} />
            {children}
        </>
    );
}
