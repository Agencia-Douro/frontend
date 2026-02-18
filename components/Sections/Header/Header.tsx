"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavLink from "@/components/Sections/Header/NavLink";
import NavLinkDropdown from "@/components/Sections/Header/NavLinkDropdown";
import LanguageSwitcher from "@/components/Sections/Header/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo.png";
import { useTranslations } from "next-intl";

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
    const savedScrollY = useRef(0);
    const t = useTranslations("Header");

    // Detectar scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 1);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Bloquear scroll quando menu mobile está aberto e restaurar posição ao fechar
    useEffect(() => {
        if (mobileMenuOpen) {
            setOpenSubmenu(null);
            savedScrollY.current = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${savedScrollY.current}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollToRestore = savedScrollY.current;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollToRestore);
        }
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    // Não renderizar o Header se a rota contiver /admin
    // usePathname do next-intl retorna pathname sem locale
    if (pathname?.includes("admin")) {
        return null;
    }

    // Determinar se estamos nas páginas de imóveis ou imóveis de luxo
    // usePathname do next-intl retorna pathname sem locale (ex: "/imoveis")
    const isImoveisPage = pathname === "/imoveis";
    const isImoveisLuxoPage = pathname === "/imoveis-luxo";
    const isHomePage = pathname === "/";
    const isPodcastPage = pathname === "/podcast";
    const useSticky = isImoveisPage || isImoveisLuxoPage;
    const positionClass = useSticky ? "" : "fixed";

    // Header transparente na home e no podcast (hero com imagem) quando não deu scroll (apenas em desktop)
    const isTransparent = (isHomePage || isPodcastPage) && !isScrolled && !mobileMenuOpen;
    // Em mobile, sempre ter background preenchido
    const headerBg = isTransparent ? "bg-muted xl:bg-transparent" : "bg-muted";
    const borderColor = isTransparent ? "border-[#EAE6DF] xl:border-white/20" : "border-[#EAE6DF]";
    const textColor = isTransparent ? "text-brown xl:text-white" : "text-brown";

    return (
        <header className={`border-b ${borderColor} ${positionClass} top-0 left-0 right-0 w-full max-w-full ${headerBg} z-50 transition-all duration-300`}>
            <div className="container">
                <div className="flex items-center xl:h-18 h-16 gap-6">
                    <div className="w-full flex flex-col justify-center">
                        <Link href="/" className="inline-flex" onClick={() => setMobileMenuOpen(false)}>
                            <Image
                                className={`xl:h-10 h-8 w-auto transition-all duration-300 ${isTransparent ? 'xl:brightness-0 xl:invert' : ''}`}
                                src={Logo}
                                alt={t("logoAlt")}
                                width={88}
                                height={40}
                                sizes="88px"
                            />
                        </Link>
                    </div>
                    <nav className="hidden xl:flex items-center gap-6">
                        <NavLink href="/" isTransparent={isTransparent}>{t("home")}</NavLink>
                        <NavLinkDropdown
                            trigger={t("properties")}
                            triggerHref="/imoveis"
                            isTransparent={isTransparent}
                            items={[
                                { href: "/imoveis?transactionType=comprar", label: t("buy") },
                                { href: "/imoveis?isEmpreendimento=true", label: t("developments") },
                                { href: "/imoveis?transactionType=arrendar", label: t("rent") },
                                { href: "/imoveis?transactionType=trespasse", label: t("businessTransfer") },
                            ]}
                        />
                        <NavLinkDropdown
                            trigger={t("luxuryProperties")}
                            triggerHref="/imoveis-luxo"
                            isTransparent={isTransparent}
                            items={[
                                { href: "/imoveis-luxo?transactionType=comprar", label: t("buy") },
                                { href: "/imoveis?isEmpreendimento=true", label: t("developments") },
                                { href: "/imoveis?transactionType=arrendar", label: t("rent") },
                                { href: "/imoveis?transactionType=trespasse", label: t("businessTransfer") },
                            ]}
                        />
                        <NavLink href="/sobre-nos" isTransparent={isTransparent}>{t("aboutUs")}</NavLink>
                        <NavLink href="/podcast" isTransparent={isTransparent}>{t("podcast")}</NavLink>
                        <NavLink href="/vender-imovel" isTransparent={isTransparent}>{t("sellMyProperty")}</NavLink>
                        <NavLink href="/avaliador-online" isTransparent={isTransparent}>{t("avaliar")}</NavLink>
                    </nav>
                    <div className="w-full flex gap-2 justify-end items-center">
                        <LanguageSwitcher />
                        <Button
                            asChild
                            variant={isTransparent ? "gold" : "outline"}
                        >
                            <a href="tel:+351919766324">
                                {t("contact")}
                            </a>
                        </Button>

                        <button className={`block p-1 xl:hidden cursor-pointer z-60 relative transition-colors duration-300 ${textColor}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 0 0-1.41 1.42L10.59 12l-4.89 4.88a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.42L13.41 12l4.89-4.88a1 1 0 0 0 0-1.41z" fill="currentColor" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
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
                                className="xl:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-999 top-16"
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
                                className="xl:hidden p-4 border-t border-[#EAE6DF] flex flex-col items-start justify-between py-8 pl-6 gap-3 h-[calc(100dvh-64px)] fixed top-16 bg-muted w-full left-0 z-1000 overflow-y-auto pb-24"
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
                                    className="flex flex-col items-start gap-4 w-full justify-between h-full"
                                >
                                    {[
                                        { href: "/", label: t("home") },
                                        {
                                            href: "/imoveis",
                                            label: t("properties"),
                                            submenu: [
                                                { href: "/imoveis?transactionType=comprar", label: t("buy") },
                                                { href: "/imoveis?isEmpreendimento=true", label: t("developments") },
                                                { href: "/imoveis?transactionType=arrendar", label: t("rent") },
                                                { href: "/imoveis?transactionType=trespasse", label: t("businessTransfer") },
                                            ],
                                        },
                                        {
                                            href: "/imoveis-luxo",
                                            label: t("luxuryProperties"),
                                            submenu: [
                                                { href: "/imoveis-luxo?transactionType=comprar", label: t("buy") },
                                                { href: "/imoveis?isEmpreendimento=true", label: t("developments") },
                                                { href: "/imoveis?transactionType=arrendar", label: t("rent") },
                                                { href: "/imoveis?transactionType=trespasse", label: t("businessTransfer") },
                                            ],
                                        },
                                        { href: "/sobre-nos", label: t("aboutUs") },
                                        { href: "/podcast", label: t("podcast") },
                                        { href: "/vender-imovel", label: t("sellMyProperty") },
                                        { href: "/avaliador-online", label: t("avaliar") },
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
                                                    x: -40,
                                                    filter: "blur(10px)",
                                                },
                                            }}
                                            transition={{
                                                duration: 0.7,
                                                ease: [0.25, 0.1, 0.25, 1],
                                            }}
                                            className="w-full"
                                        >
                                            {item.submenu ? (
                                                <>
                                                    <button
                                                        className="heading-cinco-regular font-heading text-brown hover:text-gold transition-colors px-2 flex items-center gap-2 relative group text-left w-full cursor-pointer"
                                                        onClick={() => setOpenSubmenu(openSubmenu === item.href ? null : item.href)}
                                                    >
                                                        <span className="relative z-10">{item.label}</span>
                                                        <motion.svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            animate={{ rotate: openSubmenu === item.href ? 180 : 0 }}
                                                            transition={{ duration: 0.3 }}
                                                        >
                                                            <path d="m6 9 6 6 6-6" />
                                                        </motion.svg>
                                                    </button>
                                                    <AnimatePresence>
                                                        {openSubmenu === item.href && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: "auto", opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="flex flex-col gap-2 pl-5 pt-4 ml-4">
                                                                    {item.submenu.map((sub) => (
                                                                        <Link
                                                                            key={sub.href}
                                                                            href={sub.href}
                                                                            className="text-brown/60 hover:text-gold transition-colors py-1 px-2 block text-left font-body text-base heading-tres-medium"
                                                                            onClick={() => {
                                                                                setOpenSubmenu(null);
                                                                                setMobileMenuOpen(false);
                                                                            }}
                                                                        >
                                                                            {sub.label}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    className="heading-cinco-regular font-heading text-brown hover:text-gold transition-colors px-2 block relative group text-left"
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
                                            )}
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
