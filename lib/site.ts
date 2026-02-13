/**
 * NAP (Nome, Endereço, Telefone) e dados da empresa para SEO local e Schema.org.
 * Usar em Footer, FaleConnosco, JSON-LD e em qualquer referência à morada/contacto.
 */
export const siteConfig = {
  name: "Agência Douro",
  legalName: "Agência Douro - Mediação Imobiliária",
  url: "https://www.agenciadouro.pt",
  telephone: "+351919766324",
  email: "geral@agenciadouro.pt",
  address: {
    streetAddress: "Rua de Alfredo Cunha 155, rés do chão, loja 07",
    addressLocality: "Matosinhos",
    addressRegion: "Porto",
    postalCode: "4450-031",
    addressCountry: "PT",
  },
  /** Endereço em uma linha para exibição */
  addressOneLine:
    "Rua de Alfredo Cunha 155 rés do chão loja 07, 4450-031, Matosinhos, Porto",
  /** Redes sociais (para sameAs no Schema) */
  sameAs: [
    "https://www.instagram.com/agenciadouro",
    "https://www.facebook.com/agenciadouro",
    "https://www.linkedin.com/company/agência-douro",
    "https://www.tiktok.com/@douroimobiliaria",
    "https://www.youtube.com/@agenciadouromediacaoimobil3889",
  ],
} as const
