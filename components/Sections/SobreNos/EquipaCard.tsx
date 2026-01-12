import { Mail, Phone } from "lucide-react";
import Image from "next/image";

interface EquipaCardProps {
    name: string;
    email: string;
    phone?: string;
    photo?: string;
}

export function EquipaCard({ name, email, phone, photo }: EquipaCardProps) {
    // Limpar o número de telefone para o WhatsApp (remover espaços e caracteres especiais)
    const whatsappNumber = phone?.replace(/\s+/g, '').replace(/[^0-9+]/g, '');

    return (
        <div className="flex flex-col gap-4">
            {photo && (
                <div className="w-32 h-32 relative overflow-hidden rounded-lg">
                    <Image
                        src={photo}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                    <div className="w-px bg-brown h-1/3"></div>
                    <div className="w-px bg-brown/20 h-2/3"></div>
                </div>
                <div className="flex-1 space-y-2">
                    <div>
                        <h3 className="body-18-medium text-black">{name}</h3>
                        <a
                            href={`mailto:${email}`}
                            className="flex items-center gap-2 mt-1 hover:opacity-80 transition-opacity"
                        >
                            <Mail className="w-4 h-4 text-gold" />
                            <p className="body-14-medium text-gold">{email}</p>
                        </a>
                    </div>
                    {phone && whatsappNumber && (
                        <a
                            href={`https://wa.me/${whatsappNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 mt-2 hover:opacity-80 transition-opacity"
                        >
                            <Phone className="w-4 h-4 text-black-muted" />
                            <p className="body-16-regular text-black-muted">{phone}</p>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}






