"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { newslettersApi } from "@/services/api";
import Link from "next/link";
import Image from "next/image";
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
                <section className="bg-deaf overflow-x-hidden">
                    <div className="container pb-8 sm:pb-16 pt-10 sm:pt-20">
                        <div className="max-w-3xl mx-auto">
                            <p className="text-center text-brown">Carregando newsletter...</p>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (error || !newsletter) {
        return (
            <>
                <section className="bg-deaf overflow-x-hidden">
                    <div className="container pb-8 sm:pb-16 pt-10 sm:pt-20">
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
            </>
        );
    }

    return (
        <>
            <section className="bg-deaf overflow-x-hidden">
                <div className="container pt-5 sm:pt-10 pb-8 sm:pb-16">
                    <div>
                        <div className="relative flex flex-col sm:flex-row sm:items-center">
                            <Link
                                href="/newsletter"
                                className="inline-flex items-center gap-2 body-14-medium text-brown hover:text-gold transition-colors mb-4 sm:mb-8"
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

                            <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 bg-[#ECE7E3] p-3 text-center">
                                <h1 className="capitalize body-16-medium">
                                    {newsletter.category}
                                </h1>
                            </div>
                        </div>


                        {/* Title */}
                        <h1 className="heading-tres-regular flex justify-center mt-5 sm:mt-10 mb-5 sm:mb-10 text-2xl sm:text-3xl lg:text-4xl">
                            {newsletter.title}
                        </h1>

                        {/* Cover Image */}
                        {newsletter.coverImage && (
                            <div className="relative w-full mb-5 sm:mb-10">
                                <img
                                    src={newsletter.coverImage}
                                    alt={newsletter.title}
                                    className="w-full h-auto max-h-[300px] sm:max-h-[400px] object-contain"
                                />
                            </div>
                        )}

                        <article className="mb-5 sm:mb-10">
                            <div
                                className="prose prose-brown max-w-none break-words"
                                dangerouslySetInnerHTML={{ __html: newsletter.content }}
                            />
                        </article>

                        {/* Related Properties */}
                        {newsletter.properties && newsletter.properties.length > 0 && (
                            <div className="mt-8 sm:mt-16 mb-8 sm:mb-16">
                                <h2 className="heading-tres-regular text-center mb-5 sm:mb-10">
                                    Imóveis Relacionados
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    {newsletter.properties.map((property) => (
                                        <Link
                                            key={property.id}
                                            href={`/imoveis/${property.id}`}
                                            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <div className="relative w-full h-48 sm:h-56 md:h-64">
                                                <Image
                                                    src={property.image}
                                                    alt={property.title}
                                                    fill
                                                    className="object-cover transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <p className="body-16-medium text-black line-clamp-2 mb-2">
                                                    {property.title}
                                                </p>
                                                <p className="body-14-medium text-grey mb-3">
                                                    {property.concelho}, {property.distrito}
                                                </p>
                                                <p className="body-20-medium text-brown">
                                                    {new Intl.NumberFormat('pt-PT', {
                                                        style: 'currency',
                                                        currency: 'EUR',
                                                        minimumFractionDigits: 0
                                                    }).format(parseFloat(property.price))}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
