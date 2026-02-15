"use client"

import { useState, useMemo } from "react";
import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Footer from "@/components/Sections/Footer/Footer";
import { ShoppingBag } from "lucide-react";
import Testemunhos from "@/components/Sections/Testemunhos/Testemunhos";
import { StatCard } from "@/components/Sections/SobreNos/StatCard";
import { CulturaCard } from "@/components/Sections/SobreNos/CulturaCard";
import { ServicoCard } from "@/components/Sections/SobreNos/ServicoCard";
import { EquipaCard } from "@/components/Sections/SobreNos/EquipaCard";
import { Button } from "@/components/ui/button";

// Formata números grandes para exibição amigável (ex: 150000 -> "150 mil")
const formatLargeNumber = (num: number): string => {
    if (num >= 1000000) {
        const millions = num / 1000000;
        return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} M`;
    }
    if (num >= 1000) {
        const thousands = num / 1000;
        return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}m`;
    }
    return num.toString();
};
import {
    siteConfigApi,
    teamMembersApi,
    newslettersApi,
    aboutUsContentApi,
    cultureItemsApi,
    serviceItemsApi,
} from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import NewsletterCard from "@/components/NewsletterCard";
import Image from "next/image";
import Logo from "@/public/Logo.png";

export default function InstitucionalPage() {
    const locale = useLocale();
    const tNewsletter = useTranslations("Newsletter");
    const t = useTranslations("SobreNos");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showAllTeam, setShowAllTeam] = useState(false);

    const { data: siteConfig } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    });

    const { data: teamMembers } = useQuery({
        queryKey: ["team-members"],
        queryFn: () => teamMembersApi.getAll(),
    });

    const { data: newsletters, isLoading: newslettersLoading, error: newslettersError } = useQuery({
        queryKey: ["newsletters"],
        queryFn: () => newslettersApi.getAll(),
    });

    // Fetch About Us content with locale
    const { data: aboutUsContent, isLoading: contentLoading } = useQuery({
        queryKey: ["about-us-content", locale],
        queryFn: () => aboutUsContentApi.get(locale),
    });

    // Fetch Culture Items with locale
    const { data: cultureItems = [], isLoading: cultureLoading } = useQuery({
        queryKey: ["culture-items", locale],
        queryFn: () => cultureItemsApi.getAll(locale),
    });

    // Fetch Service Items with locale
    const { data: serviceItems = [], isLoading: servicesLoading } = useQuery({
        queryKey: ["service-items", locale],
        queryFn: () => serviceItemsApi.getAll(locale),
    });

    const categories = [
        { value: "mercado", label: tNewsletter("categories.market") },
        { value: "dicas", label: tNewsletter("categories.tips") },
        { value: "noticias", label: tNewsletter("categories.news") },
    ] as const;

    const filteredNewsletters = useMemo(() => {
        if (!newsletters) return [];
        if (!selectedCategory) return newsletters;
        return newsletters.filter((newsletter) => newsletter.category === selectedCategory);
    }, [newsletters, selectedCategory]);

    return (
        <>
            {/* Primeira Seção - Apresentação */}
            <section className="container pt-24 md:pt-28 lg:pt-32 xl:pt-40 relative">
                {contentLoading ? (
                    <div className="text-center py-12">
                        <p className="body-16-regular text-brown">{t("loading")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-7 lg:space-y-6 space-y-4">
                            <div><span className="body-14-medium text-brown uppercase tracking-wider">{t("whoWeAre")}</span></div>
                            <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black">
                                {aboutUsContent?.pageTitle || ""}
                            </h1>
                            <h2 className="body-18-medium md:body-20-medium text-black max-w-2xl">
                                {aboutUsContent?.pageSubtitle || ""}
                            </h2>
                            <p className="text-black-muted md:body-18-regular body-16-regular w-full leading-relaxed">
                                {aboutUsContent?.description1 || ""}
                            </p>
                            <p className="text-black-muted md:body-18-regular body-16-regular w-full leading-relaxed">
                                {aboutUsContent?.description2 || ""}
                            </p>
                        </div>
                        <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
                            <Image
                                src={Logo}
                                alt="Agência do Douro"
                                width={400}
                                height={400}
                                className="w-full max-w-[400px] h-auto"
                            />
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:gap-12 mt-6 md:mt-8 lg:mt-10 xl:mt-12 gap-6 md:gap-8">
                    <StatCard value={`${siteConfig?.anosExperiencia || 0}`} label={t("yearsExperience")} />
                    <StatCard value={`${siteConfig?.imoveisVendidos || 0}`} label={t("propertiesSold")} />
                    <StatCard value={`${siteConfig?.clientesSatisfeitos || 0}`} label={t("satisfiedClients")} />
                    <StatCard value={formatLargeNumber(siteConfig?.seguidoresInstagram || 0)} label={t("instagramFollowers")} />

                </div>
            </section>

            {/* Terceira Seção - Cultura */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24 space-y-6">
                <div>
                    <span className="button-14-medium text-brown">{aboutUsContent?.cultureLabel || t("ourIdentity")}</span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{aboutUsContent?.cultureTitle || t("ourCulture")}</h2>
                </div>
                {cultureLoading ? (
                    <div className="text-center py-8">
                        <p className="body-16-regular text-brown">{t("loadingCulture")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                        {cultureItems.map((item: any) => (
                            <CulturaCard
                                key={item.id}
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Nova Seção - Television */}
            {aboutUsContent?.televisionLabel && aboutUsContent?.televisionTitle && (
                <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24 space-y-6">
                    <div>
                        <span className="button-14-medium text-brown">{aboutUsContent?.televisionLabel || ""}</span>
                        <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{aboutUsContent?.televisionTitle || ""}</h2>
                        {aboutUsContent?.televisionDescription && (
                            <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl mt-4 leading-relaxed">
                                {aboutUsContent?.televisionDescription}
                            </p>
                        )}
                    </div>
                    
                    {/* YouTube Videos */}
                    {(aboutUsContent as any)?.youtubeLink1 || (aboutUsContent as any)?.youtubeLink2 || (aboutUsContent as any)?.youtubeLink3 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                            {[(aboutUsContent as any)?.youtubeLink1, (aboutUsContent as any)?.youtubeLink2, (aboutUsContent as any)?.youtubeLink3]
                                .filter(link => link)
                                .map((link, index) => {
                                    // Extrair videoId do YouTube
                                    const getYouTubeVideoId = (url: string): string | null => {
                                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                        const match = url.match(regExp);
                                        return (match && match[2].length === 11) ? match[2] : null;
                                    };

                                    const videoId = getYouTubeVideoId(link);
                                    if (!videoId) return null;

                                    return (
                                        <div key={index} className="relative w-full aspect-video overflow-hidden bg-gray-100 rounded-none">
                                            <a
                                                href={link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group block w-full h-full"
                                            >
                                                <Image
                                                    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                                                    alt={`YouTube video ${index + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    unoptimized
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M8 5v14l11-7z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    );
                                })}
                        </div>
                    ) : null}
                </section>
            )}

            {/* Quarta Seção - Serviços */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <span className="button-14-medium text-brown">{aboutUsContent?.servicesLabel || t("whatWeOffer")}</span>
                        <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{aboutUsContent?.servicesTitle || t("ourServices")}</h2>
                    </div>
                    <Button
                            asChild
                            variant={"gold"}
                        >
                            <a href="tel:+351919766324">
                                {t("contact")}
                            </a>
                        </Button>
                </div>
                {servicesLoading ? (
                    <div className="text-center py-8">
                        <p className="body-16-regular text-brown">{t("loadingServices")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                        {serviceItems.map((item: any) => (
                            <ServicoCard
                                key={item.id}
                                icon={ShoppingBag}
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>
                )}
                {/* Botão mobile - aparece no final da seção */}
                <Button
                    variant="gold"
                    className="md:hidden w-full mt-6"
                    onClick={(e) => {
                        e.preventDefault();
                        const contactoSection = document.getElementById("contacto");
                        if (contactoSection) {
                            contactoSection.scrollIntoView({ behavior: "smooth", block: "start" });
                        }
                    }}
                >
                    {t("contact")}
                </Button>
            </section>

            {/* Quinta Seção - Equipa */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24 space-y-6" id="equipa">
                <div>
                    <span className="button-14-medium text-brown">{aboutUsContent?.teamLabel || t("meetOurTeam")}</span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">{aboutUsContent?.teamTitle || t("ourTeam")}</h2>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl mt-4 leading-relaxed">
                        {aboutUsContent?.teamDescription || ""}
                    </p>
                </div>
                {/* Desktop - mostra todos */}
                <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    {teamMembers?.map((member) => (
                        <EquipaCard
                            key={member.id}
                            name={member.name}
                            email={member.email}
                            phone={member.phone}
                            photo={member.photo}
                            role={member.role}
                        />
                    ))}
                </div>
                {/* Mobile - mostra 3 inicialmente, com botão para ver mais */}
                <div className="md:hidden">
                    <div className="grid grid-cols-1 gap-6 mt-6">
                        {teamMembers?.slice(0, showAllTeam ? undefined : 3).map((member) => (
                            <EquipaCard
                                key={member.id}
                                name={member.name}
                                email={member.email}
                                phone={member.phone}
                                photo={member.photo}
                                role={member.role}
                            />
                        ))}
                    </div>
                    {teamMembers && teamMembers.length > 3 && (
                        <Button
                            variant="gold"
                            className="w-full mt-6"
                            onClick={() => setShowAllTeam(!showAllTeam)}
                        >
                            {showAllTeam ? t("viewLess") : t("viewMore")}
                        </Button>
                    )}
                </div>
            </section>

            {/* Seção Newsletter */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24">
                <div className="lg:space-y-6 space-y-4">
                    <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-balance md:whitespace-nowrap text-black">{tNewsletter("title")}</h2>
                    <p className="text-black-muted md:body-18-regular body-16-regular w-full">{tNewsletter("description")}</p>
                </div>
                {newslettersLoading && (
                    <div className="text-center mt-8 sm:py-12">
                        <p className="body-16-regular text-brown">{tNewsletter("loading")}</p>
                    </div>
                )}

                {newslettersError && (
                    <div className="text-center mt-8 sm:py-12">
                        <p className="body-16-regular text-red">{tNewsletter("error")}</p>
                    </div>
                )}

                {!newslettersLoading && !newslettersError && newsletters && newsletters.length === 0 && (
                    <div className="text-center mt-8 sm:py-12">
                        <p className="body-16-regular text-brown/50">{tNewsletter("noNewsletters")}</p>
                    </div>
                )}

                {!newslettersLoading && !newslettersError && newsletters && newsletters.length > 0 && (
                    <div className="mt-6 md:mt-8 lg:mt-10 xl:mt-12 grid grid-cols-12 gap-6">
                        <div className="flex lg:flex-col gap-1 pr-6 border-r border-brown/10 lg:sticky lg:top-0 col-span-12 lg:col-span-3 xl:col-span-2">
                            <Button
                                variant={selectedCategory === null ? "gold" : "ghost"}
                                className="w-min"
                                onClick={() => setSelectedCategory(null)}>
                                {tNewsletter("all")}
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category.value}
                                    variant={selectedCategory === category.value ? "gold" : "ghost"}
                                    className="w-min"
                                    onClick={() => setSelectedCategory(category.value)}>
                                    {category.label}
                                </Button>
                            ))}
                        </div>
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 col-span-12 lg:col-span-9 xl:col-span-10 lg:min-h-63">
                            {filteredNewsletters.length > 0 ? (
                                filteredNewsletters.map((newsletter) => (
                                    <NewsletterCard key={newsletter.id} newsletter={newsletter} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-8 lg:py-12">
                                    <span className="body-16-regular text-brown/50">
                                        {tNewsletter("noNewslettersInCategory")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </section>

            <Testemunhos />
            <FaleConnosco />
            <Footer />
        </>
    );
}