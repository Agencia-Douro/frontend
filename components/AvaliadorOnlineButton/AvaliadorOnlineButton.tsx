"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
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
import { contactApi } from "@/services/api"

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
            await contactApi.send({
                ...formData,
                mensagem: mensagemFormatada,
            })

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
        } catch (error: any) {
            toast.error(error.message || "Erro ao enviar avaliação. Tente novamente.", { id: toastId })
        }
    }

    return (
        <>
            {/* Botão Flutuante */}
            <button
                onClick={() => setIsOpen(true)}
                className="cursor-pointer fixed right-0 top-2/3 -translate-y-1/2 z-40 bg-gold will-change-transform text-white p-2 lg:-p-3 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white md:size-8">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                {/* Mobile - apenas "Avaliador" */}
                <div className="flex md:hidden flex-col items-center">
                    <div className="text-[10px] font-bold leading-tight">AVALIADOR</div>
                </div>
                {/* Desktop - "Avaliador Online" */}
                <div className="hidden md:flex flex-col items-center">
                    <div className="button-14-medium">AVALIADOR</div>
                    <div className="button-14-medium">ONLINE</div>
                </div>
            </button>

            {/* Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-[calc(100%-2rem)] md:w-full md:max-w-2xl max-h-[90vh] overflow-y-auto mx-0">
                    <DialogHeader>
                        <DialogTitle className="body-18-medium">Avaliador Online</DialogTitle>
                        <DialogClose />
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4 bg-deaf">
                        {/* Dados Pessoais */}
                        <div className="space-y-4">
                            <h3 className="body-16-medium text-black">Dados Pessoais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="modal-nome" className="body-14-medium text-black">Nome <span className="text-red body-14-medium">*</span></Label>
                                    <Input
                                        id="modal-nome"
                                        placeholder="Tomas Ribeiro Silva"
                                        value={formData.nome}
                                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="modal-telefone" className="body-14-medium text-black">Número de Telemóvel <span className="text-red body-14-medium">*</span></Label>
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
                                <Label htmlFor="modal-email" className="body-14-medium text-black">Email <span className="text-red body-14-medium">*</span></Label>
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
                                    <Label htmlFor="modal-tipo" className="body-14-medium text-black">Tipo de Imóvel <span className="text-red body-14-medium">*</span></Label>
                                    <Select
                                        value={imovelData.tipoImovel}
                                        onValueChange={(value) => setImovelData({ ...imovelData, tipoImovel: value })}>
                                        <SelectTrigger id="modal-tipo">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent className="z-2001">
                                            {TIPOS_IMOVEL.map((tipo) => (
                                                <SelectItem key={tipo.value} value={tipo.value}>
                                                    {tipo.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="modal-finalidade" className="body-14-medium text-black">Finalidade <span className="text-red body-14-medium">*</span></Label>
                                    <Select
                                        value={imovelData.finalidade}
                                        onValueChange={(value) => setImovelData({ ...imovelData, finalidade: value })}
                                    >
                                        <SelectTrigger id="modal-finalidade">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent className="z-2001">
                                            <SelectItem value="Venda">Venda</SelectItem>
                                            <SelectItem value="Arrendar">Arrendar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="modal-tipologia" className="body-14-medium text-black">Tipologia <span className="text-red body-14-medium">*</span></Label>
                                    <Select
                                        value={imovelData.tipologia}
                                        onValueChange={(value) => setImovelData({ ...imovelData, tipologia: value })}
                                    >
                                        <SelectTrigger id="modal-tipologia">
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                        <SelectContent className="z-2001">
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
                            <label htmlFor="modal-marketing" className="body-14-medium text-black-muted cursor-pointer">Autorizo a Agência Douro a guardar estes dados</label>
                        </div>
                        <DialogFooter>
                            <Button type="submit" variant="gold" className="w-full">Solicitar Avaliação</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
