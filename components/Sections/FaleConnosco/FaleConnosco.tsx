"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input-line"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea-line"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export const FaleConnosco = () => {
    const [formData, setFormData] = useState({
        nome: "",
        telefone: "",
        email: "",
        mensagem: "",
        aceitaMarketing: false,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const toastId = toast.loading("Enviando mensagem...")

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success("Mensagem enviada com sucesso!", { id: toastId })
                setFormData({
                    nome: "",
                    telefone: "",
                    email: "",
                    mensagem: "",
                    aceitaMarketing: false,
                })
            } else {
                toast.error(data.error || "Erro ao enviar mensagem", { id: toastId })
            }
        } catch (error) {
            toast.error("Erro ao enviar mensagem. Tente novamente.", { id: toastId })
        }
    }


    return (
        <section className="bg-white py-16">
            <div className="container">
                <h2 className="text-heading-dois mb-12">Fale connosco</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Mapa */}
                    <div className="relative h-[400px] bg-muted">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1502.0337394772985!2d-8.6822294!3d41.1842493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd246f70571b1a9b%3A0xd18009e3350eed24!2sAg%C3%AAncia%20Douro%20-%20Media%C3%A7%C3%A3o%20Imobili%C3%A1ria%20AMI%2017%20632!5e0!3m2!1spt-PT!2spt!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="nome" className="body-14-medium text-black">
                                    Nome *
                                </Label>
                                <Input
                                    id="nome"
                                    placeholder="Tomas Ribeiro Silva"
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="telefone" className="body-14-medium text-black">
                                    Número de Telemóvel *
                                </Label>
                                <Input
                                    id="telefone"
                                    placeholder="+351 919 766 323"
                                    value={formData.telefone}
                                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="body-14-medium text-black">
                                Email *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="contacto@agenciadouro.pt"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mensagem" className="body-14-medium text-black">
                                Mensagem *
                            </Label>
                            <Textarea
                                id="mensagem"
                                placeholder="Envie-nos uma mensagem!"
                                value={formData.mensagem}
                                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                                required
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="marketing"
                                checked={formData.aceitaMarketing}
                                onCheckedChange={(checked) =>
                                    setFormData({ ...formData, aceitaMarketing: checked as boolean })
                                }
                            />
                            <label
                                htmlFor="marketing"
                                className="body-14-regular text-black-muted cursor-pointer"
                            >
                                Autorizo a Agência Douro a guardar estes dados para efeitos de contacto.
                            </label>
                        </div>

                        <Button type="submit" variant="gold" className="w-full">
                            ENVIAR
                        </Button>
                    </form>
                </div>

                {/* Informações de Contato */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10 pt-16">
                    <div>
                        <h3 className="body-20-medium text-black mb-4">Email</h3>
                        <p className="body-16-regular text-black-muted mb-4">
                            Envie-nos a sua dúvida ou questão para o nosso email.
                        </p>
                        <a href="mailto:contacto@agenciadouro.pt" className="body-16-medium text-black hover:text-brown">
                            contacto@agenciadouro.pt
                        </a>
                    </div>

                    <div>
                        <h3 className="body-20-medium text-black mb-4">Contacto</h3>
                        <p className="body-16-regular text-black-muted mb-4">
                            Pode também falar conosco através do telefone.
                        </p>
                        <a href="tel:+351919766323" className="body-16-medium text-black hover:text-brown block">
                            +351 919 766 323
                        </a>
                        <a href="tel:+351919766324" className="body-16-medium text-black hover:text-brown block">
                            +351 919 766 324
                        </a>
                    </div>

                    <div>
                        <h3 className="body-20-medium text-black mb-4">Redes Sociais</h3>
                        <p className="body-16-regular text-black-muted mb-4">
                            Somos bastante ativos nas redes, siga-nos!
                        </p>
                        <a href="https://www.instagram.com/agenciadouro" target="_blank" rel="noopener noreferrer" className="body-16-medium text-black hover:text-brown flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            agenciadouro
                        </a>
                        <a href="https://www.facebook.com/agenciadouro" target="_blank" rel="noopener noreferrer" className="body-16-medium text-black hover:text-brown flex items-center gap-2 mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                            Agência Douro
                        </a>
                    </div>

                    <div>
                        <h3 className="body-20-medium text-black mb-4">Morada</h3>
                        <p className="body-16-regular text-black-muted mb-4">
                            Venha fazer-nos uma visita, ficamos por cá à sua espera
                        </p>
                        <p className="body-16-medium text-black">
                            Rua de Alfredo Cunha 155<br />
                            rés do chão loja 07<br />
                            4450-031 Porto
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}