"use client"

import { useRef, useState } from "react"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { propertiesApi } from "@/services/api"
import Footer from "@/components/Footer"
import Caracteristica from "@/components/Sections/Imovel/Caracteristica"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input-line"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea-line"
import Link from "next/link"
import { toast } from "sonner"
import useFavorites from "@/hooks/useFavorites"
import ImoveisRelacionados from "@/components/Sections/ImoveisRelacionados/ImoveisRelacionado"
import { generatePropertyPDF } from "@/utils/pdfGenerator"
import ImagensImoveis from "@/components/Sections/ImagensImoveis"
import PropertyPDFTemplate from "@/components/PropertyPDFTemplate"

export default function ImovelDetails() {
    const params = useParams()
    const id = params.id as string
    const [linkCopied, setLinkCopied] = useState(false)
    const { isFavorite, toggleFavorite } = useFavorites()
    const fav = isFavorite(id)
    const [showPanel, setShowPanel] = useState(false)
    const [panelClosing, setPanelClosing] = useState(false)
    const [panelOpening, setPanelOpening] = useState(false)
    const pdfRef = useRef(null)

    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        mensagem: "",
        aceitaMarketing: false,
    })

    const handleOpenPanel = () => {
        // Bloquear overflow imediatamente
        document.body.style.overflow = 'hidden';
        setShowPanel(true)
        // Força o elemento a começar com translate-y-full e depois anima
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setPanelOpening(true)
            })
        })
    }

    const handleClosePanel = () => {
        setPanelClosing(true)
        setPanelOpening(false)
    }

    const handleTransitionEnd = () => {
        if (panelClosing) {
            setPanelClosing(false);
            setShowPanel(false);
            setPanelOpening(false);
            // Restaurar overflow quando o painel fechar completamente
            document.body.style.overflow = '';
        }
    }
    const { data: property, isLoading, error } = useQuery({
        queryKey: ["property", id],
        queryFn: () => propertiesApi.getById(id),
        enabled: !!id,
    })

    if (isLoading) {
        return (
            <>
                <section className="bg-deaf">
                    <div className="container pb-16 pt-20">
                        <p className="text-center text-brown">Carregando...</p>
                    </div>
                </section>
                <Footer />
            </>
        )
    }

    if (error || !property) {
        return (
            <>
                <section className="bg-deaf">
                    <div className="container pb-16 pt-20">
                        <p className="text-center text-red">Imóvel não encontrado</p>
                    </div>
                </section>
                <Footer />
            </>
        )
    }

    const transactionTypeMap: Record<string, string> = {
        comprar: "Compra",
        arrendar: "Arrendamento",
        vender: "Venda"
    }

    const handleCopyLink = async () => {
        try {
            const url = window.location.href
            await navigator.clipboard.writeText(url)
            setLinkCopied(true)
            toast.success("Link copiado para a área de transferência!")

            setTimeout(() => {
                setLinkCopied(false)
            }, 2000)
        } catch {
            toast.error("Erro ao copiar link")
        }
    }

    const handleDownloadPDF = async () => {
        try {
            toast.loading("Gerando brochura em PDF...")
            await generatePropertyPDF(property, pdfRef)
            toast.dismiss()
            toast.success("Brochura gerada com sucesso!")
        } catch (error) {
            toast.dismiss()
            toast.error("Erro ao gerar PDF")
            console.error(error)
        }
    }

    const handleSubmitContact = async (e: React.FormEvent) => {
        e.preventDefault()

        const toastId = toast.loading("Enviando mensagem...")

        try {
            // Adicionar informações do imóvel à mensagem
            const propertyInfo = `\n\n--- Informações do Imóvel ---\nReferência: ${property.reference || property.id}\nTipo: ${property.propertyType}\nLocalização: ${property.concelho}, ${property.distrito}\nPreço: ${parseFloat(property.price.toString()).toLocaleString("pt-PT")} €\nLink: ${window.location.href}`

            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    mensagem: formData.mensagem + propertyInfo,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Mensagem enviada com sucesso!", { id: toastId })
                setFormData({
                    nome: "",
                    telefone: "",
                    email: "",
                    mensagem: "",
                    aceitaMarketing: false,
                })
            } else {
                toast.error(data.error || "Erro ao enviar mensagem", { id: toastId })
            }
        } catch (error) {
            toast.error("Erro ao enviar mensagem. Tente novamente.", { id: toastId })
        }
    }


    return (
        <>
            <section className="bg-deaf">
                <div className="container pb-16">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <Link
                                href="/imoveis"
                                className="flex items-center gap-2 px-1.5 py-1 body-16-medium text-brown hover:text-gold transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M5.16725 9.12965L2.19555 5.80428L5.16336 2.5M2 5.81495H11.0427C12.676 5.81495 14 7.31142 14 9.1575C14 11.0035 12.676 12.5 11.0427 12.5H7.38875" stroke="currentColor" strokeWidth="1.5" />
                                </svg>Voltar
                            </Link>
                            <div className="w-px h-3 bg-brown/20"></div>
                            <div className="flex items-center gap-0.5">
                                <p className="body-16-medium text-brown capitalize">{property.transactionType}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20">
                                    <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor" />
                                </svg>
                                <p className="body-16-medium text-brown capitalize">{property.propertyType}</p>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20">
                                    <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor" />
                                </svg>
                                <p className="body-16-medium text-brown">{property.distrito}</p>
                            </div>
                        </div>
                        <ImagensImoveis
                            property={property}
                            showPanel={showPanel}
                            panelClosing={panelClosing}
                            panelOpening={panelOpening}
                            handleOpenPanel={handleOpenPanel}
                            handleClosePanel={handleClosePanel}
                            handleTransitionEnd={handleTransitionEnd}
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
                            <div className="h-96 grid grid-cols-12 w-full gap-4">
                                <div className="border border-brown/10 col-span-6 row-span-2 overflow-hidden rounded-lg">
                                    {property.image && (
                                        <img
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="border border-brown/10 col-span-3 row-span-2 overflow-hidden rounded-lg">
                                    {allImages[0] && (
                                        <img
                                            src={allImages[0].url}
                                            alt={`${property.title} - ${allImages[0].name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="border border-brown/10 col-span-3 overflow-hidden rounded-lg">
                                    {allImages[1] && (
                                        <img
                                            src={allImages[1].url}
                                            alt={`${property.title} - ${allImages[1].name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="border border-brown/10 col-span-3 overflow-hidden rounded-lg">
                                    {allImages[2] && (
                                        <img
                                            src={allImages[2].url}
                                            alt={`${property.title} - ${allImages[2].name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    <div className="pt-4 flex justify-between items-center">
                        <div className="flex items-center gap-4 body-16-medium text-brown">
                            <span>{property.concelho}, {property.distrito}</span>
                            <div className="h-3 w-px bg-brown/30"></div>
                            <span className="capitalize">{property.propertyType}</span>
                            <div className="h-3 w-px bg-brown/30"></div>
                            <p><span className="text-brown/50">#</span>{property.reference}</p>
                        </div>
                        <p className="body-16-medium text-brown">Tipo de negócio: <span className="capitalize">{transactionTypeMap[property.transactionType]}</span></p>
                    </div>
                    <h2 className="pt-6 heading-tres-medium text-brown">{parseFloat(property.price).toLocaleString('pt-PT')} €</h2>
                    <div className="pt-6 flex justify-between">
                        <div>
                            <div className="w-154 [&>p]:first:p-0 [&>p]:pt-2 [&>h6]:first:p-0 [&>h6]:pt-4 [&>ul]:first:p-0 [&>ul]:pt-2 [&>p]:text-brown [&>p]:body-16-regular [&>h6]:body-16-medium [&>ul]:list-disc [&>ul]:list-inside">
                                <div className="prose prose-brown max-w-none" dangerouslySetInnerHTML={{ __html: property.description }} />
                                {property.deliveryDate && (
                                    <>
                                        <h6>Previsão de entrega:</h6>
                                        <p>{property.deliveryDate}</p>
                                    </>
                                )}
                                {property.paymentConditions && (
                                    <>
                                        <h6>Condições de Pagamento:</h6>
                                        <div dangerouslySetInnerHTML={{ __html: property.paymentConditions }} />
                                    </>
                                )}
                            </div>
                            <div className="mt-4">
                                <div className="flex gap-4 w-full">
                                    <Button
                                        variant={fav ? "gold" : "muted"}
                                        className="grow"
                                        onClick={() => {
                                            const currentlyFav = isFavorite(id)
                                            toggleFavorite(id)
                                            toast.success(currentlyFav ? "Removido dos favoritos" : "Adicionado aos favoritos")
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
                                        {fav ? "Favorito" : "Favoritos"}
                                    </Button>
                                    <Button variant="muted" className="grow" onClick={handleCopyLink}>
                                        {linkCopied ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                <path d="M6.33343 9.66676L9.66676 6.3334M11.4464 9.85577L13.302 8.00012C14.7661 6.536 14.7661 4.16224 13.302 2.69816C11.838 1.23408 9.46422 1.23408 8.00011 2.69816L6.14442 4.55384M9.85575 11.4464L8.00011 13.302C6.53602 14.7661 4.16226 14.7661 2.69817 13.302C1.23407 11.8379 1.23407 9.46416 2.69817 8.00012L4.55384 6.14442" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                        {linkCopied ? "Link Copiado!" : "Link do Imóvel"}
                                    </Button>
                                    <Button variant="muted" className="grow" onClick={handleDownloadPDF}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M11.2001 11.8401H13.7601C14.1136 11.8401 14.4001 11.5536 14.4001 11.2001V7.3601C14.4001 6.29971 13.5405 5.4401 12.4801 5.4401H3.5201C2.45971 5.4401 1.6001 6.29971 1.6001 7.3601V11.2001C1.6001 11.5536 1.88664 11.8401 2.2401 11.8401H4.8001M12.1601 7.6801H12.1659M11.2001 5.4401V2.5601C11.2001 2.0299 10.7703 1.6001 10.2401 1.6001H5.7601C5.2299 1.6001 4.8001 2.0299 4.8001 2.5601V5.4401M11.2001 10.5601V13.1201C11.2001 13.827 10.627 14.4001 9.9201 14.4001H6.0801C5.37317 14.4001 4.8001 13.827 4.8001 13.1201V10.5601H11.2001Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Guardar PDF
                                    </Button>
                                </div>
                                <form className="space-y-4 mt-4 p-4 border border-brown/10" onSubmit={handleSubmitContact}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nome" className="body-14-medium text-black">Nome <span className="text-red body-14-medium">*</span></Label>
                                            <Input
                                                id="nome"
                                                placeholder="Tomas Ribeiro Silva"
                                                value={formData.nome}
                                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="telefone" className="body-14-medium text-black">Número de Telemóvel <span className="text-red body-14-medium">*</span></Label>
                                            <Input
                                                id="telefone"
                                                placeholder="+351 919 766 323"
                                                value={formData.telefone}
                                                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="body-14-medium text-black">Email <span className="text-red body-14-medium">*</span></Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="contacto@agenciadouro.pt"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mensagem" className="body-14-medium text-black">Mensagem <span className="text-red body-14-medium">*</span></Label>
                                        <Textarea
                                            id="mensagem"
                                            placeholder="Envie-nos uma mensagem!"
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
                                        <label htmlFor="marketing" className="body-14-medium text-black-muted cursor-pointer">Autorizo a Agência Douro a guardar estes dados para efeitos de marketing e de contacto.</label>
                                    </div>

                                    <Button type="submit" variant="gold" className="w-full">Enviar</Button>
                                </form>

                            </div>
                        </div>
                        <div className="w-[512px] sticky top-0">
                            {property.totalArea && property.totalArea > 0 && (
                                <Caracteristica titulo="Área Total" valor={`${property.totalArea}m²`} />
                            )}
                            {property.builtArea && property.builtArea > 0 && (
                                <Caracteristica titulo="Área Construída" valor={`${property.builtArea}m²`} />
                            )}
                            {property.usefulArea && property.usefulArea > 0 && (
                                <Caracteristica titulo="Área Útil" valor={`${property.usefulArea}m²`} />
                            )}
                            {property.bathrooms > 0 && (
                                <Caracteristica titulo="Casas de Banho" valor={property.bathrooms.toString()} />
                            )}
                            {property.bedrooms > 0 && (
                                <Caracteristica titulo="Quartos" valor={property.bedrooms.toString()} />
                            )}
                            {property.hasOffice && <Caracteristica titulo="Escritório" valor="Sim" />}
                            {property.hasLaundry && <Caracteristica titulo="Lavandaria" valor="Sim" />}
                            {property.garageSpaces > 0 && (
                                <Caracteristica
                                    titulo="Garagem"
                                    valor={`${property.garageSpaces} ${property.garageSpaces === 1 ? 'Lugar' : 'Lugares'}`}
                                />
                            )}
                            {property.constructionYear && property.constructionYear > 0 && (
                                <Caracteristica titulo="Ano de construção" valor={property.constructionYear.toString()} />
                            )}
                            {property.propertyState && (
                                <Caracteristica titulo="Estado" valor={property.propertyState.charAt(0).toUpperCase() + property.propertyState.slice(1)} />
                            )}
                            {property.energyClass && (
                                <Caracteristica titulo="Classe Energética" valor={property.energyClass.toUpperCase()} />
                            )}
                            <iframe
                                className="mt-6 h-75 border-0"
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                                    `${property.concelho}, ${property.distrito}, Portugal`
                                )}`}
                                width="100%"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <ImoveisRelacionados
                currentPropertyId={property.id}
                currentPrice={property.price}
            />
            <Footer />

            {/* Template invisível para geração de PDF */}
            <div className="fixed -left-[9999px] top-0 pointer-events-none" ref={pdfRef}>
                <PropertyPDFTemplate property={property} />
            </div>
        </>
    );
}