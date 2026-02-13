import type { MetadataRoute } from "next"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://agenciadouro.pt"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/internal-api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
