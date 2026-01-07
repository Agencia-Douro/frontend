import type { Metadata } from "next";
import Footer from "@/components/Sections/Footer/Footer";
import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Hero from "@/components/Sections/Hero";
import ImoveisDestacados from "@/components/Sections/ImoveisDestacados/ImoveisDestacados";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import ZonasMaisDesejadas from "@/components/Sections/ZonasMaisDesejadas/ZonasMaisDesejadas";
import Folha from "@/components/Folha";

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
      <Folha className="top-[330px] left-[1500px] rotate-310 opacity-30 hidden lg:block text-brown" />
      <Folha className="top-[670px] left-[840px] rotate-40 opacity-30 hidden lg:block text-brown" />
      <Folha className="top-[1100px] left-[50px] rotate-30 opacity-30 hidden lg:block text-brown" />
      <Folha className="top-[1400px] left-[1450px] rotate-320 opacity-30 hidden lg:block text-brown" />
      <Folha className="top-[1800px] left-[700px] rotate-30 opacity-30 hidden lg:block text-brown" />
      <Folha className="top-[2200px] left-[1500px] rotate-310 opacity-30 hidden lg:block text-brown" />
      <Hero />
      <ImoveisDestacados />
      <ZonasMaisDesejadas />
      <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-12 md:mt-8 lg:mt-12 xl:mt-16"></div>
      <Testemunhos />
      <FaleConnosco />
      <Footer />
    </>
  );
}
