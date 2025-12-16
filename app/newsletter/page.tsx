"use client";

import { useQuery } from "@tanstack/react-query";
import { newslettersApi } from "@/services/api";
import Link from "next/link";

export default function NewsletterPage() {
    const { data: newsletters, isLoading, error } = useQuery({
        queryKey: ["newsletters"],
        queryFn: () => newslettersApi.getAll(),
    });

    return (
        <>
            <section className="bg-deaf min-h-screen overflow-x-hidden">
                <div className="container pb-8 sm:pb-16 pt-10 sm:pt-20">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="heading-dois-medium text-center mb-2 sm:mb-4 text-2xl sm:text-3xl">
                            Newsletters
                        </h1>
                        <p className="body-16-regular text-black-muted text-center mb-6 sm:mb-12 text-sm sm:text-base">
                            Fique por dentro das últimas novidades do mercado imobiliário
                        </p>

                        {isLoading && (
                            <div className="text-center py-8 sm:py-12">
                                <p className="body-16-regular text-brown">Carregando newsletters...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-8 sm:py-12">
                                <p className="body-16-regular text-red">Erro ao carregar newsletters</p>
                            </div>
                        )}

                        {!isLoading && !error && newsletters && newsletters.length === 0 && (
                            <div className="text-center py-8 sm:py-12">
                                <p className="body-16-regular text-brown/50">Nenhuma newsletter disponível</p>
                            </div>
                        )}

                        {!isLoading && !error && newsletters && newsletters.length > 0 && (
                            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                {newsletters.map((newsletter) => (
                                    <Link
                                        key={newsletter.id}
                                        href={`/newsletter/${newsletter.id}`}
                                        className="group"
                                    >
                                        <article className="bg-white p-4 sm:p-6 h-full flex flex-col border border-brown/10 hover:border-brown/30 transition-all duration-200 shadow-sm hover:shadow-md">
                                            <div className="mb-3 sm:mb-4">
                                                <span className="body-12-medium text-gold uppercase tracking-wider">
                                                    {newsletter.category}
                                                </span>
                                            </div>
                                            <h3 className="heading-quatro-medium text-brown mb-2 sm:mb-3 group-hover:text-gold transition-colors line-clamp-2 text-lg sm:text-xl">
                                                {newsletter.title}
                                            </h3>
                                            <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between text-brown/50 gap-1 sm:gap-0">
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
        </>
    );
}