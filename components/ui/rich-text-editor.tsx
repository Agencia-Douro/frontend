"use client"

import { useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { Bold, Italic, List, ListOrdered } from "lucide-react"
import { Button } from "@/components/ui-admin/button"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const isUpdatingRef = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        hardBreak: {
          keepMarks: false,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Escreva aqui...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (!isUpdatingRef.current) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: "tiptap min-h-[120px] px-2 py-1.5 body-14-medium outline-none",
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          view.dispatch(view.state.tr.replaceSelectionWith(view.state.schema.nodes.hardBreak.create()).scrollIntoView())
          return true
        }
        return false
      },
    },
  })

  // Atualiza o conteúdo do editor quando o value muda externamente
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      isUpdatingRef.current = true
      editor.commands.setContent(value, { emitUpdate: false })
      isUpdatingRef.current = false
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="border-border bg-muted border-b px-2 py-1.5 flex gap-1 rounded-t-md">
        <Button
          type="button"
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-7 w-7"
          aria-label={editor.isActive("bold") ? "Desativar negrito" : "Negrito"}
        >
          <Bold className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-7 w-7"
          aria-label={editor.isActive("italic") ? "Desativar itálico" : "Itálico"}
        >
          <Italic className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-7 w-7"
          aria-label={editor.isActive("bulletList") ? "Desativar lista com marcas" : "Lista com marcas"}
        >
          <List className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-7 w-7"
          aria-label={editor.isActive("orderedList") ? "Desativar lista numerada" : "Lista numerada"}
        >
          <ListOrdered className="size-4" aria-hidden />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="w-full bg-background border border-t-0 border-border rounded-b-md min-h-[120px]"
      />
    </div>
  )
}
