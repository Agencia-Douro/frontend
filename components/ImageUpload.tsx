"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { newslettersApi } from "@/services/api"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "Imagem" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(value)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem")
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB")
      return
    }

    setUploading(true)

    try {
      const result = await newslettersApi.uploadImage(file)
      setPreviewUrl(result.url)
      onChange(result.url)
      toast.success("Imagem enviada com sucesso!")
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer upload da imagem")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreviewUrl("")
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {!previewUrl ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-gray-400 animate-spin" />
                <span className="text-sm text-gray-500">Enviando imagem...</span>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Clique para selecionar uma imagem
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG ou WEBP (máx. 5MB)
                </span>
              </>
            )}
          </label>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="brown"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
