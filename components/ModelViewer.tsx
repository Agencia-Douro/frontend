"use client";

import { useEffect, useRef, useState } from "react";

interface ModelViewerProps {
  src: string;
  alt?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ModelViewer({
  src,
  alt = "Modelo 3D",
  autoRotate = true,
  cameraControls = true,
  className,
  style,
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Verificar se o script já foi carregado
    const checkScript = () => {
      if (customElements.get("model-viewer")) {
        setIsScriptLoaded(true);
        return true;
      }
      return false;
    };

    // Se já estiver carregado, definir como carregado
    if (checkScript()) {
      return;
    }

    // Aguardar o script ser carregado
    const interval = setInterval(() => {
      if (checkScript()) {
        clearInterval(interval);
      }
    }, 100);

    // Timeout de segurança
    const timeout = setTimeout(() => {
      clearInterval(interval);
      // Tentar mesmo assim se o script não carregar
      setIsScriptLoaded(true);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isScriptLoaded) return;

    // Verificar se customElements está disponível e se model-viewer está registrado
    if (!customElements.get("model-viewer")) {
      return;
    }

    // Criar o elemento model-viewer
    const modelViewer = document.createElement("model-viewer");
    modelViewer.setAttribute("src", src);
    modelViewer.setAttribute("alt", alt);
    
    if (autoRotate) {
      modelViewer.setAttribute("auto-rotate", "");
    }
    
    if (cameraControls) {
      modelViewer.setAttribute("camera-controls", "");
    }

    // Aplicar estilos
    if (className) {
      modelViewer.className = className;
    }
    
    if (style) {
      Object.assign(modelViewer.style, style);
    }

    // Limpar container e adicionar o model-viewer
    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(modelViewer);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [src, alt, autoRotate, cameraControls, className, style, isScriptLoaded]);

  return <div ref={containerRef} />;
}

