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
      // Vai directo ao backend (porta 3008) sem passar pelo nginx
      // property.image = "https://agenciadouro.pt/api/uploads/images/..."
      const internalUrl = property.image
        .replace("https://agenciadouro.pt/api/", "http://127.0.0.1:3008/")
        .replace("https://www.agenciadouro.pt/api/", "http://127.0.0.1:3008/")

      const res = await fetch(internalUrl, { signal: AbortSignal.timeout(8000) })
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer())
        imgSrc = `data:image/webp;base64,${buf.toString("base64")}`
      }
    }
  } catch {
    // fall through to branded fallback
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
