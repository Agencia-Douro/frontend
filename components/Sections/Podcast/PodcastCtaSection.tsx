"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PodcastCtaSectionProps {
    label: string;
    title: string;
    description: string;
    hint: string;
    buttonLabel: string;
    buttonAriaLabel: string;
}

export function PodcastCtaSection({
    label,
    title,
    description,
    hint,
    buttonLabel,
    buttonAriaLabel,
}: PodcastCtaSectionProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleContactClick = () => {
        const url = `${pathname}?assunto=podcast-participate#contacto`;
        router.replace(url);
        setTimeout(() => {
            document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <div className="max-w-3xl space-y-4 md:space-y-5 lg:space-y-6">
                <span className="button-14-medium text-brown block">{label}</span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
                <p className="text-black-muted md:body-18-regular body-16-regular leading-relaxed text-pretty">
                    {description}
                </p>
                <p className="body-14-regular text-black-muted text-pretty">
                    {hint}
                </p>
                <div className="pt-2">
                    <Button
                        type="button"
                        variant="brown"
                        className="w-fit px-6 py-3 transition-colors duration-200"
                        onClick={handleContactClick}
                        aria-label={buttonAriaLabel}
                    >
                        {buttonLabel}
                    </Button>
                </div>
            </div>
        </section>
    );
}
