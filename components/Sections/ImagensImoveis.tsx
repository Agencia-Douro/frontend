import React, { useState } from "react";
import { Property } from "@/types/property";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

interface ImagensImoveisProps {
  property: Property;
  openLightbox?: (index: number) => void;
  lightboxOpen?: boolean;
  lightboxIndex?: number;
  onLightboxClose?: () => void;
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
  openLightbox,
  lightboxOpen: lightboxOpenProp,
  lightboxIndex: lightboxIndexProp,
  onLightboxClose,
}: ImagensImoveisProps) {
  // --- estados do lightbox (fallback se não controlado) ---
  const [lightboxOpenLocal, setLightboxOpenLocal] = useState(false);
  const [photoIndexLocal, setPhotoIndexLocal] = useState(0);

  const isControlled = lightboxOpenProp !== undefined;
  const lightboxOpen = isControlled ? lightboxOpenProp : lightboxOpenLocal;
  const photoIndex = isControlled ? (lightboxIndexProp ?? 0) : photoIndexLocal;

  // --- preparar todas as mídias (imagens e vídeos) para o lightbox ---
  // Incluir a imagem principal primeiro, depois todas as outras
  const allMedia: Array<{ src: string } | { type: 'video'; sources: Array<{ src: string; type: string }> }> = [
    // Imagem principal primeiro
    property.image && (isVideoUrl(property.image)
      ? { type: 'video' as const, sources: [{ src: property.image, type: 'video/mp4' }] }
      : { src: property.image }
    ),
    // Depois todas as imagens das seções
    ...(property.imageSections?.flatMap(section =>
      section.images.map(src =>
        isVideoUrl(src)
          ? { type: 'video' as const, sources: [{ src, type: 'video/mp4' }] }
          : { src }
      )
    ) || [])
  ].filter(Boolean) as Array<{ src: string } | { type: 'video'; sources: Array<{ src: string; type: string }> }>;

  const handleClose = () => {
    if (onLightboxClose) {
      onLightboxClose();
    } else {
      setLightboxOpenLocal(false);
    }
  };



  return (
    <Lightbox
      open={lightboxOpen}
      close={handleClose}
      slides={allMedia}
      index={photoIndex}
      plugins={[Video]}
    />
  );
}

// Exportar função helper para calcular índice
export const getImageIndex = (property: Property, targetImageUrl: string): number => {
  // Se for a imagem principal
  if (property.image === targetImageUrl) {
    return 0;
  }
  
  // Procurar nas seções
  let index = 1; // Começar em 1 porque 0 é a imagem principal
  if (property.imageSections) {
    for (const section of property.imageSections) {
      for (const img of section.images) {
        if (img === targetImageUrl) {
          return index;
        }
        index++;
      }
    }
  }
  
  return 0; // Fallback
};
