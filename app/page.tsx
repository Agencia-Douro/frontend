import type { Metadata } from "next";
import Footer from "@/components/Sections/Footer/Footer";
import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Hero from "@/components/Sections/Hero";
import ImoveisDestacados from "@/components/Sections/ImoveisDestacados/ImoveisDestacados";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import ZonasMaisDesejadas from "@/components/Sections/ZonasMaisDesejadas/ZonasMaisDesejadas";

export const metadata: Metadata = {
    title: "Agência Douro - Imóveis de Luxo em Portugal",
    description: "Casas, apartamentos, escritórios, terrenos para venda e aluguel. Temos várias opções em diversas localidades. Fale com um de nossos representantes e agende uma visita.",
    keywords: "imóveis, casas, apartamentos, venda, aluguel, Portugal, imobiliária, Agência Douro",
    openGraph: {
        title: "Agência Douro - Imóveis de Luxo em Portugal",
        description: "Casas, apartamentos, escritórios, terrenos para venda e aluguel. Temos várias opções em diversas localidades.",
        type: "website",
    },
};

export default function Home() {
    
  return (
    <>
      <Hero />
      <ImoveisDestacados />
      <ZonasMaisDesejadas />
      <Testemunhos />
      <FaleConnosco />
      <Footer />
    </>
  );
}
