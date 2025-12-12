"use client";

import { useQuery } from "@tanstack/react-query";
import { newslettersApi } from "@/services/api";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function NewsletterPage() {
    const { data: newsletters, isLoading, error } = useQuery({
        queryKey: ["newsletters"],
        queryFn: () => newslettersApi.getAll(),
    });

    return (
        <>
            <section className="bg-deaf">
                <div className="container pb-16 pt-20">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="heading-dois-medium text-brown text-center mb-4">
                            Newsletter
                        </h1>
                        <p className="body-18-regular text-black-muted text-center mb-12">
                            Fique por dentro das últimas novidades do mercado imobiliário
                        </p>

                        {isLoading && (
                            <div className="text-center py-12">
                                <p className="body-16-regular text-brown">Carregando newsletters...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-12">
                                <p className="body-16-regular text-red">Erro ao carregar newsletters</p>
                            </div>
                        )}

                        {!isLoading && !error && newsletters && newsletters.length === 0 && (
                            <div className="text-center py-12">
                                <p className="body-16-regular text-brown/50">Nenhuma newsletter disponível</p>
                            </div>
                        )}

                        {!isLoading && !error && newsletters && newsletters.length > 0 && (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {newsletters.map((newsletter) => (
                                    <Link
                                        key={newsletter.id}
                                        href={`/newsletter/${newsletter.id}`}
                                        className="group"
                                    >
                                        <article className="bg-white p-6 h-full flex flex-col border border-brown/10 hover:border-brown/30 transition-all duration-200">
                                            <div className="mb-4">
                                                <span className="body-12-medium text-gold uppercase tracking-wider">
                                                    {newsletter.category}
                                                </span>
                                            </div>
                                            <h3 className="heading-quatro-medium text-brown mb-3 group-hover:text-gold transition-colors line-clamp-2">
                                                {newsletter.title}
                                            </h3>
                                            <div className="mt-auto flex items-center justify-between text-brown/50">
                                                <span className="body-14-regular">
                                                    {newsletter.readingTime} min de leitura
                                                </span>
                                                <span className="body-14-regular">
                                                    {new Date(newsletter.createdAt).toLocaleDateString('pt-PT', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}