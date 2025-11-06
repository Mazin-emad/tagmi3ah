import apiClient from "./axios";
import type { Category, PageRequest, PagedResponse } from "./types";

export const categoriesApi = {
  list: async ({
    page = 0,
    size = 20,
  }: PageRequest): Promise<PagedResponse<Category>> => {
    const response = await apiClient.get<unknown>("/categories", {
      params: { page, size },
    });
    const data = response.data as unknown;
    if (Array.isArray(data)) {
      return {
        content: data as Category[],
        page: 0,
        size: data.length,
        totalElements: data.length,
        totalPages: 1,
      };
    }
    return data as PagedResponse<Category>;
  },
  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },
  create: async (payload: Pick<Category, "name">): Promise<Category> => {
    const response = await apiClient.post<Category>("/categories", payload);
    return response.data;
  },
  update: async (
    id: number,
    payload: Pick<Category, "name">
  ): Promise<Category> => {
    const response = await apiClient.put<Category>(
      `/categories/${id}`,
      payload
    );
    return response.data;
  },
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
