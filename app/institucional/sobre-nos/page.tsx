import type { Metadata } from "next";
import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";

export const metadata: Metadata = {
    title: "Sobre Nós - Agência Douro",
    description: "Conheça a Agência Douro, especializada em imóveis de luxo em Portugal. Descubra nossa história, valores e compromisso com a excelência no mercado imobiliário.",
    keywords: "sobre nós, Agência Douro, imobiliária, história, valores, Portugal",
    openGraph: {
        title: "Sobre Nós - Agência Douro",
        description: "Conheça a Agência Douro, especializada em imóveis de luxo em Portugal.",
        type: "website",
    },
};

export default function InstitucionalPage() {
    return (
        <>
            <section className="container">
                <div className="py-6 md:py-10 lg:py-12 xl:py-16">
                    <h1 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-balance text-black">
                        Sobre Nós
                    </h1>
                </div>
            </section>
            <FaleConnosco />
            <Footer />
        </>
    );
}