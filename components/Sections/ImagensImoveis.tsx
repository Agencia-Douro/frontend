"use client";

import React, { useState } from "react";
import { Property } from "@/types/property";
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

interface ImagensImoveisProps {
  property: Property;
  lightboxOpen?: boolean;
  lightboxIndex?: number;
  onLightboxClose?: () => void;
}

const isVideoUrl = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
  return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

export default function ImagensImoveis({
  property,
  lightboxOpen: lightboxOpenProp,
  lightboxIndex: lightboxIndexProp,
  onLightboxClose,
}: ImagensImoveisProps) {
  const [lightboxOpenLocal, setLightboxOpenLocal] = useState(false);
  const [photoIndexLocal] = useState(0);

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
      styles={{
        root: {
          "--yarl__color_backdrop": "rgba(0, 0, 0, 0.2)"
        },
        slide: {
          padding: "80px 20px"
        }
      }}
    />
  );
}

export { getImageIndex } from "@/lib/image-utils";
