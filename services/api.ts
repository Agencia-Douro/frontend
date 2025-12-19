import {
  PropertiesResponse,
  Property,
  PropertyImageSection,
} from "@/types/property";
import { Newsletter } from "@/types/newsletter";

const API_BASE_URL = "/api";
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
}

export const propertiesApi = {
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

  getById: async (id: string): Promise<Property> => {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);

    if (!response.ok) {
      throw new Error("Erro ao buscar propriedade");
    }

    return response.json();
  },

  create: async (data: Property, images?: File[]): Promise<Property> => {
    const formData = new FormData();

    // Campos obrigatórios
    if (data.reference) formData.append("reference", data.reference);
    formData.append("title", data.title);
    formData.append("description", data.description);
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
      formData.append("paymentConditions", data.paymentConditions);

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
    formData.append("title", data.title);
    formData.append("description", data.description);
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
      formData.append("paymentConditions", data.paymentConditions);

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

  getFeatured: async (): Promise<Property[]> => {
    const response = await fetch(`${API_BASE_URL}/properties/featured/list`);

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
