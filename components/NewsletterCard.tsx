import { Newsletter } from "@/types/newsletter"
import Image from "next/image";
import Link from "next/link";

interface NewsletterCardProps {
    newsletter: Newsletter;
}

export default function NewsletterCard({ newsletter }: NewsletterCardProps) {
    return (
        <Link
            key={newsletter.id}
            href={`/newsletter/${newsletter.id}`}
            className="group">
            <article className="transition-all duration-200">
                <Image src={newsletter.coverImage} alt={newsletter.title} width={294} height={160} className="w-full h-64 md:h-40 object-cover" />
                <p className="body-14-regular text-black-muted mt-4">
                    {new Date(newsletter.createdAt).toLocaleDateString('pt-PT', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    })}
                </p>
                <h3 className="body-20-medium text-brown">{newsletter.title}</h3>
            </article>
        </Link>
    )
}