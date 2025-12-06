import Image from "next/image"
import Link from "next/link"
import { formatPriceNumber } from "@/lib/currency"

interface CardProps {
    href: string
    titulo: string
    localizacao: string
    preco: string
    image: string
}

export default function Card({ href, titulo, localizacao, preco, image }: CardProps) {
    return (
        <Link href={href} className="w-full">
            <Image src={image} alt="Imóvel" width={294} height={160} className="h-40" />
            <div className="mt-2">
                <p className="body-16-medium text-black">{titulo}</p>
                <p className="body-14-medium text-grey mt-1">{localizacao}</p>
            </div>
            <p className="body-20-medium text-black mt-2">{formatPriceNumber(preco)}
                <span className="text-grey body-16-medium">€</span></p>
        </Link>
    )
}