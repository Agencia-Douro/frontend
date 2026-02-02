import { LucideIcon } from "lucide-react";

interface ServicoCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function ServicoCard({ icon: Icon, title, description }: ServicoCardProps) {
    return (
        <div className="flex gap-6">
            <div className="flex flex-col gap-3">
                <div className="w-px bg-brown h-1/3"></div>
                <div className="w-px bg-brown/20 h-2/3"></div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    {/* <Icon className="size-5 text-brown" /> */}
                    <h3 className="body-18-medium text-black">{title}</h3>
                </div>
                <p className="body-16-regular text-black-muted">{description}</p>
            </div>
        </div>
    );
}

