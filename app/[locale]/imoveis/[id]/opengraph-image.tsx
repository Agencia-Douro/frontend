import { ImageResponse } from "next/og"
import { propertiesApi } from "@/services/api"

export const runtime = "nodejs"
export const alt = "Property"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

type Props = {
  params: Promise<{ id: string; locale: string }>
}

export default async function Image({ params }: Props) {
  const { id, locale } = await params

  let imgSrc: string | null = null

  try {
    const property = await propertiesApi.getById(id, locale)

    if (property?.image) {
      const rawUrl = property.image.startsWith("http")
        ? property.image.replace("https://agenciadouro.pt", "https://www.agenciadouro.pt")
        : `https://www.agenciadouro.pt${property.image}`

      try {
        // Convert WebP → JPEG via sharp so Facebook always gets a compatible format
        const sharp = (await import("sharp")).default
        const res = await fetch(rawUrl, { signal: AbortSignal.timeout(8000) })
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer())
          const jpeg = await sharp(buf).jpeg({ quality: 85 }).toBuffer()
          imgSrc = `data:image/jpeg;base64,${jpeg.toString("base64")}`
        } else {
          // fetch failed (non-2xx) — let ImageResponse try the URL directly
          imgSrc = rawUrl
        }
      } catch {
        // sharp unavailable or fetch error — let ImageResponse fetch the URL directly
        imgSrc = rawUrl
      }
    }
  } catch {
    // property fetch failed — fall through to branded fallback
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        backgroundColor: "#f5f0e8",
      }}
    >
      {imgSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imgSrc}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            fontSize: 48,
            color: "#8B7355",
            fontFamily: "serif",
          }}
        >
          Agência Douro
        </div>
      )}
    </div>,
    size
  )
}
