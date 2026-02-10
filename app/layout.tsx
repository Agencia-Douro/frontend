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
      <body className="antialiased bg-muted isolate">{children}</body>
    </html>
  )
}
