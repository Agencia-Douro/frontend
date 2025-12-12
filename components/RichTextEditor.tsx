"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading2,
  Heading3,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { newslettersApi } from "@/services/api"
import { toast } from "sonner"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Digite o conteúdo..." }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-md",
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[300px] px-4 py-3 focus:outline-none",
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL do link:", previousUrl)

    if (url === null) {
      return
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !editor) return

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida")
      return
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB")
      return
    }

    try {
      setIsUploadingImage(true)
      const { url } = await newslettersApi.uploadImage(file)
      editor.chain().focus().setImage({ src: url }).run()
      toast.success("Imagem adicionada com sucesso!")
    } catch (error: any) {
      toast.error(error?.message || "Erro ao fazer upload da imagem")
    } finally {
      setIsUploadingImage(false)
      // Limpar o input para permitir upload da mesma imagem novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const addImage = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-md">
      <div className="border-b bg-muted/40 p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("underline") ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant={editor.isActive("heading", { level: 2 }) ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("heading", { level: 3 }) ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant={editor.isActive({ textAlign: "left" }) ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "center" }) ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant={editor.isActive({ textAlign: "right" }) ? "brown" : "ghost"}
          size="default"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant={editor.isActive("link") ? "brown" : "ghost"}
          size="default"
          onClick={setLink}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-8 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="default"
          onClick={addImage}
          disabled={isUploadingImage}
        >
          {isUploadingImage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <EditorContent editor={editor} />
    </div>
  )
}
