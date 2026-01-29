"use client"

import Image from "next/image"
import { Property } from "@/types/property"
import { cn } from "@/lib/utils"
import { TIPOS_IMOVEL } from "@/app/shared/distritos"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

interface CardsProps {
    properties: Property[]
    className?: string
    locale: string
}

export default function Cards({ properties, className, locale }: CardsProps) {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [startIndex, setStartIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("ImoveisDestacados");
    const tPropertyTypes = useTranslations("PropertyTypes");

    // Determinar se deve usar layout de scroll horizontal (>3 imóveis)
    const hasMoreThanThree = properties.length > 3;

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Ajustar startIndex quando mudar de mobile para desktop ou vice-versa
    useEffect(() => {
        const currentMaxIndex = hasMoreThanThree
            ? isMobile
                ? properties.length - 1
                : properties.length - 3
            : 0;

        if (startIndex > currentMaxIndex) {
            setStartIndex(currentMaxIndex);
        }
    }, [isMobile, properties.length, hasMoreThanThree, startIndex]);

    if (properties.length === 0) {
        return (
            <div className="mt-8 text-center">
                <p className="text-medium text-black-muted">{t("noProperties")}</p>
            </div>
        )
    }

    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price)
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0
        }).format(numPrice)
    }

    const getAreaDisplay = (property: Property) => {
        const area = property.totalArea || property.builtArea || property.usefulArea
        return area ? `${area}m²` : t("notAvailable")
    }

    const getPropertyTypeLabel = (propertyType: string) => {
        const tipo = TIPOS_IMOVEL.find(t => t.value === propertyType)
        return tipo ? tPropertyTypes(tipo.labelKey) : propertyType
    }

    // No mobile mostra 1 card por vez, no desktop mostra 3
    const maxStartIndex = hasMoreThanThree
        ? isMobile
            ? properties.length - 1
            : properties.length - 3
        : 0
    const isAtStart = startIndex === 0
    const isAtEnd = startIndex >= maxStartIndex

    // Funções de navegação do slider
    const goToPrevious = () => {
        if (startIndex > 0 && !isAnimating) {
            setIsAnimating(true);
            setStartIndex(startIndex - 1);
            setTimeout(() => {
                setIsAnimating(false);
            }, 500); // Duração da animação (duration-500)
        }
    };

    const goToNext = () => {
        if (startIndex < maxStartIndex && !isAnimating) {
            setIsAnimating(true);
            setStartIndex(startIndex + 1);
            setTimeout(() => {
                setIsAnimating(false);
            }, 500); // Duração da animação (duration-500)
        }
    };

    // Calcular o translateX baseado no índice atual
    // Mobile: cada card tem 100% de largura + gap de 1rem
    // Desktop: cada card tem calc((100% - 2rem) / 3) de largura + gap de 1rem
    const translateX = hasMoreThanThree
        ? isMobile
            ? `calc(-${startIndex} * (100% + 1rem))`
            : `calc(-${startIndex} * ((100% - 2rem) / 3 + 1rem))`
        : '0%'

    return (
        <>
            <div className="mt-8 relative">
                {/* Container wrapper com overflow hidden quando >3 */}
                <div
                    className={cn(
                        hasMoreThanThree && [
                            "overflow-hidden",
                            "w-full"
                        ]
                    )}
                >
                    {/* Container dos cards com animação */}
                    <div
                        ref={scrollContainerRef}
                        className={cn(
                            "flex items-center gap-4",
                            hasMoreThanThree && [
                                "flex-nowrap",
                                "transition-transform",
                                "duration-500",
                                "ease-in-out"
                            ]
                        )}
                        style={hasMoreThanThree ? {
                            transform: `translateX(${translateX})`,
                        } : undefined}
                    >
                        {properties.map((property, index) => {
                            return (
                                <div
                                    key={property.id}
                                    className={cn(
                                        "bg-white",
                                        // Largura: full quando ≤3, 1/3 quando >3 (com gap)
                                        hasMoreThanThree ? "shrink-0 w-full md:w-[calc((100%-2rem)/3)]" : "w-full",
                                        // Margens condicionais apenas quando ≤3
                                        !hasMoreThanThree && [
                                            index === 0 && 'lg:mb-16',
                                            index === 1 && 'lg:mt-16',
                                            index === 2 && 'lg:mb-16'
                                        ],
                                        className
                                    )}
                                >
                        <article onClick={() => setSelectedProperty(property)}>
                            <div className="card-image-overlay h-64 xl:h-93 relative">
                                {property.image && (
                                    isVideoUrl(property.image) ? (
                                        <video
                                            src={property.image}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <Image
                                            src={property.image}
                                            alt={`${t("propertyIn")} ${property.concelho}`}
                                            fill
                                            className="object-cover" />
                                    )
                                )}
                                <div className="bg-white text-black body-14-medium absolute bottom-2 right-2 py-1 px-1.5 z-10">
                                    {property.isEmpreendimento ? t("development") : getPropertyTypeLabel(property.propertyType)}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 py-3 px-4">
                                <div className="flex justify-between text-black body-18-medium">
                                    <p>{property.concelho}</p>
                                    <p>{formatPrice(property.price)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="flex gap-1.5 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold">
                                            <path d="M18 18H2V2H18V18ZM2.66667 17.3333H17.3333V2.66667H2.66667V17.3333Z" fill="currentColor" />
                                            <path d="M11.3333 15.3333H4.8V8.73333H5.46667V14.6667H11.3333V15.3333Z" fill="currentColor" />
                                            <path d="M6 10.0667L5.06667 9.2L4.2 10.0667L3.73333 9.6L5.06667 8.26667L6.46667 9.6L6 10.0667Z" fill="currentColor" />
                                            <path d="M10.5333 16.3333L10.0667 15.8667L10.9333 15L10.0667 14.1333L10.5333 13.6667L11.8667 15L10.5333 16.3333Z" fill="currentColor" />
                                        </svg>
                                        <p className="body-14-medium whitespace-nowrap">{getAreaDisplay(property)} {t("area")}</p>
                                    </div>
                                    <div className="flex gap-1.5 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold">
                                            <path d="M4.33333 10.1333V3.6C4.33333 3.06667 4.8 2.66667 5.33333 2.66667C5.86667 2.66667 6.33333 3.06667 6.33333 3.6V3.8H5.66667V4.46667H7.66667V3.8H7V3.6C7 2.73333 6.26667 2 5.33333 2C4.4 2 3.66667 2.73333 3.66667 3.6V10.1333H2V12L2.26667 12.1333C2.53333 12.2667 2.66667 12.5333 2.66667 12.8V14.8C2.66667 16.0667 3.73333 17.1333 5 17.1333V18H5.66667V17.2H14.3333V18H15V17.2C16.2667 17.2 17.3333 16.1333 17.3333 14.8667V12.8667C17.3333 12.6 17.4667 12.3333 17.7333 12.2L18 12.0667V10.2L4.33333 10.1333ZM16.6667 14.8C16.6667 15.7333 15.9333 16.4667 15 16.4667H5C4.06667 16.4667 3.33333 15.7333 3.33333 14.8V12.8C3.33333 12.5333 3.26667 12.3333 3.2 12.1333H13V11.4667H2.66667V10.8H17.3333V11.4667H15V12.1333H16.8C16.6667 12.3333 16.6667 12.5333 16.6667 12.8V14.8Z" fill="currentColor" />
                                            <path d="M7 5.2H6.33333V5.86667H7V5.2Z" fill="currentColor" />
                                            <path d="M7.66667 6.13333H7V6.8H7.66667V6.13333Z" fill="currentColor" />
                                            <path d="M6.33333 6.13333H5.66667V6.8H6.33333V6.13333Z" fill="currentColor" />
                                            <path d="M5.66667 7.2H5V7.86667H5.66667V7.2Z" fill="currentColor" />
                                            <path d="M8.33333 7.2H7.66667V7.86667H8.33333V7.2Z" fill="currentColor" />
                                            <path d="M7 7.2H6.33333V7.86667H7V7.2Z" fill="currentColor" />
                                            <path d="M12.3333 4.53333V8.53333H16.3333V4.53333H17V3.86667H16.2667C16.1333 3.46667 15.7333 3.2 15.3333 3.2H12.6667C12.2 3.2 11.8667 3.46667 11.7333 3.86667H11V4.53333H12.3333ZM12.6667 3.86667H15.3333C15.5333 3.86667 15.6667 4 15.6667 4.2V7.86667H13V4.4C13 4.13333 12.8 3.93333 12.6 3.86667C12.6 3.86667 12.6 3.86667 12.6667 3.86667Z" fill="currentColor" />
                                        </svg>
                                        <p className="body-14-medium whitespace-nowrap">{property.bathrooms} {property.bathrooms === 1 ? t("bathroom") : t("bathrooms")}</p>
                                    </div>
                                    <div className="flex gap-1.5 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold">
                                            <path d="M17.3333 11.2335L17.0667 10.0462C17 9.71639 16.7333 9.45253 16.4667 9.32061L15.8 6.6821C15.7333 6.28632 15.4 6.02247 15 5.9565V5.23091C14.9333 4.76917 14.5333 4.30743 14 4.30743H11.3333C10.8 4.30743 10.3333 4.76917 10.3333 5.29688V5.9565H9.66667V5.29688C9.6 4.76917 9.2 4.30743 8.66667 4.30743H6C5.46667 4.30743 5.06667 4.76917 5 5.29688V5.9565C4.6 6.02247 4.33333 6.28632 4.2 6.6821L3.53333 9.32061C3.26667 9.45253 3 9.71639 2.93333 10.0462L2.66667 11.2335H2V17.5H5.6L5.93333 16.1807H14.0667L14.4 17.5H18V11.2335H17.3333ZM11.3333 4.96706H13.9333C14.1333 4.96706 14.2667 5.16495 14.3333 5.29688V6.61613C14.3333 6.74806 14.1333 6.94595 14 6.94595H11.4C11.2 6.94595 11.0667 6.74806 11 6.61613V5.36284C11 5.16495 11.2 4.96706 11.3333 4.96706ZM6 4.96706H8.6C8.8 4.96706 8.93333 5.16495 9 5.29688V6.61613C9 6.74806 8.8 6.94595 8.66667 6.94595H6.06667C5.86667 6.94595 5.66667 6.74806 5.66667 6.61613V5.36284C5.66667 5.16495 5.86667 4.96706 6 4.96706ZM4.86667 6.87998C4.86667 6.81402 4.93333 6.74806 5 6.6821C5.06667 7.14384 5.53333 7.60558 6 7.60558H8.66667C9.2 7.60558 9.66667 7.14384 9.66667 6.61613H10.3333C10.4 7.14384 10.8 7.60558 11.3333 7.60558H14C14.5333 7.60558 14.9333 7.14384 15 6.6821C15.0667 6.74806 15.1333 6.81402 15.1333 6.87998L15.7333 9.25465H4.26667L4.86667 6.87998ZM3.6 10.2441C3.66667 10.0462 3.8 9.91427 4 9.91427H16C16.2 9.91427 16.3333 10.0462 16.4 10.2441L16.6667 11.2335H3.33333L3.6 10.2441ZM17.3333 16.8404H14.9333L14.8 16.1807H16.4V15.5211H3.66667V16.1807H5.26667L5.13333 16.8404H2.66667V11.8932H17.3333V16.8404Z" fill="currentColor" />
                                            <path d="M3.66604 3.15963H16.3327V8.10684H16.9994V2.5H2.99938V8.10684H3.66604V3.15963Z" fill="currentColor" />
                                        </svg>
                                        <p className="body-14-medium whitespace-nowrap">{property.bedrooms} {property.bedrooms === 1 ? t("bedroom") : t("bedrooms")}</p>
                                    </div>
                                    <div className="flex gap-1.5 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold">
                                            <path d="M10 14.437V13.7647H15.2V11.2773C15.2 10.9412 14.9333 10.6723 14.6 10.6723H14.4L12.8667 7.17647H10V6.5042H13.3333L14.8667 10C15.4667 10.1345 15.9333 10.605 15.9333 11.2773V14.437H10Z" fill="currentColor" />
                                            <path d="M13.9333 16.3866H13.2C12.7333 16.3866 12.3333 15.9832 12.3333 15.5798V14.1681H13V15.5798C13 15.6471 13.0667 15.7143 13.2 15.7143H13.9333C14.0667 15.7143 14.1333 15.6471 14.1333 15.5798V14.1681H14.8V15.5798C14.8667 15.9832 14.4667 16.3866 13.9333 16.3866Z" fill="currentColor" />
                                            <path d="M10 14.437H4.13333V11.2773C4.13333 10.6723 4.6 10.1345 5.2 10L6.66667 6.5042H10V7.17647H7.13333L5.6 10.6723H5.4C5.06667 10.6723 4.8 10.9412 4.8 11.2773V13.7647H10V14.437Z" fill="currentColor" />
                                            <path d="M6.8 16.3866H6.06667C5.6 16.3866 5.2 15.9832 5.2 15.5798V14.1681H5.86667V15.5798C5.86667 15.6471 5.93333 15.7143 6.06667 15.7143H6.8C6.93333 15.7143 7 15.6471 7 15.5798V14.1681H7.66667V15.5798C7.66667 15.9832 7.26667 16.3866 6.8 16.3866Z" fill="currentColor" />
                                            <path d="M13.4667 13.4286C12.8 13.4286 12.2667 12.8908 12.2667 12.2185C12.2667 11.5462 12.8 11.0084 13.4667 11.0084C14.1333 11.0084 14.6667 11.5462 14.6667 12.2185C14.6 12.8908 14.0667 13.4286 13.4667 13.4286ZM13.4667 11.7479C13.2 11.7479 12.9333 11.9496 12.9333 12.2857C12.9333 12.6218 13.1333 12.8235 13.4667 12.8235C13.8 12.8235 14 12.6218 14 12.2857C14 11.9496 13.7333 11.7479 13.4667 11.7479Z" fill="currentColor" />
                                            <path d="M11.7333 11.3445H8.26667V12.0168H11.7333V11.3445Z" fill="currentColor" />
                                            <path d="M11.7333 12.4874H8.26667V13.1597H11.7333V12.4874Z" fill="currentColor" />
                                            <path d="M6.53333 13.4286C5.86667 13.4286 5.33333 12.8908 5.33333 12.2185C5.33333 11.5462 5.86667 11.0084 6.53333 11.0084C7.2 11.0084 7.73333 11.5462 7.73333 12.2185C7.73333 12.8908 7.2 13.4286 6.53333 13.4286ZM6.53333 11.7479C6.26667 11.7479 6 11.9496 6 12.2857C6 12.6218 6.2 12.8235 6.53333 12.8235C6.86667 12.8235 7.06667 12.6218 7.06667 12.2857C7.06667 11.9496 6.86667 11.7479 6.53333 11.7479Z" fill="currentColor" />
                                            <path d="M14.6667 10H5.46667V10.6723H14.6667V10Z" fill="currentColor" />
                                            <path d="M18 18H2V7.2437L10 2L18 7.2437V18ZM2.66667 17.3277H17.3333V7.57983L10 2.7395L2.66667 7.57983V17.3277Z" fill="currentColor" />
                                        </svg>
                                        <p className="body-14-medium whitespace-nowrap">{property.garageSpaces} {property.garageSpaces === 1 ? t("garageSpace") : t("garageSpaces")}</p>
                                    </div>
                                </div>
                            </div>
                            </article>
                        </div>
                    );
                    })}
                    </div>
                </div>

                {/* Botões de navegação - apenas quando >3 */}
                {hasMoreThanThree && (
                    <div className="flex gap-2 items-center justify-end mt-4">
                        <Button
                            variant="icon-brown"
                            size="icon"
                            onClick={goToPrevious}
                            disabled={isAtStart}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold group-hover:text-white">
                                <path d="M6.52692 9.16658L10.9969 4.69657L9.81842 3.51807L3.33659 9.99992L9.81842 16.4817L10.9969 15.3032L6.52692 10.8332H16.6699V9.16658H6.52692Z" fill="currentColor" />
                            </svg>
                        </Button>
                        <Button
                            variant="icon-brown"
                            size="icon"
                            onClick={goToNext}
                            disabled={isAtEnd}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold group-hover:text-white">
                                <path d="M13.4731 9.16658L9.00308 4.69657L10.1816 3.51807L16.6634 9.99992L10.1816 16.4817L9.00308 15.3032L13.4731 10.8332H3.33008V9.16658H13.4731Z" fill="currentColor" />
                            </svg>
                        </Button>
                    </div>
                )}
            </div>

            <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="body-20-medium">
                            {selectedProperty?.title}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedProperty && (
                        <div className="flex flex-col gap-4">
                            <div className="relative h-80 w-full">
                                {selectedProperty.image && (
                                    isVideoUrl(selectedProperty.image) ? (
                                        <video
                                            src={selectedProperty.image}
                                            className="w-full h-full object-cover rounded-md"
                                            muted
                                            loop
                                            playsInline
                                            autoPlay
                                        />
                                    ) : (
                                        <Image
                                            src={selectedProperty.image}
                                            alt={`${t("propertyIn")} ${selectedProperty.concelho}`}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    )
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="body-16-medium">{formatPrice(selectedProperty.price)}</p>
                                <div className="bg-gold text-white body-14-medium p-2">
                                    {selectedProperty?.isEmpreendimento ? t("development") : getPropertyTypeLabel(selectedProperty?.propertyType)}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-gold">
                                        <path d="M18 18H2V2H18V18ZM2.66667 17.3333H17.3333V2.66667H2.66667V17.3333Z" fill="currentColor" />
                                        <path d="M11.3333 15.3333H4.8V8.73333H5.46667V14.6667H11.3333V15.3333Z" fill="currentColor" />
                                        <path d="M6 10.0667L5.06667 9.2L4.2 10.0667L3.73333 9.6L5.06667 8.26667L6.46667 9.6L6 10.0667Z" fill="currentColor" />
                                        <path d="M10.5333 16.3333L10.0667 15.8667L10.9333 15L10.0667 14.1333L10.5333 13.6667L11.8667 15L10.5333 16.3333Z" fill="currentColor" />
                                    </svg>
                                    <p className="text-base">{getAreaDisplay(selectedProperty)} {t("area")}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-gold">
                                        <path d="M17.3333 11.2335L17.0667 10.0462C17 9.71639 16.7333 9.45253 16.4667 9.32061L15.8 6.6821C15.7333 6.28632 15.4 6.02247 15 5.9565V5.23091C14.9333 4.76917 14.5333 4.30743 14 4.30743H11.3333C10.8 4.30743 10.3333 4.76917 10.3333 5.29688V5.9565H9.66667V5.29688C9.6 4.76917 9.2 4.30743 8.66667 4.30743H6C5.46667 4.30743 5.06667 4.76917 5 5.29688V5.9565C4.6 6.02247 4.33333 6.28632 4.2 6.6821L3.53333 9.32061C3.26667 9.45253 3 9.71639 2.93333 10.0462L2.66667 11.2335H2V17.5H5.6L5.93333 16.1807H14.0667L14.4 17.5H18V11.2335H17.3333ZM11.3333 4.96706H13.9333C14.1333 4.96706 14.2667 5.16495 14.3333 5.29688V6.61613C14.3333 6.74806 14.1333 6.94595 14 6.94595H11.4C11.2 6.94595 11.0667 6.74806 11 6.61613V5.36284C11 5.16495 11.2 4.96706 11.3333 4.96706ZM6 4.96706H8.6C8.8 4.96706 8.93333 5.16495 9 5.29688V6.61613C9 6.74806 8.8 6.94595 8.66667 6.94595H6.06667C5.86667 6.94595 5.66667 6.74806 5.66667 6.61613V5.36284C5.66667 5.16495 5.86667 4.96706 6 4.96706ZM4.86667 6.87998C4.86667 6.81402 4.93333 6.74806 5 6.6821C5.06667 7.14384 5.53333 7.60558 6 7.60558H8.66667C9.2 7.60558 9.66667 7.14384 9.66667 6.61613H10.3333C10.4 7.14384 10.8 7.60558 11.3333 7.60558H14C14.5333 7.60558 14.9333 7.14384 15 6.6821C15.0667 6.74806 15.1333 6.81402 15.1333 6.87998L15.7333 9.25465H4.26667L4.86667 6.87998ZM3.6 10.2441C3.66667 10.0462 3.8 9.91427 4 9.91427H16C16.2 9.91427 16.3333 10.0462 16.4 10.2441L16.6667 11.2335H3.33333L3.6 10.2441ZM17.3333 16.8404H14.9333L14.8 16.1807H16.4V15.5211H3.66667V16.1807H5.26667L5.13333 16.8404H2.66667V11.8932H17.3333V16.8404Z" fill="currentColor" />
                                        <path d="M3.66604 3.15963H16.3327V8.10684H16.9994V2.5H2.99938V8.10684H3.66604V3.15963Z" fill="currentColor" />
                                    </svg>
                                    <p className="text-base">{selectedProperty.bedrooms} {selectedProperty.bedrooms === 1 ? t("bedroom") : t("bedrooms")}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-gold">
                                        <path d="M4.33333 10.1333V3.6C4.33333 3.06667 4.8 2.66667 5.33333 2.66667C5.86667 2.66667 6.33333 3.06667 6.33333 3.6V3.8H5.66667V4.46667H7.66667V3.8H7V3.6C7 2.73333 6.26667 2 5.33333 2C4.4 2 3.66667 2.73333 3.66667 3.6V10.1333H2V12L2.26667 12.1333C2.53333 12.2667 2.66667 12.5333 2.66667 12.8V14.8C2.66667 16.0667 3.73333 17.1333 5 17.1333V18H5.66667V17.2H14.3333V18H15V17.2C16.2667 17.2 17.3333 16.1333 17.3333 14.8667V12.8667C17.3333 12.6 17.4667 12.3333 17.7333 12.2L18 12.0667V10.2L4.33333 10.1333ZM16.6667 14.8C16.6667 15.7333 15.9333 16.4667 15 16.4667H5C4.06667 16.4667 3.33333 15.7333 3.33333 14.8V12.8C3.33333 12.5333 3.26667 12.3333 3.2 12.1333H13V11.4667H2.66667V10.8H17.3333V11.4667H15V12.1333H16.8C16.6667 12.3333 16.6667 12.5333 16.6667 12.8V14.8Z" fill="currentColor" />
                                        <path d="M7 5.2H6.33333V5.86667H7V5.2Z" fill="currentColor" />
                                        <path d="M7.66667 6.13333H7V6.8H7.66667V6.13333Z" fill="currentColor" />
                                        <path d="M6.33333 6.13333H5.66667V6.8H6.33333V6.13333Z" fill="currentColor" />
                                        <path d="M5.66667 7.2H5V7.86667H5.66667V7.2Z" fill="currentColor" />
                                        <path d="M8.33333 7.2H7.66667V7.86667H8.33333V7.2Z" fill="currentColor" />
                                        <path d="M7 7.2H6.33333V7.86667H7V7.2Z" fill="currentColor" />
                                        <path d="M12.3333 4.53333V8.53333H16.3333V4.53333H17V3.86667H16.2667C16.1333 3.46667 15.7333 3.2 15.3333 3.2H12.6667C12.2 3.2 11.8667 3.46667 11.7333 3.86667H11V4.53333H12.3333ZM12.6667 3.86667H15.3333C15.5333 3.86667 15.6667 4 15.6667 4.2V7.86667H13V4.4C13 4.13333 12.8 3.93333 12.6 3.86667C12.6 3.86667 12.6 3.86667 12.6667 3.86667Z" fill="currentColor" />
                                    </svg>
                                    <p className="text-base">{selectedProperty.bathrooms} {selectedProperty.bathrooms === 1 ? t("bathroom") : t("bathrooms")}</p>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none" className="text-gold">
                                        <path d="M10 14.437V13.7647H15.2V11.2773C15.2 10.9412 14.9333 10.6723 14.6 10.6723H14.4L12.8667 7.17647H10V6.5042H13.3333L14.8667 10C15.4667 10.1345 15.9333 10.605 15.9333 11.2773V14.437H10Z" fill="currentColor" />
                                        <path d="M13.9333 16.3866H13.2C12.7333 16.3866 12.3333 15.9832 12.3333 15.5798V14.1681H13V15.5798C13 15.6471 13.0667 15.7143 13.2 15.7143H13.9333C14.0667 15.7143 14.1333 15.6471 14.1333 15.5798V14.1681H14.8V15.5798C14.8667 15.9832 14.4667 16.3866 13.9333 16.3866Z" fill="currentColor" />
                                        <path d="M10 14.437H4.13333V11.2773C4.13333 10.6723 4.6 10.1345 5.2 10L6.66667 6.5042H10V7.17647H7.13333L5.6 10.6723H5.4C5.06667 10.6723 4.8 10.9412 4.8 11.2773V13.7647H10V14.437Z" fill="currentColor" />
                                        <path d="M6.8 16.3866H6.06667C5.6 16.3866 5.2 15.9832 5.2 15.5798V14.1681H5.86667V15.5798C5.86667 15.6471 5.93333 15.7143 6.06667 15.7143H6.8C6.93333 15.7143 7 15.6471 7 15.5798V14.1681H7.66667V15.5798C7.66667 15.9832 7.26667 16.3866 6.8 16.3866Z" fill="currentColor" />
                                        <path d="M13.4667 13.4286C12.8 13.4286 12.2667 12.8908 12.2667 12.2185C12.2667 11.5462 12.8 11.0084 13.4667 11.0084C14.1333 11.0084 14.6667 11.5462 14.6667 12.2185C14.6 12.8908 14.0667 13.4286 13.4667 13.4286ZM13.4667 11.7479C13.2 11.7479 12.9333 11.9496 12.9333 12.2857C12.9333 12.6218 13.1333 12.8235 13.4667 12.8235C13.8 12.8235 14 12.6218 14 12.2857C14 11.9496 13.7333 11.7479 13.4667 11.7479Z" fill="currentColor" />
                                        <path d="M11.7333 11.3445H8.26667V12.0168H11.7333V11.3445Z" fill="currentColor" />
                                        <path d="M11.7333 12.4874H8.26667V13.1597H11.7333V12.4874Z" fill="currentColor" />
                                        <path d="M6.53333 13.4286C5.86667 13.4286 5.33333 12.8908 5.33333 12.2185C5.33333 11.5462 5.86667 11.0084 6.53333 11.0084C7.2 11.0084 7.73333 11.5462 7.73333 12.2185C7.73333 12.8908 7.2 13.4286 6.53333 13.4286ZM6.53333 11.7479C6.26667 11.7479 6 11.9496 6 12.2857C6 12.6218 6.2 12.8235 6.53333 12.8235C6.86667 12.8235 7.06667 12.6218 7.06667 12.2857C7.06667 11.9496 6.86667 11.7479 6.53333 11.7479Z" fill="currentColor" />
                                        <path d="M14.6667 10H5.46667V10.6723H14.6667V10Z" fill="currentColor" />
                                        <path d="M18 18H2V7.2437L10 2L18 7.2437V18ZM2.66667 17.3277H17.3333V7.57983L10 2.7395L2.66667 7.57983V17.3277Z" fill="currentColor" />
                                    </svg>
                                    <p className="text-base">{selectedProperty.garageSpaces} {selectedProperty.garageSpaces === 1 ? t("garageSpace") : t("garageSpaces")}</p>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-2">
                                <Button
                                    variant="gold"
                                    className="flex-1"
                                    onClick={() => {
                                        window.location.href = `/${locale}/imoveis/${selectedProperty.id}`
                                    }}
                                >
                                    {t("viewFullPage")}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}