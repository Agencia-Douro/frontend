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

export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  email: string;
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
  country: string;
  distrito: string | null;
  concelho: string | null;
  freguesia: string | null;
  region: string;
  city: string;
  address: string | null;
  image: string;
  imageSections?: PropertyImageSection[];
  relatedProperties?: Property[];
  files?: PropertyFile[];
  paymentConditions: string | null;
  features: string | null;
  whyChoose: string | null;
  status: "active" | "inactive" | "sold" | "rented" | "reserved";
  teamMemberId: string | null;
  teamMember?: TeamMember;
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
