import { Prata, Inter } from "next/font/google"
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
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://img.youtube.com" />
      </head>
      <body className="antialiased bg-muted isolate">{children}</body>
    </html>
  )
}
