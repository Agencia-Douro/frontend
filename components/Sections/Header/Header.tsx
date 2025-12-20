"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    // Não renderizar o Header se a rota contiver /admin
    if (pathname?.includes("/admin")) {
        return null;
    }

    return (
        <header className="border-b border-[#EAE6DF]">
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
                                { href: "/imoveis?transactionType=arrendar", label: "Arrendar" },
                                { href: "/imoveis?transactionType=vender", label: "Vender" },
                            ]}
                        />
                        <NavLinkDropdown
                            trigger="Imóveis de luxo"
                            triggerHref="/imoveis-luxo"
                            items={[
                                { href: "/imoveis-luxo?transactionType=comprar", label: "Comprar" },
                                { href: "/imoveis-luxo?transactionType=arrendar", label: "Arrendar" },
                                { href: "/imoveis-luxo?transactionType=vender", label: "Vender" },
                            ]}
                        />{/*
                        <NavLinkDropdown
                            trigger="Institucional"
                            items={[
                                { href: "/institucional", label: "Sobre Nós" },
                                { href: "/institucional/equipa", label: "Equipa" },
                                { href: "/institucional/contacto", label: "Contacto" },
                            ]}
                        />
                        */}
                        <NavLink href="/newsletter">Newsletter</NavLink>
                    </nav>
                    <div className="w-full flex gap-2 justify-end">
                        <Button 
                            variant="brown" 
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
                <nav className={`lg:hidden p-4 border-t border-[#EAE6DF] flex flex-col items-center pt-8 gap-6 h-[calc(100vh-64px)] fixed top-16 bg-muted w-full left-0 z-[1000] overflow-hidden transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <Link
                        href="/imoveis"
                        className="body-16-medium text-brown hover:text-gold transition-colors px-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Imóveis
                    </Link>
                    <Link
                        href="/imoveis-luxo"
                        className="body-16-medium text-brown hover:text-gold transition-colors px-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Imóveis de luxo
                    </Link>
                    <Link
                        href="/institucional"
                        className="body-16-medium text-brown hover:text-gold transition-colors px-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Institucional
                    </Link>
                    <Link
                        href="/newsletter"
                        className="body-16-medium text-brown hover:text-gold transition-colors px-2"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Newsletter
                    </Link>
                </nav>
            </div>
        </header>
    );
}
