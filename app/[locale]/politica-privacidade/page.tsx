import type { Metadata } from "next";
import Footer from "@/components/Sections/Footer/Footer";

export const metadata: Metadata = {
    title: "Política de Privacidade - Agência Douro",
    description: "A sua privacidade é importante para nós. Conheça como a Agência Douro protege e gerencia as suas informações pessoais.",
};

export default function PoliticaPrivacidadePage() {
    return (
        <>
            <div className="bg-deaf">
                <section className="container">
                    <div className="py-6 md:py-10 lg:py-12 xl:py-16">
                        <div className="lg:space-y-6 space-y-4 mb-8 md:mb-10 lg:mb-12">
                            <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black">Política de Privacidade</h1>
                            <p className="text-black-muted md:body-18-regular body-16-regular w-full">A sua privacidade é importante para nós. É política do Agência Douro respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Agência Douro, e outros sites que possuímos e operamos.</p>
                        </div>

                        <div className="space-y-4 md:space-y-6 lg:space-y-8">
                            {/* Política de Privacidade */}
                            <article className="space-y-3">
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
                                    <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
                                    <p>Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.</p>
                                    <p>O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
                                    <p>Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.</p>
                                    <p>O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.</p>
                                </div>
                            </article>

                            {/* Política de Cookies */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">Política de Cookies Agência Douro</h2>
                                
                                {/* O que são cookies? */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">O que são cookies?</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>Como é prática comum em quase todos os sites profissionais, este site usa cookies, que são pequenos arquivos baixados no seu computador, para melhorar sua experiência. Esta página descreve quais informações eles coletam, como as usamos e por que às vezes precisamos armazenar esses cookies. Também compartilharemos como você pode impedir que esses cookies sejam armazenados, no entanto, isso pode fazer o downgrade ou &apos;quebrar&apos; certos elementos da funcionalidade do site.</p>
                                    </div>
                                </div>

                                {/* Como usamos os cookies? */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">Como usamos os cookies?</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>Utilizamos cookies por vários motivos, detalhados abaixo. Infelizmente, na maioria dos casos, não existem opções padrão do setor para desativar os cookies sem desativar completamente a funcionalidade e os recursos que eles adicionam a este site. É recomendável que você deixe todos os cookies se não tiver certeza se precisa ou não deles, caso sejam usados ​​para fornecer um serviço que você usa.</p>
                                    </div>
                                </div>

                                {/* Desativar cookies */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">Desativar cookies</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>Você pode impedir a configuração de cookies ajustando as configurações do seu navegador (consulte a Ajuda do navegador para saber como fazer isso). Esteja ciente de que a desativação de cookies afetará a funcionalidade deste e de muitos outros sites que você visita. A desativação de cookies geralmente resultará na desativação de determinadas funcionalidades e recursos deste site. Portanto, é recomendável que você não desative os cookies.</p>
                                    </div>
                                </div>

                                {/* Cookies que definimos */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">Cookies que definimos</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">Cookies relacionados à conta</h4>
                                            <p>Se você criar uma conta connosco, usaremos cookies para o gerenciamento do processo de inscrição e administração geral. Esses cookies geralmente serão excluídos quando você sair do sistema, porém, em alguns casos, eles poderão permanecer posteriormente para lembrar as preferências do seu site ao sair.</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">Cookies relacionados ao login</h4>
                                            <p>Utilizamos cookies quando você está logado, para que possamos lembrar dessa ação. Isso evita que você precise fazer login sempre que visitar uma nova página. Esses cookies são normalmente removidos ou limpos quando você efetua logout para garantir que você possa acessar apenas a recursos e áreas restritas ao efetuar login.</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">Cookies relacionados a boletins por e-mail</h4>
                                            <p>Este site oferece serviços de assinatura de boletim informativo ou e-mail e os cookies podem ser usados ​​para lembrar se você já está registrado e se deve mostrar determinadas notificações válidas apenas para usuários inscritos / não inscritos.</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">Pedidos processando cookies relacionados</h4>
                                            <p>Este site oferece facilidades de comércio eletrônico ou pagamento e alguns cookies são essenciais para garantir que seu pedido seja lembrado entre as páginas, para que possamos processá-lo adequadamente.</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">Cookies relacionados a pesquisas</h4>
                                            <p>Periodicamente, oferecemos pesquisas e questionários para fornecer informações interessantes, ferramentas úteis ou para entender nossa base de usuários com mais precisão. Essas pesquisas podem usar cookies para lembrar quem já participou numa pesquisa ou para fornecer resultados precisos após a alteração das páginas.</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">Cookies relacionados a formulários</h4>
                                            <p>Quando você envia dados por meio de um formulário como os encontrados nas páginas de contacto ou nos formulários de comentários, os cookies podem ser configurados para lembrar os detalhes do usuário para correspondência futura.</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">Cookies de preferências do site</h4>
                                            <p>Para proporcionar uma ótima experiência neste site, fornecemos a funcionalidade para definir suas preferências de como esse site é executado quando você o usa. Para lembrar suas preferências, precisamos definir cookies para que essas informações possam ser chamadas sempre que você interagir com uma página for afetada por suas preferências.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cookies de Terceiros */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">Cookies de Terceiros</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>Em alguns casos especiais, também usamos cookies fornecidos por terceiros confiáveis. A seção a seguir detalha quais cookies de terceiros você pode encontrar através deste site.</p>
                                        <p>Este site usa o Google Analytics, que é uma das soluções de análise mais difundidas e confiáveis ​​da Web, para nos ajudar a entender como você usa o site e como podemos melhorar sua experiência. Esses cookies podem rastrear itens como quanto tempo você gasta no site e as páginas visitadas, para que possamos continuar produzindo conteúdo atraente.</p>
                                        <p>Para mais informações sobre cookies do Google Analytics, consulte a página oficial do Google Analytics.</p>
                                        <p>As análises de terceiros são usadas para rastrear e medir o uso deste site, para que possamos continuar produzindo conteúdo atrativo. Esses cookies podem rastrear itens como o tempo que você passa no site ou as páginas visitadas, o que nos ajuda a entender como podemos melhorar o site para você.</p>
                                        <p>Periodicamente, testamos novos recursos e fazemos alterações subtis na maneira como o site se apresenta. Quando ainda estamos testando novos recursos, esses cookies podem ser usados ​​para garantir que você receba uma experiência consistente enquanto estiver no site, enquanto entendemos quais otimizações os nossos usuários mais apreciam.</p>
                                        <p>À medida que vendemos produtos, é importante entendermos as estatísticas sobre quantos visitantes de nosso site realmente compram e, portanto, esse é o tipo de dados que esses cookies rastrearão. Isso é importante para você, pois significa que podemos fazer previsões de negócios com precisão que nos permitem analisar nossos custos de publicidade e produtos para garantir o melhor preço possível.</p>
                                    </div>
                                </div>

                                {/* Mais informações */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">Mais informações</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>Esperemos que esteja esclarecido e, como mencionado anteriormente, se houver algo que você não tem certeza se precisa ou não, geralmente é mais seguro deixar os cookies ativados, caso interaja com um dos recursos que você usa em nosso site.</p>
                                        <p>Esta política é efetiva a partir de Outubro/2020.</p>
                                    </div>
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

