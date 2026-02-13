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

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${siteConfig.url}/${l}`
  }
  languages["x-default"] = `${siteConfig.url}/${routing.defaultLocale}`

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: "Agência Douro | Imóveis de Luxo em Portugal",
      template: "%s | Agência Douro",
    },
    description:
      "Encontre a sua casa ideal em Portugal com a Agência Douro. Compre, arrende ou venda o seu imóvel com os melhores profissionais do mercado imobiliário.",
    icons: {
      icon: "/Logo.svg",
    },
    openGraph: {
      siteName: "Agência Douro",
      type: "website",
      locale: locale === "pt" ? "pt_PT" : locale === "fr" ? "fr_FR" : "en_GB",
      images: [
        {
          url: "/hero/hero1.jpg",
          width: 1200,
          height: 630,
          alt: "Agência Douro - Imóveis de Luxo em Portugal",
        },
      ],
    },
    alternates: {
      canonical: `${siteConfig.url}/${locale}`,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const messages = await getMessages();

  const schemas = [
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/${locale}/imoveis?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "SiteNavigationElement",
      name: [
        "Comprar",
        "Imóveis de Luxo",
        "Vender Imóvel",
        "Sobre Nós",
        "Podcast",
        "Avaliador Online",
      ],
      url: [
        `${siteConfig.url}/${locale}/imoveis`,
        `${siteConfig.url}/${locale}/imoveis-luxo`,
        `${siteConfig.url}/${locale}/vender-imovel`,
        `${siteConfig.url}/${locale}/sobre-nos`,
        `${siteConfig.url}/${locale}/podcast`,
        `${siteConfig.url}/${locale}/avaliador-online`,
      ],
    },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemas),
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
