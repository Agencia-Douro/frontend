import type { MetadataRoute } from "next"
import { propertiesApi } from "@/services/api"
import { routing } from "@/i18n/routing"
import { siteConfig } from "@/lib/site"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url
const locales = routing.locales
const defaultLocale = routing.defaultLocale

const staticPaths = [
  { path: "", changeFrequency: "daily" as const, priority: 1 },
  { path: "imoveis", changeFrequency: "daily" as const, priority: 0.9 },
  { path: "imoveis-luxo", changeFrequency: "daily" as const, priority: 0.9 },
  { path: "vender-imovel", changeFrequency: "weekly" as const, priority: 0.8 },
  { path: "sobre-nos", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "podcast", changeFrequency: "weekly" as const, priority: 0.7 },
  { path: "avaliador-online", changeFrequency: "monthly" as const, priority: 0.7 },
  { path: "politica-privacidade", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "termos-condicoes", changeFrequency: "yearly" as const, priority: 0.3 },
] as const

function buildAlternates(path: string) {
  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale] = path
      ? `${baseUrl}/${locale}/${path}`
      : `${baseUrl}/${locale}`
  }
  // x-default aponta para o locale default
  languages["x-default"] = path
    ? `${baseUrl}/${defaultLocale}/${path}`
    : `${baseUrl}/${defaultLocale}`
  return { languages }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date().toISOString()

  // Páginas estáticas — uma entrada por locale com alternates hreflang
  for (const locale of locales) {
    for (const { path, changeFrequency, priority } of staticPaths) {
      const url = path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`
      entries.push({
        url,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: buildAlternates(path),
      })
    }
  }

  // Páginas de imóveis dinâmicas
  try {
    let page = 1
    const limit = 100
    let totalPages = 1

    do {
      const res = await propertiesApi.getAll({
        status: "active",
        page,
        limit,
      })
      for (const property of res.data) {
        const propertyPath = `imoveis/${property.id}`
        for (const locale of locales) {
          entries.push({
            url: `${baseUrl}/${locale}/${propertyPath}`,
            lastModified: property.updatedAt ?? now,
            changeFrequency: "weekly",
            priority: 0.6,
            alternates: buildAlternates(propertyPath),
          })
        }
      }
      totalPages = res.totalPages ?? 1
      page++
    } while (page <= totalPages)
  } catch {
    // Se a API falhar (ex.: build sem API), sitemap inclui só as estáticas
  }

  return entries
}
