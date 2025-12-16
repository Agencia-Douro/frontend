"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import NavLink from "@/components/Sections/Header/NavLink";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo.svg"

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Não renderizar o Header se a rota contiver /admin
    if (pathname?.includes("/admin")) {
        return null;
    }

    return (
        <header className="border-b border-[#EAE6DF]">
            <div className="container">
                <div className="flex items-center h-18 gap-6">
                    <div className="w-full">
                        <Link href="/" className="inline-flex" onClick={() => setMobileMenuOpen(false)}>
                            <Image
                                src={Logo}
                                alt="Agência Douro Logótipo"
                                width={88}
                                height={40}
                            />
                        </Link>
                    </div>
                    <nav className="hidden lg:flex items-center gap-6">
                        <NavLink href="/imoveis" hasArrow>Imóveis</NavLink>
                        <NavLink href="/imoveis-luxo" hasArrow>Imóveis de luxo</NavLink>
                        <NavLink href="/institucional" hasArrow>Institucional</NavLink>
                        <NavLink href="/newsletter">Newsletter</NavLink>
                    </nav>
                    <div className="w-full flex gap-2 justify-end">
                        <Button variant="brown" asChild className="hidden sm:inline-flex">
                            <Link href="/contacto">Contacto</Link>
                        </Button>
                        <button
                            className="block p-1 lg:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
                                <path d="M3 6H21V8H3V6ZM3 16H21V18H3V16Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <nav className="lg:hidden py-4 border-t border-[#EAE6DF] flex flex-col gap-4">
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
                        <Button variant="brown" asChild className="w-full">
                            <Link href="/contacto" onClick={() => setMobileMenuOpen(false)}>
                                Contacto
                            </Link>
                        </Button>
                    </nav>
                )}
            </div>
        </header>
    );
}
