"use client";

import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const languages = {
  pt: { flag: "/flags/pt.svg", name: "Português" },
  en: { flag: "/flags/en.svg", name: "English" },
  fr: { flag: "/flags/fr.svg", name: "Français" },
} as const;

export default function LanguageSwitcher() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = (params.locale as string) || "pt";

  const handleLanguageChange = (locale: string) => {
    router.push(pathname, { locale });
  };

  const currentLanguage = languages[currentLocale as keyof typeof languages];
  const otherLanguages = Object.entries(languages).filter(([locale]) => locale !== currentLocale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group flex items-center justify-center w-10 h-10",
          "bg-transparent hover:bg-transparent focus:bg-transparent",
          "p-0 border-0 shadow-none",
          "focus-visible:ring-0 focus-visible:outline-none",
          "cursor-pointer"
        )}
        aria-label="Change language"
      >
        <Image
          src={currentLanguage.flag}
          alt={currentLanguage.name}
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-gold transition-transform duration-300 group-data-[state=open]:rotate-180 ml-1"
        >
          <path
            d="M8.00042 8.78101L11.3003 5.4812L12.2431 6.42401L8.00042 10.6667L3.75781 6.42401L4.70062 5.4812L8.00042 8.78101Z"
            fill="currentColor"
          />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-deaf shadow-lg p-1 min-w-auto"
        align="end"
      >
        {otherLanguages.map(([locale, language]) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className="focus:bg-muted hover:text-brown hover:bg-muted focus:text-brown button-14-medium flex items-center justify-center cursor-pointer"
          >
            <Image
              src={language.flag}
              alt={language.name}
              width={24}
              height={24}
              className="w-6 h-6"
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
