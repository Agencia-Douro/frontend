import { NextIntlClientProvider, hasLocale } from "next-intl"
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "../globals.css";
import { QueryProvider } from "@/providers/query-provider";
import Header from "@/components/Sections/Header/Header";
import { Toaster } from "@/components/ui/sonner";
import { AvaliadorOnlineButton } from "@/components/AvaliadorOnlineButton/AvaliadorOnlineButton";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import { SocialMediaButtonV2 } from "@/components/SocialMediaButton/SocialMediaButtonV2";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
});

export const metadata: Metadata = {
  title: "Página Inicial - Agência Douro",
  description: "Casas, apartamentos, escritórios, terrenos para venda e aluguel, temos várias opções em diversas localidades. Fale com um de nossos representantes e agende",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/Logo.svg",
  },
};

export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode, params: { locale: string } }>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang="pt-BR" className={`${monaSans.variable} overflow-x-hidden`}>
      <body className="antialiased bg-muted max-w-screen overflow-x-hidden flex flex-col relative">
        <NextIntlClientProvider locale={locale} messages={(await import(`../../messages/${locale}.json`)).default}>
          <QueryProvider>
            <SplashScreen />
            <Header />
            {children}
            <Toaster />
            <AvaliadorOnlineButton />
            <SocialMediaButtonV2 />
          </QueryProvider>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}
