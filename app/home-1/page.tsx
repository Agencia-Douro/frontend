"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input-line";
import { Textarea } from "@/components/ui/textarea-line";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select-line";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import HeroImage from "@/public/hero-image.png";
import porto from "@/public/localizacoes/porto.jpg";
import aveiro from "@/public/localizacoes/aveiro.jpg";
import faro from "@/public/localizacoes/faro.jpg";
import coimbra from "@/public/localizacoes/coimbra.jpg";
import braga from "@/public/localizacoes/braga.jpg";
import lisboa from "@/public/localizacoes/lisboa.jpg";
import testemunho1 from "@/public/testemunhos/1.png";
import testemunho2 from "@/public/testemunhos/2.png";
import testemunho3 from "@/public/testemunhos/3.png";
import { DISTRITOS, TIPOS_IMOVEL } from "@/app/shared/distritos";
import { Property } from "@/types/property";
import { propertiesApi, siteConfigApi, contactApi } from "@/services/api";

type TransactionType = "comprar" | "arrendar" | "investir";

export default function Home() {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [transactionType, setTransactionType] = useState<TransactionType>("comprar");
  const [localizacao, setLocalizacao] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [preco, setPreco] = useState<string>("");
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    mensagem: "",
    aceitaMarketing: false,
  });

  // Limpar preço quando mudar o tipo de transação
  useEffect(() => {
    setPreco("");
  }, [transactionType]);

  // Animações de entrada - começam quando a splash screen está quase a acabar
  useEffect(() => {
    // A splash screen tem mínimo de 2s, depois 400ms de fade out
    // Começamos as animações aos 2.2s (quando a splash está no meio do fade out)
    const animationStartTime = 2200; // 2.2 segundos - quando splash está quase a acabar

    // Animação do título (começa quando splash está quase a acabar)
    const titleTimer = setTimeout(() => {
      setIsTitleVisible(true);
    }, animationStartTime);

    // Animação do subtítulo (começa 50ms depois)
    const subtitleTimer = setTimeout(() => {
      setIsSubtitleVisible(true);
    }, animationStartTime + 50);

    // Animação da imagem (começa 100ms depois)
    const imageTimer = setTimeout(() => {
      setIsImageVisible(true);
    }, animationStartTime + 100);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(imageTimer);
    };
  }, []);

  // Query para imóveis destacados
  const { data: properties = [], isLoading, isError } = useQuery<Property[], Error>({
    queryKey: ["properties", "featured"],
    queryFn: () => propertiesApi.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });

  // Query para site config
  const { data: siteConfig } = useQuery({
    queryKey: ["site-config"],
    queryFn: () => siteConfigApi.get(),
  });

  // Funções de scroll para testemunhos
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setIsAtStart(scrollLeft <= 0);
    setIsAtEnd(scrollLeft >= scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    checkScrollPosition();
    container.addEventListener('scroll', checkScrollPosition);
    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  const scrollToNext = () => {
    if (!scrollContainerRef.current || isAtEnd) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll('div');
    const currentScroll = container.scrollLeft;
    const containerWidth = container.clientWidth;
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      const cardRight = card.offsetLeft + card.offsetWidth;
      const visibleRight = currentScroll + containerWidth;
      if (cardRight > visibleRight + 10) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        break;
      }
    }
  };

  const scrollToPrevious = () => {
    if (!scrollContainerRef.current || isAtStart) return;
    const container = scrollContainerRef.current;
    const cards = container.querySelectorAll('div');
    const currentScroll = container.scrollLeft;
    for (let i = cards.length - 1; i >= 0; i--) {
      const card = cards[i] as HTMLElement;
      const cardLeft = card.offsetLeft;
      if (cardLeft < currentScroll - 10) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        break;
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (transactionType === "comprar") {
      params.set("transactionType", "comprar");
    } else if (transactionType === "arrendar") {
      params.set("transactionType", "arrendar");
    }
    if (localizacao) params.set("distrito", localizacao);
    if (tipo) params.set("propertyType", tipo);
    if (preco) {
      const maxPrice = preco.split("-")[1];
      params.set("maxPrice", maxPrice);
    }
    router.push(`/imoveis?${params.toString()}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Enviando mensagem...");
    try {
      await contactApi.send(formData);
      toast.success("Mensagem enviada com sucesso!", { id: toastId });
      setFormData({
        nome: "",
        telefone: "",
        email: "",
        mensagem: "",
        aceitaMarketing: false,
      });
    } catch (error: any) {
      toast.error(error.message || "Erro ao enviar mensagem. Tente novamente.", { id: toastId });
    }
  };

  // Funções auxiliares
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(numPrice);
  };

  const getAreaDisplay = (property: Property) => {
    const area = property.totalArea || property.builtArea || property.usefulArea;
    return area ? `${area}m²` : 'N/A';
  };

  const getPropertyTypeLabel = (propertyType: string) => {
    const tipo = TIPOS_IMOVEL.find(t => t.value === propertyType);
    return tipo ? tipo.label : propertyType;
  };

  const zonas = [
    { nome: "Porto", src: porto },
    { nome: "Aveiro", src: aveiro },
    { nome: "Faro", src: faro },
    { nome: "Coimbra", src: coimbra },
    { nome: "Braga", src: braga },
    { nome: "Lisboa", src: lisboa },
  ];

  const testemunhos = [
    { text: "A Vânia é maravilhosa, conhece super bem o mercado onde atua e auxilia desde a procura do imóvel até os detalhes finais. Super importante ter uma pessoa de confiança e sempre disposta a ajudar. Recomendamos 100%!", image: testemunho1, name: "Lucimara Bordignon Borghetti" },
    { text: "Agência Douro fez toda diferença na venda da minha morada. A Venda aconteceu super rápido. A Vânia Fernandes, proprietária da Agência super simpática e competente, esteve sempre pronta para atender as minhas dúvidas. Recomendo sempre.", image: testemunho2, name: "Maria Oliveira" },
    { text: "Ótimo atendimento diferenciado de todas as imobiliárias que conheci no Porto,Ética ,comprometimento, conhecer a empresa,para mim foi um presente do céu. Parabéns Agência Douro. Parabéns empresária Vânia Fernandes !", image: testemunho3, name: "Walter Martins" }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen container relative flex items-center gap-30 justify-center lg:block lg:flex lg:items-center">
        <div className="flex flex-col md:items-center lg:items-start md:max-w-[616px] z-100 w-full">
          <h1
            className="text-balance heading-tres-medium md:heading-dois-medium lg:heading-um-medium xl:text-6xl md:text-center lg:text-start"
            style={{
              opacity: isTitleVisible ? 1 : 0,
              transform: isTitleVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
            }}
          >
            A imobiliária mais exclusiva de Portugal.
          </h1>
          <p
            className="xl:mt-8 lg:mt-6 mt-4 body-18-regular text-black-muted max-w-[540px] md:text-center lg:text-start text-balance"
            style={{
              opacity: isSubtitleVisible ? 1 : 0,
              transform: isSubtitleVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
            }}
          >
            Descubra imóveis exclusivos em Portugal com a nossa imobiliária especializada.
          </p>
        </div>
        <Image
          src={HeroImage}
          alt="Hero Image"
          width={511}
          height={382}
          className="-z-10 hidden lg:block"
          style={{
            opacity: isImageVisible ? 1 : 0,
            transform: isImageVisible ? 'translateX(0)' : 'translateX(50px)',
            transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
          }}
        />
      </section>

      {/* Imóveis Destacados */}
      {properties.length >= 3 || isLoading ? (
        <section className="relative">
          <div className="container pt-6 md:pt-10 lg:pt-12 xl:pt-16 z-20">
            <div className="md:text-center flex flex-col md:items-center lg:gap-6 gap-4">
              <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">Imóveis Destacados</h2>
              <p className="body-16-regular lg:body-18-regular text-black-muted md:w-[722px]">Uma seleção criteriosa de imóveis que representam o mais elevado padrão de qualidade, arquitetura e localização, pensada para atender aos clientes mais exigentes.</p>
              <Button variant="brown" className="mt-4 md:mt-5 w-min">
                <Link href="/imoveis">Ver tudo</Link>
              </Button>
            </div>

            {isLoading && (
              <div className="mt-8 text-center">
                <p className="text-medium text-black-muted">A carregar imóveis destacados...</p>
              </div>
            )}

            {isError && (
              <div className="mt-8 text-center">
                <p className="text-medium text-red-500">Erro ao carregar imóveis destacados. Tente novamente mais tarde.</p>
              </div>
            )}

            {!isLoading && !isError && properties.length > 0 && (
              <div className={`mt-8 flex items-center gap-4 overflow-x-auto remove-scrollbar`}>
                {properties.map((property, index) => (
                  <Link
                    key={property.id}
                    href={`/imoveis/${property.id}`}
                    className={cn(`w-full bg-white`, index === 0 ? 'lg:mb-16' : index === 1 ? 'lg:mt-16' : 'lg:mb-16', 'min-w-80')}
                  >
                    <div className="card-image-overlay h-64 xl:h-93 relative">
                      {property.image && (
                        <Image
                          src={property.image}
                          alt={`Imóvel em ${property.concelho}`}
                          fill
                          className="object-cover" />
                      )}
                      <div className="bg-white text-black body-14-medium absolute bottom-2 right-2 py-1 px-1.5 z-10">
                        {property.isEmpreendimento ? "Empreendimento" : getPropertyTypeLabel(property.propertyType)}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 py-3 px-4">
                      <div className="flex justify-between text-black body-18-medium">
                        <p>{property.concelho}</p>
                        <p>{formatPrice(property.price)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="flex gap-1.5 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown">
                            <path d="M18 18H2V2H18V18ZM2.66667 17.3333H17.3333V2.66667H2.66667V17.3333Z" fill="currentColor" />
                            <path d="M11.3333 15.3333H4.8V8.73333H5.46667V14.6667H11.3333V15.3333Z" fill="currentColor" />
                            <path d="M6 10.0667L5.06667 9.2L4.2 10.0667L3.73333 9.6L5.06667 8.26667L6.46667 9.6L6 10.0667Z" fill="currentColor" />
                            <path d="M10.5333 16.3333L10.0667 15.8667L10.9333 15L10.0667 14.1333L10.5333 13.6667L11.8667 15L10.5333 16.3333Z" fill="currentColor" />
                          </svg>
                          <p className="body-14-medium whitespace-nowrap">{getAreaDisplay(property)} área</p>
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown">
                            <path d="M4.33333 10.1333V3.6C4.33333 3.06667 4.8 2.66667 5.33333 2.66667C5.86667 2.66667 6.33333 3.06667 6.33333 3.6V3.8H5.66667V4.46667H7.66667V3.8H7V3.6C7 2.73333 6.26667 2 5.33333 2C4.4 2 3.66667 2.73333 3.66667 3.6V10.1333H2V12L2.26667 12.1333C2.53333 12.2667 2.66667 12.5333 2.66667 12.8V14.8C2.66667 16.0667 3.73333 17.1333 5 17.1333V18H5.66667V17.2H14.3333V18H15V17.2C16.2667 17.2 17.3333 16.1333 17.3333 14.8667V12.8667C17.3333 12.6 17.4667 12.3333 17.7333 12.2L18 12.0667V10.2L4.33333 10.1333ZM16.6667 14.8C16.6667 15.7333 15.9333 16.4667 15 16.4667H5C4.06667 16.4667 3.33333 15.7333 3.33333 14.8V12.8C3.33333 12.5333 3.26667 12.3333 3.2 12.1333H13V11.4667H2.66667V10.8H17.3333V11.4667H15V12.1333H16.8C16.6667 12.3333 16.6667 12.5333 16.6667 12.8V14.8Z" fill="currentColor" />
                            <path d="M7 5.2H6.33333V5.86667H7V5.2Z" fill="currentColor" />
                            <path d="M7.66667 6.13333H7V6.8H7.66667V6.13333Z" fill="currentColor" />
                            <path d="M6.33333 6.13333H5.66667V6.8H6.33333V6.13333Z" fill="currentColor" />
                            <path d="M5.66667 7.2H5V7.86667H5.66667V7.2Z" fill="currentColor" />
                            <path d="M8.33333 7.2H7.66667V7.86667H8.33333V7.2Z" fill="currentColor" />
                            <path d="M7 7.2H6.33333V7.86667H7V7.2Z" fill="currentColor" />
                            <path d="M12.3333 4.53333V8.53333H16.3333V4.53333H17V3.86667H16.2667C16.1333 3.46667 15.7333 3.2 15.3333 3.2H12.6667C12.2 3.2 11.8667 3.46667 11.7333 3.86667H11V4.53333H12.3333ZM12.6667 3.86667H15.3333C15.5333 3.86667 15.6667 4 15.6667 4.2V7.86667H13V4.4C13 4.13333 12.8 3.93333 12.6 3.86667C12.6 3.86667 12.6 3.86667 12.6667 3.86667Z" fill="currentColor" />
                          </svg>
                          <p className="body-14-medium whitespace-nowrap">{property.bathrooms} {property.bathrooms === 1 ? 'casa de banho' : 'casas de banho'}</p>
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown">
                            <path d="M17.3333 11.2335L17.0667 10.0462C17 9.71639 16.7333 9.45253 16.4667 9.32061L15.8 6.6821C15.7333 6.28632 15.4 6.02247 15 5.9565V5.23091C14.9333 4.76917 14.5333 4.30743 14 4.30743H11.3333C10.8 4.30743 10.3333 4.76917 10.3333 5.29688V5.9565H9.66667V5.29688C9.6 4.76917 9.2 4.30743 8.66667 4.30743H6C5.46667 4.30743 5.06667 4.76917 5 5.29688V5.9565C4.6 6.02247 4.33333 6.28632 4.2 6.6821L3.53333 9.32061C3.26667 9.45253 3 9.71639 2.93333 10.0462L2.66667 11.2335H2V17.5H5.6L5.93333 16.1807H14.0667L14.4 17.5H18V11.2335H17.3333ZM11.3333 4.96706H13.9333C14.1333 4.96706 14.2667 5.16495 14.3333 5.29688V6.61613C14.3333 6.74806 14.1333 6.94595 14 6.94595H11.4C11.2 6.94595 11.0667 6.74806 11 6.61613V5.36284C11 5.16495 11.2 4.96706 11.3333 4.96706ZM6 4.96706H8.6C8.8 4.96706 8.93333 5.16495 9 5.29688V6.61613C9 6.74806 8.8 6.94595 8.66667 6.94595H6.06667C5.86667 6.94595 5.66667 6.74806 5.66667 6.61613V5.36284C5.66667 5.16495 5.86667 4.96706 6 4.96706ZM4.86667 6.87998C4.86667 6.81402 4.93333 6.74806 5 6.6821C5.06667 7.14384 5.53333 7.60558 6 7.60558H8.66667C9.2 7.60558 9.66667 7.14384 9.66667 6.61613H10.3333C10.4 7.14384 10.8 7.60558 11.3333 7.60558H14C14.5333 7.60558 14.9333 7.14384 15 6.6821C15.0667 6.74806 15.1333 6.81402 15.1333 6.87998L15.7333 9.25465H4.26667L4.86667 6.87998ZM3.6 10.2441C3.66667 10.0462 3.8 9.91427 4 9.91427H16C16.2 9.91427 16.3333 10.0462 16.4 10.2441L16.6667 11.2335H3.33333L3.6 10.2441ZM17.3333 16.8404H14.9333L14.8 16.1807H16.4V15.5211H3.66667V16.1807H5.26667L5.13333 16.8404H2.66667V11.8932H17.3333V16.8404Z" fill="currentColor" />
                            <path d="M3.66604 3.15963H16.3327V8.10684H16.9994V2.5H2.99938V8.10684H3.66604V3.15963Z" fill="currentColor" />
                          </svg>
                          <p className="body-14-medium whitespace-nowrap">{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</p>
                        </div>
                        <div className="flex gap-1.5 items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown">
                            <path d="M10 14.437V13.7647H15.2V11.2773C15.2 10.9412 14.9333 10.6723 14.6 10.6723H14.4L12.8667 7.17647H10V6.5042H13.3333L14.8667 10C15.4667 10.1345 15.9333 10.605 15.9333 11.2773V14.437H10Z" fill="currentColor" />
                            <path d="M13.9333 16.3866H13.2C12.7333 16.3866 12.3333 15.9832 12.3333 15.5798V14.1681H13V15.5798C13 15.6471 13.0667 15.7143 13.2 15.7143H13.9333C14.0667 15.7143 14.1333 15.6471 14.1333 15.5798V14.1681H14.8V15.5798C14.8667 15.9832 14.4667 16.3866 13.9333 16.3866Z" fill="currentColor" />
                            <path d="M10 14.437H4.13333V11.2773C4.13333 10.6723 4.6 10.1345 5.2 10L6.66667 6.5042H10V7.17647H7.13333L5.6 10.6723H5.4C5.06667 10.6723 4.8 10.9412 4.8 11.2773V13.7647H10V14.437Z" fill="currentColor" />
                            <path d="M6.8 16.3866H6.06667C5.6 16.3866 5.2 15.9832 5.2 15.5798V14.1681H5.86667V15.5798C5.86667 15.6471 5.93333 15.7143 6.06667 15.7143H6.8C6.93333 15.7143 7 15.6471 7 15.5798V14.1681H7.66667V15.5798C7.66667 15.9832 7.26667 16.3866 6.8 16.3866Z" fill="currentColor" />
                            <path d="M13.4667 13.4286C12.8 13.4286 12.2667 12.8908 12.2667 12.2185C12.2667 11.5462 12.8 11.0084 13.4667 11.0084C14.1333 11.0084 14.6667 11.5462 14.6667 12.2185C14.6 12.8908 14.0667 13.4286 13.4667 13.4286ZM13.4667 11.7479C13.2 11.7479 12.9333 11.9496 12.9333 12.2857C12.9333 12.6218 13.1333 12.8235 13.4667 12.8235C13.8 12.8235 14 12.6218 14 12.2857C14 11.9496 13.7333 11.7479 13.4667 11.7479Z" fill="currentColor" />
                            <path d="M11.7333 11.3445H8.26667V12.0168H11.7333V11.3445Z" fill="currentColor" />
                            <path d="M11.7333 12.4874H8.26667V13.1597H11.7333V12.4874Z" fill="currentColor" />
                            <path d="M6.53333 13.4286C5.86667 13.4286 5.33333 12.8908 5.33333 12.2185C5.33333 11.5462 5.86667 11.0084 6.53333 11.0084C7.2 11.0084 7.73333 11.5462 7.73333 12.2185C7.73333 12.8908 7.2 13.4286 6.53333 13.4286ZM6.53333 11.7479C6.26667 11.7479 6 11.9496 6 12.2857C6 12.6218 6.2 12.8235 6.53333 12.8235C6.86667 12.8235 7.06667 12.6218 7.06667 12.2857C7.06667 11.9496 6.86667 11.7479 6.53333 11.7479Z" fill="currentColor" />
                            <path d="M14.6667 10H5.46667V10.6723H14.6667V10Z" fill="currentColor" />
                            <path d="M18 18H2V7.2437L10 2L18 7.2437V18ZM2.66667 17.3277H17.3333V7.57983L10 2.7395L2.66667 7.57983V17.3277Z" fill="currentColor" />
                          </svg>
                          <p className="body-14-medium whitespace-nowrap">{property.garageSpaces} {property.garageSpaces === 1 ? 'lugar garagem' : 'lugares garagem'}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="w-screen left-0 bg-[#EDE3D7] lg:h-[386px] absolute top-132 -z-10"></div>
        </section>
      ) : null}

      {/* Zonas Mais Desejadas */}
      <section className="bg-deaf py-6 md:py-10 lg:py-12 xl:py-16 mt-6 md:mt-10 lg:mt-12 xl:mt-16">
        <div className="container">
          <div className="text-center flex flex-col items-center lg:gap-6 gap-4">
            <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-black">As zonas mais desejadas</h2>
            <p className="body-16-regular lg:body-18-regular text-black-muted w-full md:w-[490px] text-balance">Descubra as regiões que atraem quem busca exclusividade, conforto e um estilo de vida sem igual.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 md:mt-5 lg:mt-10 xl:mt-12">
            {zonas.map(({ nome, src }) => (
              <div key={nome} className="overflow-hidden w-full max-h-58 group relative">
                <Image src={src} alt={`Imagem de ${nome}`} className="object-cover bg-center" />
                <div className="opacity-100 md:group-hover:opacity-100 md:opacity-0 w-full h-full bg-linear-to-b from-black/0 to-black/70 absolute top-0 left-0 ease-out duration-200 transition-all">
                  <div className="md:translate-y-16 md:group-hover:translate-y-0 flex items-end h-full justify-between p-4 transition-all duration-200 ease-out">
                    <p className="text-white body-20-medium">{nome}</p>
                    <Button variant="gold" asChild className="w-min">
                      <Link href={`/imoveis?distrito=${nome}`}>Ver Todos</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testemunhos */}
      <section className="py-6 md:py-10 lg:py-12 xl:py-16 container">
        <div className="flex flex-col lg:flex-row md:justify-center lg:justify-between lg:items-end md:w-[526px] lg:w-full md:text-center lg:text-start md:m-auto">
          <div className="lg:space-y-6 space-y-4">
            <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular text-balance md:whitespace-nowrap text-black">Palavras com chave na mão</h2>
            <p className="text-black-muted md:body-18-regular body-16-regular w-full lg:w-[618px]">Cada chave carrega uma história, cada lar acolhe um sonho, estas são as vozes de quem encontrou o seu lugar perfeito.</p>
          </div>
          <div className="flex flex-col md:items-center gap-2 lg:items-end mt-4 md:mt-5 lg:mt-0">
            <p className="body-18-medium text-black-muted">
              {siteConfig?.clientesSatisfeitos || 800}+ clientes satisfeitos
            </p>
            <div className="flex gap-2 items-center">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const rating = siteConfig?.rating || 5.0;
                  const fullStars = Math.floor(rating);
                  const hasHalfStar = rating % 1 >= 0.5;
                  const isFull = i < fullStars;
                  const isHalf = i === fullStars && hasHalfStar;
                  return (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      {isFull ? (
                        <path d="M9.25805 3.12353C9.56721 2.51693 10.4339 2.51693 10.743 3.12353L12.566 6.70054C12.687 6.93796 12.9142 7.1032 13.1774 7.14512L17.1398 7.77618C17.8114 7.88315 18.079 8.70612 17.5987 9.18762L14.762 12.0319C14.5741 12.2203 14.4875 12.4871 14.529 12.75L15.1541 16.7195C15.26 17.3918 14.5591 17.9006 13.9527 17.5918L10.3788 15.7711C10.1411 15.65 9.85996 15.65 9.6223 15.7711L6.04837 17.5918C5.44199 17.9006 4.74104 17.3918 4.84692 16.7195L5.47216 12.75C5.51356 12.4871 5.42694 12.2203 5.23902 12.0319L2.40235 9.18762C1.92213 8.70612 2.18974 7.88315 2.86133 7.77618L6.82373 7.14512C7.0869 7.1032 7.31415 6.93796 7.43514 6.70054L9.25805 3.12353Z" fill="#DCB053" stroke="#DCB053" strokeWidth="1.25" strokeLinejoin="round" />
                      ) : isHalf ? (
                        <>
                          <defs>
                            <linearGradient id={`half-${i}`}>
                              <stop offset="50%" stopColor="#DCB053" />
                              <stop offset="50%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                          <path d="M9.25805 3.12353C9.56721 2.51693 10.4339 2.51693 10.743 3.12353L12.566 6.70054C12.687 6.93796 12.9142 7.1032 13.1774 7.14512L17.1398 7.77618C17.8114 7.88315 18.079 8.70612 17.5987 9.18762L14.762 12.0319C14.5741 12.2203 14.4875 12.4871 14.529 12.75L15.1541 16.7195C15.26 17.3918 14.5591 17.9006 13.9527 17.5918L10.3788 15.7711C10.1411 15.65 9.85996 15.65 9.6223 15.7711L6.04837 17.5918C5.44199 17.9006 4.74104 17.3918 4.84692 16.7195L5.47216 12.75C5.51356 12.4871 5.42694 12.2203 5.23902 12.0319L2.40235 9.18762C1.92213 8.70612 2.18974 7.88315 2.86133 7.77618L6.82373 7.14512C7.0869 7.1032 7.31415 6.93796 7.43514 6.70054L9.25805 3.12353Z" fill={`url(#half-${i})`} stroke="#DCB053" strokeWidth="1.25" strokeLinejoin="round" />
                        </>
                      ) : (
                        <path d="M9.25805 3.12353C9.56721 2.51693 10.4339 2.51693 10.743 3.12353L12.566 6.70054C12.687 6.93796 12.9142 7.1032 13.1774 7.14512L17.1398 7.77618C17.8114 7.88315 18.079 8.70612 17.5987 9.18762L14.762 12.0319C14.5741 12.2203 14.4875 12.4871 14.529 12.75L15.1541 16.7195C15.26 17.3918 14.5591 17.9006 13.9527 17.5918L10.3788 15.7711C10.1411 15.65 9.85996 15.65 9.6223 15.7711L6.04837 17.5918C5.44199 17.9006 4.74104 17.3918 4.84692 16.7195L5.47216 12.75C5.51356 12.4871 5.42694 12.2203 5.23902 12.0319L2.40235 9.18762C1.92213 8.70612 2.18974 7.88315 2.86133 7.77618L6.82373 7.14512C7.0869 7.1032 7.31415 6.93796 7.43514 6.70054L9.25805 3.12353Z" fill="transparent" stroke="#DCB053" strokeWidth="1.25" strokeLinejoin="round" />
                      )}
                    </svg>
                  );
                })}
              </div>
              <span className="body-18-medium text-black-muted">
                {siteConfig?.rating?.toFixed(1) || "5.0"}
              </span>
            </div>
          </div>
        </div>
        <div
          ref={scrollContainerRef}
          className="remove-scrollbar mt-4 md:mt-5 lg:mt-10 xl:mt-12 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory [&>div]:snap-start"
        >
          {testemunhos.map((testemunho, index) => (
            <div key={index} className="flex flex-col p-6 gap-5 min-w-117 md:min-w-[511px] bg-white">
              <div className="space-y-2">
                <Image src={testemunho.image} alt="testemunho-image" width={32} height={32} />
                <p className="text-brown body-18-medium">{testemunho.name}</p>
              </div>
              <p className="text-black-muted body-16-regular">{testemunho.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 md:mt-5 lg:mt-10 xl:mt-12 flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Button
              variant="icon-brown"
              size="icon"
              onClick={scrollToPrevious}
              disabled={isAtStart}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown group-hover:text-white">
                <path d="M6.52692 9.16658L10.9969 4.69657L9.81842 3.51807L3.33659 9.99992L9.81842 16.4817L10.9969 15.3032L6.52692 10.8332H16.6699V9.16658H6.52692Z" fill="currentColor" />
              </svg>
            </Button>
            <Button
              variant="icon-brown"
              size="icon"
              onClick={scrollToNext}
              disabled={isAtEnd}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-brown group-hover:text-white">
                <path d="M13.4731 9.16658L9.00308 4.69657L10.1816 3.51807L16.6634 9.99992L10.1816 16.4817L9.00308 15.3032L13.4731 10.8332H3.33008V9.16658H13.4731Z" fill="currentColor" />
              </svg>
            </Button>
          </div>
          <Button>
            <Link target="_blank" href="https://www.google.com/search?sa=X&sca_esv=75a4ac89eb4f2f79&rlz=1C5CHFA_enPT1081PT1081&sxsrf=AE3TifOiFTjsCAp8JGBMe6lHNXSapsBScQ:1764862760518&q=Ag%C3%AAncia+Douro+-+Media%C3%A7%C3%A3o+Imobili%C3%A1ria+AMI+17+632+Cr%C3%ADticas&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNDWwNDMwN7MwMjK2tDCytDQxstjAyPiK0dYx_fCqvOTMRAWX_NKifAVdBd_UlMzEw8sPL85X8MzNT8rMyTy8sAgo7-jrqWBormBmbKTgXHR4bUlmcmLxIlbK9AMAVO_6DZsAAAA&rldimm=15096076822398299428&tbm=lcl&hl=pt-PT&ved=2ahUKEwj16KuPoqSRAxUM0gIHHX31C5QQ9fQKegQINBAF&biw=1439&bih=691&dpr=2#lkt=LocalPoiReviews">Ver mais</Link>
          </Button>
        </div>
      </section>

      {/* Fale Connosco */}
      <section className="bg-deaf py-6 md:py-10 lg:py-12 xl:py-16" id="contacto">
        <div className="container">
          <h2 className="heading-quatro-regular md:heading-tres-regular xl:heading-dois-regular">Fale connosco</h2>
          <div className="flex lg:flex-row flex-col-reverse gap-4 mt-4 md:mt-5 lg:mt-10 xl:mt-12">
            <div className="relative h-64 md:h-93 bg-muted w-full">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1502.0337394772985!2d-8.6822294!3d41.1842493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd246f70571b1a9b%3A0xd18009e3350eed24!2sAg%C3%AAncia%20Douro%20-%20Media%C3%A7%C3%A3o%20Imobili%C3%A1ria%20AMI%2017%20632!5e0!3m2!1spt-PT!2spt!4v1234567890" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-6 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="nome" className="body-14-medium text-black">Nome <span className="text-red body-14-medium">*</span></Label>
                  <Input
                    id="nome"
                    placeholder="Tomas Ribeiro Silva"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="telefone" className="body-14-medium text-black">Número de Telemóvel <span className="text-red body-14-medium">*</span></Label>
                  <Input
                    id="telefone"
                    placeholder="+351 919 766 323"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="body-14-medium text-black">Email <span className="text-red body-14-medium">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@agenciadouro.pt"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="mensagem" className="body-14-medium text-black">Mensagem <span className="text-red body-14-medium">*</span></Label>
                <Textarea
                  id="mensagem"
                  placeholder="Envie-nos uma mensagem!"
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  required
                  className="h-19"
                />
              </div>
              <div className="flex gap-2">
                <Checkbox
                  id="marketing"
                  checked={formData.aceitaMarketing}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, aceitaMarketing: checked as boolean })
                  }
                />
                <Label htmlFor="marketing" className="body-14-medium text-black-muted cursor-pointer">Autorizo a Agência Douro a guardar estes dados para efeitos de marketing e de contacto. <span className="text-red body-14-medium">*</span></Label>
              </div>
              <Button type="submit" variant="gold" className="w-full">Enviar</Button>
            </form>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-4 md:mt-5 lg:mt-10 xl:mt-12">
            <div className="flex flex-col">
              <h3 className="md:body-20-medium body-18-medium text-black mb-6">Email</h3>
              <p className="body-16-regular text-grey mb-4 text-balance">Envie-nos a sua dúvida ou questão para o nosso email.</p>
              <Link href="mailto:contacto@agenciadouro.pt" className="body-16-medium text-black underline underline-offset-4 decoration-1">contacto@agenciadouro.pt</Link>
            </div>
            <div className="flex flex-col">
              <h3 className="md:body-20-medium body-18-medium text-black mb-6">Contacto</h3>
              <p className="body-16-regular text-grey mb-4 text-balance">Pode também falar conosco através do telefone.</p>
              <Link href="tel:+351919766323" className="body-16-medium text-black underline underline-offset-4 decoration-1 mb-2">+351 919 766 323</Link>
              <Link href="tel:+351919766324" className="body-16-medium text-black underline underline-offset-4 decoration-1">+351 919 766 324</Link>
            </div>
            <div className="flex flex-col">
              <h3 className="md:body-20-medium body-18-medium text-black mb-6">Redes Sociais</h3>
              <p className="body-16-regular text-grey mb-4 text-balance">Somos bastante ativos nas redes, siga-nos!</p>
              <Link href="https://www.instagram.com/agenciadouro" target="_blank" rel="noopener noreferrer" className="body-16-medium text-black flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gold">
                  <path d="M10.8567 1.66748C11.7946 1.66903 12.2698 1.674 12.6805 1.68622L12.8422 1.69151C13.0291 1.69815 13.2134 1.70648 13.4357 1.7169C14.3224 1.75787 14.9273 1.89815 15.4586 2.1044C16.0078 2.31621 16.4717 2.60231 16.9349 3.06551C17.3974 3.52871 17.6836 3.99398 17.8961 4.5419C18.1016 5.07246 18.2419 5.67801 18.2836 6.56481C18.2935 6.78704 18.3015 6.97137 18.3081 7.15824L18.3133 7.31998C18.3255 7.7306 18.3311 8.20592 18.3328 9.14379L18.3335 9.76512C18.3336 9.84104 18.3336 9.91937 18.3336 10.0002L18.3335 10.2353L18.333 10.8567C18.3314 11.7945 18.3265 12.2699 18.3142 12.6805L18.3089 12.8422C18.3023 13.0291 18.294 13.2135 18.2836 13.4356C18.2426 14.3225 18.1016 14.9273 17.8961 15.4585C17.6842 16.0079 17.3974 16.4718 16.9349 16.935C16.4717 17.3975 16.0057 17.6835 15.4586 17.896C14.9273 18.1016 14.3224 18.2419 13.4357 18.2835C13.2134 18.2935 13.0291 18.3015 12.8422 18.308L12.6805 18.3133C12.2698 18.3255 11.7946 18.331 10.8567 18.3329L10.2353 18.3335C10.1594 18.3335 10.0811 18.3335 10.0002 18.3335H9.76516L9.14375 18.333C8.20591 18.3315 7.7306 18.3265 7.31997 18.3142L7.15824 18.309C6.97136 18.3023 6.78703 18.294 6.56481 18.2835C5.67801 18.2426 5.07384 18.1016 4.5419 17.896C3.99328 17.6843 3.5287 17.3975 3.06551 16.935C2.60231 16.4718 2.3169 16.0058 2.1044 15.4585C1.89815 14.9273 1.75856 14.3225 1.7169 13.4356C1.707 13.2135 1.69892 13.0291 1.69238 12.8422L1.68714 12.6805C1.67495 12.2699 1.66939 11.7945 1.66759 10.8567L1.66748 9.14379C1.66903 8.20592 1.67399 7.7306 1.68621 7.31998L1.69151 7.15824C1.69815 6.97137 1.70648 6.78704 1.7169 6.56481C1.75786 5.67731 1.89815 5.07315 2.1044 4.5419C2.3162 3.99329 2.60231 3.52871 3.06551 3.06551C3.5287 2.60231 3.99398 2.3169 4.5419 2.1044C5.07315 1.89815 5.67731 1.75856 6.56481 1.7169C6.78703 1.70701 6.97136 1.69893 7.15824 1.69239L7.31997 1.68715C7.7306 1.67495 8.20591 1.66939 9.14375 1.66759L10.8567 1.66748ZM10.0002 5.83356C7.69781 5.83356 5.83356 7.69984 5.83356 10.0002C5.83356 12.3026 7.69984 14.1669 10.0002 14.1669C12.3027 14.1669 14.1669 12.3006 14.1669 10.0002C14.1669 7.69781 12.3006 5.83356 10.0002 5.83356ZM10.0002 7.50023C11.381 7.50023 12.5002 8.61912 12.5002 10.0002C12.5002 11.381 11.3813 12.5002 10.0002 12.5002C8.6195 12.5002 7.50023 11.3814 7.50023 10.0002C7.50023 8.61945 8.61908 7.50023 10.0002 7.50023ZM14.3752 4.58356C13.8008 4.58356 13.3336 5.05016 13.3336 5.62452C13.3336 6.1989 13.8002 6.66621 14.3752 6.66621C14.9496 6.66621 15.4169 6.19962 15.4169 5.62452C15.4169 5.05016 14.9488 4.58285 14.3752 4.58356Z" />
                </svg>
                agenciadouro
              </Link>
              <Link href="https://www.facebook.com/agenciadouro" target="_blank" rel="noopener noreferrer" className="body-16-medium text-black flex items-center gap-2 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-gold">
                  <path d="M10.0008 1.66626C5.39844 1.66626 1.66748 5.39722 1.66748 9.99959C1.66748 14.159 4.71486 17.6065 8.69875 18.2317V12.4084H6.58284V9.99959H8.69875V8.16366C8.69875 6.07512 9.94283 4.92147 11.8463 4.92147C12.7581 4.92147 13.7117 5.08423 13.7117 5.08423V7.13501H12.6609C11.6257 7.13501 11.3029 7.77738 11.3029 8.43643V9.99959H13.6141L13.2447 12.4084H11.3029V18.2317C15.2867 17.6065 18.3342 14.159 18.3342 9.99959C18.3342 5.39722 14.6032 1.66626 10.0008 1.66626Z" />
                </svg>
                Agência Douro
              </Link>
            </div>
            <div className="flex flex-col">
              <h3 className="body-20-medium text-black mb-6">Morada</h3>
              <p className="body-16-regular text-grey mb-4 text-balance">Venha fazer-nos uma visita, ficamos por cá à sua espera</p>
              <p className="body-16-medium text-black">
                Rua Conde Alto Mearim, nº 1133<br />
                5º Andar, Sala 55 - Edifício Via Europa<br />
                4450-036 - Matosinhos, Porto
              </p>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}