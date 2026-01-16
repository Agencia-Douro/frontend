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
import { Building2, Mail, Store, Newspaper, Users, Globe, MapPin, TrendingUp } from "lucide-react"

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
                    <div className="max-w-4xl">
                        <span className="body-14-medium text-gold uppercase tracking-wider">
                            {content?.heroBadge || t("hero.badge")}
                        </span>
                        <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black mt-4">
                            {content?.heroTitle || t("hero.title")}
                        </h1>
                        <p className="body-16-regular md:body-18-regular text-black-muted mt-4 md:mt-6 max-w-2xl">
                            {content?.heroDescription || t("hero.description")}
                        </p>
                    </div>

                    {/* Evaluation Form */}
                    <div className="mt-10 md:mt-14 lg:mt-16 bg-white p-6 md:p-8 lg:p-10 border border-brown/10 max-w-3xl">
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
                                        placeholder={t("form.namePlaceholder")}
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
                                        placeholder={t("form.phonePlaceholder")}
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
                                    placeholder={t("form.emailPlaceholder")}
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
                                        placeholder={t("form.locationPlaceholder")}
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
                                        placeholder={t("form.propertyTypePlaceholder")}
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
                                    placeholder={t("form.messagePlaceholder")}
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

            {/* Statistics Section - Our Reach */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 space-y-6">
                <div>
                    <span className="button-14-medium text-gold">
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
                            <div className="flex items-center gap-3">
                                <Globe className="w-6 h-6 text-gold shrink-0" />
                                <div className="body-16-regular text-black">
                                    {content?.statsReachLabel || t("stats.reach.label")}
                                </div>
                            </div>
                            <p>{content?.statsReachDescription || t("stats.reach.description")}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <div className="flex items-center gap-3">
                                <Users className="w-6 h-6 text-gold shrink-0" />
                                <div className="body-16-regular text-black">
                                    {content?.statsClientsLabel || t("stats.clients.label")}
                                </div>
                            </div>
                            <p>{content?.statsClientsDescription || t("stats.clients.description")}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-6 h-6 text-gold shrink-0" />
                                <div className="body-16-regular text-black">
                                    {content?.statsLocationsLabel || t("stats.locations.label")}
                                </div>
                            </div>
                            <p>{content?.statsLocationsDescription || t("stats.locations.description")}</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-gold shrink-0" />
                                <div className="body-16-regular text-black">
                                    {content?.statsExperienceLabel || t("stats.experience.label")}
                                </div>
                            </div>
                            <p>{content?.statsExperienceDescription || t("stats.experience.description")}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marketing Channels Section */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 space-y-6">
                <div>
                    <span className="button-14-medium text-gold">
                        {content?.marketingBadge || t("marketing.badge")}
                    </span>
                    <h2 className="body-20-medium md:heading-quatro-medium text-black mt-2">
                        {content?.marketingTitle || t("marketing.title")}
                    </h2>
                </div>
                <p className="text-black-muted md:body-18-regular body-16-regular w-full max-w-3xl">
                    {content?.marketingDescription || t("marketing.description")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <div className="flex items-center gap-3">
                                <Building2 className="w-6 h-6 text-gold shrink-0" />
                                <div className="body-16-regular text-black">
                                    {content?.marketingWebsiteTitle || t("marketing.channels.website.title")}
                                </div>
                            </div>
                            <p>{content?.marketingWebsiteDescription || t("marketing.channels.website.description")}</p>
                            <div className="heading-quatro-medium text-brown">
                                {content?.marketingWebsiteStat || t("marketing.channels.website.stat")}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <div className="flex items-center gap-3">
                                <Mail className="w-6 h-6 text-gold shrink-0" />
                                <div className="body-16-regular text-black">
                                    {content?.marketingNewsletterTitle || t("marketing.channels.newsletter.title")}
                                </div>
                            </div>
                            <p>{content?.marketingNewsletterDescription || t("marketing.channels.newsletter.description")}</p>
                            <div className="heading-quatro-medium text-brown">
                                {content?.marketingNewsletterStat || t("marketing.channels.newsletter.stat")}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <div className="flex items-center gap-3">
                                <Store className="w-6 h-6 text-gold shrink-0" />
                                <div className="body-16-regular text-black">
                                    {content?.marketingAgenciesTitle || t("marketing.channels.agencies.title")}
                                </div>
                            </div>
                            <p>{content?.marketingAgenciesDescription || t("marketing.channels.agencies.description")}</p>
                            <div className="heading-quatro-medium text-brown">
                                {content?.marketingAgenciesStat || t("marketing.channels.agencies.stat")}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                            <div className="w-px bg-brown h-1/3"></div>
                            <div className="w-px bg-brown/20 h-2/3"></div>
                        </div>
                        <div className="space-y-3 body-16-regular text-black-muted flex-1">
                            <div className="flex items-center gap-3">
                                <Newspaper className="w-6 h-6 text-gold shrink-0" />
                                <div className="body-16-regular text-black">
                                    {content?.marketingMediaTitle || t("marketing.channels.media.title")}
                                </div>
                            </div>
                            <p>{content?.marketingMediaDescription || t("marketing.channels.media.description")}</p>
                            <div className="heading-quatro-medium text-brown">
                                {content?.marketingMediaStat || t("marketing.channels.media.stat")}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}
