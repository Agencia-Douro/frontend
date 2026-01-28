"use client"

import { useQuery } from "@tanstack/react-query"
import { propertyFractionsApi } from "@/services/api"
import { PropertyFraction } from "@/types/property"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const PHONE_NUMBER = "+351937644165"

const DEFAULT_COLUMNS = [
  { key: "nature", label: "Natureza" },
  { key: "fractionType", label: "Tipologia" },
  { key: "floor", label: "Piso" },
  { key: "unit", label: "Fração" },
  { key: "grossArea", label: "Área Bruta" },
  { key: "outdoorArea", label: "Área Ext." },
  { key: "parkingSpaces", label: "Lugares de Garagem" },
  { key: "price", label: "Preço" },
  { key: "reservationStatus", label: "Status" },
  { key: "floorPlan", label: "Planta" },
]

const RESERVATION_STATUS_LABELS: Record<string, string> = {
  available: "Disponível",
  reserved: "Reservado",
  sold: "Vendido",
}

function getFractionLabel(
  fraction: PropertyFraction,
  field: "nature" | "fractionType" | "floor" | "unit",
  locale: string
): string {
  const suffix = locale === "en" ? "_en" : locale === "fr" ? "_fr" : "_pt"
  const key = `${field}${suffix}` as keyof PropertyFraction
  const value = fraction[key]
  if (typeof value === "string" && value) return value
  const ptKey = `${field}_pt` as keyof PropertyFraction
  return (fraction[ptKey] as string) || "-"
}

interface PropertyFractionsSectionProps {
  propertyId: string
  locale?: string
  title?: string
  description?: string
  loadingText?: string
  callNowLabel?: string
}

export default function PropertyFractionsSection({
  propertyId,
  locale = "pt",
  title = "Frações",
  description = "Unidades e frações disponíveis neste empreendimento",
  loadingText = "A carregar frações...",
  callNowLabel = "Ligue Agora",
}: PropertyFractionsSectionProps) {
  const { data: fractions, isLoading } = useQuery({
    queryKey: ["property-fractions", propertyId],
    queryFn: () => propertyFractionsApi.getAll(propertyId),
    enabled: !!propertyId,
  })

  const { data: customColumns = [] } = useQuery({
    queryKey: ["property-fraction-columns", propertyId],
    queryFn: () => propertyFractionsApi.getColumns(propertyId),
    enabled: !!propertyId && (fractions?.length ?? 0) > 0,
  })

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-"
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatArea = (value: number | null) => {
    if (value === null) return "-"
    return `${value} m²`
  }

  const getStatusLabel = (status: string) =>
    RESERVATION_STATUS_LABELS[status] ?? status

  if (isLoading) {
    return (
      <section className="container py-8">
        <div className="text-center py-8 text-brown/60 body-14-regular">
          {loadingText}
        </div>
      </section>
    )
  }

  if (!fractions || fractions.length === 0) {
    return null
  }

  return (
    <section className="container py-8 border-t border-brown/10">
      <div className="mb-6">
        <h2 className="heading-quatro-medium text-brown">{title}</h2>
        <p className="body-14-regular text-brown/70 mt-1">{description}</p>
      </div>
      <div className="border border-brown/10 rounded-lg overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <Table className="min-w-max [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap">
          <TableHeader>
            <TableRow className="border-brown/10 bg-brown/5">
              {DEFAULT_COLUMNS.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "text-brown body-14-medium",
                    col.key === "grossArea" ||
                      col.key === "outdoorArea" ||
                      col.key === "price"
                      ? "text-right"
                      : col.key === "parkingSpaces" ||
                        col.key === "floorPlan" ||
                        col.key === "reservationStatus"
                        ? "text-center"
                        : ""
                  )}
                >
                  {col.key === "parkingSpaces" ? (
                    <>
                      <span className="md:hidden">Garagem</span>
                      <span className="hidden md:inline">Lugares de Garagem</span>
                    </>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              {customColumns.map((col) => (
                <TableHead key={col.id} className="text-brown body-14-medium">
                  {col.label_pt}
                </TableHead>
              ))}
              <TableHead className="text-center text-brown body-14-medium">
                {callNowLabel}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fractions.map((fraction) => (
              <TableRow key={fraction.id} className="border-brown/10">
                <TableCell className="body-14-regular text-brown">
                  {getFractionLabel(fraction, "nature", locale)}
                </TableCell>
                <TableCell className="body-14-regular text-brown">
                  {getFractionLabel(fraction, "fractionType", locale)}
                </TableCell>
                <TableCell className="body-14-regular text-brown">
                  {getFractionLabel(fraction, "floor", locale)}
                </TableCell>
                <TableCell className="body-14-regular text-brown">
                  {getFractionLabel(fraction, "unit", locale)}
                </TableCell>
                <TableCell className="text-right body-14-regular text-brown">
                  {formatArea(fraction.grossArea)}
                </TableCell>
                <TableCell className="text-right body-14-regular text-brown">
                  {formatArea(fraction.outdoorArea)}
                </TableCell>
                <TableCell className="text-center body-14-regular text-brown">
                  {fraction.parkingSpaces}
                </TableCell>
                <TableCell className="text-right body-14-regular text-brown">
                  {formatCurrency(fraction.price)}
                </TableCell>
                <TableCell className="text-center body-14-regular text-brown">
                  {getStatusLabel(fraction.reservationStatus)}
                </TableCell>
                <TableCell className="text-center">
                  {fraction.floorPlan ? (
                    <a
                      href={fraction.floorPlan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gold hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
                {customColumns.map((col) => (
                  <TableCell
                    key={col.id}
                    className="body-14-regular text-brown"
                  >
                    {fraction.customData?.[col.columnKey] ?? "-"}
                  </TableCell>
                ))}
                <TableCell className="text-center whitespace-nowrap">
                  <a
                    href={`tel:${PHONE_NUMBER}`}
                    className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-xs font-medium bg-gold text-white hover:bg-gold-muted transition-colors whitespace-nowrap shrink-0"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="shrink-0">{callNowLabel}</span>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
