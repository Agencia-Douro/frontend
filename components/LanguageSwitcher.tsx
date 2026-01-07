"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
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
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    // Remove o locale atual do pathname
    const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, "");

    // Navega para a nova URL com o novo locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  const currentLanguage = languages[currentLocale as keyof typeof languages];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 body-14-medium text-brown hover:text-black-muted transition-colors">
        <Image
          width={27}
          height={20}
          src={currentLanguage.flag}
          alt={`${currentLanguage.name} flag`}
        />
        {currentLanguage.name}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        {Object.entries(languages).map(([locale, { name, flag }]) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Image width={20} height={15} src={flag} alt={`${name} flag`} />
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
