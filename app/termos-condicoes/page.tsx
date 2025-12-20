import type { Metadata } from "next";
import Footer from "@/components/Sections/Footer/Footer";

export const metadata: Metadata = {
    title: "Termos e Condições - Agência Douro",
    description: "Leia atentamente os termos e condições de uso do site Agência Douro",
};

export default function TermosECondicoesPage() {
    return (
        <>
            <div className="bg-deaf">
                <section className="container">
                    <div className="py-6 md:py-10 lg:py-12 xl:py-16">
                        <div className="lg:space-y-6 space-y-4 mb-8 md:mb-10 lg:mb-12">
                            <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black">Termos e Condições</h1>
                            <p className="text-black-muted md:body-18-regular body-16-regular w-full">Leia atentamente os termos e condições de uso do site Agência Douro</p>
                        </div>

                        <div className="space-y-4 md:space-y-6 lg:space-y-8">
                            {/* Seção 1: Termos */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">1. Termos</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>Ao acessar ao site Agência Douro, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.</p>
                                </div>
                            </article>

                            {/* Seção 2: Uso de Licença */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">2. Uso de Licença</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Agência Douro, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>modificar ou copiar os materiais;</li>
                                        <li>usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
                                        <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Agência Douro;</li>
                                        <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
                                        <li>transferir os materiais para outra pessoa ou &apos;espelhe&apos; os materiais em qualquer outro servidor.</li>
                                    </ul>
                                    <p>Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Agência Douro a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.</p>
                                </div>
                            </article>

                            {/* Seção 3: Isenção de responsabilidade */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">3. Isenção de responsabilidade</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>Os materiais no site da Agência Douro são fornecidos &apos;como estão&apos;. Agência Douro não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.</p>
                                    <p>Além disso, o Agência Douro não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.</p>
                                </div>
                            </article>

                            {/* Seção 4: Limitações */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">4. Limitações</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>Em nenhum caso o Agência Douro ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Agência Douro, mesmo que Agência Douro ou um representante autorizado da Agência Douro tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.</p>
                                </div>
                            </article>

                            {/* Seção 5: Precisão dos materiais */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">5. Precisão dos materiais</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>Os materiais exibidos no site da Agência Douro podem incluir erros técnicos, tipográficos ou fotográficos. Agência Douro não garante que qualquer material em seu site seja preciso, completo ou atual. Agência Douro pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Agência Douro não se compromete a atualizar os materiais.</p>
                                </div>
                            </article>

                            {/* Seção 6: Links */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">6. Links</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>O Agência Douro não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Agência Douro do site. O uso de qualquer site vinculado é por conta e risco do usuário.</p>
                                </div>
                            </article>

                            {/* Seção 7: Modificações */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">7. Modificações</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>O Agência Douro pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
                                </div>
                            </article>

                            {/* Seção 8: Lei aplicável */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">8. Lei aplicável</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>Estes termos e condições são regidos e interpretados de acordo com as leis do Agência Douro e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.</p>
                                </div>
                            </article>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
}

