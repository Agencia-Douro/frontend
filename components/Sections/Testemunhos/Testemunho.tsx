import Image, { StaticImageData } from "next/image"
interface TestemunhoProps {
    image: StaticImageData
    name: string
    text: string
}

export default function Testemunho({text, image, name}: TestemunhoProps) {
    return (
        <div className="flex flex-col p-6 gap-5 min-w-[511px] bg-white">
            <div className="space-y-2">
                <Image src={image} alt="testemunho-image" width={32} height={32} />
                <p className="text-brown body-18-medium">{name}</p>
            </div>
            <p className="text-black-muted body-16-regular">{text}</p>
        </div>
    )
}