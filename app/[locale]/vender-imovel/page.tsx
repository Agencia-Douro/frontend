"use client"

import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input-line"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea-line"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Footer from "@/components/Sections/Footer/Footer"
import Folha from "@/components/Folha"
import { contactApi, sellPropertyContentApi } from "@/services/api"
import Image from "next/image"
import Logo from "@/public/Logo.png"

export default function VenderImovelPage() {
    const t = useTranslations("VenderImovel");
    const locale = useLocale();

    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        localizacao: "",
        tipoImovel: "",
        mensagem: "",
    })

    // Fetch dynamic content
    const { data: content } = useQuery({
        queryKey: ["sell-property-content", locale],
        queryFn: () => sellPropertyContentApi.get(locale),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const toastId = toast.loading(t("sendingRequest"))

        try {
            await contactApi.send({
                nome: formData.nome,
                telefone: formData.telefone,
                email: formData.email,
                mensagem: `Localização: ${formData.localizacao}\nTipo de Imóvel: ${formData.tipoImovel}\n\n${formData.mensagem}`,
                aceitaMarketing: false,
            })

            toast.success(t("requestSentSuccess"), { id: toastId })
            setFormData({
                nome: "",
                telefone: "",
                email: "",
                localizacao: "",
                tipoImovel: "",
                mensagem: "",
            })
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : t("requestSendError")
            toast.error(errorMessage, { id: toastId })
        }
    }

    return (
        <>
            {/* Hero Section - Free Property Evaluation */}
            <section className="relative">
                <div className="container pt-20 md:pt-20 lg:pt-24 xl:pt-32 pb-8 md:pb-12 lg:pb-16">
                    <Folha className="lg:top-42 xl:top-48 right-0 text-brown/20 rotate-338" />
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8 md:mb-10 lg:mb-12">
                            <span className="body-14-medium text-brown uppercase tracking-wider">
                                {content?.heroBadge || t("hero.badge")}
                            </span>
                            <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black mt-4 mb-6">
                                {content?.heroTitle || t("hero.title")}
                            </h1>
                            <p className="body-16-regular md:body-18-regular text-black-muted max-w-2xl mx-auto">
                                {content?.heroDescription || t("hero.description")}
                            </p>
                            <a
                                href="tel:+351919766324"
                                className="flex justify-center"
                            >
                                <Button variant="gold" className="mt-6 md:mt-8 lg:mt-10">
                                    {t("hero.callNow")}
                                </Button >
                            </a>
                        </div>
                    </div>

                    {/* Evaluation Form */}
                    <div className="max-w-4xl mx-auto mt-10 md:mt-14 lg:mt-16 p-6 md:p-8 lg:p-10 border border-brown/20">
                        <h2 className="body-20-medium md:heading-quatro-medium text-black mb-6 md:mb-8">
                            {content?.formTitle || t("form.title")}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="nome" className="body-14-medium text-black">
                                        {t("form.name")} <span className="text-red body-14-medium">*</span>
                                    </Label>
                                    <Input
                                        id="nome"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="telefone" className="body-14-medium text-black">
                                        {t("form.phone")} <span className="text-red body-14-medium">*</span>
                                    </Label>
                                    <Input
                                        id="telefone"
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email" className="body-14-medium text-black">
                                    {t("form.email")} <span className="text-red body-14-medium">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="localizacao" className="body-14-medium text-black">
                                        {t("form.location")} <span className="text-red body-14-medium">*</span>
                                    </Label>
                                    <Input
                                        id="localizacao"
                                        value={formData.localizacao}
                                        onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="tipoImovel" className="body-14-medium text-black">
                                        {t("form.propertyType")} <span className="text-red body-14-medium">*</span>
                                    </Label>
                                    <Input
                                        id="tipoImovel"
                                        value={formData.tipoImovel}
                                        onChange={(e) => setFormData({ ...formData, tipoImovel: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="mensagem" className="body-14-medium text-black">
                                    {t("form.message")}
                                </Label>
                                <Textarea
                                    id="mensagem"
                                    value={formData.mensagem}
                                    onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                                    rows={4}
                                />
                            </div>
                            <Button type="submit" variant="gold" className="w-full md:w-auto">
                                {content?.formSubmit || t("form.submit")}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="container">
                <div className="h-px w-full bg-linear-to-r from-gold/0 via-gold to-gold/0 mt-12 md:mt-12 lg:mt-16 xl:mt-20"></div>
            </div>



            {/* Marketing Channels Section */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24 space-y-6">
                <div>
                    <span className="button-14-medium text-brown">
                        {content?.marketingBadge || t("marketing.badge")}
                    </span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">
                        {content?.marketingTitle || t("marketing.title")}
                    </h2>
                </div>
                <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl">
                    {content?.marketingDescription || t("marketing.description")}
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <h3 className="body-18-medium text-black">{content?.marketingWebsiteTitle || t("marketing.channels.website.title")}</h3>
                            <p>{content?.marketingWebsiteStat || t("marketing.channels.website.stat")}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <h3 className="body-18-medium text-black">{content?.marketingNewsletterTitle || t("marketing.channels.newsletter.title")}</h3>
                            <p>{content?.marketingNewsletterStat || t("marketing.channels.newsletter.stat")}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <h3 className="body-18-medium text-black">{content?.marketingAgenciesTitle || t("marketing.channels.agencies.title")}</h3>
                            <p>{content?.marketingAgenciesStat || t("marketing.channels.agencies.stat")}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <h3 className="body-18-medium text-black">{content?.marketingMediaTitle || t("marketing.channels.media.title")}</h3>
                            <p>{content?.marketingMediaStat || t("marketing.channels.media.stat")}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section - Our Reach */}
            <section className="container pt-12 md:pt-16 lg:pt-20 xl:pt-24 space-y-6">
                <div>
                    <span className="button-14-medium text-brown">
                        {content?.statsBadge || t("stats.badge")}
                    </span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">
                        {content?.statsTitle || t("stats.title")}
                    </h2>
                </div>
                <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl">
                    {content?.statsDescription || t("stats.description")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <h3 className="body-18-medium text-black">{content?.statsReachLabel || t("stats.reach.label")}</h3>
                            <p>{content?.statsReachDescription || t("stats.reach.description")}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <h3 className="body-18-medium text-black">{content?.statsClientsLabel || t("stats.clients.label")}</h3>
                            <p>{content?.statsClientsDescription || t("stats.clients.description")}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <h3 className="body-18-medium text-black">{content?.statsLocationsLabel || t("stats.locations.label")}</h3>
                            <p>{content?.statsLocationsDescription || t("stats.locations.description")}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <h3 className="body-18-medium text-black">{content?.statsExperienceLabel || t("stats.experience.label")}</h3>
                            <p>{content?.statsExperienceDescription || t("stats.experience.description")}</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-16 md:h-24 lg:h-32 xl:h-40"></div>

            <Footer />
        </>
    )
}
