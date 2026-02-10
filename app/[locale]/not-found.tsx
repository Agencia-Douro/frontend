import { Link } from "@/i18n/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Folha from "@/components/Folha"
import Logo from "@/public/Logo.png"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"

const usefulLinks = [
  { href: "/", key: "home" as const },
  { href: "/imoveis", key: "properties" as const },
  { href: "/imoveis-luxo", key: "luxuryProperties" as const },
  { href: "/sobre-nos", key: "aboutUs" as const },
  { href: "/podcast", key: "podcast" as const },
  { href: "/vender-imovel", key: "sellMyProperty" as const },
] as const

export default async function NotFound() {
  const t = await getTranslations("NotFound")
  const tHeader = await getTranslations("Header")

  return (
    <section
      className="relative min-h-dvh overflow-hidden bg-deaf flex flex-col items-center justify-center safe-area-inset-bottom"
      aria-labelledby="not-found-title"
    >
      <Folha className="top-[10%] left-[2%] rotate-30 opacity-30 hidden lg:block text-brown" />
      <Folha className="top-[15%] right-[3%] rotate-310 opacity-30 hidden lg:block text-brown" />
      <Folha className="bottom-[12%] left-[8%] rotate-40 opacity-30 hidden lg:block text-brown" />

      <div className="container relative z-10 py-12 md:py-10 lg:py-16 xl:py-20 text-center px-4">
        <div className="flex justify-center mb-6 md:mb-8">
          <Link
            href="/"
            className="inline-flex focus-visible:outline focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded"
          >
            <Image
              src={Logo}
              alt="Agência Douro"
              width={180}
              height={180}
              className="w-[140px] h-auto md:w-[180px]"
            />
          </Link>
        </div>
        <div className="max-w-2xl mx-auto space-y-6">
          <p aria-hidden className="heading-um-regular text-brown tabular-nums">
            404
          </p>
          <h1 id="not-found-title" className="text-balance heading-tres-medium text-brown">
            {t("title")}
          </h1>
          <p className="text-pretty body-18-regular text-black-muted">
            {t("description")}
          </p>
          <div className="h-px w-full max-w-xs mx-auto bg-linear-to-r from-gold/0 via-gold to-gold/0 my-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="gold" asChild>
              <Link href="/">{t("backHome")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/imoveis">{t("viewProperties")}</Link>
            </Button>
          </div>
          <nav
            className="pt-8 border-t border-gold/20"
            aria-label={t("exploreSite")}
          >
            <p className="body-14-medium text-black-muted mb-4">
              {t("exploreSite")}
            </p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {usefulLinks.map(({ href, key }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className={cn(
                      "body-14-medium text-brown hover:text-gold",
                      "focus-visible:outline focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded",
                      "transition-colors duration-200"
                    )}
                  >
                    {tHeader(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  )
}
