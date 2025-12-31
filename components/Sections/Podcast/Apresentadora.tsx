"use client";

import Image from "next/image";
import vaniaPodcast from "@/public/vania-podcast.png";
import { siteConfigApi } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function Apresentadora() {
    const { data: siteConfig } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    });

    return (
        <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                    <span className="body-14-medium text-gold uppercase tracking-wider">Apresentadora</span>
                    <h2 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-black">Vania Fernandes</h2>

                    <div className="space-y-4">
                        <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed">Com mais de 15 anos de experiência no setor imobiliário do Norte de Portugal, Vania Fernandes é uma voz respeitada e reconhecida no mercado. Especializada em imóveis residenciais e comerciais, já ajudou centenas de famílias a encontrar o lar dos seus sonhos.</p>
                        <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed">Como apresentadora do <strong>Podcast Norte Imobiliário & Business</strong>, partilha insights valiosos sobre o mercado, tendências de investimento e estratégias para compradores e vendedores. A sua paixão pelo setor e conhecimento profundo do mercado fazem dela a guia ideal para quem procura navegar no mundo imobiliário português.</p>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-6 md:gap-8 pt-4">
                        <div className="flex flex-col gap-2">
                            <div className="heading-tres-regular md:heading-dois-regular text-gold">
                                {siteConfig?.anosExperiencia}+
                            </div>
                            <p className="body-16-medium text-black">
                                Anos de Experiência
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="heading-tres-regular md:heading-dois-regular text-gold">
                                {siteConfig?.eurosEmTransacoes}M+
                            </div>
                            <p className="body-16-medium text-black">
                                Euros em Transações
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="heading-tres-regular md:heading-dois-regular text-gold">
                                {siteConfig?.clientesSatisfeitos}+
                            </div>
                            <p className="body-16-medium text-black">
                                Clientes Satisfeitos
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="heading-tres-regular md:heading-dois-regular text-gold">
                                {siteConfig?.episodiosPublicados}+
                            </div>
                            <p className="body-16-medium text-black">
                                Episódios Gravados
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lado Direito - Imagem */}
                <div className="relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0 aspect-4/5 lg:aspect-3/4 xl:aspect-4/5 overflow-hidden bg-muted">
                    <Image
                        src={vaniaPodcast}
                        alt="Vania Fernandes - Consultora Imobiliária & Host"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}

