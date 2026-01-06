"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavLink from "@/components/Sections/Header/NavLink";
import NavLinkDropdown from "@/components/Sections/Header/NavLinkDropdown";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo.svg"

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Bloquear scroll quando menu mobile está aberto
    useEffect(() => {
        if (mobileMenuOpen) {
            // Guardar posição atual de scroll
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // Restaurar posição de scroll
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Não renderizar o Header se a rota contiver /admin
    if (pathname?.includes("/admin")) {
        return null;
    }

    return (
        <header className="border-b border-[#EAE6DF] sticky top-0 w-full bg-muted z-50">
            <div className="container">
                <div className="flex items-center xl:h-18 h-16 gap-6">
                    <div className="w-full flex flex-col justify-center">
                        <Link href="/" className="inline-flex" onClick={() => setMobileMenuOpen(false)}>
                            <Image
                                className="xl:h-10 xl:w-22 h-8 w-[71px]"
                                src={Logo}
                                alt="Agência Douro Logótipo"
                                width={88}
                                height={40}
                            />
                        </Link>
                    </div>
                    <nav className="hidden lg:flex items-center gap-6">
                        <NavLinkDropdown
                            trigger="Imóveis"
                            triggerHref="/imoveis"
                            items={[
                                { href: "/imoveis?transactionType=comprar", label: "Comprar" },
                                { href: "/imoveis?isEmpreendimento=true", label: "Empreendimentos" },
                                { href: "/imoveis?transactionType=trespasse", label: "Trespasse" },
                            ]}
                        />
                        <NavLinkDropdown
                            trigger="Imóveis de luxo"
                            triggerHref="/imoveis-luxo"
                            items={[
                                { href: "/imoveis-luxo?transactionType=comprar", label: "Comprar" },
                                { href: "/imoveis?isEmpreendimento=true", label: "Empreendimentos" },
                                { href: "/imoveis?transactionType=trespasse", label: "Trespasse" },
                            ]}
                        />
                        <NavLinkDropdown
                            trigger="Quem Somos"
                            triggerHref="/institucional/sobre-nos"
                            items={[
                                { href: "/institucional/sobre-nos", label: "Sobre Nós" },
                                { href: "/institucional/podcast", label: "Podcast" },
                            ]}
                        />
                        <NavLink href="/newsletter">Newsletter</NavLink>
                    </nav>
                    <div className="w-full flex gap-2 justify-end">
                        <Button
                            variant="gold"
                            onClick={(e) => {
                                e.preventDefault();
                                const contactoSection = document.getElementById('contacto');
                                if (contactoSection) {
                                    contactoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                } else {
                                    // Se não estiver na página inicial, navega para lá
                                    window.location.href = '/#contacto';
                                }
                            }}
                        >
                            Contacto
                        </Button>
                        <button className="block p-1 lg:hidden cursor-pointer z-999" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
                                    <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.42L10.59 12l-4.89 4.88a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z" fill="currentColor" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
                                    <path d="M3 6H21V8H3V6ZM3 16H21V18H3V16Z" fill="currentColor" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            {/* Overlay com blur */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] top-16"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                            {/* Menu */}
                            <motion.nav
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{
                                    duration: 0.6,
                                    ease: [0.25, 0.1, 0.25, 1],
                                }}
                                className="lg:hidden p-4 border-t border-[#EAE6DF] flex flex-col justify-between items-end py-16 pr-8 gap-4 h-[calc(100vh-64px)] fixed top-16 bg-muted w-full left-0 z-[1000] overflow-hidden"
                            >
                                <motion.div
                                    initial="closed"
                                    animate="open"
                                    variants={{
                                        open: {
                                            transition: {
                                                staggerChildren: 0.08,
                                                delayChildren: 0.2,
                                            },
                                        },
                                        closed: {
                                            transition: {
                                                staggerChildren: 0.05,
                                                staggerDirection: -1,
                                            },
                                        },
                                    }}
                                    className="flex flex-col justify-between items-end h-full"
                                >
                                    {[
                                        { href: "/imoveis", label: "Imóveis" },
                                        { href: "/imoveis-luxo", label: "Imóveis de luxo" },
                                        { href: "/institucional/sobre-nos", label: "Institucional" },
                                        { href: "/institucional/podcast", label: "Podcast" },
                                        { href: "/newsletter", label: "Newsletter" },
                                    ].map((item) => (
                                        <motion.div
                                            key={item.href}
                                            variants={{
                                                open: {
                                                    opacity: 1,
                                                    x: 0,
                                                    filter: "blur(0px)",
                                                },
                                                closed: {
                                                    opacity: 0,
                                                    x: 40,
                                                    filter: "blur(10px)",
                                                },
                                            }}
                                            transition={{
                                                duration: 0.7,
                                                ease: [0.25, 0.1, 0.25, 1],
                                            }}
                                        >
                                            <Link
                                                href={item.href}
                                                className="heading-quatro-medium text-brown hover:text-gold transition-colors px-2 block relative group"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <span className="relative z-10">{item.label}</span>
                                                <motion.span
                                                    className="absolute bottom-0 left-0 h-[2px] bg-gold origin-left"
                                                    initial={{ scaleX: 0 }}
                                                    whileHover={{ scaleX: 1 }}
                                                    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                                                />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.nav>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
