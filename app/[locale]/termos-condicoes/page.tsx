import type { Metadata } from "next";
import Footer from "@/components/Sections/Footer/Footer";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("TermosECondicoes");
    return {
        title: `${t("title")} - Agência Douro`,
        description: t("description"),
    };
}

export default async function TermosECondicoesPage() {
    const t = await getTranslations("TermosECondicoes");
    
    return (
        <>
            <div className="bg-[#F4F0E9] pt-10">
                <section className="container">
                    <div className="py-6 md:py-10 lg:py-12 xl:py-16">
                        <div className="lg:space-y-6 space-y-4 mb-8 md:mb-10 lg:mb-12">
                            <h1 className="heading-tres-regular md:heading-dois-regular xl:heading-um-regular text-balance text-black">{t("title")}</h1>
                            <p className="text-black-muted md:body-18-regular body-16-regular w-full">{t("description")}</p>
                        </div>

                        <div className="space-y-4 md:space-y-6 lg:space-y-8">
                            {/* Seção 1: Termos */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">{t("section1.title")}</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>{t("section1.content")}</p>
                                </div>
                            </article>

                            {/* Seção 2: Uso de Licença */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">{t("section2.title")}</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>{t("section2.intro")}</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>{t("section2.item1")}</li>
                                        <li>{t("section2.item2")}</li>
                                        <li>{t("section2.item3")}</li>
                                        <li>{t("section2.item4")}</li>
                                        <li>{t("section2.item5")}</li>
                                    </ul>
                                    <p>{t("section2.conclusion")}</p>
                                </div>
                            </article>

                            {/* Seção 3: Isenção de responsabilidade */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">{t("section3.title")}</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>{t("section3.content1")}</p>
                                    <p>{t("section3.content2")}</p>
                                </div>
                            </article>

                            {/* Seção 4: Limitações */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">{t("section4.title")}</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>{t("section4.content")}</p>
                                </div>
                            </article>

                            {/* Seção 5: Precisão dos materiais */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">{t("section5.title")}</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>{t("section5.content")}</p>
                                </div>
                            </article>

                            {/* Seção 6: Links */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">{t("section6.title")}</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>{t("section6.content")}</p>
                                </div>
                            </article>

                            {/* Seção 7: Modificações */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">{t("section7.title")}</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>{t("section7.content")}</p>
                                </div>
                            </article>

                            {/* Seção 8: Lei aplicável */}
                            <article className="space-y-3">
                                <h2 className="body-20-medium md:heading-quatro-medium text-black">{t("section8.title")}</h2>
                                <div className="space-y-3 body-16-regular text-black-muted">
                                    <p>{t("section8.content")}</p>
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

