"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { newslettersApi } from "@/services/api";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function NewsletterDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: newsletter, isLoading, error } = useQuery({
        queryKey: ["newsletter", id],
        queryFn: () => newslettersApi.getById(id),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <>
                <section className="bg-deaf">
                    <div className="container pb-16 pt-20">
                        <div className="max-w-3xl mx-auto">
                            <p className="text-center text-brown">Carregando newsletter...</p>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    if (error || !newsletter) {
        return (
            <>
                <section className="bg-deaf">
                    <div className="container pb-16 pt-20">
                        <div className="max-w-3xl mx-auto">
                            <p className="text-center text-red">Newsletter não encontrada</p>
                            <div className="text-center mt-6">
                                <Link href="/newsletter" className="body-16-medium text-brown hover:text-gold transition-colors">
                                    ← Voltar para newsletters
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    return (
        <>
            <section className="bg-deaf">
                <div className="container pt-10">
                    <div>
                        <div className="relative flex items-center">
                            <Link
                                href="/newsletter"
                                className="inline-flex items-center gap-2 body-14-medium text-brown hover:text-gold transition-colors mb-8"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path
                                        d="M5.16725 9.12965L2.19555 5.80428L5.16336 2.5M2 5.81495H11.0427C12.676 5.81495 14 7.31142 14 9.1575C14 11.0035 12.676 12.5 11.0427 12.5H7.38875"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                </svg>
                                Voltar
                            </Link>

                            <div className="absolute left-1/2 -translate-x-1/2 bg-[#ECE7E3] p-3">
                                <h1 className="capitalize body-16-medium">
                                    {newsletter.category}
                                </h1>
                            </div>
                        </div>


                        {/* Title */}
                        <h1 className="heading-tres-regular flex justify-center mt-10 mb-10">
                            {newsletter.title}
                        </h1>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-brown/10">
                            <span className="body-14-regular">
                                {new Date(newsletter.createdAt).toLocaleDateString('pt-PT', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </span>
                            <div className="w-1 h-1 rounded-full"></div>
                            <span className="body-14-regular">
                                {newsletter.readingTime} min de leitura
                            </span>
                        </div>

                        {/* Content */}
                        <article className="mb-10">
                            <div
                                className="prose prose-brown max-w-none"
                                dangerouslySetInnerHTML={{ __html: newsletter.content }}
                            />
                        </article>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
