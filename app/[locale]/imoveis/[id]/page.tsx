import { Metadata } from "next"
import { notFound } from "next/navigation"
import { propertiesApi } from "@/services/api"
import ImovelDetailsClient from "./ImovelDetailsClient"
import { siteConfig } from "@/lib/site"
import { routing } from "@/i18n/routing"
import { Breadcrumbs } from "@/components/SEO/Breadcrumbs"
import { getTranslations } from "next-intl/server"

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
    const t = await getTranslations({ locale, namespace: "PropertyDetails" })

    if (!property) {
      return {
        title: t("seoNotFound"),
        description: t("seoNotFoundDescription"),
      }
    }

        const transactionType = t(`transactionTypes.${property.transactionType}`) || property.transactionType
        const propertyType = t(`propertyTypes.${property.propertyType.toLowerCase()}`) || property.propertyType
        const localeMap: Record<string, string> = { pt: "pt-PT", en: "en-GB", fr: "fr-FR" }
        const numLocale = localeMap[locale] || "pt-PT"
        const price = parseFloat(property.price).toLocaleString(numLocale)
        const totalArea = property.totalArea ?? 0

        const title = `${property.title} - ${price} €`
        const bedroomsText = property.bedrooms > 0 ? t("seoBedrooms", { count: property.bedrooms }) : ''
        const bathroomsText = property.bathrooms > 0 ? `, ${t("seoBathrooms", { count: property.bathrooms })}` : ''
        const areaText = totalArea > 0 ? `, ${totalArea}m²` : ''
        const description = `${transactionType} ${propertyType} — ${property.concelho}, ${property.distrito}. ${bedroomsText}${bathroomsText}${areaText}. ${t("propertyInfoReference")}: ${property.reference}`

        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url

        // Get absolute URL for og:image — always use the canonical www domain
        const rawImage = property.image || ''
        const sourceImageUrl = rawImage.startsWith('http')
            ? rawImage.replace('https://agenciadouro.pt', 'https://www.agenciadouro.pt')
            : rawImage
                ? `${baseUrl}${rawImage}`
                : null
        // Proxy through /api/og-image to convert WebP → JPEG for Facebook/WhatsApp compatibility
        const imageUrl = sourceImageUrl
            ? `${baseUrl}/internal-api/og-image?url=${encodeURIComponent(sourceImageUrl)}`
            : `${baseUrl}/hero/hero1.jpg`
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
        url: canonicalUrl,
        type: "website",
        locale: locale === "pt" ? "pt_PT" : locale === "fr" ? "fr_FR" : "en_GB",
        images: [
          {
            url: imageUrl,
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
    const tFallback = await getTranslations({ locale, namespace: "PropertyDetails" })
    return {
      title: `${tFallback("seoNotFound")} | Agência Douro`,
      description: tFallback("seoNotFoundDescription"),
    }
  }
}

export default async function ImovelDetails({ params }: Props) {
    const { id, locale } = await params
  const tPage = await getTranslations({ locale, namespace: "Footer" })
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
          { name: tPage("properties"), path: "/imoveis" },
          { name: initialProperty.title },
        ]}
      />
      <ImovelDetailsClient initialProperty={initialProperty} />
    </>
  )
}
