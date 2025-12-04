export interface Property {
  id: string;
  reference: string;
  title: string;
  description: string;
  transactionType: "comprar" | "arrendar" | "vender";
  propertyType: string;
  isEmpreendimento: boolean;
  isFeatured: boolean;
  propertyState: "novo" | "usado" | "renovado" | null;
  energyClass: string | null;
  price: string;
  totalArea: number | null;
  builtArea: number | null;
  usefulArea: number | null;
  bedrooms: number;
  bathrooms: number;
  hasOffice: boolean;
  hasLaundry: boolean;
  garageSpaces: number;
  constructionYear: number | null;
  deliveryDate: string | null;
  distrito: string;
  concelho: string;
  address: string | null;
  images: string[];
  paymentConditions: string | null;
  status: "active" | "inactive" | "sold" | "rented";
  createdAt: string;
  updatedAt: string;
}

export interface PropertiesResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
