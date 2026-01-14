export interface AboutUsContent {
  id: string;
  pageTitle: string;
  pageSubtitle: string;
  description1: string;
  description2: string;
  cultureLabel: string;
  cultureTitle: string;
  servicesLabel: string;
  servicesTitle: string;
  teamLabel: string;
  teamTitle: string;
  teamDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface CultureItem {
  id: string;
  title_pt: string;
  description_pt: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title_pt: string;
  description_pt: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// DTOs for creating/updating (backend expects PT fields)
export interface UpdateAboutUsContentDto {
  pageTitle_pt?: string;
  pageSubtitle_pt?: string;
  description1_pt?: string;
  description2_pt?: string;
  cultureLabel_pt?: string;
  cultureTitle_pt?: string;
  servicesLabel_pt?: string;
  servicesTitle_pt?: string;
  teamLabel_pt?: string;
  teamTitle_pt?: string;
  teamDescription_pt?: string;
}

export interface CreateCultureItemDto {
  title_pt: string;
  description_pt: string;
  order?: number;
}

export interface UpdateCultureItemDto {
  title_pt?: string;
  description_pt?: string;
  order?: number;
}

export interface CreateServiceItemDto {
  title_pt: string;
  description_pt: string;
  order?: number;
}

export interface UpdateServiceItemDto {
  title_pt?: string;
  description_pt?: string;
  order?: number;
}

// Depoimento interfaces
export interface Depoimento {
  id: string;
  clientName: string;
  text_pt: string;
  text_en?: string;
  text_fr?: string;
  createdAt: string;
  updatedAt: string;
}

// Response when fetching with locale (translated)
export interface DepoimentoLocalized {
  id: string;
  clientName: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepoimentoDto {
  clientName: string;
  text_pt: string;
}

export interface UpdateDepoimentoDto {
  clientName?: string;
  text_pt?: string;
}
