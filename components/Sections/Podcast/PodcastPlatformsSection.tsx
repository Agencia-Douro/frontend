"use client";

import { Link } from "@/i18n/navigation";

interface PodcastPlatformsSectionProps {
    label: string;
    title: string;
    description: string;
}

const PLATFORMS = [
    {
        href: "https://www.instagram.com/norteimobiliariobusiness/",
        label: "Instagram",
        ariaLabel: "Instagram",
        className: "bg-linear-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90",
        icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    },
    {
        href: "https://www.facebook.com/norteimobiliariobusiness",
        label: "Facebook",
        ariaLabel: "Facebook",
        className: "bg-[#1877F2] hover:bg-[#166FE5]",
        icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    },
    {
        href: "https://www.linkedin.com/company/podcast-norte-imobili%C3%A1rio/",
        label: "LinkedIn",
        ariaLabel: "LinkedIn",
        className: "bg-[#0A66C2] hover:bg-[#004182]",
        icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    {
        href: "https://www.youtube.com/@norteimobiliariobusiness",
        label: "YouTube",
        ariaLabel: "YouTube",
        className: "bg-[#FF0000] hover:bg-[#CC0000]",
        icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    },
    {
        href: "https://open.spotify.com/show/3K8jsTPPNt59OKWyubhA71",
        label: "Spotify",
        ariaLabel: "Spotify",
        className: "bg-[#1DB954] hover:bg-[#1ed760]",
        icon: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.359.24-.66.54-.779 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z",
    },
    {
        href: "https://www.tiktok.com/@norteimobiliariobusiness",
        label: "TikTok",
        ariaLabel: "TikTok",
        className: "bg-black hover:bg-gray-800",
        icon: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z",
    },
] as const;

export function PodcastPlatformsSection({ label, title, description }: PodcastPlatformsSectionProps) {
    return (
        <section className="container py-8 md:py-10 lg:py-12 xl:py-16">
            <header className="mb-6 md:mb-8 lg:mb-10 xl:mb-12 space-y-2 md:space-y-3">
                <span className="button-14-medium text-gold block">{label}</span>
                <h2 className="body-20-medium md:heading-quatro-medium text-black text-balance">
                    {title}
                </h2>
                <p className="text-black-muted md:body-18-regular body-16-regular max-w-3xl text-pretty">
                    {description}
                </p>
            </header>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-start">
                {PLATFORMS.map((platform) => (
                    <Link
                        key={platform.label}
                        href={platform.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-3 px-5 py-3 md:px-6 text-white transition-colors duration-200 body-14-medium ${platform.className}`}
                        aria-label={platform.ariaLabel}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d={platform.icon} />
                        </svg>
                        <span>{platform.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
