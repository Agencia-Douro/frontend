"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X, Loader2, File, Edit2, Save, Download, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { propertyFilesApi } from "@/services/api"
import { PropertyFile } from "@/types/property"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface FileManagementProps {
  propertyId?: string
  isEditMode?: boolean
}

export function FileManagement({ propertyId, isEditMode = false }: FileManagementProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [editingFileId, setEditingFileId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editVisible, setEditVisible] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  // Buscar arquivos existentes (apenas no modo de edição)
  const { data: existingFiles = [], isLoading: loadingFiles } = useQuery({
    queryKey: ["property-files", propertyId],
    queryFn: () => propertyFilesApi.getAll(propertyId!),
    enabled: isEditMode && !!propertyId,
  })

  // Mutation para upload múltiplo
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (!propertyId) {
        throw new Error("ID da propriedade não fornecido")
      }
      return propertyFilesApi.uploadMultiple(propertyId, files, undefined, true)
    },
    onSuccess: (data) => {
      toast.success(data.message)
      setSelectedFiles([])
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      queryClient.invalidateQueries({ queryKey: ["property-files", propertyId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao fazer upload dos arquivos")
    },
  })

  // Mutation para atualizar arquivo
  const updateMutation = useMutation({
    mutationFn: ({ fileId, data }: { fileId: string; data: { title?: string; isVisible?: boolean } }) =>
      propertyFilesApi.update(fileId, data),
    onSuccess: () => {
      toast.success("Arquivo atualizado com sucesso!")
      setEditingFileId(null)
      queryClient.invalidateQueries({ queryKey: ["property-files", propertyId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar arquivo")
    },
  })

  // Mutation para deletar arquivo
  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => propertyFilesApi.delete(fileId),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ["property-files", propertyId] })
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao deletar arquivo")
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    // Validar número máximo de arquivos (20)
    if (files.length > 20) {
      toast.error("Você pode enviar no máximo 20 arquivos por vez")
      return
    }

    // Validar tamanho de cada arquivo (máximo 200MB)
    const invalidFiles = files.filter(file => file.size > 200 * 1024 * 1024)
    if (invalidFiles.length > 0) {
      toast.error("Cada arquivo deve ter no máximo 200MB")
      return
    }

    setSelectedFiles(files)
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Selecione pelo menos um arquivo")
      return
    }

    if (!propertyId) {
      toast.error("Esta ação só está disponível ao editar uma propriedade existente")
      return
    }

    setUploading(true)
    try {
      await uploadMutation.mutateAsync(selectedFiles)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveSelected = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleStartEdit = (file: PropertyFile) => {
    setEditingFileId(file.id)
    setEditTitle(file.title || "")
    setEditVisible(file.isVisible)
  }

  const handleSaveEdit = async (fileId: string) => {
    await updateMutation.mutateAsync({
      fileId,
      data: {
        title: editTitle || undefined,
        isVisible: editVisible,
      },
    })
  }

  const handleCancelEdit = () => {
    setEditingFileId(null)
    setEditTitle("")
    setEditVisible(true)
  }

  const handleDelete = async (fileId: string, fileName: string) => {
    if (window.confirm(`Tem certeza que deseja deletar "${fileName}"?`)) {
      await deleteMutation.mutateAsync(fileId)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return "🖼️"
    if (mimeType.includes("pdf")) return "📄"
    if (mimeType.includes("word")) return "📝"
    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊"
    return "📎"
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="space-y-4">
        <Label>Upload de Arquivos</Label>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={uploading || !isEditMode}
          />
          <label
            htmlFor="file-upload"
            className={`cursor-pointer flex flex-col items-center gap-2 ${!isEditMode ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Upload className="h-10 w-10 text-gray-400" />
            <span className="text-sm text-gray-500">
              {isEditMode
                ? "Clique para selecionar arquivos (máx. 20 arquivos, 200MB cada)"
                : "Salve a propriedade primeiro para fazer upload de arquivos"}
            </span>
            <span className="text-xs text-gray-400">
              Todos os tipos de arquivo são aceitos
            </span>
          </label>
        </div>

        {/* Selected Files Preview */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Arquivos selecionados ({selectedFiles.length})
              </Label>
              <Button
                type="button"
                onClick={handleUpload}
                disabled={uploading || !propertyId}
                size="default"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar {selectedFiles.length} arquivo(s)
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <File className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSelected(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Existing Files List */}
      {isEditMode && propertyId && (
        <div className="space-y-4">
          <Label>Arquivos da Propriedade</Label>

          {loadingFiles ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : existingFiles.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed">
              <File className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Nenhum arquivo enviado ainda
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {existingFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-start gap-3 p-4 bg-white rounded-lg border hover:border-gray-300 transition-colors"
                >
                  <div className="text-2xl flex-shrink-0 mt-1">
                    {getFileIcon(file.mimeType)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    {editingFileId === file.id ? (
                      // Edit Mode
                      <>
                        <Input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Título do arquivo"
                          maxLength={200}
                          className="text-sm"
                        />
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`visible-${file.id}`}
                            checked={editVisible}
                            onCheckedChange={(checked) => setEditVisible(checked as boolean)}
                          />
                          <label
                            htmlFor={`visible-${file.id}`}
                            className="text-sm text-gray-600 cursor-pointer"
                          >
                            Arquivo visível
                          </label>
                        </div>
                      </>
                    ) : (
                      // View Mode
                      <>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {file.title || file.originalName}
                          </h4>
                          {!file.isVisible && (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {file.originalName}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{formatFileSize(file.fileSize)}</span>
                          <span>{new Date(file.createdAt).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {editingFileId === file.id ? (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSaveEdit(file.id)}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelEdit}
                          disabled={updateMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(file.filePath, "_blank")}
                          title="Baixar arquivo"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartEdit(file)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(file.id, file.title || file.originalName)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
