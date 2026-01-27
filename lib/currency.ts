/**
 * Formata um valor numérico ou string em formato de moeda portuguesa (EUR)
 * @param value - Valor a ser formatado (number ou string)
 * @param options - Opções de formatação
 * @returns String formatada em EUR (ex: "250.000 €")
 */
export function formatCurrency(
  value: string | number,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  },
): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(numValue);
}

/**
 * Formata apenas o número do preço, sem o símbolo da moeda
 * @param value - Valor a ser formatado (number ou string)
 * @returns String formatada apenas com o número com espaço como separador (ex: "250 000")
 */
export function formatPriceNumber(value: string | number): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numValue);
}

/**
 * Remove formatação de moeda e retorna apenas os dígitos
 * @param value - String formatada como moeda
 * @returns String contendo apenas dígitos
 */
export function parseCurrency(value: string): string {
  const cleanedValue = value.replace(/[^\d]/g, "");
  return cleanedValue || "0";
}

/**
 * Formata um valor como moeda compacta (ex: 1.5M, 250K)
 * @param value - Valor a ser formatado
 * @returns String formatada de forma compacta
 */
export function formatCompactCurrency(value: string | number): string {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(numValue);
}

/**
 * Traduz o status da propriedade para português
 * @param status - Status em inglês
 * @returns Status traduzido
 */
export function translatePropertyStatus(status: string): string {
  const translations: Record<string, string> = {
    active: "Ativo",
    inactive: "Inativo",
    sold: "Vendido",
    rented: "Arrendado",
  };
  return translations[status] || status;
}

/**
 * Retorna a cor do badge baseado no status
 * @param status - Status da propriedade
 * @returns Classe CSS para a cor
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    sold: "bg-red-100 text-red-800",
    rented: "bg-blue-100 text-blue-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
