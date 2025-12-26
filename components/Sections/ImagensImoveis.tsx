import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Property } from "@/types/property";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

interface ImagensImoveisProps {
  property: Property;
  showPanel?: boolean;
  panelClosing?: boolean;
  panelOpening?: boolean;
  handleOpenPanel?: () => void;
  handleClosePanel?: () => void;
  handleTransitionEnd?: () => void;
}

// Helper function to check if URL is a video
const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

// Helper component to render media (image or video)
const MediaItem = ({
  src,
  alt,
  className,
  onClick
}: {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}) => {
  const isVideo = isVideoUrl(src);

  if (isVideo) {
    return (
      <video
        src={src}
        controls
        className={className}
        onClick={onClick}
        preload="metadata"
      />
    );
  }

  return (
    <Image
      width={1000}
      height={1000}
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
    />
  );
};

export default function ImagensImoveis({
  property,
  showPanel: showPanelProp,
  panelClosing: panelClosingProp,
  panelOpening: panelOpeningProp,
  handleOpenPanel,
  handleClosePanel: handleClosePanelProp,
  handleTransitionEnd: handleTransitionEndProp,
}: ImagensImoveisProps) {
  // --- estados locais (fallback quando não há props) ---
  const [showPanelLocal, setShowPanelLocal] = useState(false);
  const [panelClosingLocal, setPanelClosingLocal] = useState(false);
  const [panelOpeningLocal, setPanelOpeningLocal] = useState(false);

  // --- estados do lightbox ---
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // --- preparar todas as mídias (imagens e vídeos) para o lightbox ---
  const allMedia = property.imageSections?.flatMap(section =>
    section.images.map(src =>
      isVideoUrl(src)
        ? { type: 'video' as const, sources: [{ src, type: 'video/mp4' }] }
        : { src }
    )
  ) || [];

  // --- função para abrir lightbox na imagem correta ---
  const openLightbox = (sectionIndex: number, imageIndex: number) => {
    // calcular o índice global da imagem
    let globalIndex = 0;
    for (let i = 0; i < sectionIndex; i++) {
      globalIndex += property.imageSections![i].images.length;
    }
    globalIndex += imageIndex;

    setPhotoIndex(globalIndex);
    setLightboxOpen(true);
  };

  // --- usar props se fornecidas, senão usar estados locais ---
  const isControlled = showPanelProp !== undefined;
  const showPanel = showPanelProp ?? showPanelLocal;
  const panelClosing = panelClosingProp ?? panelClosingLocal;
  const panelOpening = panelOpeningProp ?? panelOpeningLocal;

  // --- abrir painel (modo controlado delega para prop) ---
  const handleOpen = () => {
    if (handleOpenPanel) {
      console.log("[ImagensImoveis] delegando open para prop");
      handleOpenPanel();
      return;
    }

    console.log("[ImagensImoveis] abrir (local)");
    // reset de segurança
    setPanelClosingLocal(false);
    setPanelOpeningLocal(false);

    // montar o painel
    setShowPanelLocal(true);

    // garantir que a transição de abertura corre (duplo RAF força aplicação do style)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPanelOpeningLocal(true);
      });
    });
  };

  // --- fechar painel (modo controlado delega para prop) ---
  const handleClose = () => {
    if (handleClosePanelProp) {
      console.log("[ImagensImoveis] delegando close para prop");
      handleClosePanelProp();
      return;
    }

    console.log("[ImagensImoveis] fechar (local) — iniciar transição de fechar");
    setPanelClosingLocal(true);
    setPanelOpeningLocal(false);
  };

  // --- when transition ends on the outer wrapper ---
  const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    // só reagir à transição de transform
    if (e.propertyName !== "transform") return;

    console.log(
      `[ImagensImoveis] onTransitionEnd prop=${e.propertyName} panelClosing=${panelClosing} panelOpening=${panelOpening}`
    );

    if (handleTransitionEndProp) {
      // se caller controla estados, delega
      handleTransitionEndProp();
      return;
    }

    if (panelClosing) {
      // terminar de fechar: desmontar
      setPanelClosingLocal(false);
      setShowPanelLocal(false);
      setPanelOpeningLocal(false);
      console.log("[ImagensImoveis] transição de fechar terminou — desmontado localmente");
    } else {
      // terminou abertura — nada necessário
      console.log("[ImagensImoveis] transição de abrir terminou");
    }
  };

  // Caso alguém altere showPanelProp externamente (modo controlado),
  // queremos garantir que o estado local de opening/closing sincroniza visualmente
  useEffect(() => {
    if (!isControlled) return;

    // modo controlado: se showPanelProp foi ativado -> simular opening
    if (showPanelProp) {
      // reset e abrir
      setPanelClosingLocal(false);
      setPanelOpeningLocal(false);
      // permitir ao browser aplicar estilos
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // não mexer em showPanelLocal (está controlado pelo prop), usamos apenas panelOpeningLocal para cálculo do transform inline
          setPanelOpeningLocal(true);
        });
      });
    } else {
      // se foi pedido para fechar via prop, iniciar a animação de fechar
      setPanelOpeningLocal(false);
      setPanelClosingLocal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPanelProp]);

  // --- estilo inline garantido para a transição do transform ---
  const transformStyle = panelOpening && !panelClosing ? "translateY(0%)" : "translateY(100%)";

  // pointer events off when fully hidden to avoid tabbing into content while hidden
  const pointerEvents = showPanel || panelClosing ? "auto" : "none";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && (showPanel || panelOpening)) {
        console.log("[ImagensImoveis] ESC pressionado – fechar painel");
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPanel, panelOpening]);


  return (
    <>
      <Button variant="outline" onClick={handleOpen}>
        Ver Todas
      </Button>

      {/* Mantemos o wrapper no DOM enquanto showPanel ou estamos no processo de fechar */}
      {(showPanel || panelClosing) && (
        <div
          className="bg-deaf block overflow-hidden fixed inset-0 z-1000"
          // wrapper que tem a transição de transform inline — por isso onTransitionEnd aqui é fiável
          onTransitionEnd={onTransitionEnd}
          role="dialog"
          aria-modal="true"
          style={{
            overflow: "hidden",
            transform: transformStyle,
            transition: "transform 300ms ease-in-out",
            pointerEvents,
          }}
        >
          <div style={{ height: "100%", overflowY: "auto" }}>
            <div className="container relative" style={{ minHeight: "100%" }}>
              <button
                className="flex items-center gap-2 px-1.5 py-1 absolute lg:fixed mt-4 lg:mt-8 z-100 body-16-medium text-brown hover:text-gold transition-colors cursor-pointer"
                onClick={handleClose}
                disabled={panelClosing}
                aria-disabled={panelClosing}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5.16725 9.12965L2.19555 5.80428L5.16336 2.5M2 5.81495H11.0427C12.676 5.81495 14 7.31142 14 9.1575C14 11.0035 12.676 12.5 11.0427 12.5H7.38875"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                Voltar
              </button>
              <div className="min-h-full">
                {property.imageSections && property.imageSections.length > 0 ? (
                  property.imageSections.map((section, sectionIndex) => {
                    const imageCount = section.images.length;
                    const imagesToShow = section.images.slice(0, 3);

                    return (
                      <div key={section.id} className={`grid grid-cols-1 lg:grid-cols-6 ${sectionIndex === property.imageSections!.length - 1 ? 'pb-8' : ''}`}>
                        <span className="text-brown body-18-medium pt-4 md:pt-6 xl:pt-8 lg:col-start-1 lg:col-end-3 text-end lg:sticky lg:top-0 h-min">
                          {section.sectionName}
                        </span>
                        <div className={`pt-4 md:pt-6 lg:pt-4 lg:col-start-4 lg:col-end-7 ${imageCount === 1 ? 'pb-4' : ''}`}>
                          {imageCount >= 2 ? (
                            <div className="grid grid-cols-2 gap-4" style={{ gridTemplateRows: 'auto 1fr' }}>
                              <div className="col-span-2 aspect-5/3 w-full bg-cover bg-center overflow-hidden cursor-pointer" onClick={() => openLightbox(sectionIndex, 0)}>
                                <MediaItem
                                  src={imagesToShow[0]}
                                  alt={`${section.sectionName} - 1`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                              {imagesToShow.slice(1).map((image, imageIndex) => (
                                <div
                                  key={imageIndex + 1}
                                  className="w-full h-full bg-cover bg-center overflow-hidden cursor-pointer"
                                  onClick={() => openLightbox(sectionIndex, imageIndex + 1)}
                                >
                                  <MediaItem
                                    src={image}
                                    alt={`${section.sectionName} - ${imageIndex + 2}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="w-full bg-cover bg-center overflow-hidden aspect-5/3 cursor-pointer" onClick={() => openLightbox(sectionIndex, 0)}>
                              <MediaItem
                                src={imagesToShow[0]}
                                alt={`${section.sectionName} - 1`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <p className="text-brown body-16-regular">Nenhuma imagem disponível para este imóvel.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={allMedia}
        index={photoIndex}
        plugins={[Video]}
      />
    </>
  );
}
