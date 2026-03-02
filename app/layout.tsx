import { Prata, Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const prata = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prata",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt" className={`${prata.variable} ${inter.variable}`}>
      <head>
        <meta property="fb:app_id" content="810888341595184" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body className="antialiased bg-muted isolate">
        {children}
        {/* Google tag (gtag.js) — GA4 + Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S2LLVJRF5Y"
          strategy="afterInteractive"
        />
        <Script id="google-tags" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S2LLVJRF5Y');
            gtag('config', 'AW-17325904134');
          `}
        </Script>
      </body>
    </html>
  )
}
