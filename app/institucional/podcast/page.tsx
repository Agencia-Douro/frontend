"use client";

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { StatCard } from "@/components/Sections/SobreNos/StatCard";
import { CulturaCard } from "@/components/Sections/SobreNos/CulturaCard";
import Folha from "@/components/Folha";
import { useQuery } from "@tanstack/react-query";
import { siteConfigApi } from "@/services/api";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import { Apresentadora } from "@/components/Sections/Podcast/Apresentadora";
import Logo from "@/public/Logo.svg";

// Episódios em destaque
const FEATURED_EPISODES = [
    {
        id: "1",
        href: "https://www.youtube.com/watch?v=yjNfYWkTiP0",
        videoId: "yjNfYWkTiP0",
        title: "4ª Temporada – Episódio 2 - ➡️ financiamento habitacional com a Paula Coutinho.",
    },
    {
        id: "2",
        href: "https://www.youtube.com/watch?v=fHzsVfUTOFg",
        videoId: "fHzsVfUTOFg",
        title: "Temporada 2ª- episódio 03. Dra. Carolina Carvalho, vistos & cidadania sem enrolação.",
    },
    {
        id: "3",
        href: "https://www.youtube.com/watch?v=NbOWR3llnVk",
        videoId: "NbOWR3llnVk",
        title: "Temporada 3ª- Episódio 02, com Ruben Marques – cofundador do Querido Condomínio",
    },
    {
        id: "4",
        href: "https://www.youtube.com/watch?v=A6XYFBiICMo",
        videoId: "A6XYFBiICMo",
        title: "Temporada 3ª - Episodio 01 Rocha Automóveis - Porto -Portugal",
    },
    {
        id: "5",
        href: "https://www.youtube.com/watch?v=93GZkfX9U-U",
        videoId: "93GZkfX9U-U",
        title: "5ª temporada - 2º Episódio - Dra. Renata Dias, médica dentista com formação reconhecida em Portugal.",
    },
    {
        id: "6",
        href: "https://www.youtube.com/watch?v=wc2neJE36hc",
        videoId: "wc2neJE36hc",
        title: "Temporada 4ª - episódio 01 - Filipe Mello, CEO da ENG&COOP, uma trajetória de sucesso.",
    },
];

export default function PodcastPage() {
    const { data: config } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    })

    return (
        <>
            {/* Primeira Seção - Apresentação do Podcast */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 relative">
                <Folha className="lg:top-42 xl:top-48 right-0 text-brown rotate-338" />
                <div className="lg:space-y-6 space-y-4">
                    <div><span className="body-14-medium text-gold uppercase tracking-wider">Conteúdo Exclusivo</span></div>
                    <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black">Podcast Agência Douro</h1>
                    <h2 className="body-18-medium md:body-20-medium text-black max-w-2xl">Conversas sobre o Mercado Imobiliário de Luxo em Portugal</h2>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl leading-relaxed">
                        Um espaço criado para discutir as principais tendências, desafios e oportunidades do mercado imobiliário de luxo em Portugal. A cada episódio, recebemos especialistas, empreendedores e profissionais do ramo para partilhar insights valiosos, experiências e dicas práticas.
                    </p>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl leading-relaxed">
                        Queremos ser uma fonte confiável de informação e inspiração para quem vive ou deseja ingressar neste mercado dinâmico. Seja você um investidor experiente, um corretor imobiliário ou alguém interessado no setor, o Podcast Agência Douro traz conversas envolventes e cheias de aprendizado sobre o mundo imobiliário e dos negócios.
                    </p>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl leading-relaxed">
                        Fique ligado e siga as nossas redes sociais para mais novidades. Prepare-se para uma jornada pelo mercado imobiliário português!
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    <StatCard value={config?.episodiosPublicados?.toString() || ""} label="Episódios" />
                    <StatCard value={config?.temporadas?.toString() || ""} label="Temporadas" />
                    <StatCard value={config?.especialistasConvidados?.toString() || ""} label="Convidados" />
                </div>
            </section>
            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-4 md:mt-8 lg:mt-12 xl:mt-16"></div>

            <Apresentadora />

            <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-4 md:mt-8 lg:mt-12 xl:mt-16"></div>

            {/* Segunda Seção - O Que Abordamos */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 space-y-6">
                <div>
                    <span className="button-14-medium text-gold">Temas & Insights</span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">O Que Abordamos</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    <CulturaCard
                        title="Tendências de Mercado"
                        description="Análises profundas sobre as tendências atuais do mercado imobiliário de luxo em Portugal e oportunidades de investimento."
                    />
                    <CulturaCard
                        title="Histórias de Sucesso"
                        description="Convidados partilham as suas experiências, desafios e conquistas no setor imobiliário português."
                    />
                    <CulturaCard
                        title="Dicas de Investimento"
                        description="Conselhos práticos sobre como investir em imóveis de luxo, desde a escolha da localização até estratégias de valorização."
                    />
                    <CulturaCard
                        title="Legislação e Processos"
                        description="Informações claras sobre aspectos legais, fiscais e burocráticos relacionados à compra e venda de imóveis."
                    />
                    <CulturaCard
                        title="Lifestyle & Design"
                        description="Discussões sobre arquitetura, design de interiores e o estilo de vida associado a imóveis de luxo."
                    />
                    <CulturaCard
                        title="Visão Internacional"
                        description="Perspetivas sobre investidores estrangeiros em Portugal e comparações com outros mercados internacionais."
                    />
                </div>
            </section>

            <div className="hidden lg:flex justify-center mt-20">
                <Image src={Logo} alt="logo" width={200} height={90} className="hidden lg:block " />
            </div>

            {/* Terceira Seção - Episódios */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16">
                <div className="lg:space-y-6 space-y-4 mb-6 md:mb-8 lg:mb-10 xl:mb-12">
                    <div>
                        <span className="button-14-medium text-gold">Assista Agora</span>
                        <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">Episódios em Destaque</h2>
                    </div>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl">
                        Confira os nossos episódios mais assistidos e fique por dentro das conversas que estão a transformar o mercado imobiliário de luxo.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {FEATURED_EPISODES.map((episode, index) => (
                        <Link
                            key={episode.id}
                            href={episode.href}
                            target="_blank"
                            className="group">
                            <article className="">
                                <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                                    <Image
                                        src={`https://img.youtube.com/vi/${episode.videoId}/maxresdefault.jpg`}
                                        alt={episode.title}
                                        fill
                                        className="object-cover transition-transform duration-300"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs text-gold font-medium">Episódio {index + 1}</span>
                                    </div>
                                    <h3 className="body-16-medium md:body-18-medium text-black group-hover:text-brown transition-colors">
                                        {episode.title}
                                    </h3>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>
            <Testemunhos />
            <FaleConnosco />
            <Footer />
        </>
    );
}