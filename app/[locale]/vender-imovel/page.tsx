"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Input } from "@/components/ui/input-line"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea-line"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Footer from "@/components/Sections/Footer/Footer"
import Folha from "@/components/Folha"
import { contactApi } from "@/services/api"
import { Building2, Mail, Store, Newspaper, Users, Globe, MapPin, TrendingUp } from "lucide-react"

export default function VenderImovelPage() {
    const t = useTranslations("VenderImovel");
    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        localizacao: "",
        tipoImovel: "",
        mensagem: "",
    })

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
                <div className="container pt-12 md:pt-20 lg:pt-24 xl:pt-32 pb-6 md:pb-10 lg:pb-12 xl:pb-16">
                    <Folha className="lg:top-42 xl:top-48 right-0 text-brown/20 rotate-338" />
                    <div className="max-w-4xl">
                        <span className="body-14-medium text-gold uppercase tracking-wider">{t("hero.badge")}</span>
                        <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black mt-4">
                            {t("hero.title")}
                        </h1>
                        <p className="body-18-regular text-black-muted mt-4 md:mt-6 max-w-2xl">
                            {t("hero.description")}
                        </p>
                    </div>

                    {/* Evaluation Form */}
                    <div className="mt-10 md:mt-14 lg:mt-16 bg-white p-6 md:p-8 lg:p-10 border border-brown/10 max-w-3xl">
                        <h2 className="heading-quatro-medium text-black mb-6 md:mb-8">{t("form.title")}</h2>
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
                                {t("form.submit")}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Statistics Section - Our Reach */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16">
                <div className="text-center mb-8 md:mb-12">
                    <span className="body-14-medium text-gold uppercase tracking-wider">{t("stats.badge")}</span>
                    <h2 className="heading-tres-regular md:heading-dois-regular text-black mt-2">
                        {t("stats.title")}
                    </h2>
                    <p className="body-18-regular text-black-muted mt-4 max-w-2xl mx-auto">
                        {t("stats.description")}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    <div className="bg-white p-6 md:p-8 border border-brown/10 text-center">
                        <Globe className="w-12 h-12 mx-auto mb-4 md:mb-6 text-gold" />
                        <div className="heading-tres-medium text-brown mb-2">{t("stats.reach.label")}</div>
                        <p className="body-14-regular text-black-muted">{t("stats.reach.description")}</p>
                    </div>
                    <div className="bg-white p-6 md:p-8 border border-brown/10 text-center">
                        <Users className="w-12 h-12 mx-auto mb-4 md:mb-6 text-gold" />
                        <div className="heading-tres-medium text-brown mb-2">{t("stats.clients.label")}</div>
                        <p className="body-14-regular text-black-muted">{t("stats.clients.description")}</p>
                    </div>
                    <div className="bg-white p-6 md:p-8 border border-brown/10 text-center">
                        <MapPin className="w-12 h-12 mx-auto mb-4 md:mb-6 text-gold" />
                        <div className="heading-tres-medium text-brown mb-2">{t("stats.locations.label")}</div>
                        <p className="body-14-regular text-black-muted">{t("stats.locations.description")}</p>
                    </div>
                    <div className="bg-white p-6 md:p-8 border border-brown/10 text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-4 md:mb-6 text-gold" />
                        <div className="heading-tres-medium text-brown mb-2">{t("stats.experience.label")}</div>
                        <p className="body-14-regular text-black-muted">{t("stats.experience.description")}</p>
                    </div>
                </div>
            </section>

            {/* Marketing Channels Section */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16">
                <div className="text-center mb-8 md:mb-12">
                    <span className="body-14-medium text-gold uppercase tracking-wider">{t("marketing.badge")}</span>
                    <h2 className="heading-tres-regular md:heading-dois-regular text-black mt-2">
                        {t("marketing.title")}
                    </h2>
                    <p className="body-18-regular text-black-muted mt-4 max-w-2xl mx-auto">
                        {t("marketing.description")}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    <div className="bg-white p-6 md:p-8 border border-brown/10">
                        <Building2 className="w-10 h-10 mb-4 md:mb-6 text-gold" />
                        <h3 className="body-20-medium text-black mb-2 md:mb-3">{t("marketing.channels.website.title")}</h3>
                        <p className="body-14-regular text-black-muted mb-4 md:mb-6">{t("marketing.channels.website.description")}</p>
                        <div className="heading-quatro-medium text-brown">{t("marketing.channels.website.stat")}</div>
                    </div>
                    <div className="bg-white p-6 md:p-8 border border-brown/10">
                        <Mail className="w-10 h-10 mb-4 md:mb-6 text-gold" />
                        <h3 className="body-20-medium text-black mb-2 md:mb-3">{t("marketing.channels.newsletter.title")}</h3>
                        <p className="body-14-regular text-black-muted mb-4 md:mb-6">{t("marketing.channels.newsletter.description")}</p>
                        <div className="heading-quatro-medium text-brown">{t("marketing.channels.newsletter.stat")}</div>
                    </div>
                    <div className="bg-white p-6 md:p-8 border border-brown/10">
                        <Store className="w-10 h-10 mb-4 md:mb-6 text-gold" />
                        <h3 className="body-20-medium text-black mb-2 md:mb-3">{t("marketing.channels.agencies.title")}</h3>
                        <p className="body-14-regular text-black-muted mb-4 md:mb-6">{t("marketing.channels.agencies.description")}</p>
                        <div className="heading-quatro-medium text-brown">{t("marketing.channels.agencies.stat")}</div>
                    </div>
                    <div className="bg-white p-6 md:p-8 border border-brown/10">
                        <Newspaper className="w-10 h-10 mb-4 md:mb-6 text-gold" />
                        <h3 className="body-20-medium text-black mb-2 md:mb-3">{t("marketing.channels.media.title")}</h3>
                        <p className="body-14-regular text-black-muted mb-4 md:mb-6">{t("marketing.channels.media.description")}</p>
                        <div className="heading-quatro-medium text-brown">{t("marketing.channels.media.stat")}</div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 pb-6 md:pb-10 lg:pb-12 xl:pb-16">
                <div className="bg-brown p-8 md:p-12 lg:p-16 text-white relative overflow-hidden">
                    <Folha className="absolute top-4 right-4 text-gold/20 rotate-45" />
                    <div className="relative z-10 max-w-3xl">
                        <h2 className="heading-tres-regular md:heading-dois-regular mb-6 md:mb-8">
                            {t("whyChooseUs.title")}
                        </h2>
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex items-start gap-4">
                                <Folha className="!w-[10px] !h-[10px] text-gold mt-2 shrink-0 !relative" />
                                <p className="body-18-regular">{t("whyChooseUs.reason1")}</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <Folha className="!w-[10px] !h-[10px] text-gold mt-2 shrink-0 !relative" />
                                <p className="body-18-regular">{t("whyChooseUs.reason2")}</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <Folha className="!w-[10px] !h-[10px] text-gold mt-2 shrink-0 !relative" />
                                <p className="body-18-regular">{t("whyChooseUs.reason3")}</p>
                            </div>
                            <div className="flex items-start gap-4">
                                <Folha className="!w-[10px] !h-[10px] text-gold mt-2 shrink-0 !relative" />
                                <p className="body-18-regular">{t("whyChooseUs.reason4")}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="mt-8 md:mt-10 border-white text-white hover:bg-white hover:text-brown">
                            {t("whyChooseUs.cta")}
                        </Button>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}
