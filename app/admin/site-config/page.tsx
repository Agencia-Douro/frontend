"use client"

import { useState, useEffect, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { siteConfigApi, teamMembersApi, TeamMember } from "@/services/api"
import { Button } from "@/components/ui-admin/button"
import { Input } from "@/components/ui-admin/input"
import { Label } from "@/components/ui-admin/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-admin/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui-admin/tabs"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X, User, GripVertical } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableMemberRow({
  member,
  onEdit,
  onDelete,
  isDeleting,
}: {
  member: TeamMember
  onEdit: (m: TeamMember) => void
  onDelete: (id: string) => void
  isDeleting: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: member.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex min-h-12 items-center gap-4 border-b border-border py-2 text-sm",
        isDragging && "z-10 bg-background opacity-90 shadow-sm",
      )}
    >
      <div
        className="flex w-10 shrink-0 cursor-grab touch-none items-center justify-center text-muted-foreground active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
      >
        <GripVertical className="size-5" aria-hidden />
      </div>
      <div className="w-10 shrink-0">
        {member.photo ? (
          <Image
            src={member.photo}
            alt=""
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <User className="size-5" aria-hidden />
          </div>
        )}
      </div>
      <span className="w-[min(120px,20%)] shrink-0 truncate font-medium text-foreground">
        {member.name}
      </span>
      <span className="w-[min(140px,22%)] shrink-0 truncate text-muted-foreground">
        {member.role || "—"}
      </span>
      <a
        href={`tel:${member.phone}`}
        className="w-[min(120px,18%)] shrink-0 truncate text-muted-foreground hover:text-foreground"
      >
        {member.phone}
      </a>
      <a
        href={`mailto:${member.email}`}
        className="min-w-0 flex-1 truncate text-muted-foreground hover:text-foreground"
      >
        {member.email}
      </a>
      <div className="flex w-20 shrink-0 justify-end gap-0">
        <Button
          type="button"
          onClick={() => onEdit(member)}
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Editar membro"
        >
          <Pencil className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          onClick={() => onDelete(member.id)}
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          disabled={isDeleting}
          aria-label="Remover membro"
        >
          <Trash2 className="size-4" aria-hidden />
        </Button>
      </div>
    </li>
  )
}

export default function SiteConfigPage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    clientesSatisfeitos: 0,
    rating: 0,
    imoveisVendidos: 0,
    anosExperiencia: 0,
    temporadas: 0,
    episodiosPublicados: 0,
    especialistasConvidados: 0,
    eurosEmTransacoes: 0,
    seguidoresInstagram: 0,
  })

  const [memberFormData, setMemberFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    displayOrder: 0,
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showMemberForm, setShowMemberForm] = useState(false)

  const [podcastImagemFile, setPodcastImagemFile] = useState<File | null>(null)
  const [podcastImagemPreview, setPodcastImagemPreview] = useState<string | null>(null)

  const { data: config, isLoading } = useQuery({
    queryKey: ["site-config"],
    queryFn: () => siteConfigApi.get(),
  })

  const { data: teamMembers, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => teamMembersApi.getAll(),
  })

  const savedOrderIds = useMemo(
    () =>
      [...(teamMembers ?? [])]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map((m) => m.id),
    [teamMembers],
  )

  const [orderedMemberIds, setOrderedMemberIds] = useState<string[]>([])

  useEffect(() => {
    if (teamMembers?.length) {
      setOrderedMemberIds(savedOrderIds)
    } else {
      setOrderedMemberIds([])
    }
  }, [savedOrderIds.join(","), teamMembers?.length])

  const hasOrderChanged =
    orderedMemberIds.length === savedOrderIds.length &&
    orderedMemberIds.some((id, i) => savedOrderIds[i] !== id)

  const updateOrderMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(
        ids.map((id, index) => teamMembersApi.update(id, { displayOrder: index })),
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] })
      toast.success("Ordem guardada com sucesso!")
    },
    onError: (error: unknown) => {
      toast.error((error as Error)?.message ?? "Erro ao guardar ordem")
    },
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setOrderedMemberIds((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  useEffect(() => {
    if (config) {
      setFormData({
        clientesSatisfeitos: config.clientesSatisfeitos || 0,
        rating: config.rating || 0,
        imoveisVendidos: config.imoveisVendidos || 0,
        anosExperiencia: config.anosExperiencia || 0,
        temporadas: config.temporadas || 0,
        episodiosPublicados: config.episodiosPublicados || 0,
        especialistasConvidados: config.especialistasConvidados || 0,
        eurosEmTransacoes: config.eurosEmTransacoes || 0,
        seguidoresInstagram: config.seguidoresInstagram || 0,
      })
      if (config.podcastImagem) {
        setPodcastImagemPreview(config.podcastImagem)
      }
    }
  }, [config])

  const updateMutation = useMutation({
    mutationFn: ({ data, podcastImagemFile }: { data: any; podcastImagemFile?: File }) =>
      siteConfigApi.update(data, undefined, podcastImagemFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-config"] })
      toast.success("Configurações atualizadas com sucesso!")
      setPodcastImagemFile(null)
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar configurações")
    },
  })

  const createMemberMutation = useMutation({
    mutationFn: ({ data, photoFile }: { data: Omit<TeamMember, "id">; photoFile?: File }) =>
      teamMembersApi.create(data, photoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] })
      toast.success("Membro adicionado com sucesso!")
      resetMemberForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao adicionar membro")
    },
  })

  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data, photoFile }: { id: string; data: Partial<TeamMember>; photoFile?: File }) =>
      teamMembersApi.update(id, data, photoFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] })
      toast.success("Membro atualizado com sucesso!")
      resetMemberForm()
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao atualizar membro")
    },
  })

  const deleteMemberMutation = useMutation({
    mutationFn: (id: string) => teamMembersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] })
      toast.success("Membro removido com sucesso!")
    },
    onError: (error: any) => {
      toast.error(error?.message || "Erro ao remover membro")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.clientesSatisfeitos < 0 || formData.rating < 0 || formData.rating > 5) {
      toast.error("Valores inválidos. Rating deve estar entre 0 e 5.")
      return
    }

    updateMutation.mutate({
      data: formData,
      podcastImagemFile: podcastImagemFile || undefined,
    })
  }

  const handlePodcastImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPodcastImagemFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPodcastImagemPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!memberFormData.name || !memberFormData.phone || !memberFormData.email) {
      toast.error("Todos os campos são obrigatórios")
      return
    }

    if (editingMember) {
      updateMemberMutation.mutate({
        id: editingMember.id,
        data: memberFormData,
        photoFile: photoFile || undefined,
      })
    } else {
      createMemberMutation.mutate({
        data: memberFormData,
        photoFile: photoFile || undefined,
      })
    }
  }

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setMemberFormData({
      name: member.name,
      phone: member.phone,
      email: member.email,
      role: member.role || "",
      displayOrder: member.displayOrder || 0,
    })
    setPhotoPreview(member.photo || null)
    setPhotoFile(null)
    setShowMemberForm(true)
  }

  const handleDeleteMember = (id: string) => {
    if (confirm("Tem certeza que deseja remover este membro?")) {
      deleteMemberMutation.mutate(id)
    }
  }

  const resetMemberForm = () => {
    setMemberFormData({
      name: "",
      phone: "",
      email: "",
      role: "",
      displayOrder: 0,
    })
    setPhotoFile(null)
    setPhotoPreview(null)
    setEditingMember(null)
    setShowMemberForm(false)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto px-4 pt-6 pb-6 md:px-6">
        <p className="text-sm text-muted-foreground">A carregar…</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col px-4 pt-6 md:px-6">
      <div className="mb-4 shrink-0">
        <h1 className="text-lg font-semibold tracking-tight text-foreground">Configurações do site</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure as informações gerais exibidas no site
        </p>
      </div>

      <Tabs defaultValue="estatisticas" className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TabsList variant="line" className="w-full shrink-0 justify-start">
          <TabsTrigger variant="line" value="estatisticas">
            Estatísticas
          </TabsTrigger>
          <TabsTrigger variant="line" value="membros">
            Membros da equipa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="estatisticas" className="relative min-h-0 flex-1 overflow-auto overflow-x-hidden">
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="space-y-6 pb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Estatísticas do site</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="clientesSatisfeitos">Clientes satisfeitos</Label>
                    <Input
                      id="clientesSatisfeitos"
                      type="number"
                      min="0"
                      value={formData.clientesSatisfeitos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          clientesSatisfeitos: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 150"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (0–5)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          rating: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 4.5"
                      required
                    />
                    <p className="text-xs text-muted-foreground">Valor entre 0 e 5</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anos">Anos de experiência</Label>
                    <Input
                      id="anos"
                      type="number"
                      value={formData.anosExperiencia}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          anosExperiencia: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imoveis">Imóveis vendidos</Label>
                    <Input
                      id="imoveis"
                      type="number"
                      value={formData.imoveisVendidos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          imoveisVendidos: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 200"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="euros">Euros em transações</Label>
                    <Input
                      id="euros"
                      type="number"
                      value={formData.eurosEmTransacoes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          eurosEmTransacoes: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 50000000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seguidoresInstagram">Seguidores no Instagram</Label>
                    <Input
                      id="seguidoresInstagram"
                      type="number"
                      min="0"
                      value={formData.seguidoresInstagram}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seguidoresInstagram: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 5000"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Estatísticas do podcast</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="temporadas">Temporadas</Label>
                    <Input
                      id="temporadas"
                      type="number"
                      min="0"
                      value={formData.temporadas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          temporadas: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 3"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="episodios">Episódios publicados</Label>
                    <Input
                      id="episodios"
                      type="number"
                      value={formData.episodiosPublicados}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          episodiosPublicados: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 36"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="convidados">Número de convidados</Label>
                    <Input
                      id="convidados"
                      type="number"
                      value={formData.especialistasConvidados}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          especialistasConvidados: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Ex: 24"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="podcastImagem">Imagem do podcast</Label>
                    <Input
                      id="podcastImagem"
                      type="file"
                      accept="image/*"
                      onChange={handlePodcastImagemChange}
                    />
                    {podcastImagemPreview && (
                      <div className="mt-2">
                        <Image
                          src={podcastImagemPreview}
                          alt="Preview podcast"
                          width={200}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="sticky bottom-0 left-0 right-0 z-10 flex justify-end bg-background/95 py-3 backdrop-blur-sm">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "A guardar…" : "Guardar alterações"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="membros" className="mt-6 min-h-0 flex-1 overflow-auto overflow-x-hidden pb-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Gerir os membros exibidos na página Sobre Nós.
              </p>
              <Button
                type="button"
                onClick={() => setShowMemberForm(!showMemberForm)}
              >
                {showMemberForm ? (
                  <>
                    <X className="size-4 shrink-0" aria-hidden />
                    Cancelar
                  </>
                ) : (
                  <>
                    <Plus className="size-4 shrink-0" aria-hidden />
                    Adicionar membro
                  </>
                )}
              </Button>
            </div>

            {showMemberForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    {editingMember ? "Editar Membro" : "Novo Membro"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMemberSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                      <div className="space-y-2 shrink-0">
                        <Label htmlFor="member-photo">Foto</Label>
                        <div className="flex items-center gap-4">
                          <label
                            htmlFor="member-photo"
                            className={cn(
                              "flex size-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-muted-foreground/40 hover:bg-muted/50",
                            )}
                          >
                            {photoPreview ? (
                              <Image
                                src={photoPreview}
                                alt="Preview"
                                width={96}
                                height={96}
                                className="size-full object-cover"
                              />
                            ) : (
                              <User className="size-10 text-muted-foreground" aria-hidden />
                            )}
                          </label>
                          <div className="flex flex-col gap-1">
                            <Input
                              id="member-photo"
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoChange}
                              className="max-w-[200px] text-sm file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground file:hover:bg-primary/90"
                            />
                            <span className="text-xs text-muted-foreground">PNG, JPG (recom. quadrada)</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="member-name">Nome</Label>
                          <Input
                            id="member-name"
                            type="text"
                            value={memberFormData.name}
                            onChange={(e) =>
                              setMemberFormData({ ...memberFormData, name: e.target.value })
                            }
                            placeholder="Nome completo"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member-role">Cargo</Label>
                          <Input
                            id="member-role"
                            type="text"
                            value={memberFormData.role}
                            onChange={(e) =>
                              setMemberFormData({ ...memberFormData, role: e.target.value })
                            }
                            placeholder="Ex: Consultor Imobiliário"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member-phone">Telefone</Label>
                          <Input
                            id="member-phone"
                            type="tel"
                            value={memberFormData.phone}
                            onChange={(e) =>
                              setMemberFormData({ ...memberFormData, phone: e.target.value })
                            }
                            placeholder="+351 912 345 678"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="member-email">Email</Label>
                          <Input
                            id="member-email"
                            type="email"
                            value={memberFormData.email}
                            onChange={(e) =>
                              setMemberFormData({ ...memberFormData, email: e.target.value })
                            }
                            placeholder="email@exemplo.pt"
                            required
                          />
                        </div>
                        <div className="space-y-2 sm:col-span-2 sm:max-w-32">
                          <Label htmlFor="member-displayOrder">Ordem de exibição</Label>
                          <Input
                            id="member-displayOrder"
                            type="number"
                            min="0"
                            value={memberFormData.displayOrder}
                            onChange={(e) =>
                              setMemberFormData({ ...memberFormData, displayOrder: parseInt(e.target.value) || 0 })
                            }
                            placeholder="0"
                          />
                          <p className="text-xs text-muted-foreground">Menor = aparece primeiro</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetMemberForm}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          createMemberMutation.isPending || updateMemberMutation.isPending
                        }
                      >
                        {createMemberMutation.isPending || updateMemberMutation.isPending
                          ? "A guardar…"
                          : editingMember
                            ? "Atualizar"
                            : "Adicionar"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {isLoadingMembers ? (
              <div className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">A carregar membros…</p>
              </div>
            ) : teamMembers && teamMembers.length > 0 ? (
              <div className="space-y-3">
                {hasOrderChanged && (
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOrderedMemberIds(savedOrderIds)}
                    >
                      Repor ordem guardada
                    </Button>
                    <Button
                      type="button"
                      onClick={() => updateOrderMutation.mutate(orderedMemberIds)}
                      disabled={updateOrderMutation.isPending}
                    >
                      {updateOrderMutation.isPending ? "A guardar…" : "Confirmar ordem"}
                    </Button>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <ul className="min-w-[640px]">
                      <li className="flex items-center gap-4 border-b border-border py-2 text-xs font-medium text-muted-foreground">
                        <span className="w-10 shrink-0" aria-hidden />
                        <span className="w-10 shrink-0" aria-hidden />
                        <span className="w-[min(120px,20%)] shrink-0">Nome</span>
                        <span className="w-[min(140px,22%)] shrink-0">Cargo</span>
                        <span className="w-[min(120px,18%)] shrink-0">Telefone</span>
                        <span className="min-w-0 flex-1">Email</span>
                        <span className="w-20 shrink-0" aria-hidden />
                      </li>
                      <SortableContext
                        items={orderedMemberIds}
                        strategy={verticalListSortingStrategy}
                      >
                        {orderedMemberIds
                          .map((id) => teamMembers?.find((m) => m.id === id))
                          .filter(Boolean)
                          .map((member) => (
                            <SortableMemberRow
                              key={member!.id}
                              member={member!}
                              onEdit={handleEditMember}
                              onDelete={handleDeleteMember}
                              isDeleting={deleteMemberMutation.isPending}
                            />
                          ))}
                      </SortableContext>
                    </ul>
                  </DndContext>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                    <User className="size-7 text-muted-foreground" aria-hidden />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Nenhum membro</p>
                    <p className="mt-1 text-sm text-muted-foreground text-pretty">
                      Adicione membros da equipa para exibir na página Sobre Nós.
                    </p>
                  </div>
                  <Button type="button" onClick={() => setShowMemberForm(true)}>
                    <Plus className="size-4 shrink-0" aria-hidden />
                    Adicionar membro
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
