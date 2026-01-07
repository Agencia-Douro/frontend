"use client"

import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import { ShoppingBag } from "lucide-react";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import { StatCard } from "@/components/Sections/SobreNos/StatCard";
import { CulturaCard } from "@/components/Sections/SobreNos/CulturaCard";
import { ServicoCard } from "@/components/Sections/SobreNos/ServicoCard";
import { EquipaCard } from "@/components/Sections/SobreNos/EquipaCard";
import Folha from "@/components/Folha";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { siteConfigApi, teamMembersApi } from "@/services/api";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function InstitucionalPage() {
    const t = useTranslations("SobreNos");
    const { data: siteConfig } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    });

    const { data: teamMembers } = useQuery({
        queryKey: ["team-members"],
        queryFn: () => teamMembersApi.getAll(),
    })

    return (
        <>
            {/* Primeira Seção - Apresentação */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 relative">
                <Folha className="lg:top-42 xl:top-48 right-0 text-brown rotate-338" />
                <div className="lg:space-y-6 space-y-4">
                    <div><span className="body-14-medium text-gold uppercase tracking-wider">{t("whoWeAre")}</span></div>
                    <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black">{t("title")}</h1>
                    <h2 className="body-18-medium md:body-20-medium text-black max-w-2xl">{t("subtitle")}</h2>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl leading-relaxed">{t("description1")}</p>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl leading-relaxed">{t("description2")}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-12 mt-6 md:mt-8 lg:mt-10 xl:mt-12 gap-6 md:gap-8">
                    <StatCard value={siteConfig?.anosExperiencia.toString() || ""} label={t("yearsExperience")} />
                    <StatCard value={siteConfig?.imoveisVendidos.toString() || ""} label={t("propertiesSold")} />
                    <StatCard value={siteConfig?.clientesSatisfeitos.toString() || ""} label={t("satisfiedClients")} />
                </div>
            </section>

            {/* Terceira Seção - Cultura */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 space-y-6">
                <div>
                    <span className="button-14-medium text-gold">{t("ourIdentity")}</span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{t("ourCulture")}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    <CulturaCard
                        title={t("culture.excellence.title")}
                        description={t("culture.excellence.description")}
                    />
                    <CulturaCard
                        title={t("culture.dedication.title")}
                        description={t("culture.dedication.description")}
                    />
                    <CulturaCard
                        title={t("culture.innovation.title")}
                        description={t("culture.innovation.description")}
                    />
                </div>
            </section>

            {/* Quarta Seção - Serviços */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16">
                <div className="flex justify-between items-center">
                    <div>
                        <span className="button-14-medium text-gold">{t("whatWeOffer")}</span>
                        <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{t("ourServices")}</h2>
                    </div>
                    <Button variant="gold">
                        <Link href="/institucional/sobre-nos#contacto">{t("requestInfo")}</Link>
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    <ServicoCard
                        icon={ShoppingBag}
                        title={t("services.legalConsulting.title")}
                        description={t("services.legalConsulting.description")}
                    />
                    <ServicoCard
                        icon={ShoppingBag}
                        title={t("services.mortgageConsulting.title")}
                        description={t("services.mortgageConsulting.description")}
                    />
                    <ServicoCard
                        icon={ShoppingBag}
                        title={t("services.realEstatePromotion.title")}
                        description={t("services.realEstatePromotion.description")}
                    />
                    <ServicoCard
                        icon={ShoppingBag}
                        title={t("services.projectManagement.title")}
                        description={t("services.projectManagement.description")}
                    />
                    <ServicoCard
                        icon={ShoppingBag}
                        title={t("services.realEstateInvestments.title")}
                        description={t("services.realEstateInvestments.description")}
                    />
                    <ServicoCard
                        icon={ShoppingBag}
                        title={t("services.goldenVisa.title")}
                        description={t("services.goldenVisa.description")}
                    />
                    <ServicoCard
                        icon={ShoppingBag}
                        title={t("services.mortgagePartners.title")}
                        description={t("services.mortgagePartners.description")}
                    />

                </div>
            </section>

            {/* Quinta Seção - Equipa */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 space-y-6">
                <div>
                    <span className="button-14-medium text-gold">{t("meetOurTeam")}</span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{t("ourTeam")}</h2>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl mt-4 leading-relaxed">
                        {t("teamDescription")}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    {teamMembers?.map((member) => (
                        <EquipaCard
                            key={member.id}
                            name={member.name}
                            email={member.email}
                            phone={member.phone}
                        />
                    ))}
                </div>
            </section>

            <Testemunhos />
            <FaleConnosco />
            <Footer />
        </>
    );
}