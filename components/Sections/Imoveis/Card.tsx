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
}

export default function Card({ href, titulo, localizacao, preco, image, status }: CardProps) {
    return (
        <Link href={href} className="w-full h-full flex flex-col">
            <div className="relative">
                {isVideoUrl(image) ? (
                    <video
                        src={image}
                        className="h-40 w-full object-cover"
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <Image src={image} alt="Imóvel" width={294} height={160} className="h-40 w-full object-cover" />
                )}
                {status === "reserved" && (
                    <div className="bg-white text-black body-14-medium absolute bottom-2 right-2 py-1 px-1.5 z-10">
                        Reservado
                    </div>
                )}
            </div>
            <div className="mt-2 flex-1">
                <p className="body-16-medium text-black">{titulo}</p>
                <p className="body-14-medium text-grey mt-1">{localizacao}</p>
            </div>
            <p className="body-20-medium text-black mt-2">{formatPriceNumber(preco)}
                <span className="text-grey body-16-medium">€</span></p>
        </Link>
    )
}