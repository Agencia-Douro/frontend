export interface Country {
  code: string;
  name: string;
  flag: string;
  regionLabel: string;
  cityLabel: string;
}

export const COUNTRIES: Country[] = [
  {
    code: "PT",
    name: "Portugal",
    flag: "\u{1F1F5}\u{1F1F9}",
    regionLabel: "Distrito",
    cityLabel: "Concelho",
  },
  {
    code: "ES",
    name: "Espanha",
    flag: "\u{1F1EA}\u{1F1F8}",
    regionLabel: "Comunidade",
    cityLabel: "Cidade",
  },
  {
    code: "FR",
    name: "Franca",
    flag: "\u{1F1EB}\u{1F1F7}",
    regionLabel: "Regiao",
    cityLabel: "Cidade",
  },
  {
    code: "UK",
    name: "Reino Unido",
    flag: "\u{1F1EC}\u{1F1E7}",
    regionLabel: "Condado",
    cityLabel: "Cidade",
  },
  {
    code: "BR",
    name: "Brasil",
    flag: "\u{1F1E7}\u{1F1F7}",
    regionLabel: "Estado",
    cityLabel: "Cidade",
  },
  {
    code: "AE",
    name: "Dubai (EAU)",
    flag: "\u{1F1E6}\u{1F1EA}",
    regionLabel: "Emirado",
    cityLabel: "Cidade",
  },
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function getCountryName(code: string): string {
  const country = getCountryByCode(code);
  return country ? country.name : code;
}
