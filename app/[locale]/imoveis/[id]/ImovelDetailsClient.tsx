"use client"

import { useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { propertiesApi, contactApi } from "@/services/api"
import Caracteristica from "@/components/Sections/Imovel/Caracteristica"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input-line"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea-line"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import useFavorites from "@/hooks/useFavorites"
import ImoveisRelacionados from "@/components/Sections/ImoveisRelacionados/ImoveisRelacionado"
import { generatePropertyPDF } from "@/utils/pdfGenerator"
import ImagensImoveis, { getImageIndex } from "@/components/Sections/ImagensImoveis"
import PropertyPDFTemplate from "@/components/PropertyPDFTemplate"
import Image from "next/image"
import Footer from "@/components/Sections/Footer/Footer"
import { useTranslations } from "next-intl"
import Logo from "@/public/Logo.png"

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

// Helper component to render media (image or video)
const MediaItem = ({
    src,
    alt,
    className,
    onClick,
}: {
    src: string;
    alt: string;
    className?: string;
    onClick?: () => void;
}) => {
    const isVideo = isVideoUrl(src);
    console.log('MediaItem:', { src, isVideo });

    if (isVideo) {
        return (
            <video
                src={src}
                controls
                className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
                preload="metadata"
                onClick={onClick}
            />
        );
    }

    return (
        <Image
            width={1000}
            height={1000}
            src={src}
            alt={alt}
            className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
            unoptimized={isVideoUrl(src)}
            onClick={onClick}
        />
    );
};

export default function ImovelDetailsClient() {
    const params = useParams()
    const id = params.id as string
    const locale = params.locale as string
    const t = useTranslations("PropertyDetails")
    const [linkCopied, setLinkCopied] = useState(false)
    const { isFavorite, toggleFavorite } = useFavorites()
    const fav = isFavorite(id)
    const [showFilesModal, setShowFilesModal] = useState(false)
    const [showFeaturesModal, setShowFeaturesModal] = useState(false)
    const [showWhyModal, setShowWhyModal] = useState(false)
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [lightboxIndex, setLightboxIndex] = useState(0)
    const pdfRef = useRef(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        mensagem: "",
        aceitaMarketing: false,
    })


    const { data: property, isLoading, error } = useQuery({
        queryKey: ["property", id, locale],
        queryFn: () => propertiesApi.getById(id, locale),
        enabled: !!id,
    })

    if (isLoading) {
        return (
            <>
                <section className="bg-deaf grid place-content-center h-[calc(100vh-64px)] lg:h-[calc(100vh-72px)]">
                    <p className="text-center text-black-muted">{t("loading")}</p>
                </section>
            </>
        )
    }

    if (error || !property) {
        return (
            <>
                <section className="bg-deaf grid place-content-center h-[calc(100vh-64px)] lg:h-[calc(100vh-72px)]">
                    <p className="text-center text-black-muted">{t("propertyNotFound")}</p>
                </section>
            </>
        )
    }

    const transactionTypeMap: Record<string, string> = {
        comprar: t("transactionTypes.comprar"),
        arrendar: t("transactionTypes.arrendar"),
        trespasse: t("transactionTypes.trespasse"),
    }

    const propertyTypeMap: Record<string, string> = {
        apartamento: t("propertyTypes.apartamento"),
        moradia: t("propertyTypes.moradia"),
        terreno: t("propertyTypes.terreno"),
        escritório: t("propertyTypes.escritório"),
        loja: t("propertyTypes.loja"),
        armazém: t("propertyTypes.armazém"),
        prédio: t("propertyTypes.prédio"),
        quinta: t("propertyTypes.quinta"),
        garagem: t("propertyTypes.garagem"),
        cave: t("propertyTypes.cave"),
    }

    const handleCopyLink = async () => {
        try {
            const url = window.location.href
            await navigator.clipboard.writeText(url)
            setLinkCopied(true)
            toast.success(t("linkCopied"))

            setTimeout(() => {
                setLinkCopied(false)
            }, 2000)
        } catch {
            toast.error(t("errorCopyingLink"))
        }
    }

    const handleDownloadPDF = async () => {
        try {
            toast.loading(t("generatingPDF"))
            await generatePropertyPDF(property, pdfRef)
            toast.dismiss()
            toast.success(t("pdfGenerated"))
        } catch (error) {
            toast.dismiss()
            toast.error(t("errorGeneratingPDF"))
            console.error(error)
        }
    }

    const handleSubmitContact = async (e: React.FormEvent) => {
        e.preventDefault()

        const toastId = toast.loading(t("sendingMessage"))

        try {
            // Adicionar informações do imóvel à mensagem
            const propertyInfo = `\n\n--- Informações do Imóvel ---\nReferência: ${property.reference || property.id}\nTipo: ${property.propertyType}\nLocalização: ${property.concelho}, ${property.distrito}\nPreço: ${parseFloat(property.price.toString()).toLocaleString("pt-PT")} €\nLink: ${window.location.href}`

            await contactApi.send({
                ...formData,
                mensagem: formData.mensagem + propertyInfo,
            })

            toast.success(t("messageSent"), { id: toastId })
            setFormData({
                nome: "",
                telefone: "",
                email: "",
                mensagem: "",
                aceitaMarketing: false,
            })
        } catch (error: any) {
            toast.error(error.message || t("errorSendingMessage"), { id: toastId })
        }
    }

    const handleDownloadFile = async (fileUrl: string, fileName: string) => {
        try {
            const response = await fetch(fileUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            toast.success(t("downloadStarted"))
        } catch (error) {
            toast.error(t("errorDownloadingFile"))
            console.error(error)
        }
    }

    return (
        <>
            <section className="container pt-16">
                <div className="flex justify-between items-center py-4 gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="cursor-pointer hidden md:flex items-center gap-2 px-1.5 py-1 body-16-medium text-brown hover:text-gold transition-colors whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5.16725 9.12965L2.19555 5.80428L5.16336 2.5M2 5.81495H11.0427C12.676 5.81495 14 7.31142 14 9.1575C14 11.0035 12.676 12.5 11.0427 12.5H7.38875" stroke="currentColor" strokeWidth="1.5" />
                            </svg>{t("back")}
                        </button>
                        <div className="hidden md:block w-px h-3 bg-brown/20"></div>
                        <div className="flex flex-nowrap items-center gap-0.5 overflow-x-auto">
                            <p className="body-16-medium text-brown capitalize whitespace-nowrap">{transactionTypeMap[property.transactionType] || property.transactionType}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20 flex-shrink-0">
                                <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor" />
                            </svg>
                            <p className="body-16-medium text-brown capitalize whitespace-nowrap">{propertyTypeMap[property.propertyType.toLowerCase()] || property.propertyType}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20 flex-shrink-0">
                                <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor" />
                            </svg>
                            <p className="body-16-medium text-brown whitespace-nowrap">{property.distrito}</p>
                        </div>
                    </div>
                    <ImagensImoveis
                        property={property}
                        lightboxOpen={lightboxOpen}
                        lightboxIndex={lightboxIndex}
                        onLightboxClose={() => setLightboxOpen(false)}
                    />
                </div>
                {(() => {
                    // Coletar todas as imagens disponíveis (primeira de cada seção)
                    const allImages = property.imageSections
                        ?.filter(section => section.images && section.images.length > 0)
                        .flatMap(section => section.images.map(img => ({
                            url: img,
                            name: section.sectionName
                        }))) || [];

                    return (
                        <>
                            {/* Grid de 4 mídias - visible only on md and up */}
                            <div className="hidden md:grid md:grid-cols-2 md:grid-rows-2 h-96 lg:grid-cols-12 w-full gap-4">
                                <div className="bg-brown/10 row-span-2 lg:col-span-6 lg:row-span-2 overflow-hidden cursor-pointer" onClick={() => {
                                    setLightboxIndex(0);
                                    setLightboxOpen(true);
                                }}>
                                    {property.image && (
                                        <MediaItem
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                            onClick={() => {
                                                setLightboxIndex(0);
                                                setLightboxOpen(true);
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="bg-brown/10 lg:col-span-3 md:row-span-1 lg:row-span-2 overflow-hidden hidden lg:block cursor-pointer" onClick={() => {
                                    if (allImages[0]) {
                                        setLightboxIndex(getImageIndex(property, allImages[0].url));
                                        setLightboxOpen(true);
                                    }
                                }}>
                                    {allImages[0] && (
                                        <MediaItem
                                            src={allImages[0].url}
                                            alt={`${property.title} - ${allImages[0].name}`}
                                            className="w-full h-full object-cover"
                                            onClick={() => {
                                                if (allImages[0]) {
                                                    setLightboxIndex(getImageIndex(property, allImages[0].url));
                                                    setLightboxOpen(true);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="bg-brown/10 lg:col-span-3 overflow-hidden cursor-pointer" onClick={() => {
                                    if (allImages[1]) {
                                        setLightboxIndex(getImageIndex(property, allImages[1].url));
                                        setLightboxOpen(true);
                                    }
                                }}>
                                    {allImages[1] && (
                                        <MediaItem
                                            src={allImages[1].url}
                                            alt={`${property.title} - ${allImages[1].name}`}
                                            className="w-full h-full object-cover"
                                            onClick={() => {
                                                if (allImages[1]) {
                                                    setLightboxIndex(getImageIndex(property, allImages[1].url));
                                                    setLightboxOpen(true);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="bg-brown/10 col-start-2 lg:col-span-3 overflow-hidden cursor-pointer" onClick={() => {
                                    if (allImages[2]) {
                                        setLightboxIndex(getImageIndex(property, allImages[2].url));
                                        setLightboxOpen(true);
                                    }
                                }}>
                                    {allImages[2] && (
                                        <MediaItem
                                            src={allImages[2].url}
                                            alt={`${property.title} - ${allImages[2].name}`}
                                            className="w-full h-full object-cover"
                                            onClick={() => {
                                                if (allImages[2]) {
                                                    setLightboxIndex(getImageIndex(property, allImages[2].url));
                                                    setLightboxOpen(true);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Mídia principal - visible only on mobile */}
                            <div className="md:hidden w-full max-h-96 aspect-video border border-brown/10 overflow-hidden cursor-pointer" onClick={() => {
                                setLightboxIndex(0);
                                setLightboxOpen(true);
                            }}>
                                {property.image && (
                                    <MediaItem
                                        src={property.image}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                        onClick={() => {
                                            setLightboxIndex(0);
                                            setLightboxOpen(true);
                                        }}
                                    />
                                )}
                            </div>
                        </>
                    );
                })()}
                <div className="pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 min-w-0">
                    <div className="flex items-center gap-4 body-16-medium text-brown justify-between md:justify-start w-full md:w-auto">
                        <span>{property.concelho}, {property.distrito}</span>
                        <div className="block h-3 w-px bg-brown/30"></div>
                        <span className="capitalize">{propertyTypeMap[property.propertyType.toLowerCase()] || property.propertyType}</span>
                        <div className="block h-3 w-px bg-brown/30"></div>
                        <p><span className="text-brown/50">#</span>{property.reference}</p>
                    </div>
                    <p className="body-16-medium text-brown">{t("businessType")} <span className="capitalize">{transactionTypeMap[property.transactionType]}</span></p>
                </div>
                <h1 className="pt-4 md:pt-5 lg:pt-6 body-18-medium md:body-20-medium lg:heading-quatro-medium text-brown">{property.title}</h1>
                <h2 className="pt-2 md:pt-3 lg:pt-4 heading-quatro-medium lg:heading-tres-medium text-brown">{parseFloat(property.price).toLocaleString('pt-PT')} €</h2>

                <div className="grid lg:grid-cols-2 gap-4 w-full lg:w-1/2 mt-2">
                    <a
                        href={`https://wa.me/351919766323?text=${encodeURIComponent(
                            `Olá! Tenho interesse no imóvel:\n\n` +
                            `${property.title}\n` +
                            `Preço: ${parseFloat(property.price).toLocaleString('pt-PT')} €\n` +
                            `Referência: ${property.reference}\n` +
                            `Link: ${window.location.href}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-muted text-white font-medium px-6 py-3 transition-colors body-16-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        {t("contactViaWhatsApp")}
                    </a>

                    <Button variant="gold" className="grow body-16-medium" onClick={handleDownloadPDF}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.2001 11.8401H13.7601C14.1136 11.8401 14.4001 11.5536 14.4001 11.2001V7.3601C14.4001 6.29971 13.5405 5.4401 12.4801 5.4401H3.5201C2.45971 5.4401 1.6001 6.29971 1.6001 7.3601V11.2001C1.6001 11.5536 1.88664 11.8401 2.2401 11.8401H4.8001M12.1601 7.6801H12.1659M11.2001 5.4401V2.5601C11.2001 2.0299 10.7703 1.6001 10.2401 1.6001H5.7601C5.2299 1.6001 4.8001 2.0299 4.8001 2.5601V5.4401M11.2001 10.5601V13.1201C11.2001 13.827 10.627 14.4001 9.9201 14.4001H6.0801C5.37317 14.4001 4.8001 13.827 4.8001 13.1201V10.5601H11.2001Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {t("savePDF")}
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-6 order-2 lg:order-1 pt-4 md:pt-5 lg:pt-6">
                        <div className="w-full">
                            <div
                                className="tiptap max-w-none break-words whitespace-pre-line"
                                style={{ wordBreak: "break-word", overflowWrap: "break-word", hyphens: "auto" }}
                                dangerouslySetInnerHTML={{ __html: property.description }} />
                            {property.isEmpreendimento && (
                                <div className="mt-4 p-4 bg-brown/5 border border-brown/20">
                                    <p className="body-14-regular text-brown/80 italic">
                                        {t("developmentNote")}
                                    </p>
                                </div>
                            )}

                            <div className="mt-4 p-4 bg-brown/5 border border-brown/20">
                                <p className="body-16-medium text-brown mb-2">
                                    {t("whyChooseAgencyTitle")}
                                </p>
                                <p className="body-14-regular text-brown/80 mb-3">
                                    {t("whyChooseAgencyDescription")}
                                </p>
                                <p className="body-14-medium text-brown/90 mb-2">
                                    {t("whyChooseAgencyCTA")}
                                </p>
                                <p className="body-14-regular text-brown/80 mb-3">
                                    {t("whyChooseAgencyOpportunity")}
                                </p>
                                <p className="body-14-regular text-brown/60 italic">
                                    {t("whyChooseAgencyAgentNote")}
                                </p>
                            </div>

                            {/* Google Maps - Desktop Only */}
                            <iframe
                                className="hidden lg:block mt-6 h-75 border-0"
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                                    `${property.freguesia}, ${property.concelho}, ${property.distrito}, Portugal`
                                )}`}
                                width="100%"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* Mobile Only - Corretor Responsável, Botões e Form */}
                        <div className="lg:hidden">
                            {/* Corretor Responsável */}
                            {property.teamMember && (
                                <div className="mt-4 w-full p-4 bg-deaf/50 rounded-lg border border-brown/10">
                                    <p className="body-14-medium text-brown/70 mb-2">{t("responsibleBroker")}</p>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="body-16-medium text-brown">{property.teamMember.name}</p>
                                            <p className="body-14-regular text-brown/60">{property.teamMember.email}</p>
                                        </div>
                                        <a
                                            href={`https://wa.me/351${property.teamMember.phone}?text=${encodeURIComponent(
                                                `Olá ${property.teamMember.name}! Tenho interesse no imóvel:\n\n` +
                                                `${property.title}\n` +
                                                `Preço: ${parseFloat(property.price).toLocaleString('pt-PT')} €\n` +
                                                `Referência: ${property.reference}\n` +
                                                `Link: ${typeof window !== 'undefined' ? window.location.href : ''}`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0"
                                        >
                                            <Button className="bg-gold text-white" size="default">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                {t("contact")}
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 w-full">
                                <div className="flex flex-col gap-4 w-full">
                                    <Button
                                        variant={fav ? "gold" : "gold"}
                                        className="grow body-16-medium"
                                        onClick={() => {
                                            const currentlyFav = isFavorite(id)
                                            toggleFavorite(id)
                                            toast.success(currentlyFav ? t("removedFromFavorites") : t("addedToFavorites"))
                                        }}
                                    >
                                        {fav ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8.0001 14.447C8.0001 14.447 1.6001 10.4608 1.6001 6.60381C1.6001 4.69789 2.94746 3.15283 4.8001 3.15283C5.7601 3.15283 6.7201 3.48501 8.0001 4.81373C9.2801 3.48501 10.2401 3.15283 11.2001 3.15283C13.0527 3.15283 14.4001 4.69789 14.4001 6.60381C14.4001 10.4608 8.0001 14.447 8.0001 14.447Z" fill="currentColor" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8.0001 14.447C8.0001 14.447 1.6001 10.4608 1.6001 6.60381C1.6001 4.69789 2.94746 3.15283 4.8001 3.15283C5.7601 3.15283 6.7201 3.48501 8.0001 4.81373C9.2801 3.48501 10.2401 3.15283 11.2001 3.15283C13.0527 3.15283 14.4001 4.69789 14.4001 6.60381C14.4001 10.4608 8.0001 14.447 8.0001 14.447Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {t("favorite")}
                                    </Button>
                                    <Button variant="gold" className="grow body-16-medium" onClick={handleCopyLink}>
                                        {linkCopied ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6.33343 9.66676L9.66676 6.3334M11.4464 9.85577L13.302 8.00012C14.7661 6.536 14.7661 4.16224 13.302 2.69816C11.838 1.23408 9.46422 1.23408 8.00011 2.69816L6.14442 4.55384M9.85575 11.4464L8.00011 13.302C6.53602 14.7661 4.16226 14.7661 2.69817 13.302C1.23407 11.8379 1.23407 9.46416 2.69817 8.00012L4.55384 6.14442" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {linkCopied ? t("linkCopiedShort") : t("propertyLink")}
                                    </Button>

                                </div>
                                <form className="space-y-4 mt-4 p-4 border border-brown/10" onSubmit={handleSubmitContact}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nome" className="body-14-medium text-black">{t("name")} <span className="text-red body-14-medium">*</span></Label>
                                            <Input
                                                id="nome"
                                                value={formData.nome}
                                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefone" className="body-14-medium text-black">{t("phoneNumber")} <span className="text-red body-14-medium">*</span></Label>
                                            <Input
                                                id="telefone"
                                                placeholder={t("phonePlaceholder")}
                                                value={formData.telefone}
                                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="body-14-medium text-black">{t("email")} <span className="text-red body-14-medium">*</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder={t("emailPlaceholder")}
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mensagem" className="body-14-medium text-black">{t("message")} <span className="text-red body-14-medium">*</span></Label>
                                        <Textarea
                                            id="mensagem"
                                            placeholder={t("messagePlaceholder")}
                                            value={formData.mensagem}
                                            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                                            required
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="marketing"
                                            checked={formData.aceitaMarketing}
                                            onCheckedChange={(checked) => setFormData({ ...formData, aceitaMarketing: checked as boolean })}
                                        />
                                        <label htmlFor="marketing" className="body-14-medium text-black-muted cursor-pointer">{t("marketingConsent")}</label>
                                    </div>

                                    <Button type="submit" variant="gold" className="w-full">{t("send")}</Button>
                                </form>
                                <iframe
                                    className="mt-6 h-75 border-0"
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                                        `${property.freguesia}, ${property.concelho}, ${property.distrito}, Portugal`
                                    )}`}
                                    width="100%"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-5 lg:col-end-13 order-1 lg:order-2 pt-4 md:pt-5 lg:pt-6">

                        {property.totalArea && property.totalArea > 0 && (
                            <Caracteristica titulo={t("totalArea")} valor={`${property.totalArea}m²`} />
                        )}
                        {property.builtArea && property.builtArea > 0 && (
                            <Caracteristica titulo={t("builtArea")} valor={`${property.builtArea}m²`} />
                        )}
                        {property.usefulArea && property.usefulArea > 0 && (
                            <Caracteristica titulo={t("usefulArea")} valor={`${property.usefulArea}m²`} />
                        )}
                        {property.bathrooms > 0 && (
                            <Caracteristica titulo={t("bathrooms")} valor={property.bathrooms.toString()} />
                        )}
                        {property.bedrooms > 0 && (
                            <Caracteristica titulo={t("bedrooms")} valor={property.bedrooms.toString()} />
                        )}
                        {property.hasOffice && <Caracteristica titulo={t("office")} valor={t("yes")} />}
                        {property.hasLaundry && <Caracteristica titulo={t("laundry")} valor={t("yes")} />}
                        {property.garageSpaces > 0 && (
                            <Caracteristica
                                titulo={t("garage")}
                                valor={`${property.garageSpaces} ${property.garageSpaces === 1 ? t("space") : t("spaces")}`}
                            />
                        )}
                        {property.constructionYear && property.constructionYear > 0 && (
                            <Caracteristica titulo={t("constructionYear")} valor={property.constructionYear.toString()} />
                        )}
                        {property.propertyState && (
                            <Caracteristica titulo={t("state")} valor={property.propertyState.charAt(0).toUpperCase() + property.propertyState.slice(1)} />
                        )}
                        {property.energyClass && (
                            <Caracteristica titulo={t("energyClass")} valor={property.energyClass.toUpperCase()} />
                        )}
                        {property.features && (
                            <div className="flex items-center justify-between py-4 border-b border-brown/10">
                                <p className="body-16-medium text-brown">{t("features")}</p>
                                <Button
                                    variant="gold"
                                    size="default"
                                    onClick={() => setShowFeaturesModal(true)}
                                >
                                    {t("view")}
                                </Button>
                            </div>
                        )}
                        {property.whyChoose && (
                            <div className="flex items-center justify-between py-4 border-b border-brown/10">
                                <p className="body-16-medium text-brown">{t("whyChooseThisPropertyLabel")}</p>
                                <Button
                                    variant="gold"
                                    size="default"
                                    onClick={() => setShowWhyModal(true)}
                                >
                                    {t("view")}
                                </Button>
                            </div>
                        )}
                        {property.files && property.files.filter(f => f.isVisible).length > 0 && (
                            <div className="flex items-center justify-between py-4 border-b border-brown/10">
                                <p className="body-16-medium text-brown">{t("files")}</p>
                                <Button
                                    variant="gold"
                                    size="default"
                                    onClick={() => setShowFilesModal(true)}
                                >
                                    {t("view")}
                                </Button>
                            </div>
                        )}
                        {property.deliveryDate && (
                            <div className="mt-4">
                                <h6 className="body-16-medium text-brown mb-2">{t("expectedDelivery")}</h6>
                                <p className="body-16-regular text-brown">{property.deliveryDate}</p>
                            </div>
                        )}
                        {property.paymentConditions && (
                            <div className="mt-4">
                                <h6 className="body-16-medium text-brown mb-2">{t("paymentConditions")}</h6>
                                <div className="tiptap body-16-regular text-brown" dangerouslySetInnerHTML={{ __html: property.paymentConditions }} />
                            </div>
                        )}

                        {/* Desktop Only - Corretor Responsável, Botões e Form */}
                        <div className="hidden lg:block">
                            {/* Corretor Responsável */}
                            {property.teamMember && (
                                <div className="mt-4 w-full p-4 bg-deaf/50 border border-brown/10">
                                    <p className="body-14-medium text-brown/70 mb-2">{t("responsibleBroker")}</p>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="body-16-medium text-brown">{property.teamMember.name}</p>
                                            <p className="body-14-regular text-brown/60">{property.teamMember.email}</p>
                                        </div>
                                        <a
                                            href={`https://wa.me/351${property.teamMember.phone}?text=${encodeURIComponent(
                                                `Olá ${property.teamMember.name}! Tenho interesse no imóvel:\n\n` +
                                                `${property.title}\n` +
                                                `Preço: ${parseFloat(property.price).toLocaleString('pt-PT')} €\n` +
                                                `Referência: ${property.reference}\n` +
                                                `Link: ${typeof window !== 'undefined' ? window.location.href : ''}`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0"
                                        >
                                            <Button variant="gold" className="w-full body-16-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                </svg>
                                                {t("contact")}
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 w-full">
                                <div className="flex flex-col gap-4 w-full">
                                    <Button
                                        variant={fav ? "gold" : "gold"}
                                        className="w-full body-16-medium"
                                        onClick={() => {
                                            const currentlyFav = isFavorite(id)
                                            toggleFavorite(id)
                                            toast.success(currentlyFav ? t("removedFromFavorites") : t("addedToFavorites"))
                                        }}
                                    >
                                        {fav ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8.0001 14.447C8.0001 14.447 1.6001 10.4608 1.6001 6.60381C1.6001 4.69789 2.94746 3.15283 4.8001 3.15283C5.7601 3.15283 6.7201 3.48501 8.0001 4.81373C9.2801 3.48501 10.2401 3.15283 11.2001 3.15283C13.0527 3.15283 14.4001 4.69789 14.4001 6.60381C14.4001 10.4608 8.0001 14.447 8.0001 14.447Z" fill="currentColor" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M8.0001 14.447C8.0001 14.447 1.6001 10.4608 1.6001 6.60381C1.6001 4.69789 2.94746 3.15283 4.8001 3.15283C5.7601 3.15283 6.7201 3.48501 8.0001 4.81373C9.2801 3.48501 10.2401 3.15283 11.2001 3.15283C13.0527 3.15283 14.4001 4.69789 14.4001 6.60381C14.4001 10.4608 8.0001 14.447 8.0001 14.447Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {t("favorite")}
                                    </Button>
                                    <Button variant="gold" className="w-full body-16-medium" onClick={handleCopyLink}>
                                        {linkCopied ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6.33343 9.66676L9.66676 6.3334M11.4464 9.85577L13.302 8.00012C14.7661 6.536 14.7661 4.16224 13.302 2.69816C11.838 1.23408 9.46422 1.23408 8.00011 2.69816L6.14442 4.55384M9.85575 11.4464L8.00011 13.302C6.53602 14.7661 4.16226 14.7661 2.69817 13.302C1.23407 11.8379 1.23407 9.46416 2.69817 8.00012L4.55384 6.14442" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {linkCopied ? t("linkCopiedShort") : t("propertyLink")}
                                    </Button>
                                </div>
                                <form className="space-y-4 mt-4 p-4 border border-brown/10" onSubmit={handleSubmitContact}>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nome-desktop" className="body-14-medium text-black">{t("name")} <span className="text-red body-14-medium">*</span></Label>
                                            <Input
                                                id="nome-desktop"
                                                value={formData.nome}
                                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefone-desktop" className="body-14-medium text-black">{t("phoneNumber")} <span className="text-red body-14-medium">*</span></Label>
                                            <Input
                                                id="telefone-desktop"
                                                value={formData.telefone}
                                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email-desktop" className="body-14-medium text-black">{t("email")} <span className="text-red body-14-medium">*</span></Label>
                                        <Input
                                            id="email-desktop"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mensagem-desktop" className="body-14-medium text-black">{t("message")} <span className="text-red body-14-medium">*</span></Label>
                                        <Textarea
                                            id="mensagem-desktop"
                                            value={formData.mensagem}
                                            onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                                            required
                                            className="min-h-[100px]"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="marketing-desktop"
                                            checked={formData.aceitaMarketing}
                                            onCheckedChange={(checked) => setFormData({ ...formData, aceitaMarketing: checked as boolean })}
                                        />
                                        <label htmlFor="marketing-desktop" className="body-14-medium text-black-muted cursor-pointer">{t("marketingConsent")}</label>
                                    </div>

                                    <Button type="submit" variant="gold" className="w-full">{t("send")}</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ImoveisRelacionados
                currentPropertyId={property.id}
                currentPrice={property.price}
                property={property}
            />

            {/* Template invisível para geração de PDF */}
            <div className="fixed -left-[9999px] top-0 pointer-events-none" ref={pdfRef}>
                <PropertyPDFTemplate property={property} />
            </div>

            {/* Modal de Características */}
            <Dialog open={showFeaturesModal} onOpenChange={setShowFeaturesModal}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-brown body-18-medium">{t("propertyFeatures")}</DialogTitle>
                        <DialogDescription>
                            Características e comodidades especiais deste imóvel
                        </DialogDescription>
                    </DialogHeader>
                    <div className="tiptap body-16-regular text-brown" dangerouslySetInnerHTML={{ __html: property.features || "" }} />
                </DialogContent>
            </Dialog>

            {/* Modal de Ficheiros */}
            <Dialog open={showFilesModal} onOpenChange={setShowFilesModal}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-brown body-18-medium">{t("propertyFiles")}</DialogTitle>
                        <DialogDescription>
                            {t("filesDescription")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3">
                        {property.files?.filter(f => f.isVisible).map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between p-4 border border-brown/10 rounded-lg hover:bg-deaf/50 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brown">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                        </svg>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="body-16-medium text-brown truncate">
                                            {file.title || file.originalName}
                                        </p>
                                        <p className="body-14-regular text-brown/60">
                                            {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="brown"
                                    size="default"
                                    onClick={() => handleDownloadFile(file.filePath, file.originalName)}
                                    className="ml-4"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    {t("download")}
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal - Porque escolher este imóvel */}
            <Dialog open={showWhyModal} onOpenChange={setShowWhyModal}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-brown body-18-medium">
                            {t("whyChooseThisPropertyTitle")}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="tiptap body-16-regular text-brown" dangerouslySetInnerHTML={{ __html: property.whyChoose || "" }} />
                </DialogContent>
            </Dialog>

            <Footer />
        </>
    );
}
