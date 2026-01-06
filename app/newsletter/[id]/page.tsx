"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { newslettersApi } from "@/services/api";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Sections/Footer/Footer";
import Logo from "@/public/Logo.svg";
import Divider from "@/public/divider.png";
import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Folha from "@/components/Folha";

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
                            <p className="text-center text-brown">A carregar newsletter...</p>
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
            <Folha className="top-[2000px] left-[1500px] rotate-310 opacity-30 hidden lg:block text-brown" />
            <Folha className="top-[1900px] left-[0px] rotate-30 opacity-30 hidden lg:block text-brown" />
            <section className="bg-muted container pt-6 md:pt-8 lg:pt-12 xl:pt-16 relative">
                <div className="flex flex-nowrap items-center gap-0.5 overflow-x-auto">
                    <Link href="/newsletter" className="body-16-medium text-brown capitalize whitespace-nowrap">Newsletter</Link>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20">
                        <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor"></path>
                    </svg>
                    <p className="body-16-medium text-brown capitalize">{newsletter.category}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20">
                        <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor"></path>
                    </svg>
                    <p className="body-16-medium text-brown capitalize whitespace-nowrap">{newsletter.title}</p>
                </div>

                {/* Header and Content Section */}
                <div className="mt-6 lg:mt-8">
                    {/* Cover Image - Floated Left */}
                    {newsletter.coverImage && (
                        <div className="float-none lg:float-left w-full lg:w-1/3 mb-6 lg:mb-0 lg:mr-6">
                            <div className="relative w-full h-64 lg:h-80 overflow-hidden">
                                <Image
                                    src={newsletter.coverImage}
                                    alt={newsletter.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Title and Info */}
                    <h1 className="heading-tres-regular lg:heading-dois-regular text-balance text-black">{newsletter.title}</h1>
                    <div className="flex items-center gap-2 mt-4">
                        <p className="body-14-regular text-black-muted">
                            {new Date(newsletter.createdAt).toLocaleDateString('pt-PT', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                        <span>∙</span>
                        <p className="body-14-regular text-black-muted">{newsletter.readingTime} min de leitura</p>
                    </div>

                    {/* Content */}
                    <article className="mt-6 md:mb-5 mb-10">
                        <div
                            className="tiptap-newsletter max-w-none"
                            dangerouslySetInnerHTML={{ __html: newsletter.content }}
                        />
                    </article>

                    {/* Clear float */}
                    <div className="clear-both"></div>
                </div>
            </section>
            <Image src={Divider} alt="divider" width={1000} height={32} className="w-full object-cover h-8 mt-4" />
            {newsletter.properties && newsletter.properties.length > 0 && (
                <div className="mt-8 sm:mt-16 mb-8 sm:mb-16 flex flex-col items-center container">
                    <Image
                        className="mb-6 lg:mb-8 h-16"
                        src={Logo}
                        alt="Agência Douro Logótipo"
                        width={213}
                        height={96}
                    />
                    <h2 className="heading-tres-regular text mb-5 sm:mb-10">Imóveis Relacionados</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {newsletter.properties.map((property) => (
                            <Link
                                key={property.id}
                                href={`/imoveis/${property.id}`}
                                className="w-full">
                                <div className="relative w-full h-48 sm:h-56 md:h-64">
                                    <Image
                                        src={property.image}
                                        alt={property.title}
                                        fill
                                        className="w-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <p className="body-16-medium text-black">{property.title}</p>
                                    <p className="body-14-medium text-grey mt-1">{property.concelho}, {property.distrito}</p>
                                    <p className="body-20-medium text-black mt-2">
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
            <Image src={Divider} alt="divider" width={1000} height={32} className="w-full object-cover h-8" />
            <FaleConnosco />
            <Footer />
        </>
    );
}