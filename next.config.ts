import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '51.75.19.38',
        port: '3008',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;