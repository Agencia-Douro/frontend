import Image from "next/image"
import Link from "next/link"
import { formatPriceNumber } from "@/lib/currency"

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

interface CardProps {
    href: string
    titulo: string
    localizacao: string
    preco: string
    image: string
    status?: string
    locale?: string
}

export default function Card({ href, titulo, localizacao, preco, image, status, locale }: CardProps) {
    return (
        <Link href={locale ? `/${locale}/${href}` : href} className="w-full h-full flex flex-col">
            <div className="relative h-40">
                {isVideoUrl(image) ? (
                    <video
                        src={image}
                        className="absolute inset-0 size-full object-cover"
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <Image src={image} alt={titulo} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
                )}
                {status === "reserved" && (
                    <div className="bg-white text-black body-14-medium absolute bottom-2 right-2 py-1 px-1.5 z-10">
                        Reservado
                    </div>
                )}
            </div>
            <div className="mt-2 flex-1 min-w-0">
                <p className="body-16-medium text-black line-clamp-1">{titulo}</p>
                <p className="body-14-medium text-grey mt-1 truncate">{localizacao}</p>
            </div>
            <p className="body-20-medium text-black mt-2">{formatPriceNumber(preco)}
                <span className="text-grey body-16-medium">€</span></p>
        </Link>
    )
}