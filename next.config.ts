import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "51.75.19.38",
        port: "3008",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3008",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "agenciadouro.pt",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/:locale(pt|en|fr)/model3.gltf",
        destination: "/model3.gltf",
      },
      {
        source: "/:locale(pt|en|fr)/:path*.gltf",
        destination: "/:path*.gltf",
      },
      {
        source: "/:locale(pt|en|fr)/:path*.glb",
        destination: "/:path*.glb",
      },
      {
        source: "/:locale(pt|en|fr)/hero/:image*",
        destination: "/hero/:image*",
      },
      {
        source: "/:locale(pt|en|fr)/flags/:image*",
        destination: "/flags/:image*",
      },
    ];
  },
};

export default withNextIntl(nextConfig);
