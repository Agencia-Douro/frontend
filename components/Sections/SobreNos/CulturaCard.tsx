interface CulturaCardProps {
    title: string;
    description: string;
}

export function CulturaCard({ title, description }: CulturaCardProps) {
    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <div className="w-px bg-brown h-1/3"></div>
                <div className="w-px bg-brown/20 h-2/3"></div>
            </div>
            <div className="space-y-3 body-16-regular text-black-muted flex-1">
                <h3 className="body-18-medium text-black">{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}

