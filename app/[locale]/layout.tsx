import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages } from "next-intl/server"
import type { Metadata } from "next";
import { Prata, Inter } from "next/font/google";
import "../globals.css";
import { QueryProvider } from "@/providers/query-provider";
import Header from "@/components/Sections/Header/Header";
import { Toaster } from "@/components/ui/sonner";
import { AvaliadorOnlineButton } from "@/components/AvaliadorOnlineButton/AvaliadorOnlineButton";
import { SocialMediaButtonV2 } from "@/components/SocialMediaButton/SocialMediaButtonV2";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";

const prata = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prata",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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

export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages();

  return (
    <html lang="pt-BR" className={`${prata.variable} ${inter.variable}`}>
      <body className="antialiased bg-muted isolate">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <Header />
            <main className="w-full overflow-x-hidden">
              {children}
            </main>
            <Toaster />
            <SocialMediaButtonV2 />
          </QueryProvider>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}
