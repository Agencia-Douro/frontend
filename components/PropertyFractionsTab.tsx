"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Trash2,
  FileText,
  ChevronDown,
  ChevronUp,
  Settings,
  GripVertical,
  Upload,
  X,
} from "lucide-react";
import {
  PropertyFraction,
  PropertyFractionColumn,
  CreatePropertyFractionDto,
  CreatePropertyFractionColumnDto,
} from "@/types/property";
import { propertyFractionsApi, uploadApi } from "@/services/api";
import { toast } from "sonner";
import CurrencyInput from "react-currency-input-field";
import { cn } from "@/lib/utils";

interface PropertyFractionsTabProps {
  propertyId?: string;
  isEditMode: boolean;
  onPendingFractionsChange?: (fractions: CreatePropertyFractionDto[]) => void;
  pendingFractions?: CreatePropertyFractionDto[];
}

// Opções padrão
const NATURE_OPTIONS = [
  { pt: "Apartamento", en: "Apartment", fr: "Appartement" },
  { pt: "Moradia", en: "House", fr: "Maison" },
  { pt: "Loja", en: "Shop", fr: "Boutique" },
  { pt: "Escritório", en: "Office", fr: "Bureau" },
  { pt: "Armazém", en: "Warehouse", fr: "Entrepôt" },
];

const FRACTION_TYPE_OPTIONS = [
  { pt: "T0", en: "Studio", fr: "Studio" },
  { pt: "T1", en: "1 Bed", fr: "T1" },
  { pt: "T1+1", en: "1+1 Bed", fr: "T1+1" },
  { pt: "T2", en: "2 Bed", fr: "T2" },
  { pt: "T2+1", en: "2+1 Bed", fr: "T2+1" },
  { pt: "T3", en: "3 Bed", fr: "T3" },
  { pt: "T3+1", en: "3+1 Bed", fr: "T3+1" },
  { pt: "T4", en: "4 Bed", fr: "T4" },
  { pt: "T5+", en: "5+ Bed", fr: "T5+" },
];

const RESERVATION_STATUS_OPTIONS = [
  { value: "available", label: "Disponível", color: "bg-green-500" },
  { value: "reserved", label: "Reservado", color: "bg-yellow-500" },
  { value: "sold", label: "Vendido", color: "bg-red-500" },
];

// Colunas padrão da tabela
const DEFAULT_COLUMNS = [
  { key: "nature", label: "Natureza", visible: true },
  { key: "fractionType", label: "Tipologia", visible: true },
  { key: "floor", label: "Piso", visible: true },
  { key: "unit", label: "Fração", visible: true },
  { key: "grossArea", label: "Área Bruta", visible: true },
  { key: "outdoorArea", label: "Área Ext.", visible: true },
  { key: "parkingSpaces", label: "Lugares de Garagem", visible: true },
  { key: "price", label: "Preço", visible: true },
  { key: "floorPlan", label: "Planta", visible: true },
  { key: "reservationStatus", label: "Status", visible: true },
];

const COLUMN_DATA_TYPES = [
  { value: "text", label: "Texto" },
  { value: "number", label: "Número" },
  { value: "currency", label: "Moeda (€)" },
  { value: "area", label: "Área (m²)" },
  { value: "select", label: "Seleção" },
];

export function PropertyFractionsTab({
  propertyId,
  isEditMode,
  onPendingFractionsChange,
  pendingFractions = [],
}: PropertyFractionsTabProps) {
  const [fractions, setFractions] = useState<PropertyFraction[]>([]);
  const [customColumns, setCustomColumns] = useState<PropertyFractionColumn[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showColumnConfig, setShowColumnConfig] = useState(false);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [floorPlanUploading, setFloorPlanUploading] = useState(false);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);

  // Estado para visibilidade das colunas padrão (local)
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(
    DEFAULT_COLUMNS.reduce(
      (acc, col) => ({ ...acc, [col.key]: col.visible }),
      {}
    )
  );

  // Estado para nova coluna personalizada
  const [newColumn, setNewColumn] = useState<CreatePropertyFractionColumnDto>({
    columnKey: "",
    label_pt: "",
    label_en: null,
    label_fr: null,
    dataType: "text",
    selectOptions: null,
    isVisible: true,
    isRequired: false,
    displayOrder: 0,
  });

  // Estado para nova fração
  const [newFraction, setNewFraction] = useState<CreatePropertyFractionDto>({
    nature_pt: null,
    nature_en: null,
    nature_fr: null,
    fractionType_pt: null,
    fractionType_en: null,
    fractionType_fr: null,
    floor_pt: null,
    floor_en: null,
    floor_fr: null,
    unit_pt: null,
    unit_en: null,
    unit_fr: null,
    grossArea: null,
    outdoorArea: null,
    parkingSpaces: 0,
    price: null,
    floorPlan: null,
    reservationStatus: "available",
    displayOrder: 0,
    customData: null,
  });

  // Carregar frações existentes no modo de edição
  useEffect(() => {
    if (isEditMode && propertyId) {
      loadFractions();
    }
  }, [isEditMode, propertyId]);

  // Manter newFraction.customData em sync com customColumns: remover chaves de colunas que já não existem
  useEffect(() => {
    if (
      newFraction.customData &&
      Object.keys(newFraction.customData).length > 0
    ) {
      const validKeys = new Set(customColumns.map((c) => c.columnKey));
      const filtered = Object.fromEntries(
        Object.entries(newFraction.customData).filter(([k]) =>
          validKeys.has(k)
        )
      );
      if (
        Object.keys(filtered).length !==
        Object.keys(newFraction.customData).length
      ) {
        setNewFraction((prev) => ({
          ...prev,
          customData:
            Object.keys(filtered).length > 0 ? filtered : null,
        }));
      }
    }
  }, [customColumns]);

  const loadFractions = async () => {
    if (!propertyId) return;

    try {
      setIsLoading(true);
      const [fractionsData, columnsData] = await Promise.all([
        propertyFractionsApi.getAll(propertyId),
        propertyFractionsApi.getColumns(propertyId),
      ]);
      setFractions(fractionsData);
      setCustomColumns(columnsData);
    } catch (error) {
      console.error("Erro ao carregar frações:", error);
      toast.error("Erro ao carregar frações");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNatureChange = (value: string) => {
    const option = NATURE_OPTIONS.find((o) => o.pt === value);
    if (option) {
      setNewFraction({
        ...newFraction,
        nature_pt: option.pt,
        nature_en: option.en,
        nature_fr: option.fr,
      });
    }
  };

  const handleFractionTypeChange = (value: string) => {
    const option = FRACTION_TYPE_OPTIONS.find((o) => o.pt === value);
    if (option) {
      setNewFraction({
        ...newFraction,
        fractionType_pt: option.pt,
        fractionType_en: option.en,
        fractionType_fr: option.fr,
      });
    }
  };

  const resetNewFraction = () => {
    setNewFraction({
      nature_pt: null,
      nature_en: null,
      nature_fr: null,
      fractionType_pt: null,
      fractionType_en: null,
      fractionType_fr: null,
      floor_pt: null,
      floor_en: null,
      floor_fr: null,
      unit_pt: null,
      unit_en: null,
      unit_fr: null,
      grossArea: null,
      outdoorArea: null,
      parkingSpaces: 0,
      price: null,
      floorPlan: null,
      reservationStatus: "available",
      displayOrder: fractions.length + pendingFractions.length,
      customData: null,
    });
  };

  const resetNewColumn = () => {
    setNewColumn({
      columnKey: "",
      label_pt: "",
      label_en: null,
      label_fr: null,
      dataType: "text",
      selectOptions: null,
      isVisible: true,
      isRequired: false,
      displayOrder: customColumns.length,
    });
  };

  const handleAddFraction = async () => {
    if (isEditMode && propertyId) {
      try {
        const created = await propertyFractionsApi.create(
          propertyId,
          newFraction
        );
        setFractions([...fractions, created]);
        toast.success("Fração adicionada com sucesso");
        setIsAddDialogOpen(false);
        resetNewFraction();
      } catch (error) {
        toast.error("Erro ao adicionar fração");
      }
    } else {
      const updated = [...pendingFractions, newFraction];
      onPendingFractionsChange?.(updated);
      setIsAddDialogOpen(false);
      resetNewFraction();
      toast.success("Fração adicionada (será salva com a propriedade)");
    }
  };

  const handleAddColumn = async () => {
    if (!newColumn.columnKey || !newColumn.label_pt) {
      toast.error("Preencha a chave e o label da coluna");
      return;
    }

    if (isEditMode && propertyId) {
      try {
        const created = await propertyFractionsApi.createColumn(
          propertyId,
          newColumn
        );
        setCustomColumns([...customColumns, created]);
        toast.success("Coluna adicionada com sucesso");
        setIsAddColumnDialogOpen(false);
        resetNewColumn();
      } catch (error) {
        toast.error("Erro ao adicionar coluna");
      }
    } else {
      toast.info(
        "Colunas personalizadas só podem ser adicionadas após criar a propriedade"
      );
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!isEditMode) return;

    if (!confirm("Tem certeza que deseja excluir esta coluna?")) return;

    const columnToDelete = customColumns.find((c) => c.id === columnId);
    const columnKeyToRemove = columnToDelete?.columnKey;

    try {
      await propertyFractionsApi.deleteColumn(columnId);
      setCustomColumns(customColumns.filter((c) => c.id !== columnId));
      // Remover a coluna do customData da nova fração para não continuar a aparecer no modal
      if (columnKeyToRemove) {
        setNewFraction((prev) => ({
          ...prev,
          customData:
            prev.customData && columnKeyToRemove in prev.customData
              ? (() => {
                const next = { ...prev.customData };
                delete next[columnKeyToRemove];
                return Object.keys(next).length > 0 ? next : null;
              })()
              : prev.customData,
        }));
      }
      toast.success("Coluna excluída");
    } catch (error) {
      toast.error("Erro ao excluir coluna");
    }
  };

  const handleUpdateFraction = async (
    fractionId: string,
    data: Partial<PropertyFraction>
  ) => {
    if (!isEditMode) return;

    try {
      const updated = await propertyFractionsApi.update(fractionId, data);
      setFractions(fractions.map((f) => (f.id === fractionId ? updated : f)));
      toast.success("Fração atualizada");
    } catch (error) {
      toast.error("Erro ao atualizar fração");
    }
  };

  const handleDeleteFraction = async (fractionId: string) => {
    if (!isEditMode) return;

    if (!confirm("Tem certeza que deseja excluir esta fração?")) return;

    try {
      await propertyFractionsApi.delete(fractionId);
      setFractions(fractions.filter((f) => f.id !== fractionId));
      toast.success("Fração excluída");
    } catch (error) {
      toast.error("Erro ao excluir fração");
    }
  };

  const handleDeletePendingFraction = (index: number) => {
    const updated = pendingFractions.filter((_, i) => i !== index);
    onPendingFractionsChange?.(updated);
    toast.success("Fração removida");
  };

  const toggleColumnVisibility = (key: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatArea = (value: number | null) => {
    if (value === null) return "-";
    return `${value} m²`;
  };

  const getStatusLabel = (status: string) => {
    const option = RESERVATION_STATUS_OPTIONS.find((o) => o.value === status);
    return option?.label ?? status;
  };

  // Combinar frações salvas e pendentes para exibição
  const allFractions = isEditMode
    ? fractions
    : pendingFractions.map((f, index) => ({
      ...f,
      id: `pending-${index}`,
      propertyId: "",
      createdAt: "",
      updatedAt: "",
    }));

  // Colunas visíveis
  const visibleDefaultColumns = DEFAULT_COLUMNS.filter(
    (col) => columnVisibility[col.key]
  );

  return (
    <div className="space-y-6">
      {/* Header com botões de ação */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Frações do Imóvel</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie as unidades/frações disponíveis neste empreendimento
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={() => setShowColumnConfig(!showColumnConfig)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showColumnConfig ? "Ocultar Configuração" : "Configurar Colunas"}
            {showColumnConfig ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" size="default">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Fração
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Fração</DialogTitle>
                <DialogDescription>
                  Preencha os dados da fração/unidade
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* Natureza e Tipologia – só mostramos se a coluna estiver visível */}
                {(columnVisibility["nature"] ||
                  columnVisibility["fractionType"]) && (
                    <div className="grid grid-cols-2 gap-4">
                      {columnVisibility["nature"] && (
                        <div className="space-y-2">
                          <Label>Natureza</Label>
                          <Select
                            value={newFraction.nature_pt || undefined}
                            onValueChange={handleNatureChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {NATURE_OPTIONS.map((option) => (
                                <SelectItem key={option.pt} value={option.pt}>
                                  {option.pt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      {columnVisibility["fractionType"] && (
                        <div className="space-y-2">
                          <Label>Tipologia</Label>
                          <Select
                            value={newFraction.fractionType_pt || undefined}
                            onValueChange={handleFractionTypeChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {FRACTION_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option.pt} value={option.pt}>
                                  {option.pt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                {/* Piso e Fração */}
                {(columnVisibility["floor"] || columnVisibility["unit"]) && (
                  <div className="grid grid-cols-2 gap-4">
                    {columnVisibility["floor"] && (
                      <div className="space-y-2">
                        <Label>Piso</Label>
                        <Input
                          placeholder="Ex: R/C, 1º, 2º..."
                          value={newFraction.floor_pt || ""}
                          onChange={(e) =>
                            setNewFraction({
                              ...newFraction,
                              floor_pt: e.target.value || null,
                              floor_en: e.target.value || null,
                              floor_fr: e.target.value || null,
                            })
                          }
                        />
                      </div>
                    )}
                    {columnVisibility["unit"] && (
                      <div className="space-y-2">
                        <Label>Fração/Unidade</Label>
                        <Input
                          placeholder="Ex: A, B, 101..."
                          value={newFraction.unit_pt || ""}
                          onChange={(e) =>
                            setNewFraction({
                              ...newFraction,
                              unit_pt: e.target.value || null,
                              unit_en: e.target.value || null,
                              unit_fr: e.target.value || null,
                            })
                          }
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Áreas */}
                {(columnVisibility["grossArea"] ||
                  columnVisibility["outdoorArea"]) && (
                    <div className="grid grid-cols-2 gap-4">
                      {columnVisibility["grossArea"] && (
                        <div className="space-y-2">
                          <Label>Área Bruta (m²)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Ex: 100"
                            value={newFraction.grossArea ?? ""}
                            onChange={(e) =>
                              setNewFraction({
                                ...newFraction,
                                grossArea: e.target.value
                                  ? parseFloat(e.target.value)
                                  : null,
                              })
                            }
                          />
                        </div>
                      )}
                      {columnVisibility["outdoorArea"] && (
                        <div className="space-y-2">
                          <Label>Área Exterior (m²)</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Ex: 20"
                            value={newFraction.outdoorArea ?? ""}
                            onChange={(e) =>
                              setNewFraction({
                                ...newFraction,
                                outdoorArea: e.target.value
                                  ? parseFloat(e.target.value)
                                  : null,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                {/* Estacionamento e Preço */}
                {(columnVisibility["parkingSpaces"] ||
                  columnVisibility["price"]) && (
                    <div className="grid grid-cols-2 gap-4">
                      {columnVisibility["parkingSpaces"] && (
                        <div className="space-y-2">
                          <Label>Lugares de Garagem</Label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Ex: 1"
                            value={newFraction.parkingSpaces || ""}
                            onChange={(e) =>
                              setNewFraction({
                                ...newFraction,
                                parkingSpaces: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      )}
                      {columnVisibility["price"] && (
                        <div className="space-y-2">
                          <Label>Preço (€)</Label>
                          <CurrencyInput
                            id="fraction-price"
                            name="price"
                            placeholder="250.000 €"
                            value={newFraction.price ?? ""}
                            decimalsLimit={0}
                            groupSeparator="."
                            decimalSeparator=","
                            suffix=" €"
                            onValueChange={(value) => {
                              setNewFraction({
                                ...newFraction,
                                price: value ? parseFloat(value) : null,
                              });
                            }}
                            className={cn(
                              "text-black-muted w-full shadow-pretty placeholder:text-grey bg-white px-2 py-1.5 body-14-medium outline-none disabled:cursor-not-allowed disabled:opacity-50 h-9"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  )}

                {/* Planta e Status – só mostramos se a coluna estiver visível */}
                {(columnVisibility["floorPlan"] ||
                  columnVisibility["reservationStatus"]) && (
                    <div className="grid grid-cols-2 gap-4">
                      {columnVisibility["floorPlan"] && (
                        <div className="space-y-2">
                          <Label>Planta (PDF ou imagem)</Label>
                          <input
                            ref={floorPlanInputRef}
                            type="file"
                            accept=".pdf,application/pdf,image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setFloorPlanUploading(true);
                              try {
                                const result = await uploadApi.uploadFile(
                                  file,
                                  isEditMode ? propertyId : undefined,
                                );
                                setNewFraction({
                                  ...newFraction,
                                  floorPlan: result.url,
                                });
                                toast.success("Planta enviada com sucesso");
                              } catch (err) {
                                toast.error(
                                  err instanceof Error
                                    ? err.message
                                    : "Erro ao enviar planta",
                                );
                              } finally {
                                setFloorPlanUploading(false);
                                e.target.value = "";
                              }
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="default"
                              disabled={floorPlanUploading}
                              onClick={() =>
                                floorPlanInputRef.current?.click()
                              }
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {floorPlanUploading
                                ? "A enviar..."
                                : newFraction.floorPlan
                                  ? "Substituir ficheiro"
                                  : "Escolher ficheiro"}
                            </Button>
                            {newFraction.floorPlan && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setNewFraction({
                                    ...newFraction,
                                    floorPlan: null,
                                  })
                                }
                                title="Remover planta"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {newFraction.floorPlan && !floorPlanUploading && (
                            <p className="text-xs text-muted-foreground truncate">
                              Planta anexada.{" "}
                              <a
                                href={newFraction.floorPlan}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Abrir
                              </a>
                            </p>
                          )}
                        </div>
                      )}
                      {columnVisibility["reservationStatus"] && (
                        <div className="space-y-2">
                          <Label>Status de Reserva</Label>
                          <Select
                            value={newFraction.reservationStatus}
                            onValueChange={(value) =>
                              setNewFraction({
                                ...newFraction,
                                reservationStatus: value as
                                  | "available"
                                  | "reserved"
                                  | "sold",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {RESERVATION_STATUS_OPTIONS.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  )}

                {/* Colunas personalizadas – sempre baseado em customColumns atual */}
                {customColumns.length > 0 && (
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-sm font-medium">Dados personalizados</h4>
                    <div className="grid gap-4">
                      {customColumns.map((col) => {
                        const value =
                          newFraction.customData?.[col.columnKey] ?? "";
                        return (
                          <div key={col.id} className="space-y-2">
                            <Label>{col.label_pt}</Label>
                            {col.dataType === "select" &&
                              col.selectOptions?.length ? (
                              <Select
                                value={
                                  value !== "" && value != null
                                    ? String(value)
                                    : undefined
                                }
                                onValueChange={(v) =>
                                  setNewFraction({
                                    ...newFraction,
                                    customData: {
                                      ...(newFraction.customData || {}),
                                      [col.columnKey]: v,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  {col.selectOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : col.dataType === "currency" ? (
                              <CurrencyInput
                                value={value !== "" ? String(value) : ""}
                                decimalsLimit={0}
                                groupSeparator="."
                                decimalSeparator=","
                                suffix=" €"
                                onValueChange={(v) =>
                                  setNewFraction({
                                    ...newFraction,
                                    customData: {
                                      ...(newFraction.customData || {}),
                                      [col.columnKey]: v
                                        ? parseFloat(v)
                                        : null,
                                    },
                                  })
                                }
                                className={cn(
                                  "text-black-muted w-full shadow-pretty placeholder:text-grey bg-white px-2 py-1.5 body-14-medium outline-none disabled:cursor-not-allowed disabled:opacity-50 h-9"
                                )}
                              />
                            ) : col.dataType === "number" ||
                              col.dataType === "area" ? (
                              <Input
                                type="number"
                                min={0}
                                step={
                                  col.dataType === "area" ? "0.01" : "1"
                                }
                                placeholder={
                                  col.dataType === "area"
                                    ? "m²"
                                    : undefined
                                }
                                value={value !== "" ? String(value) : ""}
                                onChange={(e) =>
                                  setNewFraction({
                                    ...newFraction,
                                    customData: {
                                      ...(newFraction.customData || {}),
                                      [col.columnKey]:
                                        e.target.value !== ""
                                          ? parseFloat(e.target.value)
                                          : null,
                                    },
                                  })
                                }
                              />
                            ) : (
                              <Input
                                value={value !== "" ? String(value) : ""}
                                onChange={(e) =>
                                  setNewFraction({
                                    ...newFraction,
                                    customData: {
                                      ...(newFraction.customData || {}),
                                      [col.columnKey]:
                                        e.target.value || null,
                                    },
                                  })
                                }
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setFloorPlanUploading(false);
                    resetNewFraction();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="button" onClick={handleAddFraction}>
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Configuração de Colunas (colapsável) */}
      {showColumnConfig && (
        <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Configuração de Colunas</h4>
              <p className="text-sm text-muted-foreground">
                Escolha quais colunas exibir na tabela
              </p>
            </div>
            {isEditMode && propertyId && (
              <Dialog
                open={isAddColumnDialogOpen}
                onOpenChange={setIsAddColumnDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="default">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Coluna
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Coluna Personalizada</DialogTitle>
                    <DialogDescription>
                      Crie uma coluna adicional para suas frações
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>
                        Chave da Coluna <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ex: garagem_tipo"
                        value={newColumn.columnKey}
                        onChange={(e) =>
                          setNewColumn({
                            ...newColumn,
                            columnKey: e.target.value
                              .toLowerCase()
                              .replace(/\s/g, "_"),
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Identificador único, sem espaços
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>
                        Label <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Ex: Tipo de Garagem"
                        value={newColumn.label_pt}
                        onChange={(e) =>
                          setNewColumn({ ...newColumn, label_pt: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Dados</Label>
                      <Select
                        value={newColumn.dataType}
                        onValueChange={(value) =>
                          setNewColumn({ ...newColumn, dataType: value as any })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COLUMN_DATA_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {newColumn.dataType === "select" && (
                      <div className="space-y-2">
                        <Label>Opções (separadas por vírgula)</Label>
                        <Input
                          placeholder="Ex: Box, Exterior, Coberta"
                          onChange={(e) =>
                            setNewColumn({
                              ...newColumn,
                              selectOptions: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddColumnDialogOpen(false);
                        resetNewColumn();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="button" onClick={handleAddColumn}>
                      Adicionar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Lista de colunas padrão */}
          <div>
            <h5 className="text-sm font-medium mb-2">Colunas Padrão</h5>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {DEFAULT_COLUMNS.map((col) => (
                <div
                  key={col.key}
                  className="flex items-center space-x-2 p-2 rounded border bg-background"
                >
                  <Checkbox
                    id={`col-${col.key}`}
                    checked={columnVisibility[col.key]}
                    onCheckedChange={() => toggleColumnVisibility(col.key)}
                  />
                  <label
                    htmlFor={`col-${col.key}`}
                    className="text-sm cursor-pointer"
                  >
                    {col.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de colunas personalizadas */}
          {customColumns.length > 0 && (
            <div>
              <h5 className="text-sm font-medium mb-2">
                Colunas Personalizadas
              </h5>
              <div className="space-y-2">
                {customColumns.map((col) => (
                  <div
                    key={col.id}
                    className="flex items-center justify-between p-2 rounded border bg-background"
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{col.label_pt}</span>
                      <span className="text-xs text-muted-foreground">
                        ({col.dataType})
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteColumn(col.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isEditMode && (
            <p className="text-sm text-muted-foreground italic">
              Colunas personalizadas podem ser adicionadas após criar a
              propriedade.
            </p>
          )}
        </div>
      )}

      {/* Tabela de Frações */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          A carregar frações...
        </div>
      ) : allFractions.length === 0 ? (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">
            Nenhuma fração cadastrada.
            <br />
            Clique em &quot;Adicionar Fração&quot; para começar.
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleDefaultColumns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
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
                  <TableHead key={col.id}>{col.label_pt}</TableHead>
                ))}
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFractions.map((fraction, index) => {
                const isPending = fraction.id.startsWith("pending-");

                return (
                  <TableRow key={fraction.id}>
                    {columnVisibility["nature"] && (
                      <TableCell>{fraction.nature_pt || "-"}</TableCell>
                    )}
                    {columnVisibility["fractionType"] && (
                      <TableCell>{fraction.fractionType_pt || "-"}</TableCell>
                    )}
                    {columnVisibility["floor"] && (
                      <TableCell>{fraction.floor_pt || "-"}</TableCell>
                    )}
                    {columnVisibility["unit"] && (
                      <TableCell>{fraction.unit_pt || "-"}</TableCell>
                    )}
                    {columnVisibility["grossArea"] && (
                      <TableCell className="text-right">
                        {formatArea(fraction.grossArea)}
                      </TableCell>
                    )}
                    {columnVisibility["outdoorArea"] && (
                      <TableCell className="text-right">
                        {formatArea(fraction.outdoorArea)}
                      </TableCell>
                    )}
                    {columnVisibility["parkingSpaces"] && (
                      <TableCell className="text-center">
                        {fraction.parkingSpaces}
                      </TableCell>
                    )}
                    {columnVisibility["price"] && (
                      <TableCell className="text-right">
                        {formatCurrency(fraction.price)}
                      </TableCell>
                    )}
                    {columnVisibility["floorPlan"] && (
                      <TableCell className="text-center">
                        {fraction.floorPlan ? (
                          <a
                            href={fraction.floorPlan}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    )}
                    {columnVisibility["reservationStatus"] && (
                      <TableCell className="text-center text-sm">
                        {getStatusLabel(fraction.reservationStatus)}
                      </TableCell>
                    )}
                    {/* Colunas personalizadas */}
                    {customColumns.map((col) => (
                      <TableCell key={col.id}>
                        {fraction.customData?.[col.columnKey] || "-"}
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {isPending ? (
                          <Button
                            type="button"
                            variant="brown"
                            size="icon"
                            onClick={() => handleDeletePendingFraction(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        ) : (
                          isEditMode && (
                            <Button
                              type="button"
                              variant="brown"
                              size="icon"
                              onClick={() => handleDeleteFraction(fraction.id)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
