import Image from "next/image";

interface EquipaCardProps {
    name: string;
    role: string;
    description?: string;
    image?: string;
}

export function EquipaCard({ name, role, description, image }: EquipaCardProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                    <div className="w-px bg-brown h-1/3"></div>
                    <div className="w-px bg-brown/20 h-2/3"></div>
                </div>
                <div className="flex-1 space-y-2">
                    {image && (
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-200">
                            <Image
                                src={image}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                    <div>
                        <h3 className="body-18-medium text-black">{name}</h3>
                        <p className="body-14-medium text-gold mt-1">{role}</p>
                    </div>
                    {description && (
                        <p className="body-16-regular text-black-muted mt-2">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

