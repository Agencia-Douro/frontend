import { NextIntlClientProvider, hasLocale } from "next-intl"
import { getMessages } from "next-intl/server"
import type { Metadata } from "next"
import { QueryProvider } from "@/providers/query-provider"
import Header from "@/components/Sections/Header/Header"
import { Toaster } from "@/components/ui/sonner"
import { SocialMediaButtonV2 } from "@/components/SocialMediaButton/SocialMediaButtonV2"
import { notFound } from "next/navigation"
import { routing } from "../../i18n/routing"
import { siteConfig } from "@/lib/site"

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

  const realEstateAgentSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    areaServed: { "@type": "Country", name: "Portugal" },
    ...(siteConfig.sameAs.length > 0 && { sameAs: siteConfig.sameAs }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(realEstateAgentSchema),
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: "typeof window !== 'undefined' && (history.scrollRestoration = 'manual');",
        }}
      />
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
    </>
  )
}
