"use client"

import Image from "next/image"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui-admin/card"
import { formatPriceNumber } from "@/lib/currency"

function isVideoUrl(url: string): boolean {
  const videoExtensions = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".flv", ".wmv", ".m4v"]
  return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext))
}

export interface AdminPropertyCardProps {
  href: string
  titulo: string
  localizacao: string
  preco: string
  image: string
  status?: string
}

export function AdminPropertyCard({
  href,
  titulo,
  localizacao,
  preco,
  image,
  status,
}: AdminPropertyCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="h-full overflow-hidden border-0 shadow-none transition-colors hover:bg-accent/50">
        <div className="relative aspect-[294/160] w-full shrink-0 overflow-hidden bg-muted">
          {isVideoUrl(image) ? (
            <video
              src={image}
              className="size-full object-cover"
              muted
              loop
              playsInline
              aria-hidden
            />
          ) : (
            <Image
              src={image}
              alt=""
              width={294}
              height={160}
              className="size-full object-cover"
            />
          )}
          {status === "reserved" && (
            <span
              className="absolute bottom-2 right-2 rounded bg-background px-1.5 py-1 text-xs font-medium text-foreground"
              aria-label="Reservado"
            >
              Reservado
            </span>
          )}
        </div>
        <CardContent className="flex flex-1 flex-col p-4">
          <p className="line-clamp-2 text-sm font-medium text-foreground text-pretty">
            {titulo}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{localizacao}</p>
          <p className="mt-2 tabular-nums text-sm font-semibold text-foreground">
            {formatPriceNumber(preco)}
            <span className="ml-0.5 font-normal text-muted-foreground">€</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
