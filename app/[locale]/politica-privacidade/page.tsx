import type { Metadata } from "next";
import Footer from "@/components/Sections/Footer/Footer";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("PoliticaPrivacidade");
    return {
        title: `${t("title")} - Agência Douro`,
        description: t("description"),
    };
}

export default async function PoliticaPrivacidadePage() {
    const t = await getTranslations("PoliticaPrivacidade");
    
    return (
        <>
            <div className="bg-deaf">
                <section className="container">
                    <div className="py-6 md:py-10 lg:py-12 xl:py-16">
                        <div className="lg:space-y-6 space-y-4 mb-8 md:mb-10 lg:mb-12">
                            <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black">{t("title")}</h1>
                            <p className="text-black-muted md:body-18-regular body-16-regular w-full">{t("description")}</p>
                        </div>

                        <div className="space-y-4 md:space-y-6 lg:space-y-8">
                            {/* Política de Privacidade */}
                            <article className="space-y-3">
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>{t("intro1")}</p>
                                    <p>{t("intro2")}</p>
                                    <p>{t("intro3")}</p>
                                    <p>{t("intro4")}</p>
                                    <p>{t("intro5")}</p>
                                    <p>{t("intro6")}</p>
                                </div>
                            </article>

                            {/* Política de Cookies */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">{t("cookies.title")}</h2>
                                
                                {/* O que são cookies? */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">{t("cookies.whatAre.title")}</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>{t("cookies.whatAre.content")}</p>
                                    </div>
                                </div>

                                {/* Como usamos os cookies? */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">{t("cookies.howWeUse.title")}</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>{t("cookies.howWeUse.content")}</p>
                                    </div>
                                </div>

                                {/* Desativar cookies */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">{t("cookies.disable.title")}</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>{t("cookies.disable.content")}</p>
                                    </div>
                                </div>

                                {/* Cookies que definimos */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">{t("cookies.weSet.title")}</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">{t("cookies.weSet.account.title")}</h4>
                                            <p>{t("cookies.weSet.account.content")}</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">{t("cookies.weSet.login.title")}</h4>
                                            <p>{t("cookies.weSet.login.content")}</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">{t("cookies.weSet.newsletter.title")}</h4>
                                            <p>{t("cookies.weSet.newsletter.content")}</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">{t("cookies.weSet.orders.title")}</h4>
                                            <p>{t("cookies.weSet.orders.content")}</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">{t("cookies.weSet.surveys.title")}</h4>
                                            <p>{t("cookies.weSet.surveys.content")}</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">{t("cookies.weSet.forms.title")}</h4>
                                            <p>{t("cookies.weSet.forms.content")}</p>
                                        </div>
                                        <div>
                                            <h4 className="body-18-medium text-black mb-2">{t("cookies.weSet.preferences.title")}</h4>
                                            <p>{t("cookies.weSet.preferences.content")}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Cookies de Terceiros */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">{t("cookies.thirdParty.title")}</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>{t("cookies.thirdParty.content1")}</p>
                                        <p>{t("cookies.thirdParty.content2")}</p>
                                        <p>{t("cookies.thirdParty.content3")}</p>
                                        <p>{t("cookies.thirdParty.content4")}</p>
                                        <p>{t("cookies.thirdParty.content5")}</p>
                                        <p>{t("cookies.thirdParty.content6")}</p>
                                    </div>
                                </div>

                                {/* Mais informações */}
                                <div className="space-y-3">
                                    <h3 className="body-20-medium md:heading-quatro-medium text-black">{t("cookies.moreInfo.title")}</h3>
                                    <div className="space-y-3 body-16-regular text-black-muted">
                                        <p>{t("cookies.moreInfo.content1")}</p>
                                        <p>{t("cookies.moreInfo.content2")}</p>
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

