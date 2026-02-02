"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input-line"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea-line"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Link } from "@/i18n/navigation"
import { contactApi } from "@/services/api"
import Folha from "@/components/Folha"
import { useTranslations } from "next-intl"

export const FaleConnosco = () => {
    const t = useTranslations("FaleConnosco");
    const tr = useTranslations("SobreNos");
    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        mensagem: "",
        aceitaMarketing: false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const toastId = toast.loading(t("sendingMessage"))

        try {
            await contactApi.send({
                nome: formData.nome,
                telefone: formData.telefone,
                email: formData.email,
                mensagem: formData.mensagem,
                aceitaMarketing: formData.aceitaMarketing,
            })

            toast.success(t("messageSentSuccess"), { id: toastId })
            setFormData({
                nome: "",
                telefone: "",
                email: "",
                mensagem: "",
                aceitaMarketing: false,
            })
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : t("messageSendError"), { id: toastId })
        }
    }

    return (
        <section className="relative container py-12 md:py-10 lg:py-12 xl:py-16 scroll-mt-6 md:scroll-mt-10 lg:scroll-mt-12 xl:scroll-mt-16" id="contacto">
            <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular">{t("title")}</h2>
            <div className="flex lg:flex-row flex-col-reverse gap-4 mt-4 md:mt-5 lg:mt-10 xl:mt-12 lg:items-stretch">
                {/* Mapa */}
                <div className="relative h-64 md:h-93 bg-muted w-full lg:h-[376px]">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1502.0337394772985!2d-8.6822294!3d41.1842493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd246f70571b1a9b%3A0xd18009e3350eed24!2sAg%C3%AAncia%20Douro%20-%20Media%C3%A7%C3%A3o%20Imobili%C3%A1ria%20AMI%2017%20632!5e0!3m2!1spt-PT!2spt!4v1234567890" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="nome" className="body-14-medium text-black">{t("name")} <span className="text-red body-14-medium">*</span></Label>
                            <Input
                                id="nome"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="telefone" className="body-14-medium text-black">{t("phoneNumber")} <span className="text-red body-14-medium">*</span></Label>
                            <Input
                                id="telefone"
                                value={formData.telefone}
                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email" className="body-14-medium text-black">{t("email")} <span className="text-red body-14-medium">*</span></Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="mensagem" className="body-14-medium text-black">{t("message")} <span className="text-red body-14-medium">*</span></Label>
                        <Textarea
                            id="mensagem"
                            value={formData.mensagem}
                            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                            required
                            className="h-19"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Checkbox
                            id="marketing"
                            checked={formData.aceitaMarketing}
                            onCheckedChange={(checked) =>
                                setFormData({ ...formData, aceitaMarketing: checked as boolean })
                            }
                        />
                        <Label htmlFor="marketing" className="body-14-medium text-black-muted cursor-pointer">{t("marketingConsent")} <span className="text-red body-14-medium">*</span></Label>
                    </div>
                    <Button type="submit" variant="gold" className="w-full">{t("send")}</Button>
                </form>
            </div>
            {/* Informações de Contato */}
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 md:gap-4 mt-4 md:mt-5 lg:mt-10 xl:mt-12">
                <div className="flex flex-col">
                    <h3 className="md:body-20-medium body-18-medium text-black mb-4 md:mb-6">{t("email")}</h3>
                    <p className="body-16-regular text-grey mb-4 text-balance hidden md:block">{t("emailDescription")}</p>
                    <Link href="mailto:contacto@agenciadouro.pt" className="body-16-medium text-black underline underline-offset-4 decoration-1">contacto@agenciadouro.pt</Link>
                </div>
                <div className="flex flex-col">
                    <h3 className="md:body-20-medium body-18-medium text-black mb-4 md:mb-6">{t("contact")}</h3>
                    <p className="body-16-regular text-grey mb-4 text-balance hidden md:block">{t("contactDescription")}</p>
                    <div className="flex flex-col gap-x-4 gap-y-2">
                        <Link href="tel:+351919766324" className="body-16-medium text-black underline underline-offset-4 decoration-1">+351 919 766 323</Link>
                        <p className="text-grey body-14-regular">{tr("legal")}</p>
                        <Link href="tel:+351919766324" className="body-16-medium text-black underline underline-offset-4 decoration-1">+351 919 766 324</Link>
                        <p className="text-grey body-14-regular">{tr("legal")}</p>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="md:body-20-medium body-18-medium text-black mb-4 md:mb-6">{t("socialMedia")}</h3>
                    <p className="body-16-regular text-grey mb-4 text-balance hidden md:block">{t("socialMediaDescription")}</p>
                    <div className="flex flex-col gap-x-4 gap-y-2">
                        <Link href="https://www.instagram.com/agenciadouro" target="_blank" rel="noopener noreferrer" className="body-16-medium text-black flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gold">
                                <path d="M10.8567 1.66748C11.7946 1.66903 12.2698 1.674 12.6805 1.68622L12.8422 1.69151C13.0291 1.69815 13.2134 1.70648 13.4357 1.7169C14.3224 1.75787 14.9273 1.89815 15.4586 2.1044C16.0078 2.31621 16.4717 2.60231 16.9349 3.06551C17.3974 3.52871 17.6836 3.99398 17.8961 4.5419C18.1016 5.07246 18.2419 5.67801 18.2836 6.56481C18.2935 6.78704 18.3015 6.97137 18.3081 7.15824L18.3133 7.31998C18.3255 7.7306 18.3311 8.20592 18.3328 9.14379L18.3335 9.76512C18.3336 9.84104 18.3336 9.91937 18.3336 10.0002L18.3335 10.2353L18.333 10.8567C18.3314 11.7945 18.3265 12.2699 18.3142 12.6805L18.3089 12.8422C18.3023 13.0291 18.294 13.2135 18.2836 13.4356C18.2426 14.3225 18.1016 14.9273 17.8961 15.4585C17.6842 16.0079 17.3974 16.4718 16.9349 16.935C16.4717 17.3975 16.0057 17.6835 15.4586 17.896C14.9273 18.1016 14.3224 18.2419 13.4357 18.2835C13.2134 18.2935 13.0291 18.3015 12.8422 18.308L12.6805 18.3133C12.2698 18.3255 11.7946 18.331 10.8567 18.3329L10.2353 18.3335C10.1594 18.3335 10.0811 18.3335 10.0002 18.3335H9.76516L9.14375 18.333C8.20591 18.3315 7.7306 18.3265 7.31997 18.3142L7.15824 18.309C6.97136 18.3023 6.78703 18.294 6.56481 18.2835C5.67801 18.2426 5.07384 18.1016 4.5419 17.896C3.99328 17.6843 3.5287 17.3975 3.06551 16.935C2.60231 16.4718 2.3169 16.0058 2.1044 15.4585C1.89815 14.9273 1.75856 14.3225 1.7169 13.4356C1.707 13.2135 1.69892 13.0291 1.69238 12.8422L1.68714 12.6805C1.67495 12.2699 1.66939 11.7945 1.66759 10.8567L1.66748 9.14379C1.66903 8.20592 1.67399 7.7306 1.68621 7.31998L1.69151 7.15824C1.69815 6.97137 1.70648 6.78704 1.7169 6.56481C1.75786 5.67731 1.89815 5.07315 2.1044 4.5419C2.3162 3.99329 2.60231 3.52871 3.06551 3.06551C3.5287 2.60231 3.99398 2.3169 4.5419 2.1044C5.07315 1.89815 5.67731 1.75856 6.56481 1.7169C6.78703 1.70701 6.97136 1.69893 7.15824 1.69239L7.31997 1.68715C7.7306 1.67495 8.20591 1.66939 9.14375 1.66759L10.8567 1.66748ZM10.0002 5.83356C7.69781 5.83356 5.83356 7.69984 5.83356 10.0002C5.83356 12.3026 7.69984 14.1669 10.0002 14.1669C12.3027 14.1669 14.1669 12.3006 14.1669 10.0002C14.1669 7.69781 12.3006 5.83356 10.0002 5.83356ZM10.0002 7.50023C11.381 7.50023 12.5002 8.61912 12.5002 10.0002C12.5002 11.381 11.3813 12.5002 10.0002 12.5002C8.6195 12.5002 7.50023 11.3814 7.50023 10.0002C7.50023 8.61945 8.61908 7.50023 10.0002 7.50023ZM14.3752 4.58356C13.8008 4.58356 13.3336 5.05016 13.3336 5.62452C13.3336 6.1989 13.8002 6.66621 14.3752 6.66621C14.9496 6.66621 15.4169 6.19962 15.4169 5.62452C15.4169 5.05016 14.9488 4.58285 14.3752 4.58356Z" />
                            </svg>
                            agenciadouro
                        </Link>
                        <Link href="https://www.facebook.com/agenciadouro" target="_blank" rel="noopener noreferrer" className="body-16-medium text-black flex items-center gap-2 md:mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gold">
                                <path d="M10.0008 1.66626C5.39844 1.66626 1.66748 5.39722 1.66748 9.99959C1.66748 14.159 4.71486 17.6065 8.69875 18.2317V12.4084H6.58284V9.99959H8.69875V8.16366C8.69875 6.07512 9.94283 4.92147 11.8463 4.92147C12.7581 4.92147 13.7117 5.08423 13.7117 5.08423V7.13501H12.6609C11.6257 7.13501 11.3029 7.77738 11.3029 8.43643V9.99959H13.6141L13.2447 12.4084H11.3029V18.2317C15.2867 17.6065 18.3342 14.159 18.3342 9.99959C18.3342 5.39722 14.6032 1.66626 10.0008 1.66626Z" />
                            </svg>
                            Agência Douro
                        </Link>
                        <Link href="https://www.linkedin.com/company/agência-douro" target="_blank" rel="noopener noreferrer" className="body-16-medium text-black flex items-center gap-2 md:mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gold">
                                <path d="M4.16667 2.5C3.24619 2.5 2.5 3.24619 2.5 4.16667C2.5 5.08714 3.24619 5.83333 4.16667 5.83333C5.08714 5.83333 5.83333 5.08714 5.83333 4.16667C5.83333 3.24619 5.08714 2.5 4.16667 2.5ZM2.5 7.5V17.5H5.83333V7.5H2.5ZM7.5 7.5V17.5H10.8333V12.0833C10.8333 11.1629 11.5795 10.4167 12.5 10.4167C13.4205 10.4167 14.1667 11.1629 14.1667 12.0833V17.5H17.5V12.0833C17.5 9.32191 15.2614 7.08333 12.5 7.08333C11.3807 7.08333 10.3546 7.46944 9.53125 8.11198V7.5H7.5Z" />
                            </svg>
                            Agência Douro
                        </Link>
                        <Link href="https://www.tiktok.com/@douroimobiliaria" target="_blank" rel="noopener noreferrer" className="body-16-medium text-black flex items-center gap-2 md:mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gold">
                                <path d="M14.1667 1.66667H11.25V13.3333C11.25 14.2538 10.5038 15 9.58333 15C8.66286 15 7.91667 14.2538 7.91667 13.3333C7.91667 12.4129 8.66286 11.6667 9.58333 11.6667V8.75C7.05208 8.75 5 10.8021 5 13.3333C5 15.8646 7.05208 17.9167 9.58333 17.9167C12.1146 17.9167 14.1667 15.8646 14.1667 13.3333V7.29167C15.1875 8.04167 16.4583 8.5 17.8333 8.5V5.58333C15.8021 5.58333 14.1667 3.94792 14.1667 1.66667Z" />
                            </svg>
                            douroimobiliaria
                        </Link>
                        <Link href="https://www.youtube.com/@agenciadouromediacaoimobil3889" target="_blank" rel="noopener noreferrer" className="body-16-medium text-black flex items-center gap-2 md:mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gold">
                                <path d="M17.7734 5.60156C17.5651 4.79948 16.9349 4.16927 16.1328 3.96094C14.6745 3.58333 10 3.58333 10 3.58333C10 3.58333 5.32552 3.58333 3.86719 3.96094C3.06511 4.16927 2.4349 4.79948 2.22656 5.60156C1.84896 7.0599 1.84896 10.1042 1.84896 10.1042C1.84896 10.1042 1.84896 13.1484 2.22656 14.6068C2.4349 15.4089 3.06511 16.0391 3.86719 16.2474C5.32552 16.625 10 16.625 10 16.625C10 16.625 14.6745 16.625 16.1328 16.2474C16.9349 16.0391 17.5651 15.4089 17.7734 14.6068C18.151 13.1484 18.151 10.1042 18.151 10.1042C18.151 10.1042 18.151 7.0599 17.7734 5.60156ZM8.22917 12.9167V7.29167L12.9167 10.1042L8.22917 12.9167Z" />
                            </svg>
                            Agência Douro
                        </Link>
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="body-20-medium text-black mb-4 md:mb-6">{t("address")}</h3>
                    <p className="body-16-regular text-grey mb-4 text-balance hidden md:block">{t("addressDescription")}</p>
                    <p className="body-16-medium text-black">
                        Rua de Alfredo Cunha 155 rés do chão loja 07, 4450-031, Matosinhos, Porto
                    </p>
                </div>
            </div>
            <Folha className="top-8 right-0 text-brown -rotate-360" />
        </section>
    )
}