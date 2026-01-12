"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { siteConfigApi, teamMembersApi, TeamMember } from "@/services/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, X } from "lucide-react"
import Image from "next/image"

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
  })

  const [memberFormData, setMemberFormData] = useState({
    name: "",
    phone: "",
    email: "",
  })

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [showMemberForm, setShowMemberForm] = useState(false)

  const { data: config, isLoading } = useQuery({
    queryKey: ["site-config"],
    queryFn: () => siteConfigApi.get(),
  })

  const { data: teamMembers, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => teamMembersApi.getAll(),
  })

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
      })
    }
  }, [config])

  const updateMutation = useMutation({
    mutationFn: (data: any) => siteConfigApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-config"] })
      toast.success("Configurações atualizadas com sucesso!")
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

    updateMutation.mutate(formData)
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
      <div className="container mx-auto p-6">
        <p>A carregar...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="heading-tres-medium text-brown mb-2">Configurações do Site</h1>
        <p className="body-16-regular text-grey">
          Configure informações gerais exibidas no site
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas do Site</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1 w-full">
              <Label htmlFor="clientesSatisfeitos">Clientes Satisfeitos</Label>
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
                placeholder="Digite o número de clientes satisfeitos"
                required
              />
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="rating">Rating (0-5)</Label>
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
                placeholder="Digite o rating (ex: 4.5)"
                required
              />
              <p className="body-14-regular text-grey">
                Insira um valor entre 0 e 5 (pode usar decimais, ex: 4.5)
              </p>
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="anos">Anos de Experiência</Label>
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
                placeholder="Digite os anos de experiencia"
                required
              />
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="imoveis">Imóveis Vendidos</Label>
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
                placeholder="Digite a quantidade de imóveis vendidos"
                required
              />
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="euros">Euros em Transações</Label>
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
                placeholder="Digite a quantidade de euros em transações"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-10">
          <CardHeader>
            <CardTitle>Estatísticas do Podcast</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1 w-full">
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
                placeholder="Digite o número de temporadas"
                required
              />
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="episodios">Episodios Publicados</Label>
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
                placeholder="Digite o número de episódios publicados"
                required
              />
            </div>

            <div className="space-y-1 w-full">
              <Label htmlFor="convidados">Número de Convidados</Label>
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
                placeholder="Digite o número de convidados"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6 justify-end">
          <Button
            type="submit"
            variant="brown"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Membros da Equipa</CardTitle>
            <Button
              onClick={() => setShowMemberForm(!showMemberForm)}
              variant="brown"
            >
              {showMemberForm ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Membro
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showMemberForm && (
            <form onSubmit={handleMemberSubmit} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium mb-4">
                {editingMember ? "Editar Membro" : "Novo Membro"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="member-name">Nome</Label>
                  <Input
                    id="member-name"
                    type="text"
                    value={memberFormData.name}
                    onChange={(e) =>
                      setMemberFormData({ ...memberFormData, name: e.target.value })
                    }
                    placeholder="Digite o nome"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="member-phone">Telefone</Label>
                  <Input
                    id="member-phone"
                    type="tel"
                    value={memberFormData.phone}
                    onChange={(e) =>
                      setMemberFormData({ ...memberFormData, phone: e.target.value })
                    }
                    placeholder="Digite o telefone"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="member-email">Email</Label>
                  <Input
                    id="member-email"
                    type="email"
                    value={memberFormData.email}
                    onChange={(e) =>
                      setMemberFormData({ ...memberFormData, email: e.target.value })
                    }
                    placeholder="Digite o email"
                    required
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="member-photo">Foto</Label>
                <Input
                  id="member-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {photoPreview && (
                  <div className="mt-2">
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetMemberForm}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="brown"
                  disabled={
                    createMemberMutation.isPending || updateMemberMutation.isPending
                  }
                >
                  {createMemberMutation.isPending || updateMemberMutation.isPending
                    ? "Salvando..."
                    : editingMember
                      ? "Atualizar"
                      : "Adicionar"}
                </Button>
              </div>
            </form>
          )}

          {isLoadingMembers ? (
            <p>A carregar membros...</p>
          ) : teamMembers && teamMembers.length > 0 ? (
            <div className="space-y-3">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {member.photo && (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Nome</p>
                        <p className="font-medium">{member.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Telefone</p>
                        <p className="font-medium">{member.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{member.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => handleEditMember(member)}
                      variant="outline"
                      className="px-2 py-1"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteMember(member.id)}
                      variant="red"
                      className="px-2 py-1"
                      disabled={deleteMemberMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Nenhum membro da equipa cadastrado. Clique em "Adicionar Membro" para
              começar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
