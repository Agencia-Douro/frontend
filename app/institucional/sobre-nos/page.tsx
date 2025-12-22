import type { Metadata } from "next";
import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import { ShoppingBag } from "lucide-react";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import { StatCard } from "@/components/Sections/SobreNos/StatCard";
import { CulturaCard } from "@/components/Sections/SobreNos/CulturaCard";
import { ServicoCard } from "@/components/Sections/SobreNos/ServicoCard";
import Folha from "@/components/Folha";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
            {/* Primeira Seção - Apresentação */}
            <section className="bg-deaf relative">
                <div className="container py-6 md:py-10 lg:py-12 xl:py-16">
                    <Folha className="lg:top-42 xl:top-48 right-0 text-brown rotate-338"/>
                    <div className="lg:space-y-6 space-y-4">
                        <div><span className="body-14-medium text-gold uppercase tracking-wider">Quem Somos</span></div>
                        <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black">Sobre Nós</h1>
                        <h2 className="body-18-medium md:body-20-medium text-black max-w-2xl">Especialistas em Imóveis de Luxo em Portugal</h2>
                        <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl leading-relaxed">Na Agência Douro, a nossa missão é transformar sonhos em realidade, sempre com um compromisso inabalável com a transparência e a responsabilidade. A nossa equipa é composta por profissionais altamente qualificados, prontos para o ajudar a realizar o sonho da sua vida.</p>
                        <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl leading-relaxed">A atuar no mercado nacional e internacional, a Agência Douro é reconhecida pela sua transparência, responsabilidade e compromisso em proporcionar tranquilidade em cada transação. Seja para habitação própria ou para investimento, oferecemos um apoio completo para garantir que o seu negócio seja seguro e eficaz.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                        <StatCard value="15+" label="Anos de Experiência" />
                        <StatCard value="500+" label="Imóveis Vendidos" />
                        <StatCard value="800+" label="Clientes Satisfeitos" />
                    </div>
                </div>
            </section>

            {/* Terceira Seção - Cultura */}
            <section className="container py-6 md:py-10 lg:py-12 xl:py-16">
                <div className="space-y-6">
                    <div>
                        <span className="button-14-medium text-gold">Nossa Identidade</span>
                        <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">A Nossa Cultura</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                        <CulturaCard
                            title="Excelência"
                            description="Acreditamos na excelência como padrão, na transparência como base de confiança e na integridade como princípio inegociável."
                        />
                        <CulturaCard
                            title="Dedicação"
                            description="Valorizamos o atendimento personalizado e dedicado, reconhecendo que cada cliente tem necessidades únicas."
                        />
                        <CulturaCard
                            title="Inovação"
                            description="A inovação e a adaptação às necessidades do mercado são pilares da nossa cultura, permitindo-nos oferecer sempre o melhor serviço possível."
                        />
                    </div>
                </div>
            </section>

            {/* Quarta Seção - Serviços */}
            <div className="bg-deaf">
                <section className="container py-6 md:py-10 lg:py-12 xl:py-16">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="button-14-medium text-gold">O Que Oferecemos</span>
                            <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">Os Nossos Serviços</h2>
                        </div>
                        <Button variant="brown">
                            <Link href="/institucional/sobre-nos#contacto">Pedir informações</Link>
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                        <ServicoCard
                            icon={ShoppingBag}
                            title=" Consultoria Jurídica"
                            description="Garantimos que todas as transações imobiliárias sejam realizadas de forma segura e conforme a legislação vigente."
                        />
                        <ServicoCard
                            icon={ShoppingBag}
                            title="Consultoria para Crédito Imobiliário"
                            description="Ajudamos você a encontrar as melhores opções de financiamento, adequadas às suas necessidades e perfil financeiro."
                        />
                        <ServicoCard
                            icon={ShoppingBag}
                            title="Promoção Imobiliária"
                            description="Ajudamos você a encontrar as melhores opções de financiamento, adequadas às suas necessidades e perfil financeiro."
                        />
                        <ServicoCard
                            icon={ShoppingBag}
                            title="Gestão de projetos imobiliários"
                            description="Ajudamos você a encontrar as melhores opções de financiamento, adequadas às suas necessidades e perfil financeiro."
                        />
                        <ServicoCard
                            icon={ShoppingBag}
                            title="Investimentos imobiliários"
                            description="Ajudamos você a encontrar as melhores opções de financiamento, adequadas às suas necessidades e perfil financeiro."
                        />
                        <ServicoCard
                            icon={ShoppingBag}
                            title="Visto Gold"
                            description="Ajudamos você a encontrar as melhores opções de financiamento, adequadas às suas necessidades e perfil financeiro."
                        />
                        <ServicoCard
                            icon={ShoppingBag}
                            title="Parceiros de crédito imobiliário"
                            description="Ajudamos você a encontrar as melhores opções de financiamento, adequadas às suas necessidades e perfil financeiro."
                        />
                        
                    </div>
                </section>
            </div>
            <Testemunhos/>
            <FaleConnosco />
            <Footer />
        </>
    );
}