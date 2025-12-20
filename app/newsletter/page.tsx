"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { newslettersApi } from "@/services/api";
import Footer from "@/components/Sections/Footer/Footer";
import NewsletterCard from "@/components/NewsletterCard";
import { Button } from "@/components/ui/button";
import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";

const CATEGORIES = [
    { value: "mercado", label: "Mercado" },
    { value: "dicas", label: "Dicas" },
    { value: "noticias", label: "Notícias" },
] as const;

export default function NewsletterPage() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    
    const { data: newsletters, isLoading, error } = useQuery({
        queryKey: ["newsletters"],
        queryFn: () => newslettersApi.getAll(),
    });

    const filteredNewsletters = useMemo(() => {
        if (!newsletters) return [];
        if (!selectedCategory) return newsletters;
        return newsletters.filter((newsletter) => newsletter.category === selectedCategory);
    }, [newsletters, selectedCategory]);

    return (
        <>
            <section className="container">
                <div className="py-6 md:py-10 lg:py-12 xl:py-16">
                    <div className="lg:space-y-6 space-y-4">
                        <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-balance md:whitespace-nowrap text-black">Newsletter</h2>
                        <p className="text-black-muted md:body-18-regular body-16-regular w-full">Fique por dentro das últimas novidades do mercado imobiliário</p>
                    </div>
                    {isLoading && (
                        <div className="text-center mt-8 sm:py-12">
                            <p className="body-16-regular text-brown">A carregar newsletters...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center mt-8 sm:py-12">
                            <p className="body-16-regular text-red">Erro ao carregar newsletters.</p>
                        </div>
                    )}

                    {!isLoading && !error && newsletters && newsletters.length === 0 && (
                        <div className="text-center mt-8 sm:py-12">
                            <p className="body-16-regular text-brown/50">Nenhuma newsletter disponível.</p>
                        </div>
                    )}

                    {!isLoading && !error && newsletters && newsletters.length > 0 && (
                        <div className="mt-6 md:mt-8 lg:mt-10 xl:mt-12 grid grid-cols-12 gap-6">
                            <div className="flex lg:flex-col gap-1 pr-6 border-r border-brown/10 lg:sticky lg:top-0 col-span-12 lg:col-span-4 xl:col-span-3">
                                <Button 
                                    variant={selectedCategory === null ? "brown" : "ghost"} 
                                    className="w-min"
                                    onClick={() => setSelectedCategory(null)}>
                                    Todas
                                </Button>
                                {CATEGORIES.map((category) => (
                                    <Button 
                                        key={category.value}
                                        variant={selectedCategory === category.value ? "brown" : "ghost"} 
                                        className="w-min"
                                        onClick={() => setSelectedCategory(category.value)}>
                                        {category.label}
                                    </Button>
                                ))}
                            </div>
                            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 col-span-12 lg:col-span-8 xl:col-span-9 lg:min-h-63">
                                {filteredNewsletters.length > 0 ? (
                                    filteredNewsletters.map((newsletter) => (
                                        <NewsletterCard key={newsletter.id} newsletter={newsletter} />
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8 lg:py-12">
                                        <span className="body-16-regular text-brown/50">
                                            Nenhuma newsletter encontrada nesta categoria.
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <FaleConnosco/>
            <Footer/>
        </>
    );
}