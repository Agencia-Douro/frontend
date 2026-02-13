import { siteConfig } from "@/lib/site"

type BreadcrumbItem = {
  name: string
  path?: string
}

type Props = {
  locale: string
  items: BreadcrumbItem[]
}

/**
 * Renders a BreadcrumbList JSON-LD schema for SEO.
 * Does NOT render visible breadcrumbs — only the structured data for Google.
 *
 * Usage:
 * <Breadcrumbs locale="pt" items={[{ name: "Imóveis", path: "/imoveis" }, { name: "T3 Porto" }]} />
 */
export function Breadcrumbs({ locale, items }: Props) {
  const baseUrl = siteConfig.url

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Início",
        item: `${baseUrl}/${locale}`,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        ...(item.path ? { item: `${baseUrl}/${locale}${item.path}` } : {}),
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  )
}
