"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Center } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  src: string;
  autoRotate?: boolean;
}

function Model({ src, autoRotate }: ModelProps) {
  const { scene } = useGLTF(src);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (modelRef.current && autoRotate) {
      modelRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Center scale={0.5} position={[0, -0.3, 0]}>
      <primitive ref={modelRef} object={scene} rotation={[0, 0, 0]} />
    </Center>
  );
}

interface ModelViewerProps {
  src: string;
  alt?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brown mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Carregando modelo 3D...</p>
      </div>
    </div>
  );
}

// Preload the model
useGLTF.preload("/model3.gltf");

export default function ModelViewer({
  src,
  alt = "Modelo 3D",
  autoRotate = true,
  cameraControls = true,
  className,
  style,
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Permitir scroll da página mesmo quando o rato está sobre o canvas
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Interceptar o scroll e redirecionar para a página
      // Isto permite que o utilizador faça scroll mesmo quando o rato está sobre o modelo 3D
      window.scrollBy({
        top: e.deltaY,
        behavior: 'auto'
      });
      // Prevenir que o OrbitControls capture o evento
      e.preventDefault();
      e.stopPropagation();
    };

    const canvas = container.querySelector('canvas');
    if (canvas) {
      // Usar capture phase para interceptar antes do OrbitControls
      canvas.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      return () => {
        canvas.removeEventListener('wheel', handleWheel, { capture: true } as EventListenerOptions);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
    >
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 2, 15], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
          gl={{
            antialias: true,
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-10, -10, -5]} intensity={0.4} />
            <Suspense fallback={null}>
              <Environment preset="sunset" />
            </Suspense>

            <Model src={src} autoRotate={autoRotate} />

            {cameraControls && (
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={false}
                minDistance={15}
                maxDistance={15}
                autoRotate={false}
                target={[0, 0, 0]}
              />
            )}
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
}

