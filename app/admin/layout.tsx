import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased bg-white min-h-screen">
      {children}
      <Toaster />
    </div>
  );
}