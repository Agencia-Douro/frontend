interface StatCardProps {
    value: string;
    label: string;
}

export function StatCard({ value, label }: StatCardProps) {
    return (
        <div className="flex gap-8">
            <div className="flex flex-col gap-3">
                <div className="w-px bg-brown h-1/3"></div>
                <div className="w-px bg-brown/20 h-2/3"></div>
            </div>
            <div>
                <div className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-brown mb-1">
                    {value}
                </div>
                <p className="body-16-medium text-brown">
                    {label}
                </p>
            </div>
        </div>
    );
}

