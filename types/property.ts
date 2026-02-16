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
  role?: string;
  displayOrder: number;
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
  floor: string | null;
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

export interface PropertyFraction {
  id: string;
  propertyId: string;
  // Campos multilíngues - Natureza
  nature_pt: string | null;
  nature_en: string | null;
  nature_fr: string | null;
  // Campos multilíngues - Tipologia
  fractionType_pt: string | null;
  fractionType_en: string | null;
  fractionType_fr: string | null;
  // Campos multilíngues - Piso
  floor_pt: string | null;
  floor_en: string | null;
  floor_fr: string | null;
  // Campos multilíngues - Fração/Unidade
  unit_pt: string | null;
  unit_en: string | null;
  unit_fr: string | null;
  // Campos numéricos
  grossArea: number | null;
  outdoorArea: number | null;
  parkingSpaces: number;
  price: number | null;
  // Campo URL
  floorPlan: string | null;
  // Status e ordem
  reservationStatus: "available" | "reserved" | "sold";
  displayOrder: number;
  customData: Record<string, string | number | boolean | null> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFractionColumn {
  id: string;
  propertyId: string;
  columnKey: string;
  label_pt: string;
  label_en: string | null;
  label_fr: string | null;
  dataType: "text" | "number" | "currency" | "area" | "select";
  selectOptions: string[] | null;
  isVisible: boolean;
  isRequired: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type CreatePropertyFractionDto = Omit<
  PropertyFraction,
  "id" | "propertyId" | "createdAt" | "updatedAt"
>;

export type UpdatePropertyFractionDto = Partial<CreatePropertyFractionDto>;

export type CreatePropertyFractionColumnDto = Omit<
  PropertyFractionColumn,
  "id" | "propertyId" | "createdAt" | "updatedAt"
>;

export type UpdatePropertyFractionColumnDto = Partial<
  CreatePropertyFractionColumnDto
>;
