"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavLink from "@/components/Sections/Header/NavLink";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo.svg"

export default function Header() {
    const pathname = usePathname();
    
    // Não renderizar o Header se a rota contiver /admin
    if (pathname?.includes("/admin")) {
        return null;
    }
    
    return (
        <header className="border-b border-[#EAE6DF]">
            <div className="container">
                <div className="flex items-center h-18 gap-6">
                    <div className="w-full">
                        <Link href="/">
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
                        <NavLink href="/imoveis-de-luxo" hasArrow>Imóveis de luxo</NavLink>
                        <NavLink href="/institucional" hasArrow>Institucional</NavLink>
                        <NavLink href="/newsletter">Newsletter</NavLink>
                    </nav>
                    <div className="w-full flex gap-2 justify-end">
                        <Button variant="brown" asChild>
                            <Link href="/contacto">Contacto</Link>
                        </Button>
                        <button className="block p-1 lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-black">
                                <path d="M3 6H21V8H3V6ZM3 16H21V18H3V16Z" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
