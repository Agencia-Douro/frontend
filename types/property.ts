export interface PropertyImageSection {
  id: string;
  propertyId: string;
  sectionName: string;
  images: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFile {
  id: string;
  propertyId: string;
  title: string | null;
  isVisible: boolean;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  reference: string;
  title: string;
  description: string;
  transactionType: "comprar" | "arrendar";
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
  image: string;
  imageSections?: PropertyImageSection[];
  relatedProperties?: Property[];
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
