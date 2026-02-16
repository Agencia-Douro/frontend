import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
    poweredByHeader: false,
    turbopack: {},
    images: {
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 31536000,
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
            hostname: "www.agenciadouro.pt",
            pathname: "/**",
        },
        {
            protocol: "https",
            hostname: "img.youtube.com",
            pathname: "/vi/**",
        },
        ],
    },
    async headers() {
        return [
            {
                source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|gif)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/_next/static/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/:all*(woff|woff2|ttf|otf|eot)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
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
        {
            source: "/:locale(pt|en|fr)/podcast.png",
            destination: "/podcast.png",
        },
        {
            source: "/:locale(pt|en|fr)/patrocinador-podcast.jpeg",
            destination: "/patrocinador-podcast.jpeg",
        },
        ];
    },
    async redirects() {
        return [
            // ── Redireciona URLs sem www → www ──
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'agenciadouro.pt' }],
                destination: 'https://www.agenciadouro.pt/:path*',
                permanent: true,
            },

            // ── URLs antigas do WordPress — páginas estáticas ──
            {
                source: '/empreendimentos/',
                destination: '/pt/imoveis?isEmpreendimento=true',
                permanent: true,
            },
            {
                source: '/empreendimentos',
                destination: '/pt/imoveis?isEmpreendimento=true',
                permanent: true,
            },
            {
                source: '/trespasse_/',
                destination: '/pt/imoveis?transactionType=trespasse',
                permanent: true,
            },
            {
                source: '/trespasse_',
                destination: '/pt/imoveis?transactionType=trespasse',
                permanent: true,
            },
            {
                source: '/arrendar/',
                destination: '/pt/imoveis?transactionType=arrendar',
                permanent: true,
            },
            {
                source: '/arrendar',
                destination: '/pt/imoveis?transactionType=arrendar',
                permanent: true,
            },
            {
                source: '/comprar/',
                destination: '/pt/imoveis?transactionType=comprar',
                permanent: true,
            },
            {
                source: '/comprar',
                destination: '/pt/imoveis?transactionType=comprar',
                permanent: true,
            },
            {
                source: '/about-us/',
                destination: '/pt/sobre-nos',
                permanent: true,
            },
            {
                source: '/about-us',
                destination: '/pt/sobre-nos',
                permanent: true,
            },
            {
                source: '/consultores/',
                destination: '/pt/sobre-nos',
                permanent: true,
            },
            {
                source: '/consultores',
                destination: '/pt/sobre-nos',
                permanent: true,
            },
            // ── WordPress: páginas comuns ──
            {
                source: '/contactos/',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/contactos',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/contacto/',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/contacto',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/servicos/',
                destination: '/pt/sobre-nos',
                permanent: true,
            },
            {
                source: '/servicos',
                destination: '/pt/sobre-nos',
                permanent: true,
            },
            {
                source: '/equipa/',
                destination: '/pt/sobre-nos',
                permanent: true,
            },
            {
                source: '/equipa',
                destination: '/pt/sobre-nos',
                permanent: true,
            },
            // ── WordPress: imóveis individuais com slug ──
            {
                source: '/imovel/:slug*',
                destination: '/pt/imoveis',
                permanent: true,
            },
            {
                source: '/property/:slug*',
                destination: '/pt/imoveis',
                permanent: true,
            },
            {
                source: '/properties/:slug*',
                destination: '/pt/imoveis',
                permanent: true,
            },
            {
                source: '/imoveis/:path((?!\\d).+)',
                destination: '/pt/imoveis',
                permanent: true,
            },
            // ── WordPress: categorias e taxonomias ──
            {
                source: '/category/:slug*',
                destination: '/pt/imoveis',
                permanent: true,
            },
            {
                source: '/tag/:slug*',
                destination: '/pt/imoveis',
                permanent: true,
            },
            {
                source: '/tipo/:slug*',
                destination: '/pt/imoveis',
                permanent: true,
            },
            {
                source: '/localizacao/:slug*',
                destination: '/pt/imoveis',
                permanent: true,
            },
            // ── WordPress: blog/notícias ──
            {
                source: '/blog/:slug*',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/noticias/:slug*',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/news/:slug*',
                destination: '/pt',
                permanent: true,
            },
            // ── WordPress: recursos estáticos e páginas de sistema ──
            {
                source: '/wp-content/:path*',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/wp-admin/:path*',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/wp-login.php',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/wp-json/:path*',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/xmlrpc.php',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/feed/:path*',
                destination: '/pt',
                permanent: true,
            },
            {
                source: '/feed',
                destination: '/pt',
                permanent: true,
            },
            // ── WordPress: paginação ──
            {
                source: '/page/:num',
                destination: '/pt/imoveis',
                permanent: true,
            },
            // ── Páginas sem locale prefix (redirecionar para /pt/) ──
            {
                source: '/imoveis-luxo',
                destination: '/pt/imoveis-luxo',
                permanent: true,
            },
            {
                source: '/sobre-nos',
                destination: '/pt/sobre-nos',
                permanent: true,
            },
            {
                source: '/vender-imovel',
                destination: '/pt/vender-imovel',
                permanent: true,
            },
            {
                source: '/avaliador-online',
                destination: '/pt/avaliador-online',
                permanent: true,
            },
            {
                source: '/podcast',
                destination: '/pt/podcast',
                permanent: true,
            },
        ];
    },
};

export default withNextIntl(nextConfig);