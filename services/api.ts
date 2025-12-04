import { PropertiesResponse, Property } from "@/types/property";

// const API_BASE_URL = "https://api.agenciadouro.server.ausses.pt";
const API_BASE_URL = "http://localhost:3008";

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

    // Arrays
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("images[]", image);
      });
    }

    // Adicionar imagens se existirem
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await fetch(`${API_BASE_URL}/properties`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erro ao criar propriedade");
    }

    return response.json();
  },

  update: async (
    id: string,
    data: Property,
    imagesToAdd?: File[],
    imagesToRemove?: string[]
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

    // Adicionar novas imagens
    if (imagesToAdd && imagesToAdd.length > 0) {
      imagesToAdd.forEach((image) => {
        formData.append("imagesToAdd", image);
      });
    }

    // Adicionar imagens a remover
    if (imagesToRemove && imagesToRemove.length > 0) {
      imagesToRemove.forEach((imageUrl) => {
        formData.append("imagesToRemove[]", imageUrl);
      });
    }

    const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar propriedade");
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
