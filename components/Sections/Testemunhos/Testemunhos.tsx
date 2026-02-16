"use client"

import { Button } from "@/components/ui/button";
import Testemunho from "./Testemunho";
import { Link } from "@/i18n/navigation";
import { useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { siteConfigApi, depoimentosApi } from "@/services/api";
import Image from "next/image";
import Logo from "@/public/Logo.png";
import { useTranslations, useLocale } from "next-intl";

export default function Testemunhos() {
    const t = useTranslations("Testemunhos");
    const locale = useLocale();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const { data: siteConfig } = useQuery({
        queryKey: ["site-config"],
        queryFn: () => siteConfigApi.get(),
    });

    const { data: depoimentos } = useQuery({
        queryKey: ["depoimentos", locale],
        queryFn: () => depoimentosApi.getAll(locale),
    });

    const checkScrollPosition = () => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const { scrollLeft, scrollWidth, clientWidth } = container;

        // Se todos os cards cabem na tela, desabilitar scroll horizontal
        if (scrollWidth <= clientWidth + 1) { // +1 para tolerância de arredondamento
            setIsAtStart(true);
            setIsAtEnd(true);
            // Prevenir scroll horizontal desnecessário e resetar se necessário
            if (scrollLeft > 0) {
                container.scrollLeft = 0;
            }
            // Desabilitar overflow horizontal quando não é necessário
            container.style.overflowX = 'hidden';
            return;
        }

        // Habilitar overflow horizontal quando necessário
        container.style.overflowX = 'auto';
        setIsAtStart(scrollLeft <= 0);
        setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 1);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Verificar posição inicial e ao redimensionar
        const handleResize = () => {
            checkScrollPosition();
        };

        container.addEventListener('scroll', checkScrollPosition);
        window.addEventListener('resize', handleResize);

        return () => {
            container.removeEventListener('scroll', checkScrollPosition);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const scrollToNext = () => {
        if (!scrollContainerRef.current || isAtEnd) return;

        const container = scrollContainerRef.current;
        const cards = container.querySelectorAll('div');
        const currentScroll = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const scrollWidth = container.scrollWidth;

        // Se todos os cards cabem na tela, não fazer scroll
        if (scrollWidth <= containerWidth) return;

        // Encontrar o próximo card que ainda não está totalmente visível
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            const cardRight = card.offsetLeft + card.offsetWidth;
            const visibleRight = currentScroll + containerWidth;

            if (cardRight > visibleRight + 10) { // 10px de tolerância
                // Usar scrollLeft diretamente em vez de scrollIntoView para evitar problemas
                const targetScroll = card.offsetLeft - (containerWidth - card.offsetWidth) / 2;
                container.scrollTo({
                    left: Math.max(0, Math.min(targetScroll, scrollWidth - containerWidth)),
                    behavior: 'smooth'
                });
                break;
            }
        }
    };

    const scrollToPrevious = () => {
        if (!scrollContainerRef.current || isAtStart) return;

        const container = scrollContainerRef.current;
        const cards = container.querySelectorAll('div');
        const currentScroll = container.scrollLeft;
        const containerWidth = container.clientWidth;
        const scrollWidth = container.scrollWidth;

        // Se todos os cards cabem na tela, não fazer scroll
        if (scrollWidth <= containerWidth) return;

        // Encontrar o card anterior que não está totalmente visível
        for (let i = cards.length - 1; i >= 0; i--) {
            const card = cards[i] as HTMLElement;
            const cardLeft = card.offsetLeft;

            if (cardLeft < currentScroll - 10) { // 10px de tolerância
                // Usar scrollLeft diretamente em vez de scrollIntoView para evitar problemas
                const targetScroll = card.offsetLeft - (containerWidth - card.offsetWidth) / 2;
                container.scrollTo({
                    left: Math.max(0, Math.min(targetScroll, scrollWidth - containerWidth)),
                    behavior: 'smooth'
                });
                break;
            }
        }
    };

    return (
        <section className="relative pt-12 md:pt-10 lg:pt-12 xl:pt-16 container">
            <div className="lg:space-y-6 space-y-4">
                <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-balance md:whitespace-nowrap text-black text-center lg:text-left">{t("title")}</h2>
                <p className="text-black-muted md:body-18-regular body-16-regular w-full lg:w-[618px] text-balance hidden md:block text-center lg:text-left">{t("description")}</p>
            </div>
            <div
                ref={scrollContainerRef}
                className="remove-scrollbar mt-4 md:mt-5 lg:mt-10 xl:mt-12 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&>div]:snap-start"
            >
                {depoimentos && depoimentos.length > 0 ? (
                    depoimentos.map((depoimento) => (
                        <Testemunho
                            key={depoimento.id}
                            text={depoimento.text}
                            name={depoimento.clientName}
                        />
                    ))
                ) : (
                    <p className="text-black-muted body-16-regular">{t("noTestimonials")}</p>
                )}
            </div>

            {/* Rating e Logo */}
            <div className="mt-4 md:mt-5 lg:mt-6 flex flex-col md:flex-row gap-4 items-center justify-center lg:justify-between">
                <div className="flex flex-col items-center lg:items-start gap-2">
                    <p className="body-18-medium text-black-muted whitespace-nowrap">
                        {siteConfig?.clientesSatisfeitos || 800}+ {t("satisfiedClients")}
                    </p>
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => {
                                const rating = siteConfig?.rating || 5.0;
                                const fullStars = Math.floor(rating);
                                const hasHalfStar = rating % 1 >= 0.5;

                                const isFull = i < fullStars;
                                const isHalf = i === fullStars && hasHalfStar;

                                return (
                                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        {isFull ? (
                                            // Estrela cheia
                                            <path d="M9.25805 3.12353C9.56721 2.51693 10.4339 2.51693 10.743 3.12353L12.566 6.70054C12.687 6.93796 12.9142 7.1032 13.1774 7.14512L17.1398 7.77618C17.8114 7.88315 18.079 8.70612 17.5987 9.18762L14.762 12.0319C14.5741 12.2203 14.4875 12.4871 14.529 12.75L15.1541 16.7195C15.26 17.3918 14.5591 17.9006 13.9527 17.5918L10.3788 15.7711C10.1411 15.65 9.85996 15.65 9.6223 15.7711L6.04837 17.5918C5.44199 17.9006 4.74104 17.3918 4.84692 16.7195L5.47216 12.75C5.51356 12.4871 5.42694 12.2203 5.23902 12.0319L2.40235 9.18762C1.92213 8.70612 2.18974 7.88315 2.86133 7.77618L6.82373 7.14512C7.0869 7.1032 7.31415 6.93796 7.43514 6.70054L9.25805 3.12353Z" fill="#DCB053" stroke="#DCB053" strokeWidth="1.25" strokeLinejoin="round" />
                                        ) : isHalf ? (
                                            // Meia estrela
                                            <>
                                                <defs>
                                                    <linearGradient id={`half-${i}`}>
                                                        <stop offset="50%" stopColor="#DCB053" />
                                                        <stop offset="50%" stopColor="transparent" />
                                                    </linearGradient>
                                                </defs>
                                                <path d="M9.25805 3.12353C9.56721 2.51693 10.4339 2.51693 10.743 3.12353L12.566 6.70054C12.687 6.93796 12.9142 7.1032 13.1774 7.14512L17.1398 7.77618C17.8114 7.88315 18.079 8.70612 17.5987 9.18762L14.762 12.0319C14.5741 12.2203 14.4875 12.4871 14.529 12.75L15.1541 16.7195C15.26 17.3918 14.5591 17.9006 13.9527 17.5918L10.3788 15.7711C10.1411 15.65 9.85996 15.65 9.6223 15.7711L6.04837 17.5918C5.44199 17.9006 4.74104 17.3918 4.84692 16.7195L5.47216 12.75C5.51356 12.4871 5.42694 12.2203 5.23902 12.0319L2.40235 9.18762C1.92213 8.70612 2.18974 7.88315 2.86133 7.77618L6.82373 7.14512C7.0869 7.1032 7.31415 6.93796 7.43514 6.70054L9.25805 3.12353Z" fill={`url(#half-${i})`} stroke="#DCB053" strokeWidth="1.25" strokeLinejoin="round" />
                                            </>
                                        ) : (
                                            // Estrela vazia
                                            <path d="M9.25805 3.12353C9.56721 2.51693 10.4339 2.51693 10.743 3.12353L12.566 6.70054C12.687 6.93796 12.9142 7.1032 13.1774 7.14512L17.1398 7.77618C17.8114 7.88315 18.079 8.70612 17.5987 9.18762L14.762 12.0319C14.5741 12.2203 14.4875 12.4871 14.529 12.75L15.1541 16.7195C15.26 17.3918 14.5591 17.9006 13.9527 17.5918L10.3788 15.7711C10.1411 15.65 9.85996 15.65 9.6223 15.7711L6.04837 17.5918C5.44199 17.9006 4.74104 17.3918 4.84692 16.7195L5.47216 12.75C5.51356 12.4871 5.42694 12.2203 5.23902 12.0319L2.40235 9.18762C1.92213 8.70612 2.18974 7.88315 2.86133 7.77618L6.82373 7.14512C7.0869 7.1032 7.31415 6.93796 7.43514 6.70054L9.25805 3.12353Z" fill="transparent" stroke="#DCB053" strokeWidth="1.25" strokeLinejoin="round" />
                                        )}
                                    </svg>
                                );
                            })}
                        </div>
                        <span className="body-18-medium text-black-muted">
                            {siteConfig?.rating?.toFixed(1) || "5.0"}
                        </span>
                    </div>
                    <Button variant="outline" className="mt-2">
                        <Link target="_blank" href="https://www.google.com/search?sa=X&sca_esv=75a4ac89eb4f2f79&rlz=1C5CHFA_enPT1081PT1081&sxsrf=AE3TifOiFTjsCAp8JGBMe6lHNXSapsBScQ:1764862760518&q=Ag%C3%AAncia+Douro+-+Media%C3%A7%C3%A3o+Imobili%C3%A1ria+AMI+17+632+Cr%C3%ADticas&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDWwNDMwN7MwMjK2tDCytDQxstjAyPiK0dYx_fCqvOTMRAWX_NKifAVdBd_UlMzEw8sPL85X8MzNT8rMyTy8sAgo7-jrqWBormBmbKTgXHR4bUlmcmLxIlbK9AMAVO_6DZsAAAA&rldimm=15096076822398299428&tbm=lcl&hl=pt-PT&ved=2ahUKEwj16KuPoqSRAxUM0gIHHX31C5QQ9fQKegQINBAF&biw=1439&bih=691&dpr=2#lkt=LocalPoiReviews">{t("viewMore")}</Link>
                    </Button>
                </div>
                <Image src={Logo} alt="logo" width={178} height={81} sizes="384px" className="hidden lg:block w-96 h-auto" />
            </div>

            {/* Botões de navegação */}
            <div className="mt-4 md:mt-5 lg:mt-10 xl:mt-12 flex gap-2 items-center justify-center lg:justify-start">
                <Button
                    variant="icon-brown"
                    size="icon"
                    onClick={scrollToPrevious}
                    disabled={isAtStart}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold group-hover:text-white">
                        <path d="M6.52692 9.16658L10.9969 4.69657L9.81842 3.51807L3.33659 9.99992L9.81842 16.4817L10.9969 15.3032L6.52692 10.8332H16.6699V9.16658H6.52692Z" fill="currentColor" />
                    </svg>
                </Button>
                <Button
                    variant="icon-brown"
                    size="icon"
                    onClick={scrollToNext}
                    disabled={isAtEnd}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold group-hover:text-white">
                        <path d="M13.4731 9.16658L9.00308 4.69657L10.1816 3.51807L16.6634 9.99992L10.1816 16.4817L9.00308 15.3032L13.4731 10.8332H3.33008V9.16658H13.4731Z" fill="currentColor" />
                    </svg>
                </Button>
            </div>
        </section>
    )
}