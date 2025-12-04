import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import Header from "@/components/Sections/Header/Header";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
});

export const metadata: Metadata = {
  title: "Página Inicial - Agência Douro",
  description: "Casas, apartamentos, escritórios, terrenos para venda e aluguel, temos várias opções em diversas localidades. Fale com um de nossos representantes e agende",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={monaSans.variable}>
      <body className="antialiased bg-muted w-screen overflow-x-hidden">
        <QueryProvider>
          <Header />
          <main>
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
