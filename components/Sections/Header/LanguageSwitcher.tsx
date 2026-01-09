"use client";

import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useState, useRef, useEffect } from "react";

const languages = {
  pt: { flag: "🇵🇹", name: "Português" },
  en: { flag: "🇬🇧", name: "English" },
  fr: { flag: "🇫🇷", name: "Français" },
} as const;

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = (params.locale as string) || "pt";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: string) => {
    router.push(pathname, { locale });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-muted-foreground/10 transition-colors"
        aria-label="Change language"
      >
        <span className="text-2xl">{languages[currentLocale as keyof typeof languages].flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md py-2 min-w-[120px] z-50">
          {Object.entries(languages)
            .filter(([locale]) => locale !== currentLocale)
            .map(([locale, { flag, name }]) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className="w-full px-4 py-2 hover:bg-muted transition-colors flex items-center gap-3 text-left"
              >
                <span className="text-2xl">{flag}</span>
                <span className="body-14-regular text-black-muted">{name}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
