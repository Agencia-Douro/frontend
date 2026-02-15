import { Newsletter } from "@/types/newsletter"
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";

interface NewsletterCardProps {
    newsletter: Newsletter;
}

const localeMap: Record<string, string> = {
    pt: "pt-PT",
    en: "en-GB",
    fr: "fr-FR",
};

export default function NewsletterCard({ newsletter }: NewsletterCardProps) {
    const t = useTranslations("NewsletterDetails");
    const locale = useLocale();
    const dateLocale = localeMap[locale] || locale;

    return (
        <Link
            key={newsletter.id}
            href={`/newsletter/${newsletter.id}`}
            className="group">
            <article className="transition-all duration-200">
                <div className="relative w-full aspect-video overflow-hidden">
                    <Image src={newsletter.coverImage} alt={newsletter.title} fill className="object-cover" />
                </div>
                <div className="flex justify-between gap-2 items-center mt-4">
                    <p className="body-14-regular text-black-muted">
                        {new Date(newsletter.createdAt).toLocaleDateString(dateLocale, {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </p>
                    <p className="body-14-regular text-black-muted">{newsletter.readingTime} {t("readingTime")}</p>
                </div>
                <h3 className="body-20-medium text-brown mt-2">{newsletter.title}</h3>
            </article>
        </Link>
    )
}