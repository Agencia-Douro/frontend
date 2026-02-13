import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Newsletter",
    description:
        "Leia as últimas newsletters da Agência Douro sobre o mercado imobiliário em Portugal. Dicas, tendências e novidades do setor.",
};

export default function NewsletterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
