"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { propertiesApi } from "@/services/api"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link"
import ImagensImoveis from "@/components/Sections/ImagensImoveis"
import Caracteristica from "@/components/Sections/Imovel/Caracteristica"
import { Trash2, Pencil, Star } from "lucide-react"
import Image from "next/image"

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
}: {
    src: string;
    alt: string;
    className?: string;
}) => {
    if (isVideoUrl(src)) {
        return (
            <video
                src={src}
                controls
                className={className}
                preload="metadata"
            />
        );
    }

    return (
        <Image
            width={1000}
            height={1000}
            src={src}
            alt={alt}
            className={className}
        />
    );
};

export default function PropertyDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const propertyId = params.id as string
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [showPanel, setShowPanel] = useState(false)
    const [panelClosing, setPanelClosing] = useState(false)
    const [panelOpening, setPanelOpening] = useState(false)

    const { data: property, isLoading, error } = useQuery({
        queryKey: ["property", propertyId],
        queryFn: () => propertiesApi.getById(propertyId),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => propertiesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["properties"] })
            router.push("/admin/properties")
        },
    })

    const toggleFeaturedMutation = useMutation({
        mutationFn: (id: string) => propertiesApi.toggleFeatured(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
            queryClient.invalidateQueries({ queryKey: ["properties"] })
        },
    })

    const handleOpenPanel = () => {
        document.body.style.overflow = 'hidden';
        setShowPanel(true)
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
            document.body.style.overflow = '';
        }
    }

    const handleDelete = () => {
        deleteMutation.mutate(propertyId)
    }

    const handleToggleFeatured = () => {
        toggleFeaturedMutation.mutate(propertyId)
    }

    if (isLoading) {
        return (
            <section className="bg-deaf">
                <div className="container pb-16 pt-20">
                    <p className="text-center text-brown">A carregar...</p>
                </div>
            </section>
        )
    }

    if (error || !property) {
        return (
            <section className="bg-deaf">
                <div className="container pb-16 pt-20">
                    <p className="text-center text-red">Imóvel não encontrado</p>
                </div>
            </section>
        )
    }

    const transactionTypeMap: Record<string, string> = {
        comprar: "Compra",
        arrendar: "Arrendamento",
        trespasse: "Trespasse",
    }

    return (
        <>
            <section className="">
                <div className="container pb-16">
                    {/* Barra de administração */}
                    <div className="flex justify-between items-center py-4 border-b border-brown/10 mb-4">
                        <Link
                            href="/admin/properties"
                            className="body-14-medium text-brown flex items-center gap-2 px-1.5 py-1 hover:text-gold transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5.16725 9.12965L2.19555 5.80428L5.16336 2.5M2 5.81495H11.0427C12.676 5.81495 14 7.31142 14 9.1575C14 11.0035 12.676 12.5 11.0427 12.5H7.38875" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                            Voltar para lista
                        </Link>

                        <div className="flex gap-2">
                            <Button
                                variant={property.isFeatured ? "gold" : "brown"}
                                onClick={handleToggleFeatured}
                                disabled={toggleFeaturedMutation.isPending}
                            >
                                <Star className={`h-4 w-4 mr-2 ${property.isFeatured ? "fill-current" : ""}`} />
                                {toggleFeaturedMutation.isPending
                                    ? "Processando..."
                                    : property.isFeatured
                                        ? "Remover Destaque"
                                        : "Destacar"}
                            </Button>

                            <Button
                                variant="brown"
                                onClick={() => router.push(`/admin/properties/${propertyId}/edit`)}
                            >
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                            </Button>

                            <Button
                                variant="brown"
                                onClick={() => setOpenDeleteDialog(true)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                            </Button>
                        </div>
                    </div>

                    {/* Breadcrumb e Ver Todas */}
                    <div className="flex justify-between items-center py-4">
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

                    {/* Grid de imagens */}
                    {(() => {
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
                                        <MediaItem
                                            src={property.image}
                                            alt={property.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="border border-brown/10 col-span-3 row-span-2 overflow-hidden rounded-lg">
                                    {allImages[0] && (
                                        <MediaItem
                                            src={allImages[0].url}
                                            alt={`${property.title} - ${allImages[0].name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="border border-brown/10 col-span-3 overflow-hidden rounded-lg">
                                    {allImages[1] && (
                                        <MediaItem
                                            src={allImages[1].url}
                                            alt={`${property.title} - ${allImages[1].name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="border border-brown/10 col-span-3 overflow-hidden rounded-lg">
                                    {allImages[2] && (
                                        <MediaItem
                                            src={allImages[2].url}
                                            alt={`${property.title} - ${allImages[2].name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Informações do imóvel */}
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

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-6 order-2 lg:order-1 pt-4 md:pt-5 lg:pt-6">
                            <div
                                className="tiptap max-w-none break-words whitespace-pre-line"
                                style={{ wordBreak: "break-word", overflowWrap: "break-word", hyphens: "auto" }}
                                dangerouslySetInnerHTML={{ __html: property.description }} />
                            {property.deliveryDate && (
                                <div className="mt-4 px-4 bg-deaf border-l-3 border-brown">
                                    <h6 className="body-16-medium text-brown mb-2">Previsão de entrega:</h6>
                                    <p className="body-16-regular text-brown">{property.deliveryDate}</p>
                                </div>
                            )}
                            {property.paymentConditions && (
                                <div className="mt-4 px-4 bg-deaf border-l-3 border-brown">
                                    <h6 className="body-16-medium text-brown mb-2">Condições de Pagamento:</h6>
                                    <div className="tiptap body-16-regular text-brown" dangerouslySetInnerHTML={{ __html: property.paymentConditions }} />
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-5 lg:col-end-13 order-1 lg:order-2 lg:sticky lg:top-4 pt-4 md:pt-5 lg:pt-6 h-min">
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

            {/* Dialog de confirmação de exclusão */}
            <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="body-18-medium">Confirmar exclusão</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir a propriedade{" "}
                            <span className="font-semibold">{property.title}</span>? Esta ação
                            não pode ser desfeita.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="brown"
                            onClick={() => setOpenDeleteDialog(false)}
                            disabled={deleteMutation.isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="brown"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
