import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";

export const metadata: Metadata = {
    title: "Vender Imóvel",
    description:
        "Quer vender o seu imóvel em Portugal? A Agência Douro ajuda-o a vender a sua casa, apartamento ou terreno de forma rápida e ao melhor preço.",
    keywords:
        "vender imóvel, vender casa, vender apartamento, Portugal, Agência Douro, mediação imobiliária",
};

export default async function VenderImovelLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <>
            <Breadcrumbs locale={locale} items={[{ name: "Vender Imóvel", path: "/vender-imovel" }]} />
            {children}
        </>
    );
}
