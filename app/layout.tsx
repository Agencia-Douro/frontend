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
        {/* Consentmanager CMP */}
        <Script
          id="consentmanager"
          src="https://cdn.consentmanager.net/delivery/autoblocking/59253cc252fe5.js"
          data-cmp-ab="1"
          data-cmp-host="a.delivery.consentmanager.net"
          data-cmp-cdn="cdn.consentmanager.net"
          data-cmp-codesrc="16"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased bg-muted isolate">
        {children}
        {/* Google Consent Mode v2 */}
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'granted',
              'ad_storage': 'denied'
            });
          `}
        </Script>
        {/* Google tag (gtag.js) */}
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
          `}
        </Script>
      </body>
    </html>
  )
}
