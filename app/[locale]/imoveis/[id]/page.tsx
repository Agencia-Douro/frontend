import { Metadata } from "next"
import { notFound } from "next/navigation"
import { propertiesApi } from "@/services/api"
import ImovelDetailsClient from "./ImovelDetailsClient"
import { siteConfig } from "@/lib/site"
import { routing } from "@/i18n/routing"
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs"

type Props = {
    params: Promise<{
        id: string
        locale: string
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id, locale } = await params

    try {
    const property = await propertiesApi.getById(id, locale)

    if (!property) {
      return {
        title: "Imóvel não encontrado",
        description: "O imóvel que procura não foi encontrado.",
      }
    }

        const transactionTypeMap: Record<string, string> = {
            comprar: "Comprar",
            arrendar: "Arrendar",
            trespasse: "Trespasse",
        }

        const propertyTypeMap: Record<string, string> = {
            apartamento: "Apartamento",
            moradia: "Moradia",
            terreno: "Terreno",
            escritório: "Escritório",
            loja: "Loja",
            armazém: "Armazém",
            prédio: "Prédio",
            quinta: "Quinta",
            garagem: "Garagem",
            cave: "Cave",
        }

        const transactionType = transactionTypeMap[property.transactionType] || property.transactionType
        const propertyType = propertyTypeMap[property.propertyType.toLowerCase()] || property.propertyType
        const price = parseFloat(property.price).toLocaleString('pt-PT')
        const totalArea = property.totalArea ?? 0

        const title = `${property.title} - ${price} €`
        const description = `${transactionType} ${propertyType} em ${property.concelho}, ${property.distrito}. ${property.bedrooms > 0 ? `${property.bedrooms} quartos` : ''}${property.bathrooms > 0 ? `, ${property.bathrooms} casas de banho` : ''}${totalArea > 0 ? `, ${totalArea}m²` : ''}. Referência: ${property.reference}`

        // Get absolute URL for og:image
        const imageUrl = property.image?.startsWith('http')
            ? property.image
            : `${process.env.NEXT_PUBLIC_API_URL || 'https://agenciadouro.pt'}${property.image}`

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url
        const canonicalUrl = `${baseUrl}/${locale}/imoveis/${id}`
        const languages: Record<string, string> = {}
        for (const loc of routing.locales) {
            languages[loc] = `${baseUrl}/${loc}/imoveis/${id}`
        }

    return {
      metadataBase: new URL(baseUrl),
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
        languages,
      },
      openGraph: {
        title,
        description,
        type: "website",
        locale: locale === "pt" ? "pt_PT" : "en_US",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
        siteName: "Agência Douro",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    }
  } catch {
    return {
      title: "Imóvel não encontrado | Agência Douro",
      description: "O imóvel que procura não foi encontrado.",
    }
  }
}

export default async function ImovelDetails({ params }: Props) {
    const { id, locale } = await params
  let initialProperty: Awaited<ReturnType<typeof propertiesApi.getById>> | null = null
    try {
    initialProperty = await propertiesApi.getById(id, locale)
  } catch {
    notFound()
  }
  if (!initialProperty) notFound()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url
  const imageUrl = initialProperty.image?.startsWith('http')
    ? initialProperty.image
    : `${process.env.NEXT_PUBLIC_API_URL || siteConfig.url}${initialProperty.image}`

  const propertySchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: initialProperty.title,
    description: initialProperty.description,
    url: `${baseUrl}/${locale}/imoveis/${id}`,
    image: imageUrl,
    datePosted: initialProperty.createdAt,
    ...(initialProperty.price && {
      offers: {
        "@type": "Offer",
        price: initialProperty.price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
    }),
    address: {
      "@type": "PostalAddress",
      addressLocality: initialProperty.concelho,
      addressRegion: initialProperty.distrito,
      addressCountry: "PT",
    },
    ...(initialProperty.totalArea && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: initialProperty.totalArea,
        unitCode: "MTK",
      },
    }),
    ...(initialProperty.bedrooms > 0 && {
      numberOfRooms: initialProperty.bedrooms,
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertySchema) }}
      />
      <Breadcrumbs
        locale={locale}
        items={[
          { name: "Imóveis", path: "/imoveis" },
          { name: initialProperty.title },
        ]}
      />
      <ImovelDetailsClient initialProperty={initialProperty} />
    </>
  )
}
