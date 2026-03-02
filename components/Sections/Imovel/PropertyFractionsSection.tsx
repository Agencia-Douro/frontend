"use client"

import { useQuery } from "@tanstack/react-query"
import { useRef, useState, useEffect, Fragment } from "react"
import { propertyFractionsApi } from "@/services/api"
import { PropertyFraction } from "@/types/property"
import { FileText, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
const PHONE_NUMBER = "+351919766324"

const DEFAULT_COLUMNS = [
  { key: "nature", label: "Natureza" },
  { key: "fractionType", label: "Tipologia" },
  { key: "floor", label: "Piso" },
  { key: "unit", label: "Fração" },
  { key: "grossArea", label: "Área Total" },
  { key: "privateGrossArea", label: "Área Bruta Privativa" },
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
  const str = typeof value === "string" ? value.trim() : ""
  if (str) return str
  const ptKey = `${field}_pt` as keyof PropertyFraction
  const ptVal = fraction[ptKey]
  const ptStr = typeof ptVal === "string" ? ptVal.trim() : ""
  return ptStr || "-"
}

const EMPTY_PLACEHOLDERS = ["", "-", "n/a", "null"]

function hasNatureValue(fraction: PropertyFraction): boolean {
  const values = [
    (fraction.nature_pt as string)?.trim() ?? "",
    (fraction.nature_en as string)?.trim() ?? "",
    (fraction.nature_fr as string)?.trim() ?? "",
  ]
  return values.some(
    (v) => v.length > 0 && !EMPTY_PLACEHOLDERS.includes(v.toLowerCase())
  )
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

  const scrollRef = useRef<HTMLDivElement>(null)
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = useState(false)
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const check = () => setHasHorizontalOverflow(el.scrollWidth > el.clientWidth)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fractions, customColumns])

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

  const columnHasValue = (key: string): boolean => {
    return fractions.some((fraction) => {
      switch (key) {
        case "nature":
          return hasNatureValue(fraction)
        case "fractionType":
        case "floor":
        case "unit":
          return getFractionLabel(fraction, key as "fractionType" | "floor" | "unit", locale) !== "-"
        case "grossArea":
          return fraction.grossArea !== null
        case "privateGrossArea":
          return fraction.privateGrossArea !== null
        case "outdoorArea":
          return fraction.outdoorArea !== null
        case "parkingSpaces":
          return fraction.parkingSpaces !== null && fraction.parkingSpaces !== undefined
        case "price":
          return fraction.price !== null
        case "reservationStatus":
          return true
        case "floorPlan":
          return !!fraction.floorPlan
        default:
          return false
      }
    })
  }

  const activeColumns = DEFAULT_COLUMNS.filter((col) => columnHasValue(col.key))
  const columnsBeforePlanta = activeColumns.filter((col) => col.key !== "floorPlan")
  const plantaColumn = activeColumns.filter((col) => col.key === "floorPlan")
  const displayColumns: Array<{ type: "default"; key: string } | { type: "custom"; id: string; columnKey: string; label_pt: string }> = [
    ...columnsBeforePlanta.map((col) => ({ type: "default" as const, key: col.key })),
    ...customColumns.map((col) => ({ type: "custom" as const, id: col.id, columnKey: col.columnKey, label_pt: col.label_pt })),
    ...plantaColumn.map((col) => ({ type: "default" as const, key: col.key })),
  ]

  const renderCell = (key: string, fraction: PropertyFraction) => {
    switch (key) {
      case "nature":
      case "fractionType":
      case "floor":
      case "unit":
        return getFractionLabel(fraction, key as "nature" | "fractionType" | "floor" | "unit", locale)
      case "grossArea":
        return formatArea(fraction.grossArea)
      case "privateGrossArea":
        return formatArea(fraction.privateGrossArea)
      case "outdoorArea":
        return formatArea(fraction.outdoorArea)
      case "parkingSpaces":
        return fraction.parkingSpaces
      case "price":
        return formatCurrency(fraction.price)
      case "reservationStatus":
        return getStatusLabel(fraction.reservationStatus)
      case "floorPlan":
        return fraction.floorPlan ? (
          <a
            href={fraction.floorPlan}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-gold hover:underline"
          >
            <FileText className="h-4 w-4" />
          </a>
        ) : "-"
      default:
        return "-"
    }
  }

  const getHeadClassName = (key: string) =>
    cn(
      "text-brown body-14-medium",
      key === "grossArea" || key === "privateGrossArea" || key === "outdoorArea" || key === "price"
        ? "text-right"
        : key === "parkingSpaces" || key === "floorPlan" || key === "reservationStatus"
          ? "text-center"
          : ""
    )

  const getCellClassName = (key: string) =>
    cn(
      "body-14-regular text-brown",
      key === "grossArea" || key === "privateGrossArea" || key === "outdoorArea" || key === "price"
        ? "text-right"
        : key === "parkingSpaces" || key === "floorPlan" || key === "reservationStatus"
          ? "text-center"
          : ""
    )

  const getHeadDisplayLabel = (key: string) => {
    if (key === "parkingSpaces") return "Garagem"
    if (key === "privateGrossArea") return "Área Bru."
    if (key === "outdoorArea") return "Área Ext."
    return DEFAULT_COLUMNS.find((c) => c.key === key)?.label ?? key
  }

  const MIN_CONTENT_COLUMN_KEYS = ["floor", "unit"]
  const MIN_WIDTH_COLUMN_KEYS = [
    "fractionType",
    "grossArea",
    "privateGrossArea",
    "outdoorArea",
    "parkingSpaces",
    "reservationStatus",
    "floorPlan",
  ]
  const getColGridSize = (key: string) => {
    if (MIN_CONTENT_COLUMN_KEYS.includes(key)) return "minmax(3.5rem, min-content)"
    if (MIN_WIDTH_COLUMN_KEYS.includes(key)) return "minmax(min-content, 0.4fr)"
    return "minmax(0, 1fr)"
  }
  const gridCols = displayColumns
    .map((col) =>
      col.type === "default"
        ? getColGridSize(col.key)
        : "minmax(min-content, 1fr)"
    )
    .join(" ")

  const callNowButton = (
    <a
      href={`tel:${PHONE_NUMBER}`}
      className="inline-flex items-center justify-center gap-1.5 h-9 px-4 text-sm font-medium bg-gold text-white hover:bg-gold-muted transition-colors shrink-0"
      aria-label={callNowLabel}
    >
      <Phone className="h-4 w-4 shrink-0" />
      <span>{callNowLabel}</span>
    </a>
  )

  return (
    <section className="container py-8 border-t border-brown/10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="heading-quatro-medium text-brown">{title}</h2>
          <p className="body-14-regular text-brown/70 mt-1 text-pretty">{description}</p>
        </div>
        {callNowButton}
      </div>

      {/* Tabela: scroll horizontal quando necessário */}
      {hasHorizontalOverflow && (
        <p className="body-14-regular text-brown/70 mb-2">
          Faça scroll na horizontal para ver o resto da tabela
        </p>
      )}
      <div ref={scrollRef} className="w-full overflow-x-auto">
        <div
          className="min-w-max grid"
          style={{ gridTemplateColumns: gridCols }}
          onMouseLeave={() => setHoveredRowIndex(null)}
        >
          {/* Header (th) */}
          {displayColumns.map((col) =>
            col.type === "default" ? (
              <div
                key={`head-${col.key}`}
                className={cn(
                  "h-12 px-4 flex items-center text-brown body-14-medium min-w-0 border-b border-brown/20 bg-brown/5",
                  getHeadClassName(col.key)
                )}
              >
                <span className="block min-w-0 whitespace-nowrap">
                  {getHeadDisplayLabel(col.key)}
                </span>
              </div>
            ) : (
              <div
                key={`head-${col.id}`}
                className="h-12 px-4 flex items-center text-brown body-14-medium min-w-0 border-b border-brown/20 bg-brown/5"
              >
                <span className="block min-w-0 whitespace-nowrap">
                  {col.label_pt}
                </span>
              </div>
            )
          )}
          {/* Body (td) */}
          {fractions.map((fraction, rowIndex) => {
            const isLastRow = rowIndex === fractions.length - 1
            return (
              <Fragment key={fraction.id}>
                {displayColumns.map((col) => {
                  if (col.type === "default") {
                    const cellContent = renderCell(col.key, fraction)
                    return (
                      <div
                        key={`${fraction.id}-${col.key}`}
                        className={cn(
                          "p-4 flex items-center body-14-regular text-brown min-w-0 overflow-hidden border-b border-brown/20 transition-colors",
                          hoveredRowIndex === rowIndex && "bg-brown/5",
                          isLastRow && "border-b-0",
                          getCellClassName(col.key)
                        )}
                        onMouseEnter={() => setHoveredRowIndex(rowIndex)}
                      >
                        {typeof cellContent === "string" ? (
                          <span className="block min-w-0 whitespace-nowrap">{cellContent}</span>
                        ) : (
                          cellContent
                        )}
                      </div>
                    )
                  }
                  return (
                    <div
                      key={`${fraction.id}-${col.id}`}
                      className={cn(
                        "p-4 flex items-center body-14-regular text-brown min-w-0 overflow-hidden border-b border-brown/20 transition-colors",
                        hoveredRowIndex === rowIndex && "bg-brown/5",
                        isLastRow && "border-b-0"
                      )}
                      onMouseEnter={() => setHoveredRowIndex(rowIndex)}
                    >
                      <span className="block min-w-0 whitespace-nowrap">
                        {fraction.customData?.[col.columnKey] ?? "-"}
                      </span>
                    </div>
                  )
                })}
              </Fragment>
            )
          })}
        </div>
      </div>
    </section>
  )
}
