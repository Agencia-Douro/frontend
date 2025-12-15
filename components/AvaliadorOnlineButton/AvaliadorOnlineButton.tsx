"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input-line"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea-line"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select-line"
import { toast } from "sonner"
import { TIPOS_IMOVEL } from "@/app/shared/distritos"

export const AvaliadorOnlineButton = () => {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    // Não mostrar o botão nas páginas de admin
    if (pathname?.startsWith('/admin')) {
        return null
    }
    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        aceitaMarketing: false,
    })

    const [imovelData, setImovelData] = useState({
        tipoImovel: "",
        finalidade: "",
        tipologia: "",
        observacoes: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const toastId = toast.loading("Enviando avaliação...")

        // Formatar dados do imóvel em uma mensagem estruturada
        const mensagemFormatada = `
=== SOLICITAÇÃO DE AVALIAÇÃO DE IMÓVEL ===

TIPO DE IMÓVEL: ${imovelData.tipoImovel}
FINALIDADE: ${imovelData.finalidade}
TIPOLOGIA: ${imovelData.tipologia}

${imovelData.observacoes ? `OBSERVAÇÕES:\n${imovelData.observacoes}` : ''}
        `.trim()

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    mensagem: mensagemFormatada,
                }),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Avaliação enviada com sucesso!", { id: toastId })
                setFormData({
                    nome: "",
                    telefone: "",
                    email: "",
                    aceitaMarketing: false,
                })
                setImovelData({
                    tipoImovel: "",
                    finalidade: "",
                    tipologia: "",
                    observacoes: "",
                })
                setIsOpen(false)
            } else {
                toast.error(data.error || "Erro ao enviar avaliação", { id: toastId })
            }
        } catch (error) {
            toast.error("Erro ao enviar avaliação. Tente novamente.", { id: toastId })
        }
    }

    return (
        <>
            {/* Botão Flutuante */}
            <button
                onClick={() => setIsOpen(true)}
                className="cursor-pointer fixed bottom-6 right-6 z-40 bg-gold hover:bg-gold/90 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 font-medium"
            >
                Avaliador Online
            </button>

            {/* Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="body-18-medium">Avaliador Online</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {/* Dados Pessoais */}
                        <div className="space-y-4">
                            <h3 className="body-16-medium text-black">Dados Pessoais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="modal-nome" className="body-14-medium text-black">
                                        Nome *
                                    </Label>
                                    <Input
                                        id="modal-nome"
                                        placeholder="Tomas Ribeiro Silva"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="modal-telefone" className="body-14-medium text-black">
                                        Número de Telemóvel *
                                    </Label>
                                    <Input
                                        id="modal-telefone"
                                        placeholder="+351 919 766 323"
                                        value={formData.telefone}
                                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modal-email" className="body-14-medium text-black">
                                    Email *
                                </Label>
                                <Input
                                    id="modal-email"
                                    type="email"
                                    placeholder="contacto@agenciadouro.pt"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Dados do Imóvel */}
                        <div className="space-y-4 pt-4">
                            <h3 className="body-16-medium text-black">Dados do Imóvel</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="modal-tipo" className="body-14-medium text-black">
                                        Tipo de Imóvel *
                                    </Label>
                                    <Select
                                        value={imovelData.tipoImovel}
                                        onValueChange={(value) => setImovelData({ ...imovelData, tipoImovel: value })}
                                    >
                                        <SelectTrigger id="modal-tipo">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIPOS_IMOVEL.map((tipo) => (
                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="modal-finalidade" className="body-14-medium text-black">
                                        Finalidade *
                                    </Label>
                                    <Select
                                        value={imovelData.finalidade}
                                        onValueChange={(value) => setImovelData({ ...imovelData, finalidade: value })}
                                    >
                                        <SelectTrigger id="modal-finalidade">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Venda">Venda</SelectItem>
                                            <SelectItem value="Arrendar">Arrendar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="modal-tipologia" className="body-14-medium text-black">
                                        Tipologia *
                                    </Label>
                                    <Select
                                        value={imovelData.tipologia}
                                        onValueChange={(value) => setImovelData({ ...imovelData, tipologia: value })}
                                    >
                                        <SelectTrigger id="modal-tipologia">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="T0">T0</SelectItem>
                                            <SelectItem value="T1">T1</SelectItem>
                                            <SelectItem value="T2">T2</SelectItem>
                                            <SelectItem value="T3">T3</SelectItem>
                                            <SelectItem value="T4">T4</SelectItem>
                                            <SelectItem value="T5">T5</SelectItem>
                                            <SelectItem value="T6+">T6+</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="modal-observacoes" className="body-14-medium text-black">
                                    Observações Adicionais
                                </Label>
                                <Textarea
                                    id="modal-observacoes"
                                    placeholder="Informações adicionais sobre o imóvel..."
                                    value={imovelData.observacoes}
                                    onChange={(e) => setImovelData({ ...imovelData, observacoes: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-4">
                            <Checkbox
                                id="modal-marketing"
                                checked={formData.aceitaMarketing}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, aceitaMarketing: checked as boolean })
                                }
                            />
                            <label
                                htmlFor="modal-marketing"
                                className="body-14-medium text-black-muted cursor-pointer"
                            >
                                Autorizo a Agência Douro a guardar estes dados
                            </label>
                        </div>

                        <Button type="submit" variant="gold" className="w-full">
                            SOLICITAR AVALIAÇÃO
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
