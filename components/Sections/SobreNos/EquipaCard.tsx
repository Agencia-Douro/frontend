import { Mail, Phone } from "lucide-react";

interface EquipaCardProps {
    name: string;
    email: string;
    phone?: string;
}

export function EquipaCard({ name, email, phone }: EquipaCardProps) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                    <div className="w-px bg-brown h-1/3"></div>
                    <div className="w-px bg-brown/20 h-2/3"></div>
                </div>
                <div className="flex-1 space-y-2">
                    <div>
                        <h3 className="body-18-medium text-black">{name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4 text-gold" />
                            <p className="body-14-medium text-gold">{email}</p>
                        </div>
                    </div>
                    {phone && (
                        <div className="flex items-center gap-2 mt-2">
                            <Phone className="w-4 h-4 text-black-muted" />
                            <p className="body-16-regular text-black-muted">{phone}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}




