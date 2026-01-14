import {
  PropertiesResponse,
  Property,
  PropertyImageSection,
  PropertyFile,
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
} from "@/types/about-us";

const API_BASE_URL = "https://novo.agenciadouro.pt/api";
//const API_BASE_URL = "http://localhost:3008";

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  transactionType?: string;
  propertyType?: string;
  isEmpreendimento?: boolean;
  propertyState?: string;
  energyClass?: string;
  status?: string;
  distrito?: string;
  concelho?: string;
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

export const propertiesApi = {
  search: async (
    query: string,
    limit: number = 5,
    lang: string = "pt"
  ): Promise<Property[]> => {
    const params = new URLSearchParams();
    params.append("q", query);
    params.append("limit", limit.toString());
    params.append("lang", lang);

    const response = await fetch(
      `${API_BASE_URL}/properties/search?${params.toString()}`
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
    const url = `${API_BASE_URL}/properties${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar propriedades");
    }

    return response.json();
  },

  getById: async (id: string, lang?: string): Promise<Property> => {
    const params = new URLSearchParams();
    if (lang) {
      params.append("lang", lang);
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/properties/${id}${
      queryString ? `?${queryString}` : ""
    }`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao buscar propriedade");
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
    formData.append("distrito", data.distrito);
    formData.append("concelho", data.concelho);
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

    // Campos opcionais - Localização
    if (data.address) formData.append("address", data.address);

    // Campos opcionais - Outros
    if (data.paymentConditions)
      formData.append("paymentConditions_pt", data.paymentConditions);
    if (data.features) formData.append("features", data.features);

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
    imagesToAdd?: File[]
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
    formData.append("distrito", data.distrito);
    formData.append("concelho", data.concelho);
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

    // Campos opcionais - Localização
    if (data.address) formData.append("address", data.address);

    // Campos opcionais - Outros
    if (data.paymentConditions)
      formData.append("paymentConditions_pt", data.paymentConditions);
    if (data.features) formData.append("features", data.features);

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
    data: Partial<Newsletter>
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
      `${API_BASE_URL}/properties/${propertyId}/image-sections`
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
    images?: File[]
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
      }
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
    }
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
      }
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
      }
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

export const propertyFilesApi = {
  getAll: async (propertyId: string): Promise<PropertyFile[]> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/files`
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
    isVisible: boolean = true
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
      }
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
    isVisible: boolean = true
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
      }
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
    }
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
    fileId: string
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
      `${API_BASE_URL}/properties/${propertyId}/related`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar propriedades relacionadas");
    }

    return response.json();
  },

  getSimilar: async (
    propertyId: string,
    limit: number = 5
  ): Promise<Property[]> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/similar?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar propriedades similares");
    }

    return response.json();
  },

  addRelated: async (
    propertyId: string,
    relatedPropertyIds: string[]
  ): Promise<Property> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/related`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relatedPropertyIds }),
      }
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
    relatedPropertyIds: string[]
  ): Promise<{ message: string; property: Property }> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/related`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relatedPropertyIds }),
      }
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
    relatedPropertyIds: string[]
  ): Promise<Property> => {
    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/related`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relatedPropertyIds }),
      }
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
  apresentadoraImage?: string;
}

export const siteConfigApi = {
  get: async (): Promise<SiteConfig> => {
    const response = await fetch(`${API_BASE_URL}/site-config`);

    if (!response.ok) {
      throw new Error("Erro ao buscar configurações do site");
    }

    return response.json();
  },

  update: async (
    data: SiteConfig,
    apresentadoraImageFile?: File
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
        data.episodiosPublicados.toString()
      );
    }
    if (data.temporadas !== undefined) {
      formData.append("temporadas", data.temporadas.toString());
    }
    if (data.especialistasConvidados !== undefined) {
      formData.append(
        "especialistasConvidados",
        data.especialistasConvidados.toString()
      );
    }
    if (data.eurosEmTransacoes !== undefined) {
      formData.append("eurosEmTransacoes", data.eurosEmTransacoes.toString());
    }

    // Adicionar imagem se fornecida
    if (apresentadoraImageFile) {
      formData.append("apresentadoraImage", apresentadoraImageFile);
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
    photoFile?: File
  ): Promise<TeamMember> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);

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
    photoFile?: File
  ): Promise<TeamMember> => {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.phone) formData.append("phone", data.phone);
    if (data.email) formData.append("email", data.email);

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
    data: UpdateDepoimentoDto
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

  getActive: async (): Promise<DesiredZone[]> => {
    const response = await fetch(`${API_BASE_URL}/desired-zones/active`);

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
    }
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
    }
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
    data: UpdateCultureItemDto
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
    data: UpdateServiceItemDto
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
