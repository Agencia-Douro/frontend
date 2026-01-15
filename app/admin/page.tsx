import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminPage() {
    return (
        <div className="bg-[#fafafa] min-h-screen py-6 md:py-8">
            <div className="container">
                <h1 className="mb-6 body-16-medium">Painel Administrativo</h1>

                {/* Seção Principal */}
                <div className="mb-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Link href="/admin/properties" className="h-full">
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="body-16-medium">Gerenciar Propriedades</CardTitle>
                                    <CardDescription>
                                        Adicione, edite ou remova propriedades do sistema
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/admin/newsletters" className="h-full">
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="body-16-medium">Gerenciar Newsletters</CardTitle>
                                    <CardDescription>
                                        Adicione, edite ou remova newsletters do sistema
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/admin/site-config" className="h-full">
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="body-16-medium">Configurações do Site</CardTitle>
                                    <CardDescription>
                                        Configure informações gerais exibidas no site
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/admin/depoimentos" className="h-full">
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="body-16-medium">Depoimentos</CardTitle>
                                    <CardDescription>
                                        Gerencie os depoimentos dos clientes
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Seção Sobre Nós */}
                <div className="mb-8">
                    <h2 className="mb-4 body-16-medium text-brown">Sobre Nós</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Link href="/admin/about-us-content" className="h-full">
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="body-16-medium">Conteúdo da Página</CardTitle>
                                    <CardDescription>
                                        Edite os textos principais da página Sobre Nós
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/admin/culture-items" className="h-full">
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="body-16-medium">Itens de Cultura</CardTitle>
                                    <CardDescription>
                                        Gerencie os valores da cultura da empresa
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/admin/service-items" className="h-full">
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="body-16-medium">Serviços Oferecidos</CardTitle>
                                    <CardDescription>
                                        Gerencie os serviços oferecidos pela empresa
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </div>

                {/* Seção Podcast */}
                <div>
                    <h2 className="mb-4 body-16-medium text-brown">Podcast</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <Link href="/admin/podcast-content" className="h-full">
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="body-16-medium">Conteúdo da Página</CardTitle>
                                    <CardDescription>
                                        Edite os textos, episódios e informações da apresentadora
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                        <Link href="/admin/podcast-topics" className="h-full">
                            <Card className="hover:shadow-sm transition-shadow cursor-pointer h-full">
                                <CardHeader>
                                    <CardTitle className="body-16-medium">Tópicos do Podcast</CardTitle>
                                    <CardDescription>
                                        Gerencie os tópicos abordados no podcast
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}