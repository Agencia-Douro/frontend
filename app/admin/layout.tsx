import Image from "next/image";
import Logo from "@/public/Logo.svg"
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/admin" className="shrink-0">
              <Image alt="Agência Douro" src={Logo} width={120} height={60} className="h-auto" />
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              <Link
                href="/admin"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                INÍCIO
              </Link>
              <Link
                href="/admin/properties"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                PROPRIEDADES
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}