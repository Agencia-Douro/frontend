"use client";

import Image, { StaticImageData } from "next/image"
import { useTranslations } from "next-intl";

interface TestemunhoProps {
    image: StaticImageData
    name: string
    text: string
}

export default function Testemunho({text, image, name}: TestemunhoProps) {
    const t = useTranslations("Testemunhos");
    return (
        <div className="flex flex-col p-6 gap-5 min-w-[85%] md:min-w-[511px] bg-deaf">
            <div className="space-y-2">
                <Image src={image} alt={t("imageAlt")} width={32} height={32} />
                <p className="text-brown body-18-medium">{name}</p>
            </div>
            <p className="text-black-muted body-16-regular">{text}</p>
        </div>
    )
}