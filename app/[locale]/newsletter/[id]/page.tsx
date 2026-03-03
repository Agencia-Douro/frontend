"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { newslettersApi } from "@/services/api";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import Footer from "@/components/Sections/Footer/Footer";
import Logo from "@/public/Logo.svg";
import Divider from "@/public/divider.png";
import { FaleConnosco } from "@/components/Sections/FaleConnosco/FaleConnosco";
import Folha from "@/components/Folha";
import { useTranslations } from "next-intl";

export default function NewsletterDetailsPage() {
  const t = useTranslations("NewsletterDetails");
  const params = useParams();
  const id = params.id as string;

  const { data: newsletter, isLoading, error } = useQuery({
    queryKey: ["newsletter", id],
    queryFn: () => newslettersApi.getById(id),
    enabled: !!id,
  });

  const getCategoryLabel = (category: string) => {
    const categoryMap: Record<string, string> = {
      mercado: t("categories.market"),
      dicas: t("categories.tips"),
      noticias: t("categories.news"),
    };
    return categoryMap[category] || category;
  };

  if (isLoading) {
    return (
      <>
        <section className="bg-deaf overflow-x-hidden">
          <div className="container pb-8 sm:pb-16 pt-10 sm:pt-20">
            <div className="max-w-3xl mx-auto">
              <p className="text-center text-brown">{t("loading")}</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !newsletter) {
    return (
      <>
        <section className="bg-deaf overflow-x-hidden">
          <div className="container pb-8 sm:pb-16 pt-10 sm:pt-20">
            <div className="max-w-3xl mx-auto">
              <p className="text-center text-red">{t("notFound")}</p>
              <div className="text-center mt-6">
                <Link
                  href="/newsletter"
                  className="body-16-medium text-brown hover:text-gold transition-colors"
                >
                  {t("backToNewsletters")}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  const formattedDate = new Date(newsletter.createdAt).toLocaleDateString(
    "pt-PT",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <>
      <Folha className="top-[2000px] left-[1500px] rotate-310 opacity-30 hidden lg:block text-brown" />
      <Folha className="top-[1900px] left-0 rotate-30 opacity-30 hidden lg:block text-brown" />
      <section className="bg-muted pt-24 relative">
        <div className="container">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-x-0.5 gap-y-1" aria-label="Breadcrumb">
          <Link
            href="/sobre-nos#newsletter"
            className="body-16-medium text-brown capitalize whitespace-nowrap hover:text-gold transition-colors"
          >
            {t("newsletter")}
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-brown/20 shrink-0"
            aria-hidden
          >
            <path
              d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z"
              fill="currentColor"
            />
          </svg>
          <span className="body-16-medium text-brown uppercase">
            {getCategoryLabel(newsletter.category)}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-brown/20 shrink-0"
            aria-hidden
          >
            <path
              d="M10 10L7.5 7.5L8.75003 6.25L12.5 10L8.75003 13.75L7.5 12.5L10 10Z"
              fill="currentColor"
            />
          </svg>
          <span className="body-16-medium text-brown">
            {newsletter.title}
          </span>
        </nav>

        {/* Título */}
        <h1 className="heading-tres-regular lg:heading-dois-regular text-balance text-black mt-6">
          {newsletter.title}
        </h1>

        {/* Imagem a ocupar a largura total do container */}
        {newsletter.coverImage && (
          <div className="w-full mt-10 overflow-hidden border-0">
            <div className="relative w-full aspect-video min-h-[200px] md:min-h-[320px] border-0">
              <Image
                src={newsletter.coverImage}
                alt={newsletter.title}
                fill
                sizes="(max-width: 1312px) 100vw, 1312px"
                className="object-cover border-0"
                priority
              />
            </div>
          </div>
        )}

        {/* Row: Publicado a / Tempo de leitura (16px) | Socials sem WhatsApp (justify-between) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-10">
          <div className="flex flex-wrap items-baseline gap-6 gap-y-2">
            <div>
              <p className="body-16-regular text-brown/70">{t("publishedOn")}</p>
              <p className="body-16-regular text-brown tabular-nums mt-0.5">
                {formattedDate}
              </p>
            </div>
            <div>
              <p className="body-16-regular text-brown/70">
                {t("readingTimeLabel")}
              </p>
              <p className="body-16-regular text-brown tabular-nums mt-0.5">
                {newsletter.readingTime} {t("readingTime")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/agenciadouro" target="_blank" rel="noopener noreferrer" className="text-gold transition-colors" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.8567 1.66748C11.7946 1.66903 12.2698 1.674 12.6805 1.68622L12.8422 1.69151C13.0291 1.69815 13.2134 1.70648 13.4357 1.7169C14.3224 1.75787 14.9273 1.89815 15.4586 2.1044C16.0078 2.31621 16.4717 2.60231 16.9349 3.06551C17.3974 3.52871 17.6836 3.99398 17.8961 4.5419C18.1016 5.07246 18.2419 5.67801 18.2836 6.56481C18.2935 6.78704 18.3015 6.97137 18.3081 7.15824L18.3133 7.31998C18.3255 7.7306 18.3311 8.20592 18.3328 9.14379L18.3335 9.76512C18.3336 9.84104 18.3336 9.91937 18.3336 10.0002L18.3335 10.2353L18.333 10.8567C18.3314 11.7945 18.3265 12.2699 18.3142 12.6805L18.3089 12.8422C18.3023 13.0291 18.294 13.2135 18.2836 13.4356C18.2426 14.3225 18.1016 14.9273 17.8961 15.4585C17.6842 16.0079 17.3974 16.4718 16.9349 16.935C16.4717 17.3975 16.0057 17.6835 15.4586 17.896C14.9273 18.1016 14.3224 18.2419 13.4357 18.2835C13.2134 18.2935 13.0291 18.3015 12.8422 18.308L12.6805 18.3133C12.2698 18.3255 11.7946 18.331 10.8567 18.3329L10.2353 18.3335C10.1594 18.3335 10.0811 18.3335 10.0002 18.3335H9.76516L9.14375 18.333C8.20591 18.3315 7.7306 18.3265 7.31997 18.3142L7.15824 18.309C6.97136 18.3023 6.78703 18.294 6.56481 18.2835C5.67801 18.2426 5.07384 18.1016 4.5419 17.896C3.99328 17.6843 3.5287 17.3975 3.06551 16.935C2.60231 16.4718 2.3169 16.0058 2.1044 15.4585C1.89815 14.9273 1.75856 14.3225 1.7169 13.4356C1.707 13.2135 1.69892 13.0291 1.69238 12.8422L1.68714 12.6805C1.67495 12.2699 1.66939 11.7945 1.66759 10.8567L1.66748 9.14379C1.66903 8.20592 1.67399 7.7306 1.68621 7.31998L1.69151 7.15824C1.69815 6.97137 1.70648 6.78704 1.7169 6.56481C1.75786 5.67731 1.89815 5.07315 2.1044 4.5419C2.3162 3.99329 2.60231 3.52871 3.06551 3.06551C3.5287 2.60231 3.99398 2.3169 4.5419 2.1044C5.07315 1.89815 5.67731 1.75856 6.56481 1.7169C6.78703 1.70701 6.97136 1.69893 7.15824 1.69239L7.31997 1.68715C7.7306 1.67495 8.20591 1.66939 9.14375 1.66759L10.8567 1.66748ZM10.0002 5.83356C7.69781 5.83356 5.83356 7.69984 5.83356 10.0002C5.83356 12.3026 7.69984 14.1669 10.0002 14.1669C12.3027 14.1669 14.1669 12.3006 14.1669 10.0002C14.1669 7.69781 12.3006 5.83356 10.0002 5.83356ZM10.0002 7.50023C11.381 7.50023 12.5002 8.61912 12.5002 10.0002C12.5002 11.381 11.3813 12.5002 10.0002 12.5002C8.6195 12.5002 7.50023 11.3814 7.50023 10.0002C7.50023 8.61945 8.61908 7.50023 10.0002 7.50023ZM14.3752 4.58356C13.8008 4.58356 13.3336 5.05016 13.3336 5.62452C13.3336 6.1989 13.8002 6.66621 14.3752 6.66621C14.9496 6.66621 15.4169 6.19962 15.4169 5.62452C15.4169 5.05016 14.9488 4.58285 14.3752 4.58356Z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/agenciadouro" target="_blank" rel="noopener noreferrer" className="text-gold transition-colors" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.0008 1.66626C5.39844 1.66626 1.66748 5.39722 1.66748 9.99959C1.66748 14.159 4.71486 17.6065 8.69875 18.2317V12.4084H6.58284V9.99959H8.69875V8.16366C8.69875 6.07512 9.94283 4.92147 11.8463 4.92147C12.7581 4.92147 13.7117 5.08423 13.7117 5.08423V7.13501H12.6609C11.6257 7.13501 11.3029 7.77738 11.3029 8.43643V9.99959H13.6141L13.2447 12.4084H11.3029V18.2317C15.2867 17.6065 18.3342 14.159 18.3342 9.99959C18.3342 5.39722 14.6032 1.66626 10.0008 1.66626Z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/agência-douro" target="_blank" rel="noopener noreferrer" className="text-gold transition-colors" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.16667 2.5C3.24619 2.5 2.5 3.24619 2.5 4.16667C2.5 5.08714 3.24619 5.83333 4.16667 5.83333C5.08714 5.83333 5.83333 5.08714 5.83333 4.16667C5.83333 3.24619 5.08714 2.5 4.16667 2.5ZM2.5 7.5V17.5H5.83333V7.5H2.5ZM7.5 7.5V17.5H10.8333V12.0833C10.8333 11.1629 11.5795 10.4167 12.5 10.4167C13.4205 10.4167 14.1667 11.1629 14.1667 12.0833V17.5H17.5V12.0833C17.5 9.32191 15.2614 7.08333 12.5 7.08333C11.3807 7.08333 10.3546 7.46944 9.53125 8.11198V7.5H7.5Z" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@douroimobiliaria" target="_blank" rel="noopener noreferrer" className="text-gold transition-colors" aria-label="TikTok">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.1667 1.66667H11.25V13.3333C11.25 14.2538 10.5038 15 9.58333 15C8.66286 15 7.91667 14.2538 7.91667 13.3333C7.91667 12.4129 8.66286 11.6667 9.58333 11.6667V8.75C7.05208 8.75 5 10.8021 5 13.3333C5 15.8646 7.05208 17.9167 9.58333 17.9167C12.1146 17.9167 14.1667 15.8646 14.1667 13.3333V7.29167C15.1875 8.04167 16.4583 8.5 17.8333 8.5V5.58333C15.8021 5.58333 14.1667 3.94792 14.1667 1.66667Z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@agenciadouromediacaoimobil3889" target="_blank" rel="noopener noreferrer" className="text-gold transition-colors" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.7734 5.60156C17.5651 4.79948 16.9349 4.16927 16.1328 3.96094C14.6745 3.58333 10 3.58333 10 3.58333C10 3.58333 5.32552 3.58333 3.86719 3.96094C3.06511 4.16927 2.4349 4.79948 2.22656 5.60156C1.84896 7.0599 1.84896 10.1042 1.84896 10.1042C1.84896 10.1042 1.84896 13.1484 2.22656 14.6068C2.4349 15.4089 3.06511 16.0391 3.86719 16.2474C5.32552 16.625 10 16.625 10 16.625C10 16.625 14.6745 16.625 16.1328 16.2474C16.9349 16.0391 17.5651 15.4089 17.7734 14.6068C18.151 13.1484 18.151 10.1042 18.151 10.1042C18.151 10.1042 18.151 7.0599 17.7734 5.60156ZM8.22917 12.9167V7.29167L12.9167 10.1042L8.22917 12.9167Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Texto da newsletter */}
        <article className="mt-12 md:mb-5 mb-10">
          <div
            className="tiptap-newsletter max-w-none text-pretty"
            dangerouslySetInnerHTML={{ __html: newsletter.content }}
          />
        </article>
      </div>
      </section>
      <Image
        src={Divider}
        alt=""
        width={1000}
        height={32}
        className="w-full h-auto mt-4"
      />
      {newsletter.properties && newsletter.properties.length > 0 && (
        <div className="mt-8 sm:mt-16 mb-8 sm:mb-16 flex flex-col items-center container">
          <Image
            className="mb-6 lg:mb-8 h-16 w-auto"
            src={Logo}
            alt={t("logoAlt")}
            width={213}
            height={96}
            sizes="213px"
          />
          <h2 className="heading-tres-regular text mb-5 sm:mb-10">
            {t("relatedProperties")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {newsletter.properties.map((property) => (
              <Link
                key={property.id}
                href={`/imoveis/${property.id}`}
                className="w-full"
              >
                <div className="relative w-full h-48 sm:h-56 md:h-64">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="body-16-medium text-black">{property.title}</p>
                  <p className="body-14-medium text-grey mt-1">
                    {property.country && property.country !== "PT" ? `${property.region}, ${property.city}` : `${property.concelho}, ${property.distrito}`}
                  </p>
                  <p className="body-20-medium text-black mt-2">
                    {new Intl.NumberFormat("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 0,
                    }).format(parseFloat(property.price))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Image src={Divider} alt="" width={1000} height={32} className="w-full h-auto" />
      <FaleConnosco />
      <Footer />
    </>
  );
}
