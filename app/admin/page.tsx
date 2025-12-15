import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AdminPage() {
    return (
        <div className="bg-[#fafafa] h-screen py-6 md:py-8">
            <div className="container">
                <h1 className="mb-4 body-16-medium">Painel Administrativo</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Link href="/admin/properties">
                        <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="body-16-medium">Gerenciar Propriedades</CardTitle>
                                <CardDescription>
                                    Adicione, edite ou remova propriedades do sistema
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                    <Link href="/admin/newsletters">
                        <Card className="hover:shadow-sm transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="body-16-medium">Gerenciar Newsletters</CardTitle>
                                <CardDescription>
                                    Adicione, edite ou remova newsletters do sistema
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    )
}