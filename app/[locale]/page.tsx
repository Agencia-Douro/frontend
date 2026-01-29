import type { Metadata } from "next";
import Footer from "@/components/Sections/Footer/Footer";
import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import ImoveisDestacados from "@/components/Sections/ImoveisDestacados/ImoveisDestacados";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import ZonasMaisDesejadas from "@/components/Sections/ZonasMaisDesejadas/ZonasMaisDesejadas";
import Folha from "@/components/Folha";
import { Hero } from "@/components/Sections/Hero";
import Image from "next/image";
import Logo from "@/public/Logo.png";

export const metadata: Metadata = {
  title: "Agência Douro - Imóveis de Luxo em Portugal",
  description: "Casas, apartamentos, escritórios, terrenos para venda e aluguel. Temos várias opções em diversas localidades. Fale com um de nossos representantes e agende uma visita.",
  keywords: "imóveis, casas, apartamentos, venda, aluguel, Portugal, imobiliária, Agência Douro",
  metadataBase: new URL("https://agenciadouro.pt"),
  openGraph: {
    title: "Agência Douro - Imóveis de Luxo em Portugal",
    description: "Casas, apartamentos, escritórios, terrenos para venda e aluguel. Temos várias opções em diversas localidades.",
    type: "website",
    images: [
      {
        url: "/hero/hero1.jpg",
        width: 1200,
        height: 630,
        alt: "Agência Douro - Imóveis de Luxo em Portugal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agência Douro - Imóveis de Luxo em Portugal",
    description: "Casas, apartamentos, escritórios, terrenos para venda e aluguel. Temos várias opções em diversas localidades.",
    images: ["/hero/hero1.jpg"],
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

      {/* Logo Section */}
      <section className="container pt-8 md:pt-10 lg:pt-12 xl:pt-16 pb-0 flex justify-center items-center">
        <Image
          src={Logo}
          alt="Agência do Douro"
          width={350}
          height={350}
          className="w-full max-w-[350px] h-auto lg:max-w-[500px]"
        />
      </section>

      <ZonasMaisDesejadas />
      <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-12 md:mt-8 lg:mt-12 xl:mt-16"></div>
      <Testemunhos />
      <FaleConnosco />
      <Footer />
    </>
  );
}
