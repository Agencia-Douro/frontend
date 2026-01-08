"use client";

import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = {
  pt: {
    name: "Português",
    flag: "/flags/pt.svg",
  },
  en: {
    name: "English",
    flag: "/flags/en.svg",
  },
  fr: {
    name: "Français",
    flag: "/flags/fr.svg",
  },
} as const;

export default function LanguageSwitcher() {
  const pathname = usePathname(); // Retorna pathname sem locale (ex: "/imoveis")
  const currentLocale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLanguageChange = (newLocale: string) => {
    // Construir o pathname com o novo locale
    const pathWithLocale = pathname === "/" ? `/${newLocale}` : `/${newLocale}${pathname}`;
    
    // Preservar query params se existirem
    const queryString = searchParams.toString();
    const newPath = queryString ? `${pathWithLocale}?${queryString}` : pathWithLocale;
    
    // Usar router.push para navegação suave (o middleware do next-intl gerencia o locale)
    router.push(newPath);
  };

  const currentLanguage = languages[currentLocale as keyof typeof languages];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="group flex items-center gap-2 body-14-medium text-brown hover:text-black-muted transition-colors bg-transparent border-none p-0 focus:outline-none cursor-pointer">
        {currentLanguage.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        side="top" 
        align="end"
        className="bg-[#EDE3D7] border-brown/20 min-w-[160px] shadow-lg rounded-none"
        sideOffset={8}
      >
        {Object.entries(languages).map(([locale, { name }]) => {
          const isActive = locale === currentLocale;
          return (
            <DropdownMenuItem
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-none
                ${isActive 
                  ? 'bg-gold/20 text-brown font-medium cursor-default hover:bg-gold/20' 
                  : 'text-brown hover:bg-gold/10 hover:text-brown cursor-pointer'
                }
                transition-colors
              `}
            >
              <span className="body-14-medium flex-1">{name}</span>
              {isActive && (
                <svg 
                  className="ml-auto w-4 h-4 text-gold shrink-0" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
