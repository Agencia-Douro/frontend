import {
  PropertiesResponse,
  Property,
  PropertyImageSection,
  PropertyFile,
  PropertyFraction,
  PropertyFractionColumn,
  CreatePropertyFractionDto,
  UpdatePropertyFractionDto,
  CreatePropertyFractionColumnDto,
  UpdatePropertyFractionColumnDto,
} from "@/types/property";
import { Newsletter } from "@/types/newsletter";
import {
  AboutUsContent,
  CultureItem,
  ServiceItem,
  UpdateAboutUsContentDto,
  CreateCultureItemDto,
  UpdateCultureItemDto,
  CreateServiceItemDto,
  UpdateServiceItemDto,
  Depoimento,
  DepoimentoLocalized,
  CreateDepoimentoDto,
  UpdateDepoimentoDto,
  PodcastContent,
  UpdatePodcastContentDto,
  SellPropertyContent,
  UpdateSellPropertyContentDto,
} from "@/types/about-us";

/**
 * Erros especializados para melhor tratamento em SSR/SEO.
 * - NotFoundError: recurso inexistente (ex.: imóvel removido) → pode virar 404/410.
 * - ExternalApiError: falha de API externa (5xx, timeout, etc.) → páginas estratégicas devem renderizar fallback 200.
 */
export class NotFoundError extends Error {
  constructor(message: string = "Recurso não encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ExternalApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ExternalApiError";
    this.status = status;
  }
}

const API_BASE_URL = "https://agenciadouro.pt/api";
//const API_BASE_URL = "http://localhost:3008";

async function safeJson<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  transactionType?: string;
  propertyType?: string;
  isEmpreendimento?: boolean;
  propertyState?: string;
  energyClass?: string;
  status?: string;
  country?: string;
  distrito?: string;
  concelho?: string;
  region?: string;
  city?: string;
  minTotalArea?: number;
  maxTotalArea?: number;
  minBuiltArea?: number;
  maxBuiltArea?: number;
  minUsefulArea?: number;
  maxUsefulArea?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  minGarageSpaces?: number;
  maxGarageSpaces?: number;
  hasOffice?: boolean;
  hasLaundry?: boolean;
  minConstructionYear?: number;
  maxConstructionYear?: number;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  lang?: string;
}

export type { Property } from "@/types/property";

export const propertiesApi = {
  search: async (
    query: string,
    limit: number = 5,
    lang: string = "pt",
  ): Promise<Property[]> => {
    const params = new URLSearchParams();
    params.append("q", query);
    params.append("limit", limit.toString());
    params.append("lang", lang);

    const response = await fetch(
      `${API_BASE_URL}/properties/search?${params.toString()}`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar propriedades");
    }

    return response.json();
  },

  getAll: async (filters?: PropertyFilters): Promise<PropertiesResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/properties${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url);

    if (!response.ok) {
      const data = await safeJson<{ message?: string }>(response);
      throw new ExternalApiError(
        data?.message || `Erro ao buscar propriedades (${response.status})`,
        response.status,
      );
    }

    return response.json();
  },

  /**
   * Retorna null quando a API responde 404, permitindo que o caller use notFound()
   * sem gerar 5xx em SSR. Outros erros viram ExternalApiError.
   */
  getById: async (id: string, lang?: string): Promise<Property | null> => {
    const params = new URLSearchParams();
    if (lang) {
      params.append("lang", lang);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/properties/${id}${queryString ? `?${queryString}` : ""}`;
    const response = await fetch(url);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const data = await safeJson<{ message?: string }>(response);
      throw new ExternalApiError(
        data?.message || `Erro ao buscar propriedade (${response.status})`,
        response.status,
      );
    }

    return response.json();
  },

  create: async (data: Property, images?: File[]): Promise<Property> => {
    const formData = new FormData();

    // Campos obrigatórios
    if (data.reference) formData.append("reference", data.reference);
    formData.append("title_pt", data.title);
    formData.append("description_pt", data.description);
    formData.append("transactionType", data.transactionType);
    formData.append("propertyType", data.propertyType);
    formData.append("isEmpreendimento", data.isEmpreendimento.toString());
    formData.append("price", data.price.toString());
    formData.append("bedrooms", data.bedrooms.toString());
    formData.append("bathrooms", data.bathrooms.toString());
    formData.append("garageSpaces", data.garageSpaces.toString());
    formData.append("hasOffice", data.hasOffice.toString());
    formData.append("hasLaundry", data.hasLaundry.toString());
    formData.append("distrito", data.distrito ?? "");
    formData.append("concelho", data.concelho ?? "");
    if (data.freguesia) formData.append("freguesia", data.freguesia);
    formData.append("status", data.status);

    // Campos opcionais - State e Energy
    if (data.propertyState)
      formData.append("propertyState", data.propertyState);
    if (data.energyClass) formData.append("energyClass", data.energyClass);

    // Campos opcionais - Áreas
    if (data.totalArea !== undefined && data.totalArea !== null) {
      formData.append("totalArea", data.totalArea.toString());
    }
    if (data.builtArea !== undefined && data.builtArea !== null) {
      formData.append("builtArea", data.builtArea.toString());
    }
    if (data.usefulArea !== undefined && data.usefulArea !== null) {
      formData.append("usefulArea", data.usefulArea.toString());
    }

    // Campos opcionais - Construção
    if (data.constructionYear !== undefined && data.constructionYear !== null) {
      formData.append("constructionYear", data.constructionYear.toString());
    }
    if (data.deliveryDate) formData.append("deliveryDate", data.deliveryDate);
    if (data.floor) formData.append("floor", data.floor);

    // Campos opcionais - Localização
    if (data.address) formData.append("address", data.address);

    // Campos opcionais - Outros
    if (data.paymentConditions)
      formData.append("paymentConditions_pt", data.paymentConditions);
    if (data.features) formData.append("features", data.features);
    if (data.whyChoose) formData.append("whyChoose", data.whyChoose);

    // Campos opcionais - Team Member
    if (data.teamMemberId) formData.append("teamMemberId", data.teamMemberId);

    // Adicionar imagem se existir
    if (images && images.length > 0) {
      formData.append("image", images[0]);
    }

    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao criar propriedade (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: Property,
    imagesToAdd?: File[],
  ): Promise<Property> => {
    const formData = new FormData();

    // Campos obrigatórios
    if (data.reference) formData.append("reference", data.reference);

    formData.append("id", data.id);
    formData.append("title_pt", data.title);
    formData.append("description_pt", data.description);
    formData.append("transactionType", data.transactionType);
    formData.append("propertyType", data.propertyType);
    formData.append("isEmpreendimento", data.isEmpreendimento.toString());
    formData.append("price", data.price.toString());
    formData.append("bedrooms", data.bedrooms.toString());
    formData.append("bathrooms", data.bathrooms.toString());
    formData.append("garageSpaces", data.garageSpaces.toString());
    formData.append("hasOffice", data.hasOffice.toString());
    formData.append("hasLaundry", data.hasLaundry.toString());
    formData.append("distrito", data.distrito ?? "");
    formData.append("concelho", data.concelho ?? "");
    if (data.freguesia) formData.append("freguesia", data.freguesia);
    formData.append("status", data.status);

    // Campos opcionais - State e Energy
    if (data.propertyState)
      formData.append("propertyState", data.propertyState);
    if (data.energyClass) formData.append("energyClass", data.energyClass);

    // Campos opcionais - Áreas
    if (data.totalArea !== undefined && data.totalArea !== null) {
      formData.append("totalArea", data.totalArea.toString());
    }
    if (data.builtArea !== undefined && data.builtArea !== null) {
      formData.append("builtArea", data.builtArea.toString());
    }
    if (data.usefulArea !== undefined && data.usefulArea !== null) {
      formData.append("usefulArea", data.usefulArea.toString());
    }

    // Campos opcionais - Construção
    if (data.constructionYear !== undefined && data.constructionYear !== null) {
      formData.append("constructionYear", data.constructionYear.toString());
    }
    if (data.deliveryDate) formData.append("deliveryDate", data.deliveryDate);
    if (data.floor) formData.append("floor", data.floor);

    // Campos opcionais - Localização
    if (data.address) formData.append("address", data.address);

    // Campos opcionais - Outros
    if (data.paymentConditions)
      formData.append("paymentConditions_pt", data.paymentConditions);
    if (data.features) formData.append("features", data.features);
    if (data.whyChoose) formData.append("whyChoose", data.whyChoose);

    // Campos opcionais - Team Member
    if (data.teamMemberId) formData.append("teamMemberId", data.teamMemberId);

    // Adicionar nova imagem (substitui a existente)
    if (imagesToAdd && imagesToAdd.length > 0) {
      formData.append("image", imagesToAdd[0]);
    }

    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar propriedade (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar propriedade");
    }
  },

  getFeatured: async (lang?: string): Promise<Property[]> => {
    const params = new URLSearchParams();
    if (lang) {
      params.append("lang", lang);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/properties/featured/list${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar propriedades destacadas");
    }

    return response.json();
  },

  toggleFeatured: async (id: string): Promise<Property> => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}/featured`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Erro ao alterar destaque da propriedade");
    }

    return response.json();
  },
};

export const newslettersApi = {
  getAll: async (): Promise<Newsletter[]> => {
    const response = await fetch(`${API_BASE_URL}/newsletters`);

    if (!response.ok) {
      throw new Error("Erro ao buscar newsletters");
    }

    return response.json();
  },

  getById: async (id: string): Promise<Newsletter> => {
    const response = await fetch(`${API_BASE_URL}/newsletters/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar newsletter");
    }

    return response.json();
  },

  create: async (data: Partial<Newsletter>): Promise<Newsletter> => {
    const response = await fetch(`${API_BASE_URL}/newsletters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        category: data.category,
        coverImage: data.coverImage,
        propertyIds: data.propertyIds || [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao criar newsletter (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: Partial<Newsletter>,
  ): Promise<Newsletter> => {
    const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        category: data.category,
        coverImage: data.coverImage,
        propertyIds: data.propertyIds || [],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar newsletter (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/newsletters/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erro ao deletar newsletter");
    }
  },

  uploadImage: async (image: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch(`${API_BASE_URL}/newsletters/upload-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao fazer upload da imagem (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

export const imageSectionsApi = {
  getAll: async (propertyId: string): Promise<PropertyImageSection[]> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/image-sections`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar seções de imagens");
    }

    return response.json();
  },

  create: async (
    propertyId: string,
    sectionName: string,
    displayOrder: number,
    images?: File[],
  ): Promise<PropertyImageSection> => {
    const formData = new FormData();
    formData.append("sectionName", sectionName);
    formData.append("displayOrder", displayOrder.toString());

    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/image-sections`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao criar seção de imagens (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    sectionId: string,
    data: {
      sectionName?: string;
      displayOrder?: number;
      imagesToRemove?: string[];
      imagesToAdd?: File[];
    },
  ): Promise<PropertyImageSection> => {
    const formData = new FormData();

    if (data.sectionName) {
      formData.append("sectionName", data.sectionName);
    }

    if (data.displayOrder !== undefined) {
      formData.append("displayOrder", data.displayOrder.toString());
    }

    if (data.imagesToRemove && data.imagesToRemove.length > 0) {
      formData.append("imagesToRemove", JSON.stringify(data.imagesToRemove));
    }

    if (data.imagesToAdd && data.imagesToAdd.length > 0) {
      data.imagesToAdd.forEach((image) => {
        formData.append("imagesToAdd", image);
      });
    }

    const response = await fetch(
      `${API_BASE_URL}/properties/image-sections/${sectionId}`,
      {
        method: "PATCH",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar seção de imagens (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (sectionId: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/image-sections/${sectionId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao deletar seção de imagens (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

/** Upload genérico de ficheiro e imagem */
export const uploadApi = {
  uploadFile: async (
    file: File,
    propertyId?: string,
  ): Promise<{ url: string; filename: string; originalName: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (propertyId) {
      formData.append("propertyId", propertyId);
    }
    const response = await fetch(`${API_BASE_URL}/upload/file`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao fazer upload do ficheiro (${response.status})`;
      throw new Error(errorMessage);
    }
    return response.json();
  },

  uploadImage: async (
    file: File,
  ): Promise<{ url: string; filename: string; format: string; width: number; height: number }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao fazer upload da imagem (${response.status})`;
      throw new Error(errorMessage);
    }
    return response.json();
  },

  uploadVideo: async (
    file: File,
  ): Promise<{ url: string; filename: string; originalName: string; size: number }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_BASE_URL}/upload/video`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao fazer upload do vídeo (${response.status})`;
      throw new Error(errorMessage);
    }
    return response.json();
  },
};

export const propertyFilesApi = {
  getAll: async (propertyId: string): Promise<PropertyFile[]> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/files`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar arquivos da propriedade");
    }

    return response.json();
  },

  getById: async (fileId: string): Promise<PropertyFile> => {
    const response = await fetch(`${API_BASE_URL}/properties/files/${fileId}`);

    if (!response.ok) {
      throw new Error("Arquivo não encontrado");
    }

    return response.json();
  },

  uploadSingle: async (
    propertyId: string,
    file: File,
    title?: string,
    isVisible: boolean = true,
  ): Promise<PropertyFile> => {
    const formData = new FormData();
    formData.append("file", file);

    if (title) {
      formData.append("title", title);
    }

    formData.append("isVisible", isVisible.toString());

    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/files`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao fazer upload do arquivo (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  uploadMultiple: async (
    propertyId: string,
    files: File[],
    title?: string,
    isVisible: boolean = true,
  ): Promise<{ message: string; files: PropertyFile[] }> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    if (title) {
      formData.append("title", title);
    }

    formData.append("isVisible", isVisible.toString());

    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/files/multiple`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao fazer upload dos arquivos (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    fileId: string,
    data: {
      title?: string;
      isVisible?: boolean;
    },
  ): Promise<PropertyFile> => {
    const response = await fetch(`${API_BASE_URL}/properties/files/${fileId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao atualizar arquivo (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (
    fileId: string,
  ): Promise<{ message: string; file: PropertyFile }> => {
    const response = await fetch(`${API_BASE_URL}/properties/files/${fileId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao deletar arquivo (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

export const propertyRelationshipsApi = {
  getRelated: async (propertyId: string): Promise<Property[]> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/related`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar propriedades relacionadas");
    }

    return response.json();
  },

  getSimilar: async (
    propertyId: string,
    limit: number = 5,
  ): Promise<Property[]> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/similar?limit=${limit}`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar propriedades similares");
    }

    return response.json();
  },

  addRelated: async (
    propertyId: string,
    relatedPropertyIds: string[],
  ): Promise<Property> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/related`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relatedPropertyIds }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao adicionar propriedades relacionadas (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  removeRelated: async (
    propertyId: string,
    relatedPropertyIds: string[],
  ): Promise<{ message: string; property: Property }> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/related`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relatedPropertyIds }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao remover propriedades relacionadas (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  setRelated: async (
    propertyId: string,
    relatedPropertyIds: string[],
  ): Promise<Property> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/related`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relatedPropertyIds }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao definir propriedades relacionadas (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

export interface ContactData {
  nome: string;
  telefone: string;
  email: string;
  mensagem: string;
  aceitaMarketing?: boolean;
}

export const contactApi = {
  send: async ({
    email,
    nome,
    telefone,
    mensagem,
    aceitaMarketing = false,
  }: ContactData): Promise<{ message: string }> => {
    const response = await fetch("/internal-api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        nome,
        telefone,
        mensagem,
        aceitaMarketing,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || `Erro ao enviar contato (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

export interface SiteConfig {
  clientesSatisfeitos: number;
  rating: number;
  anosExperiencia: number;
  imoveisVendidos: number;
  episodiosPublicados?: number;
  temporadas?: number;
  especialistasConvidados?: number;
  eurosEmTransacoes?: number;
  seguidoresInstagram?: number;
  apresentadoraImage?: string;
  diretorImage?: string;
  podcastImagem?: string;
}

export const siteConfigApi = {
  get: async (): Promise<SiteConfig> => {
    const response = await fetch(`${API_BASE_URL}/site-config`);

    if (!response.ok) {
      const data = await safeJson<{ message?: string }>(response);
      throw new ExternalApiError(
        data?.message || `Erro ao buscar configurações do site (${response.status})`,
        response.status,
      );
    }

    return response.json();
  },

  update: async (
    data: SiteConfig,
    apresentadoraImageFile?: File,
    podcastImagemFile?: File,
    diretorImageFile?: File,
  ): Promise<SiteConfig> => {
    const formData = new FormData();

    // Adicionar todos os campos numéricos
    formData.append("clientesSatisfeitos", data.clientesSatisfeitos.toString());
    formData.append("rating", data.rating.toString());
    formData.append("anosExperiencia", data.anosExperiencia.toString());
    formData.append("imoveisVendidos", data.imoveisVendidos.toString());

    if (data.episodiosPublicados !== undefined) {
      formData.append(
        "episodiosPublicados",
        data.episodiosPublicados.toString(),
      );
    }
    if (data.temporadas !== undefined) {
      formData.append("temporadas", data.temporadas.toString());
    }
    if (data.especialistasConvidados !== undefined) {
      formData.append(
        "especialistasConvidados",
        data.especialistasConvidados.toString(),
      );
    }
    if (data.eurosEmTransacoes !== undefined) {
      formData.append("eurosEmTransacoes", data.eurosEmTransacoes.toString());
    }
    if (data.seguidoresInstagram !== undefined) {
      formData.append(
        "seguidoresInstagram",
        data.seguidoresInstagram.toString(),
      );
    }

    // Adicionar imagens se fornecidas
    if (apresentadoraImageFile) {
      formData.append("apresentadoraImage", apresentadoraImageFile);
    }
    if (diretorImageFile) {
      formData.append("diretorImage", diretorImageFile);
    }
    if (podcastImagemFile) {
      formData.append("podcastImagem", podcastImagemFile);
    }

    const response = await fetch(`${API_BASE_URL}/site-config`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar configurações (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

export interface TeamMember {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo?: string;
  role?: string;
  displayOrder?: number;
}

export const teamMembersApi = {
  getAll: async (): Promise<TeamMember[]> => {
    const response = await fetch(`${API_BASE_URL}/team-members`);

    if (!response.ok) {
      throw new Error("Erro ao buscar membros da equipa");
    }

    return response.json();
  },

  getById: async (id: string): Promise<TeamMember> => {
    const response = await fetch(`${API_BASE_URL}/team-members/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar membro da equipa");
    }

    return response.json();
  },

  create: async (
    data: Omit<TeamMember, "id">,
    photoFile?: File,
  ): Promise<TeamMember> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);

    if (data.role) {
      formData.append("role", data.role);
    }

    if (data.displayOrder !== undefined) {
      formData.append("displayOrder", data.displayOrder.toString());
    }

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const response = await fetch(`${API_BASE_URL}/team-members`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao criar membro da equipa (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: Partial<TeamMember>,
    photoFile?: File,
  ): Promise<TeamMember> => {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.phone) formData.append("phone", data.phone);
    if (data.email) formData.append("email", data.email);
    if (data.role !== undefined) formData.append("role", data.role);
    if (data.displayOrder !== undefined)
      formData.append("displayOrder", data.displayOrder.toString());

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const response = await fetch(`${API_BASE_URL}/team-members/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar membro da equipa (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/team-members/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao deletar membro da equipa (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

export interface DesiredZone {
  id: string;
  name: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export const depoimentosApi = {
  getAll: async (locale?: string): Promise<DepoimentoLocalized[]> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(`${API_BASE_URL}/depoimentos${params}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar depoimentos");
    }

    return response.json();
  },

  getAllRaw: async (): Promise<Depoimento[]> => {
    const response = await fetch(`${API_BASE_URL}/depoimentos`);

    if (!response.ok) {
      throw new Error("Erro ao buscar depoimentos");
    }

    return response.json();
  },
  create: async (data: CreateDepoimentoDto): Promise<Depoimento> => {
    const response = await fetch(`${API_BASE_URL}/depoimentos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao criar depoimento (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
  update: async (
    id: string,
    data: UpdateDepoimentoDto,
  ): Promise<Depoimento> => {
    const response = await fetch(`${API_BASE_URL}/depoimentos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar depoimento (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/depoimentos/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao deletar depoimento (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

export const desiredZonesApi = {
  getAll: async (): Promise<DesiredZone[]> => {
    const response = await fetch(`${API_BASE_URL}/desired-zones`);

    if (!response.ok) {
      throw new Error("Erro ao buscar zonas desejadas");
    }

    return response.json();
  },

  getActive: async (country?: string): Promise<DesiredZone[]> => {
    const params = new URLSearchParams();
    if (country) {
      params.append("country", country);
    }
    const queryString = params.toString();
    const url = `${API_BASE_URL}/desired-zones/active${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar zonas desejadas ativas");
    }

    return response.json();
  },

  getById: async (id: string): Promise<DesiredZone> => {
    const response = await fetch(`${API_BASE_URL}/desired-zones/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar zona desejada");
    }

    return response.json();
  },

  create: async (data: {
    name: string;
    image?: File;
    displayOrder?: number;
    isActive?: boolean;
    country?: string;
  }): Promise<DesiredZone> => {
    const formData = new FormData();
    formData.append("name", data.name);

    if (data.image) {
      formData.append("image", data.image);
    }

    if (data.displayOrder !== undefined) {
      formData.append("displayOrder", data.displayOrder.toString());
    }

    if (data.isActive !== undefined) {
      formData.append("isActive", data.isActive.toString());
    }

    if (data.country) {
      formData.append("country", data.country);
    }

    const response = await fetch(`${API_BASE_URL}/desired-zones`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao criar zona desejada (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: {
      name?: string;
      image?: File;
      displayOrder?: number;
      isActive?: boolean;
      country?: string;
    },
  ): Promise<DesiredZone> => {
    const formData = new FormData();

    if (data.name) {
      formData.append("name", data.name);
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    if (data.displayOrder !== undefined) {
      formData.append("displayOrder", data.displayOrder.toString());
    }

    if (data.isActive !== undefined) {
      formData.append("isActive", data.isActive.toString());
    }

    if (data.country) {
      formData.append("country", data.country);
    }

    const response = await fetch(`${API_BASE_URL}/desired-zones/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar zona desejada (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/desired-zones/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao deletar zona desejada (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

export interface PodcastTopic {
  id: string;
  title_pt: string;
  title_en?: string;
  title_fr?: string;
  description_pt: string;
  description_en?: string;
  description_fr?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const podcastTopicsApi = {
  getAll: async (): Promise<PodcastTopic[]> => {
    const response = await fetch(`${API_BASE_URL}/podcast-topics`);

    if (!response.ok) {
      throw new Error("Erro ao buscar tópicos do podcast");
    }

    return response.json();
  },

  getById: async (id: string): Promise<PodcastTopic> => {
    const response = await fetch(`${API_BASE_URL}/podcast-topics/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar tópico do podcast");
    }

    return response.json();
  },

  create: async (data: {
    title_pt: string;
    description_pt: string;
    order?: number;
  }): Promise<PodcastTopic> => {
    const response = await fetch(`${API_BASE_URL}/podcast-topics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao criar tópico do podcast (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: {
      title_pt?: string;
      description_pt?: string;
      order?: number;
    },
  ): Promise<PodcastTopic> => {
    const response = await fetch(`${API_BASE_URL}/podcast-topics/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar tópico do podcast (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/podcast-topics/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao deletar tópico do podcast (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

// About Us Content API
export const aboutUsContentApi = {
  get: async (locale?: string): Promise<AboutUsContent> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(`${API_BASE_URL}/about-us-content${params}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar conteúdo sobre nós");
    }

    return response.json();
  },

  update: async (data: UpdateAboutUsContentDto): Promise<AboutUsContent> => {
    const response = await fetch(`${API_BASE_URL}/about-us-content`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao atualizar conteúdo (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

// Culture Items API
export const cultureItemsApi = {
  getAll: async (locale?: string): Promise<CultureItem[]> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(`${API_BASE_URL}/culture-items${params}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar itens de cultura");
    }

    return response.json();
  },

  getById: async (id: string): Promise<CultureItem> => {
    const response = await fetch(`${API_BASE_URL}/culture-items/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar item de cultura");
    }

    return response.json();
  },

  create: async (data: CreateCultureItemDto): Promise<CultureItem> => {
    const response = await fetch(`${API_BASE_URL}/culture-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao criar item de cultura (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: UpdateCultureItemDto,
  ): Promise<CultureItem> => {
    const response = await fetch(`${API_BASE_URL}/culture-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar item de cultura (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/culture-items/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao deletar item de cultura (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

// Service Items API
export const serviceItemsApi = {
  getAll: async (locale?: string): Promise<ServiceItem[]> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(`${API_BASE_URL}/service-items${params}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar itens de serviço");
    }

    return response.json();
  },

  getById: async (id: string): Promise<ServiceItem> => {
    const response = await fetch(`${API_BASE_URL}/service-items/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar item de serviço");
    }

    return response.json();
  },

  create: async (data: CreateServiceItemDto): Promise<ServiceItem> => {
    const response = await fetch(`${API_BASE_URL}/service-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao criar item de serviço (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: UpdateServiceItemDto,
  ): Promise<ServiceItem> => {
    const response = await fetch(`${API_BASE_URL}/service-items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar item de serviço (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/service-items/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao deletar item de serviço (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

// Podcast Content API
export const podcastContentApi = {
  get: async (locale?: string): Promise<PodcastContent> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(`${API_BASE_URL}/podcast-content${params}`);

    if (!response.ok) {
      const data = await safeJson<{ message?: string }>(response);
      throw new ExternalApiError(
        data?.message || `Erro ao buscar conteúdo do podcast (${response.status})`,
        response.status,
      );
    }

    return response.json();
  },

  update: async (data: UpdatePodcastContentDto): Promise<PodcastContent> => {
    const response = await fetch(`${API_BASE_URL}/podcast-content`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar conteúdo do podcast (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

// Sell Property Content API
export const sellPropertyContentApi = {
  get: async (locale?: string): Promise<SellPropertyContent> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(
      `${API_BASE_URL}/sell-property-content${params}`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar conteúdo da página vender imóvel");
    }

    return response.json();
  },

  update: async (
    data: UpdateSellPropertyContentDto,
  ): Promise<SellPropertyContent> => {
    const response = await fetch(`${API_BASE_URL}/sell-property-content`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao atualizar conteúdo da página vender imóvel (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

// Property Fractions API
export const propertyFractionsApi = {
  getAll: async (propertyId: string): Promise<PropertyFraction[]> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/fractions`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar frações da propriedade");
    }

    return response.json();
  },

  create: async (
    propertyId: string,
    data: CreatePropertyFractionDto,
  ): Promise<PropertyFraction> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/fractions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao criar fração (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    fractionId: string,
    data: UpdatePropertyFractionDto,
  ): Promise<PropertyFraction> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/fractions/${fractionId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao atualizar fração (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (
    fractionId: string,
  ): Promise<{ message: string; fraction: PropertyFraction }> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/fractions/${fractionId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao deletar fração (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  bulkCreate: async (
    propertyId: string,
    fractions: CreatePropertyFractionDto[],
  ): Promise<{ message: string; fractions: PropertyFraction[] }> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/fractions/bulk`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fractions }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message ||
        `Erro ao criar frações em lote (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  // Métodos para colunas
  getColumns: async (propertyId: string): Promise<PropertyFractionColumn[]> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/fraction-columns`,
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar colunas de frações");
    }

    return response.json();
  },

  createColumn: async (
    propertyId: string,
    data: CreatePropertyFractionColumnDto,
  ): Promise<PropertyFractionColumn> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/fraction-columns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao criar coluna (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  updateColumn: async (
    columnId: string,
    data: UpdatePropertyFractionColumnDto,
  ): Promise<PropertyFractionColumn> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/fraction-columns/${columnId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao atualizar coluna (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  deleteColumn: async (
    columnId: string,
  ): Promise<{ message: string; column: PropertyFractionColumn }> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/fraction-columns/${columnId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao deletar coluna (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
};

// Podcast Guests API
export interface PodcastGuest {
  id: string;
  name: string;
  role_pt: string;
  role_en?: string;
  role_fr?: string;
  role?: string; // Localized field returned when ?lang= is used
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const podcastGuestsApi = {
  getAll: async (locale?: string): Promise<PodcastGuest[]> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(`${API_BASE_URL}/podcast-guests${params}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar convidados do podcast");
    }

    return response.json();
  },

  getById: async (id: string): Promise<PodcastGuest> => {
    const response = await fetch(`${API_BASE_URL}/podcast-guests/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar convidado do podcast");
    }

    return response.json();
  },

  create: async (data: {
    name: string;
    role_pt: string;
    imageUrl?: string;
    order?: number;
    isActive?: boolean;
  }): Promise<PodcastGuest> => {
    const response = await fetch(`${API_BASE_URL}/podcast-guests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao criar convidado (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: {
      name?: string;
      role_pt?: string;
      imageUrl?: string;
      order?: number;
      isActive?: boolean;
    },
  ): Promise<PodcastGuest> => {
    const response = await fetch(`${API_BASE_URL}/podcast-guests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao atualizar convidado (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/podcast-guests/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao deletar convidado (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

// Podcast Testimonials API
export interface PodcastTestimonial {
  id: string;
  name: string;
  role_pt: string;
  role_en?: string;
  role_fr?: string;
  role?: string; // Localized field returned when ?lang= is used
  text_pt: string;
  text_en?: string;
  text_fr?: string;
  text?: string; // Localized field returned when ?lang= is used
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const podcastTestimonialsApi = {
  getAll: async (locale?: string): Promise<PodcastTestimonial[]> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(`${API_BASE_URL}/podcast-testimonials${params}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar testemunhos do podcast");
    }

    return response.json();
  },

  getById: async (id: string): Promise<PodcastTestimonial> => {
    const response = await fetch(`${API_BASE_URL}/podcast-testimonials/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar testemunho do podcast");
    }

    return response.json();
  },

  create: async (data: {
    name: string;
    role_pt: string;
    text_pt: string;
    order?: number;
    isActive?: boolean;
  }): Promise<PodcastTestimonial> => {
    const response = await fetch(`${API_BASE_URL}/podcast-testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao criar testemunho (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: {
      name?: string;
      role_pt?: string;
      text_pt?: string;
      order?: number;
      isActive?: boolean;
    },
  ): Promise<PodcastTestimonial> => {
    const response = await fetch(`${API_BASE_URL}/podcast-testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao atualizar testemunho (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/podcast-testimonials/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao deletar testemunho (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

// Podcast Gallery API
export type MediaType = "image" | "video";

export interface PodcastGalleryImage {
  id: string;
  mediaType: MediaType;
  imageUrl: string;
  videoUrl?: string;
  alt_pt?: string;
  alt_en?: string;
  alt_fr?: string;
  alt?: string; // Localized field returned when ?lang= is used
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const podcastGalleryApi = {
  getAll: async (locale?: string): Promise<PodcastGalleryImage[]> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(`${API_BASE_URL}/podcast-gallery${params}`);

    if (!response.ok) {
      const data = await safeJson<{ message?: string }>(response);
      throw new ExternalApiError(
        data?.message || `Erro ao buscar galeria do podcast (${response.status})`,
        response.status,
      );
    }

    return response.json();
  },

  getById: async (id: string): Promise<PodcastGalleryImage> => {
    const response = await fetch(`${API_BASE_URL}/podcast-gallery/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar imagem da galeria");
    }

    return response.json();
  },

  create: async (data: {
    mediaType?: MediaType;
    imageUrl?: string;
    videoUrl?: string;
    alt_pt?: string;
    order?: number;
    isActive?: boolean;
  }): Promise<PodcastGalleryImage> => {
    const response = await fetch(`${API_BASE_URL}/podcast-gallery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao adicionar mídia (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: {
      mediaType?: MediaType;
      imageUrl?: string;
      videoUrl?: string;
      alt_pt?: string;
      order?: number;
      isActive?: boolean;
    },
  ): Promise<PodcastGalleryImage> => {
    const response = await fetch(`${API_BASE_URL}/podcast-gallery/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao atualizar imagem (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/podcast-gallery/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao deletar imagem (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};

// Podcast Why Listen Cards API
export interface PodcastWhyListenCard {
  id: string;
  iconKey: string;
  title_pt: string;
  title_en?: string;
  title_fr?: string;
  title?: string; // Localized field returned when ?lang= is used
  subtext_pt: string;
  subtext_en?: string;
  subtext_fr?: string;
  subtext?: string; // Localized field returned when ?lang= is used
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const podcastWhyListenApi = {
  getAll: async (locale?: string): Promise<PodcastWhyListenCard[]> => {
    const params = locale ? `?lang=${locale}` : "";
    const response = await fetch(`${API_BASE_URL}/podcast-why-listen${params}`);

    if (!response.ok) {
      const data = await safeJson<{ message?: string }>(response);
      throw new ExternalApiError(
        data?.message || `Erro ao buscar cards do podcast (${response.status})`,
        response.status,
      );
    }

    return response.json();
  },

  getById: async (id: string): Promise<PodcastWhyListenCard> => {
    const response = await fetch(`${API_BASE_URL}/podcast-why-listen/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar card do podcast");
    }

    return response.json();
  },

  create: async (data: {
    iconKey: string;
    title_pt: string;
    subtext_pt: string;
    order?: number;
    isActive?: boolean;
  }): Promise<PodcastWhyListenCard> => {
    const response = await fetch(`${API_BASE_URL}/podcast-why-listen`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao criar card (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  update: async (
    id: string,
    data: {
      iconKey?: string;
      title_pt?: string;
      subtext_pt?: string;
      order?: number;
      isActive?: boolean;
    },
  ): Promise<PodcastWhyListenCard> => {
    const response = await fetch(`${API_BASE_URL}/podcast-why-listen/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao atualizar card (${response.status})`;
      throw new Error(errorMessage);
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/podcast-why-listen/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.message || `Erro ao deletar card (${response.status})`;
      throw new Error(errorMessage);
    }
  },
};
