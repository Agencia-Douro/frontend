"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/Logo.svg";
import ModelViewer from "../ModelViewer";

export default function SplashScreen() {
    const pathname = usePathname();
    const [opacity, setOpacity] = useState(1);
    // Iniciar como true se estiver na home para evitar flash da página
    const [isVisible, setIsVisible] = useState(pathname === "/");
    
    // Verificar se estamos na home (rota "/")
    const isHomePage = pathname === "/";

    useEffect(() => {
        // Se não estivermos na home, não mostrar a splash screen
        if (!isHomePage) {
            setIsVisible(false);
            return;
        }

        // Mostrar a splash screen apenas na home
        setIsVisible(true);

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
    }, [isHomePage]);

    // Se não estivermos na home ou a splash screen não estiver visível, não renderizar nada
    if (!isHomePage || !isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-deaf overflow-hidden"
            style={{
                opacity,
                transition: "opacity 400ms ease-out",
            }}>
            {/* Modelo 3D com tamanho do logo */}
            <div className="absolute z-0 w-[140px] h-[63px] md:w-[168px] md:h-[76px] lg:w-[196px] lg:h-[88px] pointer-events-none">
                <ModelViewer
                    src="/model3.gltf"
                    alt="Modelo 3D"
                    autoRotate
                    cameraControls={false}
                    hideLoadingFallback={true}
                    style={{ 
                        width: '100%', 
                        height: '100%'
                    }}
                />
            </div>
            
            {/* Logo no centro */}
            <div className="absolute z-10">
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
        </div>
    );
}
