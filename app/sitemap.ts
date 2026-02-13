import type { MetadataRoute } from "next"
import { propertiesApi } from "@/services/api"
import { routing } from "@/i18n/routing"
import { siteConfig } from "@/lib/site"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url
const locales = routing.locales

const staticPaths = [
  "",
  "imoveis",
  "imoveis-luxo",
  "sobre-nos",
  "podcast",
  "vender-imovel",
  "avaliador-online",
  "politica-privacidade",
  "termos-condicoes",
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  const now = new Date().toISOString()

  for (const locale of locales) {
    for (const path of staticPaths) {
      const url = path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`
      entries.push({
        url,
        lastModified: now,
        changeFrequency: path === "" ? "daily" : "weekly",
        priority: path === "" ? 1 : 0.8,
      })
    }
  }

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
        for (const locale of locales) {
          entries.push({
            url: `${baseUrl}/${locale}/imoveis/${property.id}`,
            lastModified: property.updatedAt ?? now,
            changeFrequency: "weekly",
            priority: 0.7,
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
