import apiClient from "./axios";
import type {
  Product,
  CreateProductRequest,
  CreateProductResponse,
  PageRequest,
  PagedResponse,
} from "./types";

/**
 * Products API functions
 */

export const productsApi = {
  /**
   * Get all products (with optional pagination)
   */
  getAll: async ({ page = 0, size = 12 }: PageRequest = {}): Promise<
    PagedResponse<Product>
  > => {
    const response = await apiClient.get<unknown>("/products", {
      params: { page, size },
    });
    const data = response.data as unknown;
    // Handle non-paginated response (array)
    if (Array.isArray(data)) {
      const allProducts = data as Product[];
      const totalElements = allProducts.length;
      const totalPages = Math.ceil(totalElements / size);

      // Client-side pagination: slice the array based on page and size
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedContent = allProducts.slice(startIndex, endIndex);

      return {
        content: paginatedContent,
        page,
        size,
        totalElements,
        totalPages,
      };
    }
    // Handle paginated response from backend
    return data as PagedResponse<Product>;
  },

  /**
   * Get product by ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Create a new product (admin only)
   */
  create: async (
    data: CreateProductRequest
  ): Promise<CreateProductResponse> => {
    // Handle file upload if image is a File
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price.toString());
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("brand", data.brand);
    formData.append("stock", data.stock.toString());

    if (data.image) {
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else {
        formData.append("image", data.image);
      }
    }

    const response = await apiClient.post<CreateProductResponse>(
      "/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Update product (admin only)
   */
  update: async (
    id: string,
    data: Partial<CreateProductRequest>
  ): Promise<Product> => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.price !== undefined)
      formData.append("price", data.price.toString());
    if (data.description) formData.append("description", data.description);
    if (data.category) formData.append("category", data.category);
    if (data.brand) formData.append("brand", data.brand);
    if (data.stock !== undefined)
      formData.append("stock", data.stock.toString());
    if (data.image) {
      if (data.image instanceof File) {
        formData.append("image", data.image);
      } else {
        formData.append("image", data.image);
      }
    }

    const response = await apiClient.put<Product>(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Delete product (admin only)
   */
  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiClient.delete<{ success: boolean }>(
      `/products/${id}`
    );
    return response.data;
  },
};
