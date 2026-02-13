import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs";

export const metadata: Metadata = {
    title: "Sobre Nós",
    description:
        "Conheça a Agência Douro, a sua imobiliária de confiança em Portugal. Equipa experiente, dedicada a encontrar o imóvel perfeito para si.",
    keywords:
        "sobre nós, Agência Douro, imobiliária, equipa, Portugal, quem somos",
};

export default async function SobreNosLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    return (
        <>
            <Breadcrumbs locale={locale} items={[{ name: "Sobre Nós", path: "/sobre-nos" }]} />
            {children}
        </>
    );
}
