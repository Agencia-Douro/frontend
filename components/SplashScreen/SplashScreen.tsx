"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/public/Logo.svg";

export default function SplashScreen() {
  const [opacity, setOpacity] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Bloquear scroll enquanto a splash screen está visível
    document.body.style.overflow = "hidden";

    const startTime = Date.now();
    const minDisplayTime = 2000; // Mínimo de 2 segundos

    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      // Aguardar o tempo restante para completar os 2 segundos mínimos
      setTimeout(() => {
        // Iniciar fade out: opacity de 100 para 0 em 300ms com ease-out
        setOpacity(0);

        // Remover do DOM após a animação completar
        setTimeout(() => {
          setIsVisible(false);
          document.body.style.overflow = "";
        }, 400);
      }, remainingTime);
    };

    // Verificar se a página já está carregada
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-deaf"
      style={{
        opacity,
        transition: "opacity 400ms ease-out",
      }}
    >
      <Image
        src={Logo}
        alt="Agência Douro"
        width={200}
        height={90}
        className="w-auto h-20 md:h-24 lg:h-28"
        style={{
          transform: "scale(0.7)",
        }}
        priority
      />
    </div>
  );
}
