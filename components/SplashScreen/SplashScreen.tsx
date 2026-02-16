"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/Logo.svg";

export default function SplashScreen() {
    const pathname = usePathname();
    const [opacity, setOpacity] = useState(1);
    const isHomePage = pathname === "/";
    const [isVisible, setIsVisible] = useState(isHomePage);

    useEffect(() => {
        if (!isHomePage) return;

        document.body.style.overflow = "hidden";

        const startTime = Date.now();
        const minDisplayTime = 2000;

        const handleLoad = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

            setTimeout(() => {
                setOpacity(0);

                setTimeout(() => {
                    setIsVisible(false);
                    document.body.style.overflow = "";
                }, 400);
            }, remainingTime);
        };

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

    if (!isHomePage || !isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-deaf"
            style={{
                opacity,
                transition: "opacity 400ms ease-out",
            }}>
            <Image
                src={Logo}
                alt="Agência Douro"
                width={200}
                height={90}
                className="w-auto h-24 md:h-32 lg:h-40"
                style={{
                    transform: "scale(0.7)",
                }}
                priority
            />
        </div>
    );
}
