import Footer from "@/components/Sections/Footer/Footer";
import Caracteristica from "@/components/Sections/Imovel/Caracteristica";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input-line";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea-line";
import Link from "next/link";

export default function ImovelDetails() {
    return (
    <>
        <section className="bg-deaf">
            <div className="container pb-16">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/imoveis"
                            className="body-14-medium text-brown hover:bg-muted flex gap-2 px-1.5 py-0.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M5.16725 9.12965L2.19555 5.80428L5.16336 2.5M2 5.81495H11.0427C12.676 5.81495 14 7.31142 14 9.1575C14 11.0035 12.676 12.5 11.0427 12.5H7.38875" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>Voltar
                        </Link>
                        <div className="w-px h-3 bg-brown/20"></div>
                        <div className="flex items-center gap-0.5">
                            <p className="body-16-medium text-brown">Comprar</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20">
                                <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor"/>
                            </svg>
                            <p className="body-16-medium text-brown">Casa</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown/20">
                                <path d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z" fill="currentColor"/>
                            </svg>
                            <p className="body-16-medium text-brown">Faro</p>
                        </div>
                    </div>
                    <Button variant="outline">Ver Todas</Button>
                </div>
                <div className="h-96 grid grid-cols-12 w-full gap-4">
                    <div className="border border-brown/10 col-span-6 row-span-2"></div>
                    <div className="border border-brown/10 col-span-3 row-span-2"></div>
                    <div className="border border-brown/10 col-span-3"></div>
                    <div className="border border-brown/10 col-span-3"></div>
                </div>
                <div className="pt-4 flex justify-between items-center">
                    <div className="flex items-center gap-4 body-16-medium text-brown">
                        <span>Vilamoura, Quarteira</span>
                        <div className="h-3 w-px bg-brown/30"></div>
                        <span>Empreendimento</span>
                        <div className="h-3 w-px bg-brown/30"></div>
                        <p><span className="text-brown/50">#</span>4381484</p>
                    </div>
                    <p className="body-16-medium text-brown">Tipo de negócio: <span>Compra</span></p>
                </div>
                <h2 className="pt-6 heading-tres-medium text-brown">3.250.000 €</h2>
                <div className="pt-6 flex justify-between">
                    <div>
                        <div className="w-154 [&>p]:first:p-0 [&>p]:pt-2 [&>h6]:first:p-0 [&>h6]:pt-4 [&>ul]:first:p-0 [&>ul]:pt-2 [&>p]:text-brown [&>p]:body-16-regular [&>h6]:body-16-medium [&>ul]:list-disc [&>ul]:list-inside">
                            <p>A Agência Douro, referência no mercado imobiliário do Norte de Portugal, apresenta esta incrível Penthouse T4 localizada em Vilamoura, uma urbanização situada numa das zonas mais exclusivas do Algarve.</p>
                            <p>Este imóvel faz parte do novo empreendimento pensado para criar uma experiência residencial de luxo, que convida a viver o Algarve para lá do verão. Criado com amplas áreas, espaços comuns reforçados, detalhes de comodidade e excelência de acabamentos que promovem o sentimento de pertença a um lugar único. Viva ou invista numa das melhores localizações do Sul de Portugal, um dos lugares mais procurados do Algarve para viver ou passar férias.</p>
                            <h6>Previsão de entrega do empreendimento:</h6>
                            <ul>
                                <li>Escrituras: 2º semestre de 2026</li>
                            </ul>
                            <h6>Condições de Pagamento:</h6>
                            <ul>
                                <li>Sinal - assinatura CPCV | 35%</li>
                                <li>Reforço - colocação total de caixilharia | 15%</li>
                                <li>Escritura | 50%</li>
                            </ul>
                            <h6>Características do Imóvel:</h6>
                            <ul>
                                <li>4 Quartos sendo 4 Suíte completa</li>
                                <li>5 Casas de banho sendo 1 de serviço</li>
                                <li>Salas de Estar e Jantar integradas</li>
                                <li>Cozinha estilo Openspace mobiliada e equipada</li>
                                <li>02 Varandas, uma com 115,73m2 com acesso pela sala e cozinha e por 2 quartos, e outra com 8,70 m2 com acesso por outros 2 quartos</li>
                                <li>Box para 3 lugares de estacionamento</li>
                                <li>Orientação solar: nascente e poente</li>
                            </ul>
                        </div>
                        <div className="mt-4">
                            <div className="flex gap-4 w-full">
                                <Button variant="muted" className="grow">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M8.0001 14.447C8.0001 14.447 1.6001 10.4608 1.6001 6.60381C1.6001 4.69789 2.94746 3.15283 4.8001 3.15283C5.7601 3.15283 6.7201 3.48501 8.0001 4.81373C9.2801 3.48501 10.2401 3.15283 11.2001 3.15283C13.0527 3.15283 14.4001 4.69789 14.4001 6.60381C14.4001 10.4608 8.0001 14.447 8.0001 14.447Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                                    </svg>
                                    Favoritos
                                </Button>
                                <Button variant="muted" className="grow">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6.33343 9.66676L9.66676 6.3334M11.4464 9.85577L13.302 8.00012C14.7661 6.536 14.7661 4.16224 13.302 2.69816C11.838 1.23408 9.46422 1.23408 8.00011 2.69816L6.14442 4.55384M9.85575 11.4464L8.00011 13.302C6.53602 14.7661 4.16226 14.7661 2.69817 13.302C1.23407 11.8379 1.23407 9.46416 2.69817 8.00012L4.55384 6.14442" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
                                    </svg>
                                    Link do Imóvel
                                </Button>
                                <Button variant="muted" className="grow">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M11.2001 11.8401H13.7601C14.1136 11.8401 14.4001 11.5536 14.4001 11.2001V7.3601C14.4001 6.29971 13.5405 5.4401 12.4801 5.4401H3.5201C2.45971 5.4401 1.6001 6.29971 1.6001 7.3601V11.2001C1.6001 11.5536 1.88664 11.8401 2.2401 11.8401H4.8001M12.1601 7.6801H12.1659M11.2001 5.4401V2.5601C11.2001 2.0299 10.7703 1.6001 10.2401 1.6001H5.7601C5.2299 1.6001 4.8001 2.0299 4.8001 2.5601V5.4401M11.2001 10.5601V13.1201C11.2001 13.827 10.627 14.4001 9.9201 14.4001H6.0801C5.37317 14.4001 4.8001 13.827 4.8001 13.1201V10.5601H11.2001Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Guardar PDF
                                </Button>
                            </div>
                            <form className="space-y-4 mt-4 p-4 border border-brown/10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nome" className="body-14-medium text-black">Nome <span className="text-red body-14-medium">*</span></Label>
                                        <Input
                                            id="nome"
                                            placeholder="Tomas Ribeiro Silva"
                                            value=""
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone" className="body-14-medium text-black">Número de Telemóvel <span className="text-red body-14-medium">*</span></Label>
                                        <Input
                                            id="telefone"
                                            placeholder="+351 919 766 323"
                                            value=""
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="body-14-medium text-black">Email <span className="text-red body-14-medium">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="contacto@agenciadouro.pt"
                                        value=""
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mensagem" className="body-14-medium text-black">Mensagem <span className="text-red body-14-medium">*</span></Label>
                                    <Textarea
                                        id="mensagem"
                                        placeholder="Envie-nos uma mensagem!"
                                        value=""
                                        required
                                        className="min-h-[100px]"
                                    />
                                </div>

                                <div className="flex items-center gap-2"> 
                                        <Checkbox id="marketing"/>
                                    <label htmlFor="marketing" className="body-14-medium text-black-muted cursor-pointer">Autorizo a Agência Douro a guardar estes dados para efeitos de marketing e de contacto.</label>
                                </div>

                                <Button type="submit" variant="gold" className="w-full">Enviar</Button>
                            </form>
                        </div>
                    </div>
                    <div className="w-[512px] sticky top-0">
                        <Caracteristica titulo="Área Total" valor="246.33m²" />
                        <Caracteristica titulo="Área Construída" valor="246.33m²" />
                        <Caracteristica titulo="Casas de Banho" valor="5" />
                        <Caracteristica titulo="Quartos" valor="4" />
                        <Caracteristica titulo="Escritório" valor="1" />
                        <Caracteristica titulo="Lavandaria" valor="Sim" />
                        <Caracteristica titulo="Garagem" valor="1 Lugar" />
                        <Caracteristica titulo="Ano de construção" valor="2026" />
                        <iframe
                            className="mt-6 h-75 border-0"
                            src={"https://www.google.com/maps/embed?" + "coords=41.1842493,-8.6822294"}
                            width="100%"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </section>
        <Footer/>
        </>
    )
}