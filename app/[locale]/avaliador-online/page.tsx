"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Input } from "@/components/ui/input-line"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea-line"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select-line"
import { toast } from "sonner"
import { TIPOS_IMOVEL } from "@/app/shared/distritos"
import { contactApi } from "@/services/api"
import { useTranslations } from "next-intl"
import Footer from "@/components/Sections/Footer/Footer"
import Folha from "@/components/Folha"

export default function AvaliadorOnlinePage() {
    const t = useTranslations("AvaliadorOnline")
    const pathname = usePathname()

    // Não mostrar o botão nas páginas de admin
    if (pathname?.startsWith('/admin')) {
        return null
    }
    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        aceitaMarketing: false,
    })

    const [imovelData, setImovelData] = useState({
        tipoImovel: "",
        finalidade: "",
        tipologia: "",
        observacoes: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const toastId = toast.loading(t("toast.sending"))

        // Formatar dados do imóvel em uma mensagem estruturada
        const mensagemFormatada = `
${t("emailMessage.title")}

${t("emailMessage.type")}: ${imovelData.tipoImovel}
${t("emailMessage.purpose")}: ${imovelData.finalidade}
${t("emailMessage.typology")}: ${imovelData.tipologia}

${imovelData.observacoes ? `${t("emailMessage.observations")}:\n${imovelData.observacoes}` : ''}
        `.trim()

        try {
            await contactApi.send({
                ...formData,
                mensagem: mensagemFormatada,
            })

            toast.success(t("toast.success"), { id: toastId })
            setFormData({
                nome: "",
                telefone: "",
                email: "",
                aceitaMarketing: false,
            })
            setImovelData({
                tipoImovel: "",
                finalidade: "",
                tipologia: "",
                observacoes: "",
            })
        } catch (error: any) {
            toast.error(error.message || t("toast.error"), { id: toastId })
        }
    }

    return (
        <>
            <section className="relative">
                <div className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 pb-8 md:pb-12 lg:pb-16">
                    <Folha className="lg:top-42 xl:top-48 right-0 text-brown/20 rotate-338" />
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8 md:mb-10 lg:mb-12">
                            <span className="body-14-medium text-gold uppercase tracking-wider">{t("button.desktop.line1")}</span>
                            <h1 className="heading-tres-regular md:heading-dois-regular text-balance text-black mt-4 mb-6">
                                {t("title")}
                            </h1>
                            <p className="body-18-regular text-black-muted max-w-2xl mx-auto">
                                {t("subtitle")}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Dados Pessoais */}
                            <div className="p-6 md:p-8 rounded-lg border border-brown/10 bg-white/50 backdrop-blur-sm space-y-4">
                                <h3 className="heading-quatro-medium text-brown mb-4">{t("personalData.title")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="modal-nome" className="body-14-medium text-brown">{t("personalData.name")} <span className="text-red body-14-medium">*</span></Label>
                                    <Input
                                        id="modal-nome"
                                        placeholder={t("personalData.namePlaceholder")}
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="modal-telefone" className="body-14-medium text-brown">{t("personalData.phone")} <span className="text-red body-14-medium">*</span></Label>
                                    <Input
                                        id="modal-telefone"
                                        placeholder={t("personalData.phonePlaceholder")}
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modal-email" className="body-14-medium text-brown">{t("personalData.email")} <span className="text-red body-14-medium">*</span></Label>
                                <Input
                                    id="modal-email"
                                    type="email"
                                    placeholder={t("personalData.emailPlaceholder")}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Dados do Imóvel */}
                        <div className="p-6 md:p-8 rounded-lg border border-brown/10 bg-white/50 backdrop-blur-sm space-y-4">
                            <h3 className="heading-quatro-medium text-brown mb-4">{t("propertyData.title")}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="modal-tipo" className="body-14-medium text-brown">{t("propertyData.type")} <span className="text-red body-14-medium">*</span></Label>
                                    <Select
                                        value={imovelData.tipoImovel}
                                        onValueChange={(value) => setImovelData({ ...imovelData, tipoImovel: value })}>
                                        <SelectTrigger id="modal-tipo">
                                            <SelectValue placeholder={t("propertyData.selectType")} />
                                        </SelectTrigger>
                                        <SelectContent className="z-2001">
                                            {TIPOS_IMOVEL.map((tipo) => (
                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="modal-finalidade" className="body-14-medium text-brown">{t("propertyData.purpose")} <span className="text-red body-14-medium">*</span></Label>
                                    <Select
                                        value={imovelData.finalidade}
                                        onValueChange={(value) => setImovelData({ ...imovelData, finalidade: value })}
                                    >
                                        <SelectTrigger id="modal-finalidade">
                                            <SelectValue placeholder={t("propertyData.select")} />
                                        </SelectTrigger>
                                        <SelectContent className="z-2001">
                                            <SelectItem value="Venda">{t("propertyData.purposeOptions.sale")}</SelectItem>
                                            <SelectItem value="Arrendar">{t("propertyData.purposeOptions.rent")}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="modal-tipologia" className="body-14-medium text-brown">{t("propertyData.typology")} <span className="text-red body-14-medium">*</span></Label>
                                    <Select
                                        value={imovelData.tipologia}
                                        onValueChange={(value) => setImovelData({ ...imovelData, tipologia: value })}
                                    >
                                        <SelectTrigger id="modal-tipologia">
                                            <SelectValue placeholder={t("propertyData.select")} />
                                        </SelectTrigger>
                                        <SelectContent className="z-2001">
                                            <SelectItem value="T0">T0</SelectItem>
                                            <SelectItem value="T1">T1</SelectItem>
                                            <SelectItem value="T2">T2</SelectItem>
                                            <SelectItem value="T3">T3</SelectItem>
                                            <SelectItem value="T4">T4</SelectItem>
                                            <SelectItem value="T5">T5</SelectItem>
                                            <SelectItem value="T6+">T6+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modal-observacoes" className="body-14-medium text-brown">
                                    {t("propertyData.observations")}
                                </Label>
                                <Textarea
                                    id="modal-observacoes"
                                    placeholder={t("propertyData.observationsPlaceholder")}
                                    value={imovelData.observacoes}
                                    onChange={(e) => setImovelData({ ...imovelData, observacoes: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm p-6 rounded-lg border border-brown/10">
                            <Checkbox
                                id="modal-marketing"
                                checked={formData.aceitaMarketing}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, aceitaMarketing: checked as boolean })
                                }
                            />
                            <label htmlFor="modal-marketing" className="body-14-medium text-brown/70 cursor-pointer">{t("marketingConsent")}</label>
                        </div>

                        <Button type="submit" variant="gold" className="w-full">{t("submitButton")}</Button>
                    </form>
                </div>
            </div>
        </section>
        <Footer />
        </>
    )
} 