import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/internal-api/",
          "/api/",
          "/_next/",
          "/wp-admin/",
          "/wp-content/",
          "/wp-json/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
