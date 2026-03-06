import { NextRequest, NextResponse } from "next/server"
import sharp from "sharp"

const ALLOWED_HOSTS = ["agenciadouro.pt", "www.agenciadouro.pt"]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const url = searchParams.get("url")

  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 })
  }

  // Only allow images from our own domain
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return new NextResponse("Invalid url", { status: 400 })
  }

  if (!ALLOWED_HOSTS.includes(parsedUrl.hostname)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      return new NextResponse("Failed to fetch image", { status: 502 })
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    const jpeg = await sharp(buffer).jpeg({ quality: 85 }).toBuffer()

    return new NextResponse(new Uint8Array(jpeg), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    })
  } catch {
    return new NextResponse("Image processing failed", { status: 500 })
  }
}
